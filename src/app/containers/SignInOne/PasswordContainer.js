import React, { Component } from 'react'
import { Actions } from 'react-native-router-flux'
import { inject, observer } from "mobx-react"

import BaconForm from '../../views/BaconForm'

@inject('SignInStore') @observer
export default class PasswordContainer extends Component {

  constructor(props) {
    super(props)
    this.SignInStore = this.props.SignInStore
  }

  render() {
    return(
      <BaconForm
        iconSource={ require('../../../images/ico_logo_pass.png') } 
        placeholder='請輸入6-10字英數密碼組合'
        value={ this.SignInStore.password }
        maxLength={ 10 } 
        onChangeText={ this.SignInStore.setPassword }
        secureTextEntry
      />
    )
  }
}