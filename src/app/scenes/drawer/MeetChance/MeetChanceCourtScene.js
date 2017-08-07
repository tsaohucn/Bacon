import React, { Component } from 'react' 
import { View, Text } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { observer, inject } from 'mobx-react'

//import CourtContainer from '../../../containers/MeetChanceCourtScene/CourtContainer'
//import InfosContainer from '../../../containers/MeetChanceCourtScene/InfosContainer'

@inject("firebase","SubjectStore") @observer
export default class MeetChanceCourtScene extends Component {

  constructor(props) {
    super(props)
    this.firebase = this.props.firebase
    this.SubjectStore = this.props.SubjectStore
   // this.state = {
   //   visible: false
   // }
  }

  componentWillMount() {
    Actions.refresh({ key: 'Drawer', open: false })
  }


  render() {
    return(
      <View><Text>MeetChanceCourtScene</Text></View>
    )
  }
}

