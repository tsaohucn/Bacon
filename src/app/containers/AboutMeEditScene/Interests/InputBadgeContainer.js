import React, { Component } from 'react'
import { TextInput, Dimensions } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { inject, observer } from "mobx-react"

import BaconForm from '../../../views/BaconForm'

const { width, height } = Dimensions.get('window')

const styles = {
  textInput: {
    width: width - 60
  }
}

@inject('SubjectEditStore') @observer
export default class InputBadgeContainer extends Component {

  constructor(props) {
    super(props)
    this.SubjectEditStore = this.props.SubjectEditStore
    this.state= {
      badge: ''
    }
  }

  onChangeText = text => {
    this.setState({
      badge: text
    })
  }

  addHobby = () => {
    this.SubjectEditStore.addHobby(this.state.badge)
  }

  render() {
    return(
      <TextInput
        underlineColorAndroid="#d63768"
        maxLength = { 5 }
        numberOfLines = { 1 }
        style={styles.textInput}
        placeholder = '請輸入自訂興趣'
        onSubmitEditing = { this.addHobby }     
        onChangeText = { this.onChangeText }
        value = { this.state.badge }
      /> 
    )
  }
}