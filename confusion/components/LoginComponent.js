import React, { Component } from 'react';
import {View, StyleSheet, Text, ScrollView, Image } from 'react-native';
import {Icon, Input, CheckBox, Button } from 'react-native-elements';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { baseUrl } from '../shared/baseUrl';
import * as SecureStore from 'expo-secure-store';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from "expo-image-manipulator";
import { Asset } from 'expo-asset';


class LoginTab extends Component{

    constructor(props){
      super(props);
      this.state = {
        username: '',
        password: '',
        remember: false
      }
    }
    componentDidMount() {
       SecureStore.getItemAsync('userinfo')
        .then((userdata) => {
            let userinfo = JSON.parse(userdata);

            if(userinfo){
              this.setState({username: userinfo.username});
              this.setState({password: userinfo.password});
              this.setState({remember: true})
            }
        })
    }

    static navigationOptions = {
      title: 'Login',
      tabBarIcon: ({ tintColor }) => (
          <Icon
              name='sign-in'
              type='font-awesome'
              size={24}
              iconStyle={{ color: tintColor }}
              />
      )
    };

    handleLogin() {
          console.log(JSON.stringify(this.state));
          if(this.state.remember)
              SecureStore.setItemAsync(
                'userinfo',
                JSON.stringify({username: this.state.username , password: this.state.password })
              )
              .catch((error) => console.log('Could not save user info',error));

          else
              SecureStore.deleteItemAsync('userinfo')
              .catch((error) => console.log('Could not delete user info',error));

      }

