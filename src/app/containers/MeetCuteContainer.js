import React, { Component } from "react"
import { View, ActivityIndicator } from "react-native"
import { observer, inject } from "mobx-react/native"
import { Actions } from "react-native-router-flux"
// views
import MeetCute from "../views/MeetCute"

@inject("SubjectStore","ObjectStore") @observer
export default class MeetCuteContainer extends Component {

  constructor(props) {
    super(props);
    this.SubjectStore = props.SubjectStore
    this.ObjectStore = props.ObjectStore
  }

  componentWillReact() {
    //console.warn("I will re-render, since the component has changed!");
  }

  componentWillMount() {
    Actions.refresh({ key: "drawer", open: false })
    this.ObjectStore.initPreyList()
  }

  componentDidMount() {
    this.ObjectStore.fetchPreyListsByMeetCute(this.SubjectStore.user.sexOrientation)
  }

  componentWillUnmount(){

  }

  render() {
    const { ObjectStore } = this.props
    
    const indicator = (
      <ActivityIndicator
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: 8,
          marginTop: 150
        }}
        size="large"
      />
    )
    
    return (
      <View style={{flex: 1}}>
        { ObjectStore.loading && indicator }
        {
          ObjectStore.prey && !ObjectStore.loading && 
          <MeetCute/>
        }
      </View>
    )
  }
}