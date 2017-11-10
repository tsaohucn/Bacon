import React, { Component } from 'react'
import { View, Text, FlatList, TouchableOpacity, BackHandler, ToastAndroid } from 'react-native'
import { inject, observer } from 'mobx-react'
import { Actions } from 'react-native-router-flux'
import ImagePicker from "react-native-image-picker"
import ImageResizer from "react-native-image-resizer"

import BaconChatRoom from '../../../views/BaconChatRoom/BaconChatRoom'

const options = {
  title: "傳送照片",
  takePhotoButtonTitle: "使用相機現場拍一張",
  chooseFromLibraryButtonTitle: "從相簿中選擇",
  cancelButtonTitle: "取消",
  mediaType: "photo",
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 1.0,
  noData: false,
  storageOptions: { skipBackup: true, path: "Bacon" }
}

const metadata = {
  contentType: 'image/jpeg'
}

@inject('firebase','SubjectStore') @observer
export default class ChatRoomScene extends Component {

  constructor(props) {
    super(props)
    this.firebase = this.props.firebase
    this.SubjectStore = this.props.SubjectStore
    this.chatRoomQuery = null
    this.interested = null
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid)
    this.chatRoomQuery = this.firebase.database().ref('chat_rooms/' + this.props.chatRoomKey + '/interested')
    this.chatRoomQuery.on('value', child => {
      this.interested = child.val()
      //console.warn(child.val())
      if (this.interested) {
        if (this.interested === 2) {
          // 轉到配對聊天室
          //console.warn('轉到配對聊天室')
          //this.removeChatRoomListener()
          Actions.MatchChatRoom({type: 'replace', title: this.props.Title, chatRoomKey: this.props.chatRoomKey,preyID: this.props.preyID})
        } else {
          this.firebase.database().ref('chat_rooms/' + this.props.chatRoomKey + '/chatRoomCreater').once('value',snap => {
            if (this.interested === 1) {
              if (snap.val() === this.SubjectStore.uid) {
                // 轉到Hello聊天室
                //console.warn('轉到Hello聊天室')
                //this.removeChatRoomListener()
                Actions.HelloChatRoom({type: 'replace', title: this.props.Title, chatRoomKey: this.props.chatRoomKey,preyID: this.props.preyID})
              } else {
                // 轉到訪客聊天室
                //console.warn('轉到訪客聊天室')
                //this.removeChatRoomListener()
                Actions.VisitorChatRoom({type: 'replace', title: this.props.Title, chatRoomKey: this.props.chatRoomKey,preyID: this.props.preyID})
              }
            } else if (child.val() === 0){
              if (snap.val() === this.SubjectStore.uid) {
                // 轉到Hello聊天室
                //console.warn('轉到Hello聊天室')
                //this.removeChatRoomListener()
                Actions.HelloChatRoom({type: 'replace', title: this.props.Title, chatRoomKey: this.props.chatRoomKey,preyID: this.props.preyID})
              } else {
                alert('你已對此會員不感興趣')
                //Actions.VisitorChatRoom({title: this.props.tiitle,chatRoomKey: this.props.chatRoomKey,preyID: this.props.preyID})
              }
            }
          })
        }
      }
    })
  }

  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid)
    this.removeChatRoomListener()
    this.interested = null
  }

  onBackAndroid = () => {
    Actions.pop()
    return true
  }

  onPressLeftIcon = () => {
    ImagePicker.showImagePicker(options, res => {
      if (res.didCancel) {
        //
      } else if (res.error) {
        //console.log(res.error);
      } else {
        ImageResizer.createResizedImage(res.uri, 1200, 1200, "JPEG", 100) // (imageUri, newWidth, newHeight, compressFormat, quality, rotation, outputPath)
          .then(image => {
            //console.log(image.uri)
            this.firebase.storage().ref('chats/' + this.props.chatRoomKey + '/' + Date.now() + '.jpg')
            .putFile(image.uri.replace('file:/',''), metadata)
            .then(uploadedFile => {
              //console.warn(uploadedFile.downloadURL)
              this.onSendImage(uploadedFile.downloadURL)
            })
            .catch(err => {
              alert(err)
            })
          })
          .catch(err => {
            alert(err)
          });
      }
    })
  }

  onPressRightIcon = () => {
    alert('要上傳貼圖')
  }

  onPressAvatar = () => {
    alert('預覽')
  }

  onSendMessage(messages = []) {
    const messages_no_blank = messages[0].text.trim()
    if (messages_no_blank.length > 0) {
      this.firebase.database().ref('chats/' + this.props.chatRoomKey + '/messages/' + this.SubjectStore.uid + '/' + Date.now()).set(messages[0].text)
      .then(() => {
        if (!this.interested) {
          this.firebase.database().ref('chats/' + this.props.chatRoomKey + '/chatRoomCreater').set(this.SubjectStore.uid)
          this.firebase.database().ref('chat_rooms/' + this.props.chatRoomKey).set({
            chatRoomCreater: this.SubjectStore.uid,
            interested: 1, //未處理
            lastMessage: messages[0].text,
            chatRoomRecipient: this.props.preyID
          })
          //alert('你成為訊息發送者(兩次發話限制)')
        } else {
          this.firebase.database().ref('chat_rooms/' + this.props.chatRoomKey + '/lastMessage').set(messages[0].text)
        }
      }) 
    }
  }

  onSendImage = imageURL => {
    this.firebase.database().ref('chats/' + this.props.chatRoomKey + '/images/' + this.SubjectStore.uid + '/' + Date.now()).set(imageURL)
    .then(() => {
      if (!this.interested) {
        this.firebase.database().ref('chats/' + this.props.chatRoomKey + '/chatRoomCreater').set(this.SubjectStore.uid)
        this.firebase.database().ref('chat_rooms/' + this.props.chatRoomKey).set({
          chatRoomCreater: this.SubjectStore.uid,
          interested: 1, //未處理
          lastMessage: '送出一張圖片',
          chatRoomRecipient: this.props.preyID
        })
        alert('你成為訊息發送者(兩次發話限制)')
      } else {
        this.firebase.database().ref('chat_rooms/' + this.props.chatRoomKey + '/lastMessage').set('送出一張圖片')
      }
    }) 
  }

  removeChatRoomListener = () => {
    if (this.chatRoomQuery) {
      this.chatRoomQuery.off()
      this.chatRoomQuery = null      
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        
        <BaconChatRoom
          messages={[]}
          onSend={messages => this.onSendMessage(messages)}
          user={{
            _id: this.SubjectStore.uid, // this.SubjectStore.uid
          }}
          onPressLeftIcon={this.onPressLeftIcon}
          onPressRightIcon={this.onPressRightIcon}
          onPressAvatar={this.onPressAvatar}
          showChoose={false}
        />
      </View>
    )
  }
}