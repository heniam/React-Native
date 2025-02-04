import React, { Component } from 'react';
import { View, Platform, Text, ScrollView, Image, StyleSheet, ToastAndroid} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer ,SafeAreaView } from 'react-navigation';
import { createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';

import Home from './HomeComponent';
import Menu from './MenuComponent';
import Dishdetail from './DishdetailComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import Reservation from './ReservationComponent';
import Favorites from './FavoriteComponent';
import Login from './LoginComponent';

import { Icon } from 'react-native-elements';
/*Suppressing the warning */
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['VirtualizedLists should never be nested']);
/*Suppressing the warning */


import { connect } from 'react-redux';
import { fetchDishes, fetchComments, fetchPromos, fetchLeaders} from '../redux/ActionCreators';
import NetInfo from '@react-native-community/netinfo';



const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders
  }
}

const mapDispatchToProps = dispatch => ({
  fetchDishes: () => dispatch(fetchDishes()),
  fetchComments: () => dispatch(fetchComments()),
  fetchPromos: () => dispatch(fetchPromos()),
  fetchLeaders: () => dispatch(fetchLeaders()),
})


const MenuNavigator = createStackNavigator({
  Menu: { screen: Menu,
    navigationOptions: ({navigation}) => ({
      headerStyle: {
        backgroundColor: '#512DA8'
      },
      headerLeft: () =>
          <Icon
            name='menu'
            size={24}
            color='white'
            onPress={ () => navigation.toggleDrawer() } />
    })
  },
  Dishdetail: { screen: Dishdetail }
}, {
  initialRouteName: 'Menu',
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: '#512DA8'
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      color: '#fff'
    }
  }
});


const HomeNavigator = createStackNavigator({
    Home: {screen: Home},
  },{
    defaultNavigationOptions: ({navigation}) => ({
      headerStyle: {
        backgroundColor: '#512DA8',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        color: '#fff',
      },
      headerLeft: () =>
         <Icon
           name="menu"
           size={24}
           color= 'white'
           onPress={ () => navigation.toggleDrawer() }
      />
    }),
  });

const AboutNavigator = createStackNavigator({
    About: {screen: About},
  },  {
    defaultNavigationOptions: ({navigation}) => ({
      headerStyle: {
        backgroundColor: '#512DA8',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        color: '#fff',
      },
      headerLeft: () =>
         <Icon
           name="menu"
           size={24}
           color= 'white'
           onPress={ () => navigation.toggleDrawer() }
      />
    }),
  });


const ContactNavigator = createStackNavigator({
    Contact: {screen: Contact},
  },{
    defaultNavigationOptions: ({navigation}) => ({
      headerStyle: {
        backgroundColor: '#512DA8',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        color: '#fff',
      },
      headerLeft: () =>
         <Icon
           name="menu"
           size={24}
           color= 'white'
           onPress={ () => navigation.toggleDrawer() }
      />
    })
  });

  const ReservationNavigator = createStackNavigator({
      Reservation: {screen: Reservation},
    },{
      defaultNavigationOptions: ({navigation}) => ({
        headerStyle: {
          backgroundColor: '#512DA8',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          color: '#fff',
        },
        headerLeft: () =>
           <Icon
             name="menu"
             size={24}
             color= 'white'
             onPress={ () => navigation.toggleDrawer() }
        />
      })
    });

    const FavoritesNavigator = createStackNavigator({
        Favorites: {screen: Favorites},
      },{
        defaultNavigationOptions: ({navigation}) => ({
          headerStyle: {
            backgroundColor: '#512DA8',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            color: '#fff',
          },
          headerLeft: () =>
             <Icon
               name="menu"
               size={24}
               color= 'white'
               onPress={ () => navigation.toggleDrawer() }
          />
        })
      });

      const LoginNavigator = createStackNavigator({
          Login: Login ,
        },{
          defaultNavigationOptions: ({navigation}) => ({
            headerStyle: {
              backgroundColor: '#512DA8',
            },
            title: 'Login',
            headerTintColor: '#fff',
            headerTitleStyle: {
              color: '#fff',
            },
            headerLeft: () =>
               <Icon
                 name="menu"
                 size={24}
                 color= 'white'
                 onPress={ () => navigation.toggleDrawer() }
            />
          })
        });

  const CustomDrawerContentComponent = (props) => (

   <ScrollView>
     {/* specifically for the iPhone X */}
     <SafeAreaView
       style={styles.container}
       forceInset={{ top: "always", horizontal: "never" }}>

       <View style={styles.drawerHeader}>
         <View style={{flex: 1}}>
           <Image
             source={require("./images/logo.png")}
             style={styles.drawerImage}
           />
         </View>

         <View style={{flex: 2}}>
           <Text style={styles.drawerHeaderText}>Ristorante Con Fusion</Text>
         </View>
       </View>

       <DrawerItems {...props} />
     </SafeAreaView>
   </ScrollView>
 );



