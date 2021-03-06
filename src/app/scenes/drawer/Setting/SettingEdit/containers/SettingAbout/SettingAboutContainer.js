import React, { Component } from 'react'
import { View,Text, BackHandler, ToastAndroid, Alert } from 'react-native'
import { inject, observer } from 'mobx-react'
import { Actions } from 'react-native-router-flux'

import BlankButton from '../../../../../../views/BlankButton/BlankButton'
import Knife from '../../../../../../views/Knife/Knife'
import PolicyModalContainer from './PolicyModalContainer'
import RuleModalContainer from './RuleModalContainer'

const styles = {
  text: {
    backgroundColor: 'transparent',
    letterSpacing: 0,
    fontFamily: 'NotoSans',
    textAlign: 'left',
    //fontWeight: '500',
    color: '#606060',
    fontSize: 15,
    lineHeight: 18
  }
}

@inject('ControlStore') @observer
export default class SettingAboutContainer extends Component {

  constructor(props) {
    super(props)
    this.ControlStore = this.props.ControlStore
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid)
  }

  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid)
  }

  onBackAndroid = () => {
    Actions.pop()
    return true
  }

  version = () => {
    Alert.alert(
      '目前版本', 'Beta-6.1.0', [
        {text: '確認', onPress: () => console.log('OK Pressed')}, ], { cancelable: false }
      )
  }

  render() {
    return(
      <View style={{flex: 1, alignItems: 'center'}}>
        <PolicyModalContainer/>
        <RuleModalContainer/>
        <View style={{flex: 1,paddingTop: 5, paddingLeft: 40, paddingRight: 30}}>
          <Text style={styles.text}>
            {
`我相信網路是讓我擴大交友圈最好的方式

我很重視隱私，我不要交友軟體跟FB或手機通訊錄有任何關聯

我對於要付錢才能打個招呼或是付錢才能看對方資料非常反感

我討厭主動跟我打招呼或示好的是假賬號或是機器人賬號

如果你跟我們一樣，歡迎加入BACON！`
              }
          </Text>
          <Text style={{textAlign: 'right',paddingTop: 5, paddingRight: 7}}>
            BACON團隊
          </Text>
        </View>
        <View style={{flex: 1, justifyContent: 'space-around', marginBottom: 100}}>
          <BlankButton
            text='版本'
            onPress={ this.version }
          />
          <BlankButton
            text='服務條款'
            onPress={ this.ControlStore.setSettingPolicyModal }
          />
          <BlankButton
            text='個資保護政策'
            onPress={ this.ControlStore.setSettingRuleModal }
          />
        </View>
        <View style={{position: 'absolute',bottom: 0}}>
          <Knife/>
        </View>
      </View>
    )
  }
}