    render() {
          return (
              <View style={styles.container}>
                  <Input
                      placeholder="Username"
                      leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                      onChangeText={(username) => this.setState({username})}
                      value={this.state.username}
                      containerStyle={styles.formInput}
                      leftIconContainerStyle={styles.lefticon}
                      />
                  <Input
                      placeholder="Password"
                      leftIcon={{ type: 'font-awesome', name: 'key' }}
                      onChangeText={(password) => this.setState({password})}
                      secureTextEntry={true}
                      value={this.state.password}
                      containerStyle={styles.formInput}
                      leftIconContainerStyle={styles.lefticon}
                      />
                  <CheckBox title="Remember Me"
                      center
                      checked={this.state.remember}
                      onPress={() => this.setState({remember: !this.state.remember})}
                      containerStyle={styles.formCheckbox}
                      />
                  <View style={styles.formButton}>
                      <Button
                          onPress={() => this.handleLogin()}
                          title=" Login"
                          icon={
                              <Icon
                                  name='sign-in'
                                  type='font-awesome'
                                  size={24}
                                  color= 'white'
                              />
                          }
                          buttonStyle={{
                              backgroundColor: "#512DA8"
                          }}
                          />
                  </View>
                  <View style={styles.formButton}>
                      <Button
                          onPress={() => this.props.navigation.navigate('Register')}
                          title=" Register"
                          clear
                          icon={
                              <Icon
                                  name='user-plus'
                                  type='font-awesome'
                                  size={24}
                                  color= 'blue'
                              />
                          }
                          titleStyle={{
                              color: "blue"
                          }}
                          buttonStyle={{
                              backgroundColor: "#f2f2f2"
                          }}
                          />
                  </View>
              </View>
          );
      }

  }


  class RegisterTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            email: '',
            remember: false,
            imageUrl: baseUrl + 'images/logo.png'
        }
    }


    getImageFromCamera = async () => {
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
        const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
            let capturedImage = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
            });
            if (!capturedImage.cancelled) {
                console.log(capturedImage);
                this.processImage(capturedImage.uri);
            }
        }

     };

     getImageFromGallery = async () =>{
          const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

          if (cameraRollPermission.status === "granted"){
            let capturedImage = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              aspect: [4,3]
            });

            //user did not cancel image capture
            if (capturedImage.cancelled === false){
              console.log(capturedImage);
              this.processImage(capturedImage.uri);
            }
          }
        };


      processImage = async (imageUri) => {
          let processedImage = await ImageManipulator.manipulateAsync(
              imageUri,
             [
                 {resize: {width:400}}
             ],
             { format: 'png'}
         );
         console.log(processedImage);
         this.setState({ imageUrl : processedImage.uri });
     };

     static navigationOptions = {
         title: 'Register',
         tabBarIcon: ({ tintColor, focused }) => (
             <Icon
               name='user-plus'
               type='font-awesome'
               size={24}
               iconStyle={{ color: tintColor }}
             />
           )
     };

     handleRegister() {
      console.log(JSON.stringify(this.state));
      if(this.state.remember)
        SecureStore.setItemAsync(
          'userinfo',
          JSON.stringify({username: this.state.username , password: this.state.password })
        )
        .catch((error) => console.log('Could not save user info',error));

  }
     render() {
         return(
             <ScrollView>
             <View style={styles.container}>
                 <View style={styles.imageContainer}>
                     <Image
                         source={{uri: this.state.imageUrl}}
                         loadingIndicatorSource={require('./images/logo.png')}
                         style={styles.image}
                         />
                     <Button
                         title="Camera"
                         onPress={this.getImageFromCamera}
                         style={{ marginHorizontal: '5%' }}
                        />
                    <Button
                        title="Gallery"
                        onPress={this.getImageFromGallery}
                        style={{ marginHorizontal: '5%' }}
                    />
                 </View>
                 <Input
                     placeholder="Username"
                     leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                     onChangeText={(username) => this.setState({username})}
                     value={this.state.username}
                     containerStyle={styles.formInput}
                     leftIconContainerStyle={styles.lefticon}
                     />
                 <Input
                     placeholder="Password"
                     leftIcon={{ type: 'font-awesome', name: 'key' }}
                     onChangeText={(password) => this.setState({password})}
                     secureTextEntry={true}
                     value={this.state.password}
                     containerStyle={styles.formInput}
                     leftIconContainerStyle={styles.lefticon}
                     />
                 <Input
                     placeholder="First Name"
                     leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                     onChangeText={(firstname) => this.setState({firstname})}
                     value={this.state.firstname}
                     containerStyle={styles.formInput}
                     leftIconContainerStyle={styles.lefticon}
                     />
                 <Input
                     placeholder="Last Name"
                     leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                     onChangeText={(lastname) => this.setState({lastname})}
                     value={this.state.lastname}
                     containerStyle={styles.formInput}
                     leftIconContainerStyle={styles.lefticon}
                     />
                 <Input
                     placeholder="Email"
                     leftIcon={{ type: 'font-awesome', name: 'envelope-o' }}
                     onChangeText={(email) => this.setState({email})}
                     value={this.state.email}
                     containerStyle={styles.formInput}
                     leftIconContainerStyle={styles.lefticon}
                     />
                 <CheckBox title="Remember Me"
                     center
                     checked={this.state.remember}
                     onPress={() => this.setState({remember: !this.state.remember})}
                     containerStyle={styles.formCheckbox}
                     />
                 <View style={styles.formButton}>
                     <Button
                         onPress={() => this.handleRegister()}
                         title="Register"
                         icon={
                             <Icon
                                 name='user-plus'
                                 type='font-awesome'
                                 size={24}
                                 color= 'white'
                             />
                         }
                         buttonStyle={{
                             backgroundColor: "#512DA8"
                         }}
                         />
                 </View>
             </View>
             </ScrollView>
         );
     }
 }

const Login = createBottomTabNavigator({
    Login: LoginTab,
    Register: RegisterTab
}, {
    tabBarOptions: {
        activeBackgroundColor: '#9575CD',
        inactiveBackgroundColor: '#D1C4E9',
        activeTintColor: '#ffffff',
        inactiveTintColor: 'gray'
    }
});


  const styles = StyleSheet.create({
     container: {
         justifyContent: 'center',
         margin: 20,
     },
     imageContainer: {
       flex: 1,
       flexDirection: 'row',
       margin: 20,
       justifyContent: 'space-around'
   },
     image: {
       margin: 10,
       width: 80,
       height: 60
     },
     formInput: {
         justifyContent:'center',
         marginLeft: 10,
         marginRight:40,
         margin:10,
         paddingRight:20,
     },
     formCheckbox: {
         marginLeft: 20,
         marginRight: 30,
         backgroundColor: null,
         margin:10,
     },
     formButton: {
         justifyContent:'center',
         margin: 40
     },
     lefticon: {
       marginRight: 10
     }
 });



export default Login;