const MainNavigator = createDrawerNavigator({
  Login: {
    screen: LoginNavigator,
    navigationOptions: {
      title: 'Login',
      drawerLabel: 'Login',
      drawerIcon: ({tintColor }) => (
        <Icon
            name='sign-in'
            type='font-awesome'
            size={24}
            color={tintColor}
            />
        ),
    },
  },
    Home: {
      screen: HomeNavigator,
      navigationOptions: {
        title: 'Home',
        drawerLabel: 'Home',
        drawerIcon: ({tintColor }) => (
          <Icon
              name='home'
              type='font-awesome'
              size={24}
              color={tintColor}
              />
          ),
      },
    },

    About: {
      screen: AboutNavigator,
      navigationOptions: {
        title: 'About Us',
        drawerLabel: 'About Us',
        drawerIcon: ({tintColor }) => (
          <Icon
              name='info-circle'
              type='font-awesome'
              size={24}
              color={tintColor}
              />
          ),
      },
    },

    Menu: {
      screen: MenuNavigator,
      navigationOptions: {
        title: 'Menu',
        drawerLabel: 'Menu',
        drawerIcon: ({tintColor }) => (
          <Icon
              name='list'
              type='font-awesome'
              size={24}
              color={tintColor}
              />
          ),
      },
    },
    Contact: {
      screen: ContactNavigator,
      navigationOptions: {
        title: 'Contact Us',
        drawerLabel: 'Contact Us',
        drawerIcon: ({tintColor }) => (
          <Icon
              name='address-card'
              type='font-awesome'
              size={22}
              color={tintColor}
              />
          ),
      },
    },

    Favorites: {
      screen: FavoritesNavigator,
      navigationOptions: {
        title: 'My Favorites',
        drawerLabel: 'My Favorites',
        drawerIcon: ({tintColor }) => (
          <Icon
              name='heart'
              type='font-awesome'
              size={24}
              color={tintColor}
              />
          ),
      },
    },


    Reservation: {
      screen: ReservationNavigator,
      navigationOptions: {
        title: 'Reserve Table',
        drawerLabel: 'Reserve Table',
        drawerIcon: ({tintColor }) => (
          <Icon
              name='cutlery'
              type='font-awesome'
              size={24}
              color={tintColor}
              />
          ),
      },
    },

  },
  {
    //we want to show th ehome page first instead of the login
    initialRouteName: 'Home',
    drawerBackgroundColor: '#D1C4E9',
    contentComponent: CustomDrawerContentComponent
  },
);

const MainNavigatorContainer = createAppContainer(MainNavigator);


class Main extends Component {

  componentDidMount(){
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();

//most of this stuff is depreceated !!!

    /*NetInfo.fetch()
                .then((connectionInfo) => {
                    ToastAndroid.show('Initial Network Connectivity Type: '
                        + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType,
                        ToastAndroid.LONG)
                });

            NetInfo.addEventListener('connectionChange', this.handleConnectivityChange);
        }

        componentWillUnmount() {
            NetInfo.removeEventListener('connectionChange', this.handleConnectivityChange);
        }



        handleConnectivityChange = (connectionInfo) => {
            switch (connectionInfo.type) {
                case 'none':
                    ToastAndroid.show('You are now offline!', ToastAndroid.LONG);
                    break;
                case 'wifi':
                    ToastAndroid.show('You are now connected to WiFi!', ToastAndroid.LONG);
                    break;
                case 'cellular':
                    ToastAndroid.show('You are now connected to Cellular!', ToastAndroid.LONG);
                    break;
                case 'unknown':
                    ToastAndroid.show('You now have unknown connection!', ToastAndroid.LONG);
                    break;
                default:
                    break;
            }*/
        }



  render() {
    const unsubscribe = NetInfo.addEventListener(state => {
       console.log('Connection type', state.type);
       console.log('Is connected?', state.isConnected);
     });

    return (
      <View
        style={{
          flex: 1,
          paddingTop:
            Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight,
        }}>
        <MainNavigatorContainer />
        {unsubscribe}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: '#512DA8',
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row'
  },
  drawerHeaderText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  drawerImage: {
    margin: 10,
    width: 80,
    height: 60
  }
});


export default connect(mapStateToProps,mapDispatchToProps)(Main);
