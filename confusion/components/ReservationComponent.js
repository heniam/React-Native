import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Modal, Alert} from 'react-native';
import { Card } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import * as Animatable from 'react-native-animatable';
import * as Permissions from 'expo-permissions';
import {  Notifications } from 'expo';
import * as Calendar from 'expo-calendar';


class Reservation extends Component {

  constructor(props) {
      super(props);
      this.state = {
          guests: 1,
          smoking: false,
          date : '',
          showModal: false
      }
  }

  static navigationOptions = {
      title: 'Reserve Table',
  }

    toggleModal() {
       this.setState({showModal: !this.state.showModal});
   }

   handleReservation() {
     Alert.alert(

       'Confirm Reservation?',
       `Number of Guests: ${this.state.guests} \n` +
       `Smoking: ${this.state.smoking ? 'Yes' : 'No'}\n` +
       `Date and Time: ${this.state.date}`,
       [
         {
           text: 'Cancel',
           onPress: () => this.resetForm(),
           style: 'cancel'
         },
         {
           text: 'OK',
              onPress:() => {
                 this.presentLocalNotification(this.state.date);
                 this.addReservationToCalendar(this.state.date);
                this.resetForm();
               }
              }
            ],
       {cancelable: false}
     )
   }

   resetForm() {
       this.setState({
           guests: 1,
           smoking: false,
           date: '',
           showModal: false
       });
   }

     async obtainNotificationPermission() {
      let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
      if (permission.status !== 'granted') {
          permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
          if (permission.status !== 'granted') {
              Alert.alert('Permission not granted to show notifications');
          }
      }
      return permission;
  }

  async presentLocalNotification(date) {
      await this.obtainNotificationPermission();
      Notifications.presentLocalNotificationAsync({
          title: 'Your Reservation',
          body: 'Reservation for '+ date + ' requested',
          ios: {
              sound: true
          },
          android: {
              sound: true,
              vibrate: true,
              color: '#512DA8'
          }
      });
  }

  async obtainCalendarPermission() {
           let permissionCalendar = await Permissions.getAsync(Permissions.CALENDAR);
           if (permissionCalendar.status !== 'granted') {
               permissionCalendar = await Permissions.askAsync(Permissions.CALENDAR);
               if (permissionCalendar.status !== 'granted') {
                   Alert.alert('Permission not granted to show notifications');
               }
           }
           return permissionCalendar;
       }

       async getDefaultCalendarSource() {
              const calendars = await Calendar.getCalendarsAsync();
              const defaultCalendars = calendars.filter(each => each.source.name === 'Default');
              return defaultCalendars[0].source;
          }


          async addReservationToCalendar(date) {
              await this.obtainCalendarPermission();
              const defaultCalendarSource =
                  Platform.OS === 'ios'
                      ? await this.getDefaultCalendarSource()
                      : { isLocalAccount: true, name: 'Expo Calendar' };
              const newCalendarID = await Calendar.createCalendarAsync({
                  title: "Your Reservation",
                  color: "#512DA8",
                  entityType: Calendar.EntityTypes.EVENT,
                  sourceId: defaultCalendarSource.id,
                  source: defaultCalendarSource,
                  name: 'internalCalendarName',
                  ownerAccount: 'personal',
                  accessLevel: Calendar.CalendarAccessLevel.OWNER,
              })
              console.log("New Calendar Id is: " + newCalendarID);
              const eventSet = await Calendar.createEventAsync(newCalendarID, {
                  title: "Con Fusion Table Reservation",
                  startDate: Date.parse(date),
                  endDate: (Date.parse(date) + (2 * 60 * 60 * 1000)),
              })
              console.log("Event is set: " + eventSet);
          }


   render() {
         return(
             <ScrollView>
                <Animatable.View animation="zoomIn" duration={1000}>

                     <View style={styles.formRow}>
                     <Text style={styles.formLabel}>Number of Guests</Text>
                     <Picker
                         style={styles.formItem}
                         selectedValue={this.state.guests}
                         onValueChange={(itemValue) => this.setState({guests: itemValue})}>
                         <Picker.Item label="1" value="1" />
                         <Picker.Item label="2" value="2" />
                         <Picker.Item label="3" value="3" />
                         <Picker.Item label="4" value="4" />
                         <Picker.Item label="5" value="5" />
                         <Picker.Item label="6" value="6" />
                     </Picker>
                     </View>
                     <View style={styles.formRow}>
                     <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                     <Switch
                         style={styles.formItem}
                         value={this.state.smoking}
                         trackColor='#512DA8'
                         onValueChange={(value) => this.setState({smoking: value})}>
                     </Switch>
                     </View>
                     <View style={styles.formRow}>
                     <Text style={styles.formLabel}>Date and Time</Text>
                     <DatePicker
                         style={{flex: 2, marginRight: 20}}
                         date={this.state.date}
                         format=''
                         mode="datetime"
                         placeholder="select date and Time"
                         minDate="2020-04-16"
                         confirmBtnText="Confirm"
                         cancelBtnText="Cancel"
                         customStyles={{
                         dateIcon: {
                             position: 'absolute',
                             left: 0,
                             top: 4,
                             marginLeft: 0
                         },
                         dateInput: {
                             marginLeft: 36
                         }
                         // ... You can check the source to find the other keys.
                         }}
                         onDateChange={(date) => {this.setState({date: date})}}
                     />
                     </View>
                     <View style={styles.formRow}>
                     <Button
                         onPress={() => this.handleReservation()}
                         title="Reserve"
                         color="#512DA8"
                         accessibilityLabel="Learn more about this purple button"
                         />
                     </View>

                    </Animatable.View>
             </ScrollView>
         );
     }

 };


  const styles = StyleSheet.create({
    formRow: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal:{
      justifyContent: 'center',
      margin: 40
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      backgroundColor: '#512DA8',
      textAlign: 'center',
      color: 'white',
      marginBottom: 20
    },
    modalText: {
      fontSize: 18,
      margin: 10
    }
});

export default Reservation;
