import React, { Component } from 'react'
import { View, Text, FlatList, TouchableOpacity, InteractionManager } from 'react-native'
import { observer, inject } from 'mobx-react'
import { Actions } from 'react-native-router-flux'

import ChatList from '../../views/ChatList/ChatList'

const styles = {
  view: {
    marginTop: 10
  }
}

@inject('ChatStore') @observer
export default class VisitorsChatContainer extends Component {

  constructor(props) {
    super(props)
    this.ChatStore = this.props.ChatStore
  }

  componentWillMount() {
    this.ChatStore.setChatVistorRealPrey()
  }

  componentDidMount() {
  }

  onPress = (chatRoomKey,preyId,nickname,age) => {
    this.ChatStore.setChatRoomKey(chatRoomKey,preyId)
    this.goToChatRoom(nickname,age)
  }

  goToChatRoom = (nickname,age) => {
    //this.ChatStore.setFrom('visitors')
    Actions.ChatRoom({title: nickname + '，' + age, from: 'visitors'})
  }

  render() {
    return(
      <View style={styles.view}>
        <FlatList
          removeClippedSubviews
          data={ this.ChatStore.chatVistorPrey }
          numColumns={1}
          renderItem={({item}) =>
            <ChatList 
              name={item.name}
              avatar={item.avatar}
              onPress={ () => { this.onPress(item.key,item.prey,item.name,item.age) } }
              lastChatContent={item.lastChatContent}
              nonHandleChatCount={99}
              showBadge={item.showBadge}
              showTag={item.showTag}
              online={item.online}
              userState={item.userState}
              userStateColor={item.userStateColor}
              />
           }
        />
      </View>
    )
  }
}