import React, { Component } from 'react';
import { View, Text, ScrollView, Animated, Easing} from 'react-native';
import { Card } from 'react-native-elements';

import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';

const mapStateToProps = state =>{
  return{
    dishes : state.dishes,
    promotions : state.promotions,
    leaders : state.leaders
  }
}

function RenderItem(props){
  const item = props.item;

  if (props.isLoading) {
          return(
                  <Loading />
          );
      }
      else if (props.errMess) {
          return(
              <View>
                  <Text>{props.erreMess}</Text>
              </View>
          );
      }
      else {
          if (item != null) {
              return(
                  <Card
                      featuredTitle={item.name}
                      featuredSubtitle={item.designation}
                      image={{uri: baseUrl + item.image}}>
                      <Text
                          style={{margin: 10}}>
                          {item.description}</Text>
                  </Card>
              );
          }
          else {
              return(<View></View>);
          }
      }
    }

class Home extends Component {

    constructor(props){
      super(props);
      this.animatedValue = new Animated.Value(0);
    }

  static navigationOptions = {
      title: 'Home',
  };

  componentDidMount(){
    this.animate();
  }

  animate(){
    this.animatedValue.setValue(0);
    Animated.timing(
      this.animatedValue,
      {
        toValue: 8,
        duration: 8000,
        easing: Easing.linear
      }
    ).start(() => this.animate())
  }

    render() {
      const xpos1 = this.animatedValue.interpolate({
        inputRange: [0, 1, 3, 5, 8],
        outputRange: [1200, 600, 0, -600, -1200]
      });

      const xpos2 = this.animatedValue.interpolate({
        inputRange: [0, 2, 4, 6, 8],
        outputRange: [1200, 600, 0, -600, -1200]
      });

      const xpos3 = this.animatedValue.interpolate({
        inputRange: [0, 3, 5, 7, 8],
        outputRange: [1200, 600, 0, -600, -1200]
      });


      return(
        <ScrollView>
          <RenderItem item={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
               isLoading={this.props.dishes.isLoading}
               erreMess={this.props.dishes.erreMess}
               />
           <RenderItem item={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
               isLoading={this.props.promotions.isLoading}
               erreMess={this.props.promotions.erreMess}
               />
           <RenderItem item={this.props.leaders.leaders.filter((leader) => leader.featured)[0]}
               isLoading={this.props.leaders.isLoading}
               erreMess={this.props.leaders.erreMess}
               />

            </ScrollView>
          );
    }
  }
export default connect(mapStateToProps)(Home);
