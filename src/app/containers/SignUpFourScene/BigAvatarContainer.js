import React, { Component } from 'react'import { inject, observer } from 'mobx-react'import ImagePicker from 'react-native-image-picker'import ImageResizer from 'react-native-image-resizer'import BigAvatar from '../../views/BigAvatar/BigAvatar'const options = {  mediaType: 'photo',  maxWidth: 1000,  maxHeight: 1000,  quality: 0.8,  noData: false,  storageOptions: {    skipBackup: true,    path: 'Bacon',  },}@inject('SignUpStore') @observerexport default class BigAvatarContainer extends Component {  constructor(props) {    super(props)    this.SignUpStore = this.props.SignUpStore  }  addImage = () => {    ImagePicker.showImagePicker(options, (res) => {      if (res.didCancel) {      //      } else if (res.error) {        console.log(res.error)      } else {        ImageResizer.createResizedImage(res.uri, 1200, 1200, 'JPEG', 100) // (imageUri, newWidth, newHeight, compressFormat, quality, rotation, outputPath)        .then((resizedImageUri) => {          this.SignUpStore.setAvatar(resizedImageUri)          this.SignUpStore.setAlbum(resizedImageUri)        }).catch((err) => {          console.log(err)        })      }    })  }  render() {    return (      <BigAvatar        imgSource={ this.SignUpStore.avatar }        topButtonText='新增個人照片一張'        topButtonOnPress={ this.addImage }      />    )  }}