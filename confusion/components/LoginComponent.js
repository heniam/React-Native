import React, { Component } from 'react';
import {View, Button, StyleSheet } from 'react-native';
import { Card, Icon, Input, CheckBox } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';

class Login extends Component{

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
      title: 'Login'
    };

    handleLogin(){
      console.log(JSON.stringify(this.state));
      if(this.state.remember){
         SecureStore.getItemAsync(
          'userinfo',
           JSON.stringify({username: this.state.username, password: this.state.password})
        )
        .catch((error) => console.log('Could not save user info', error))
      }
      else {
        SecureStore.deleteItemAsync('userinfo')
        .catch((error) => console.log('Could not delete user info', error))
      }
    }

    render(){
      return(
          <View style={styles.container}>
              <Input
                  placeholder=' Username'
                  leftIcon={{ type: 'font-awesome', name: 'user-o'}}
                  onChangeText= {(username) => this.setState({ username})}
                  value={this.state.username}
                  containerStyle={styles.formInput}
                  leftIconContainerStyle={styles.lefticon}
                  />
                <Input
                    placeholder=' Password'
                    leftIcon={{ type: 'font-awesome', name: 'key'}}
                    onChangeText= {(password) => this.setState({password})}
                    secureTextEntry={true}
                    value={this.state.password}
                    containerStyle={styles.formInput}
                    leftIconContainerStyle={styles.lefticon}
                    />
                <CheckBox
                      title="Remember Me"
                      center
                      checked={this.state.remember}
                      onPress={() => this.setState({remember: !this.state.remember})}
                      containerStyle={styles.formCheckbox}
                      />
                <View style={styles.formButton}>
                  <Button
                      onPress={() => this.handleLogin()}
                      title='Login'
                      color='#512DA8'
                      />
                </View>
          </View>
      );
    }
  }

  const styles = StyleSheet.create({
     container: {
         justifyContent: 'center',
         margin: 20,
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
