import React, { Component } from 'react'
import { Actions } from 'react-native-router-flux'
import { inject, observer } from "mobx-react"
// custom components
import BaconForm from '../../../components/common/BaconForm/BaconForm'

@inject("SignUpInStore") @observer
export default class PasswordInputContainer extends Component {

  constructor(props) {
    super(props)
    this.SignUpInStore = this.props.SignUpInStore
  }

  render() {
    return(
      <BaconForm
        iconSource={ require('./img/ico_logo_nn.png') } 
        placeholder='請輸入2個字以上的暱稱'
        value={ this.SignUpInStore.displayName }
        maxLength={ 10 } 
        onChangeText={ this.SignUpInStore.setDisplayName }
      />
    )
  }
}