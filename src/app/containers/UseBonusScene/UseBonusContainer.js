import React, { Component } from 'react'
// import { View, TouchableOpacity, Text, Button } from 'react-native'
// import { inject, observer } from 'mobx-react'

import UseBonus from '../../views/UseBonus'

export default class UseBonusContainer extends Component {

  constructor(props) {
    super(props)
    this.balance = this.props.balance
    this.cost = this.props.cost
    this.avatarUrl = this.props.avatarUrl
    this.reasonStr = this.props.reasonStr
    this.preStr = this.props.preStr
    this.postStr = this.props.postStr
  }

  render() {
    return (
      <UseBonus
        balance={this.balance}
        cost={this.cost}
        avatarUrl={this.avatarUrl}
        reasonStr={this.reasonStr}
        preStr={this.preStr}
        postStr={this.postStr}
      />
    )
  }
}
