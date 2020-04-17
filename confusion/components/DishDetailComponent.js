import React, { Component } from 'react';
import { Text, View ,ScrollView, FlatList,StyleSheet, Button, Modal } from 'react-native';
import { Card, Icon,Rating, Input} from 'react-native-elements';
/* we dont need dishes and comments beacuse its
connected throigh the redux store */
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';

import { postFavorite, postComment } from '../redux/ActionCreators';

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

        if (dish != null) {
            return(
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
                 </View>
             </Card>
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

    return (
        <Card title='Comments' >
        <FlatList
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
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
                                 placeholder='  Author'
                                 leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                                 onChangeText={text => this.author = text}
                             />
                             <Input
                                 placeholder='  Comment'
                                 leftIcon={{ type: 'font-awesome', name: 'comments-o' }}
                                 onChangeText={text => this.comment = text}
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
     }
 });



export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);
