import React, { Component } from 'react'
import { Alert } from 'react-native'
import { inject, observer } from 'mobx-react'
import { Actions } from 'react-native-router-flux'

import BaconRoutes from '../../../../views/BaconRoutes/BaconRoutes'

@inject('SignUpStore') @observer
export default class BaconRoutesContainer extends Component {

  constructor(props) {
    super(props)
    this.SignUpStore = this.props.SignUpStore
  }


  _buttonOnPress = async () => {
    await this.SignUpStore.checkEmail()
    await this.SignUpStore.checkPassword()
    await this.SignUpStore.checkNickname()
    if (this.checkInput()) {
      if (this.checkBirthday()) {
        if (this.SignUpStore.policyDetector) {
          Actions.SignUpFour({type: 'reset'})
        } else {
          Alert.alert( 
            '輸入錯誤', '請確認同意隱私權政策及服務條款', [ 
            {text: '確認', onPress: () => console.log('OK Pressed')}, ], { cancelable: false } 
          )
        }
      } else {
        Alert.alert( 
          '輸入錯誤', '請填入生日資料', [ 
          {text: '確認', onPress: () => console.log('OK Pressed')}, ], { cancelable: false } 
        )
      }
    } else {
        Alert.alert( 
          '輸入錯誤', '請再檢查一次帳號密碼暱稱', [ 
          {text: '確認', onPress: () => console.log('OK Pressed')}, ], { cancelable: false } 
        )
    }
  }

  checkInput = () => {
    return this.SignUpStore.emailDetector && this.SignUpStore.passwordDetector && this.SignUpStore.nicknameDetector
  }

  checkBirthday = () => {
    if (this.SignUpStore.birthday) {
      return true 
    }
    return false
  }

  render() {
    return(
      <BaconRoutes
        routesText='下一步'
        routesOnPress={ this._buttonOnPress } 
      />
    )
  }
}