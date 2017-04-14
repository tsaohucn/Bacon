import React, { Component } from 'react';
import { View, Dimensions, Image, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button, } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { observer } from 'mobx-react/native';
import PhotoGrid from 'react-native-photo-grid';
import Reactotron from 'reactotron-react-native';
import ImagePicker from 'react-native-customized-image-picker';
import Modal from 'react-native-simple-modal';
import { uploadImage, resizeImage } from '../../Utils';


const {width, height} = Dimensions.get('window'); //eslint-disable-line
const ADD_IMAGE = require('../../images/addImage.png'); //eslint-disable-line
const PLACEHOLDER = require('../../images/cameraPlaceholder.jpg'); //eslint-disable-line
const styles = {
  viewWrapper: {
    width,
    flex: 1,
  },
  gallery: {
  },
  icon: {
    textAlign: 'center'
  },
  item: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  photo: {
      flex: 1
  }
};

@observer
export default class Gallery extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;
    this.firebase = this.props.fire;
    this.storage = this.props.storage;

    this.state = {
      items: [{ id: 'addImage', src: ADD_IMAGE }],
      loading: false,
      photos: this.store.user.photos,
      showModal: false,
      currentItem: null,
    };
  }

  componentDidMount() {
    const newItems = this.state.items;
    Reactotron.log('items: ');
    Reactotron.log(newItems);
    Reactotron.log('user/photos: ');
    Reactotron.log(this.store.user.photos);
    if(this.store.user.photos) {
      this.store.user.photos.forEach(item => {
        newItems.push(item);
      });
      this.setState({
        items: newItems,
      });
      Reactotron.log('items: ');
      Reactotron.log(newItems);
    }
  }

  generateFilename = () => {
    return this.firebase.database().ref('users/' + this.store.user.uid + '/photos').push().key;
  }

  handlePressed = async photo => {
    Reactotron.log('Photo pressed');
    this.setState({ loading: true });
    let gallery = [];
    if(photo.id === 'addImage') {
      await ImagePicker.openPicker({
        multiple: true
      })
      .then( images => {
        this.setState({ loading: true });
        images.forEach(async (image) => {
          const filename = await this.generateFilename();
          const firebaseRefObj = this.firebase.storage().ref('userPhotos/' + this.store.user.uid + '/' + filename + '.jpg');
          // resizeImage(uri, width, height, mime, quality)
          const resizedUri = await resizeImage(image.path, 600, 600, image.mime, 80);
          const downloadUrl = await uploadImage(resizedUri, firebaseRefObj, image.mime);
          Reactotron.log(image);
          Reactotron.log('resizedUri: ' + resizedUri);
          Reactotron.log('downloadUrl: ' + downloadUrl);
          gallery.push({ id: filename, src: {uri: downloadUrl }});

          if(gallery.length == images.length) {
            // update state
            const arry = this.state.items.concat(gallery);
            this.setState({
              items: arry,
            });

            // update appstore and firebase
            let newGallery = gallery;
            if(this.store.user.photos) {
              newGallery = this.store.user.photos.concat(gallery);
            }
            // Reactotron.log('Print new gallery');
            // Reactotron.log(newGallery);
            this.store.setPhotos(newGallery);
            this.setState({ loading: false });
            this.firebase.database().ref('users/' + this.store.user.uid + '/photos').set(newGallery);
          }
        });
      })
      .catch(err => {
        this.setState({ loading: false });
        Reactotron.log(err.code);
      });
    } else {
      Reactotron.log('Real photo pressed');
      this.setState({
        showModal: true,
        loading: false,
        currentItem: photo,
      });
    }
  }

  handleSetAvatar = () => {
    this.setState({showModal: false});
    const user = this.firebase.auth().currentUser;
    const photoURL = this.state.currentItem.src.uri;
    this.store.setAvatar(photoURL);
    this.firebase.database().ref('users/' + user.uid).update({photoURL})
    user.updateProfile({
      photoURL,
    }).then(() => {
      Reactotron.log('Update User Profile Succeed: ' + photoURL);
      this.setState({
        showModal: false
      });
    }, error => {
      Reactotron.error(error);
      Reactotron.log('Update User Profile failed: ' + photoURL);
      this.setState({
        showModal: false
      });
    });
  }

  handleDelete = () => {
    alert('哈, 刪照片功能還沒寫好');
  }

  render() {
    return(
      <View style={styles.viewWrapper}>
        {
          this.state.loading && <ActivityIndicator style={{ marginTop: 50, marginBottom: 20 }} />
        }
        <PhotoGrid
          style={styles.gallery}
          data = { this.state.items }
          itemsPerRow = { 3 }
          itemMargin = { 1 }
          renderItem = { (item, size=123) => {
            return(
              <TouchableOpacity
                key = { item.id }
                style = {{ width: size, height: size }}
                onPress = {() => this.handlePressed(item)}
                >
                <Image
                  resizeMode = 'cover'
                  style = {{ width: size, height: size }}
                  source = {item.src}

                />
              </TouchableOpacity>
            );
          }}
        />
        <Modal
          open={this.state.showModal}
          offset={0}
          overlayBackground={'rgba(0, 0, 0, 0.75)'}
          animationDuration={200}
          animationTension={40}
          modalDidOpen={() => {Reactotron.log('modal open')}}
          modalDidClose={() => {this.setState({ showModal: false})}}
          closeOnTouchOutside={true}
          containerStyle={{
            justifyContent: 'center'
          }}
          modalStyle={{
            borderRadius: 2,
            margin: 20,
            padding: 10,
            backgroundColor: '#F5F5F5'
          }}>
          <View>
              <Button
                title='X'
                buttonStyle={{ width: 50, height: 50, margin: 5, alignSelf: 'flex-end'}}
                onPress={() => this.setState({showModal: false})}
                backgroundColor={'gray'}
                />
              <Button
                title='將此照片設為頭像'
                backgroundColor={'green'}
                buttonStyle={{ margin: 5 }}
                onPress={this.handleSetAvatar}
                />
              <Button
                title='刪除此照片'
                backgroundColor={'red'}
                buttonStyle={{ margin: 5 }}
                onPress={this.handleDelete}
                />
          </View>
        </Modal>
      </View>
    );
  }
}
