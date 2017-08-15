import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Actions } from 'react-native-router-flux'

import Court from '../../views/Court'

@inject('firebase','SubjectStore','FateStore','ControlStore') @observer
export default class CourtContainer extends Component {

  constructor(props) {
    super(props)
    this.SubjectStore = this.props.SubjectStore
    this.FateStore = this.props.FateStore
    this.ControlStore = this.props.ControlStore
    this.firebase = this.props.firebase
    this.state = {
      visible: false
    }
  }


  openAlbum = () => {
    this.setState({
      visible: true
    })
  }

  closeAlbum = () => {
    this.setState({
      visible: false
    })
  }

  like = () => {
    //alert('跳出配對視窗')
    this.ControlStore.setMateModal()
    // 寄到別人好感
    //await this.firebase.database().ref('goodImpression/' + this.SubjectStore.uid + this.MeetCuteStore.uid ).set({ wooer: this.SubjectStore.uid , prey: this.MeetCuteStore.uid, time: Date.now() })
    // 45天紀錄
    //this.goToNext()
  }

  unlike = () => {
    alert('移除好感紀錄')
    // 45天紀錄
    //this.goToNext()
  }

  render() {
    return(
      <Court
        rightIcon={require('../../../images/btn_meet_like.png')}
        leftIcon={require('../../../images/btn_meet_dislike.png')}
        album={ this.FateStore.albumToArray }
        visible={ this.state.visible }
        closeAlbum={ this.closeAlbum }
        openAlbum={ this.openAlbum }
        onPressRightIcon={ this.like }
        onPressLeftIcon={ this.unlike }
      />
    )
  }
}