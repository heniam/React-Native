import React, { Component } from 'react';
import { Text, View ,ScrollView, FlatList,StyleSheet, Button, Modal, Alert, PanResponder, Share } from 'react-native';
import { Card, Icon,Rating, Input} from 'react-native-elements';
/* we dont need dishes and comments beacuse its
connected throigh the redux store */
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';

import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (commentObject) => dispatch(postComment(commentObject))
})

function RenderDish(props) {
    const dish = props.dish;

    //Unnecessary rubber Animation
  //  handleViewRef = ref => this.view = ref;

    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
      if ( dx < -200 )
          return true;
      else {
        return false;
      }
    };

    const recognizeComment = ({ moveX, moveY, dx, dy }) =>
   {
     if (dx > 200)
     {
       return true;
     }

     else return false;
   };

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (event, gestureState) => {
        return true;
      },

   // onPanResponderGrant: () => {
   //      this.view.rubberBand(1000)
   //      .then(endState => console.log(endState.finished ? 'finished' : 'cancelled'))
   //    },

      onPanResponderEnd: (event, gestureState) =>
   {
     if (recognizeDrag(gestureState))
        {
           Alert.alert(
             "Add to Favorites?",
             `Are you sure you wish to add ${dish.name} to your favorites?`,
             [
               {
                 text: "Cancel",
                 onPress: () => console.log("Cancel pressed"),
                 style: "cancel"
               },
               {
                 text: "Ok",
                 onPress: () => props.favorite ? console.log("Already favorite") : props.onPress()
               }
             ],
             { cancelable: false }
            )
          }

          else if (recognizeComment(gestureState))
          {
            props.toggleModal();
          }

          return true;
        }
      });

      const shareDish = (title, message, url) => {
        Share.share({
          title: title,
          message: title + ': ' + message + ' ' + url,
          url: url
        },{
          dialogTitle: 'Share ' + title
        });
      }

        if (dish != null) {
            return(
              <Animatable.View animation="fadeInDown" duration={2000} delay={100}
                 //ref={this.handleViewRef}
                 {...panResponder.panHandlers}>
                  <Card
                    featuredTitle={dish.name}
                    image={{uri: baseUrl + dish.image }}>
                  <Text style={{margin: 10}}>
                      {dish.description}
                  </Text>
                  <View style={{ alignSelf: 'center', flexDirection: "row" }}>
                     <Icon
                         raised
                         reverse
                         name={props.favorite ? 'heart' : 'heart-o'}
                         type='font-awesome'
                         color='#f50'
                         onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                     />
                     <Icon
                         raised
                         reverse
                         name='pencil'
                         type='font-awesome'
                         color="#512DA8"
                         onPress={() => props.toggleModal()}
                     />
                     <Icon
                        raised
                        reverse
                        name = {'share'}
                        type='font-awesome'
                        color='#32CD32'
                        style={styles.cardItem}
                        onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)}
                     />
                     </View>
                 </Card>
              </Animatable.View>
                     );
                 }
        else {
            return(<View></View>);
        }
}

function RenderComments(props){

  const comments = props.comments;

    const renderCommentItem = ({item, index}) => {

        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating ratingCount={5}
                     readonly
                     imageSize={15}
                     style={{ alignSelf: "auto", marginVertical: 10 }}
                     startingValue={item.rating}
                 />
                     <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
                 </View>
             );
    };

    return(
     <Animatable.View animation="fadeInUp" duration={2000} delay={100}>
          <Card title='Comments' >
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
                />
          </Card>
      </Animatable.View>
    );
}

class Dishdetail extends Component {

    static navigationOptions = {
        title: 'Dish Details'
    };
    markFavorite(dishId) {
         this.props.postFavorite(dishId);
     }

     constructor(props) {
         super(props);

         this.state = {
             showModal: false,
             rating: 3
         }
     }

     toggleModal() {
         this.setState({ showModal: !this.state.showModal });
     }

     handleComment(dishid, auth, comm, rate) {

         this.props.postComment({
             dishId: dishid,
             author: auth,
             comment: comm,
             rating: this.state.rating,
             date: new Date().toISOString()
         })
         this.toggleModal()
     }

     render() {
         const dishId = this.props.navigation.getParam('dishId', '');
         this.author = ' ', this.comment = ' ', this.rating = ' ';
         return (
             <ScrollView>
                 <RenderDish dish={this.props.dishes.dishes[+dishId]}
                     favorite={this.props.favorites.some(el => el === dishId)}
                     onPress={() => this.markFavorite(dishId)}
                     toggleModal={() => this.toggleModal()}
                 />
                 <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />

                 <Modal animationType={"slide"} transparent={false}
                     visible={this.state.showModal}
                     onRequestClose={() => this.toggleModal()}
                 >
                     <View style={styles.modal}>
                         <View style={{ marginVertical: 10 }}>
                             <Rating
                                 showRating
                                 onFinishRating={(rating) => { this.setState({ rating: rating }) }}
                             />
                         </View>
                         <View style={{ marginVertical: 10 }}>
                             <Input
                                 placeholder='Author'
                                 leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                                 onChangeText={text => this.author = text}
                                 leftIconContainerStyle={styles.lefticon}
                             />
                             <Input
                                 placeholder='Comment'
                                 leftIcon={{ type: 'font-awesome', name: 'comments-o' }}
                                 onChangeText={text => this.comment = text}
                                 leftIconContainerStyle={styles.lefticon}
                             />
                         </View>
                         <View style={styles.button}>
                             <View style={{ backgroundColor: '#512DA8' }}>
                                 <Button
                                     onPress={() => { this.handleComment(dishId, this.author, this.comment, this.rating); }}
                                     color="#fff"
                                     title="SUBMIT"
                                 />
                             </View>
                             <View style={{ backgroundColor: '#a3a3a3', marginVertical: 10 }}>
                                 <Button
                                     onPress={() => { this.toggleModal(); }}
                                     color="#fff"
                                     title="CANCEL"
                                 />
                             </View>
                         </View>
                     </View>
                 </Modal>
             </ScrollView>
         );
     }
 }

 const styles = StyleSheet.create({
     modal: {
         marginTop: '15%',
         marginHorizontal: '5%',
         flex: 1
     },
     button: {
         margin: 10,
         flexDirection: "column",
         flex: 1
     },
     lefticon: {
       marginRight: 10
     }

 });



export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);
