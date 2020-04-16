import React, { Component } from 'react';
import { View, FlatList,ScrollView } from 'react-native';
import { Tile } from 'react-native-elements';

import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';

const mapStateToProps = state =>{
  return{
    dishes : state.dishes
  }
}

class Menu extends Component {

    static navigationOptions = {
        title: 'Menu'
    };


 	render() {

 		// extract this for use with onPress below
 		const { navigate } = this.props.navigation;


 		const renderMenuItem = ({item, index}) => {
 			return(
        <ScrollView>
        <Tile
            key={index}
            title={item.name}
            caption={item.description}
            featured
            onPress={() => navigate('Dishdetail', { dishId: item.id })}
            imageSrc={{ uri: baseUrl + item.image}}
            />
          </ScrollView>
   			);
   		}

      if (this.props.dishes.isLoading) {
              return(
                  <Loading />
              );
          }
          else if (this.props.dishes.errMess) {
              return(
                  <View>
                      <Text>{props.dishes.errMess}</Text>
                  </View>
              );
          }
          else {
              return (
                  <FlatList
                      data={this.props.dishes.dishes}
                      renderItem={renderMenuItem}
                      keyExtractor={item => item.id.toString()}
                      />
              );
          }
      }

}

export default connect(mapStateToProps)(Menu);
