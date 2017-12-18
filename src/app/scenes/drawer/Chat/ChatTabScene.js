import React, { Component } from 'react'
import { Actions } from 'react-native-router-flux'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view'
import { inject, observer } from 'mobx-react'
import { View, ActivityIndicator, InteractionManager } from 'react-native'

import MatchChatContainer from '../../../containers/ChatTabScene/MatchChatContainer'
import VisitorsChatContainer from '../../../containers/ChatTabScene/VisitorsChatContainer'
import SendChatContainer from '../../../containers/ChatTabScene/SendChatContainer'

@inject('ChatStore','SubjectStore','firebase') @observer
export default class ChatTabScene extends Component {

  constructor(props) {
    super(props)
    this.ChatStore = this.props.ChatStore
    this.SubjectStore = this.props.SubjectStore
    this.firebase = this.props.firebase
  }

  componentWillMount () {
    Actions.refresh({ key: 'Drawer', open: false })
    this.ChatStore.cleanChatModal()
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(this.task)
  }

  componentWillUnmount() {
    //console.warn('解除了')
  }

  task = () => {
    //await this.sleep(260)
    this.ChatStore.openChatModal()
  }

  sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  fetchChatRoom = (index) => {
    switch(index) {
      case 0:
        //console.warn('抓配對聊天室')
        this.firebase.database().ref('chat_rooms').orderByChild('interested').equalTo(2).once('value',snap => {
          const matchs = Object.keys(snap.val()).filter(key => 
            snap.val()[key].chatRoomCreater === this.SubjectStore.uid || snap.val()[key].chatRoomRecipient === this.SubjectStore.uid
          )
          
          //console.log(matchs)
        })
        break;
      case 1:
        //console.warn('抓來訪聊天室')
        break;
      case 2:
        //console.warn('抓打招呼聊天室')
        break;
      default:
      //
    }
  }

  render() {
    return(
     <View style={{flex: 1}}>
        { this.ChatStore.chatModal ?
        <View style={{flex: 1,justifyContent: 'center'}}>
          <ActivityIndicator
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              paddingBottom: 110
            }}
            size="large"
            color='#d63768'
          />
        </View> :
      <ScrollableTabView
        initialPage = { this.props.initialPage || 0 }
        tabBarPosition='top'
        renderTabBar={() => <DefaultTabBar />}
        tabBarUnderlineStyle={{ backgroundColor: '#d63768' }}
        tabBarBackgroundColor='white'
        tabBarActiveTextColor='#d63768'
        tabBarInactiveTextColor='#606060'
        onChangeTab={tab => {
          this.fetchChatRoom(tab.i)
        }}
        ref={ (tabView) => { this.tabView = tabView } }
        >
        <MatchChatContainer label='MatchChat' tabLabel='好友訊息' />
        <VisitorsChatContainer label='VisitorsChat' tabLabel='來訪訊息' />
        <SendChatContainer label='SendChat' tabLabel='已發招呼' />
      </ScrollableTabView>
      }
    </View>
    )
  }
}

