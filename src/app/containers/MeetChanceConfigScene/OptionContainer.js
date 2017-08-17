import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import SwitchLists from '../../views/SwitchLists'

@inject('SubjectStore') @observer
export default class OptionContainer extends Component {

  constructor(props) {
    super(props)
    this.SubjectStore = this.props.SubjectStore
    this.state = {
      // Prompt
      vistorPrompt : false,
      goodPrompt: false,
    }
  }

  setVistorPrompt = () => {
    if (this.SubjectStore.vip) {
      this.setState({ vistorPrompt : !this.state.vistorPrompt})
    } else {
      alert('此功能僅限高級會員使用')
    }
  }

  setGoodPrompt = () => {
    if (this.SubjectStore.vip) {
      this.setState({ goodPrompt : !this.state.goodPrompt})
    } else {
      alert('此功能僅限高級會員使用')
    }
  }

  render() {
    return(
      <SwitchLists
        flatListData={
          [
            { key: 0, switchText: '顯示離線的會員', switchValue: this.state.vistorPrompt, switchonValueChange: this.setVistorPrompt },
            { key: 1, switchText: '對方互動狀態分析可見', switchValue: this.state.goodPrompt, switchonValueChange:  this.setGoodPrompt }
          ]          
        }
      />
    )
  }
}