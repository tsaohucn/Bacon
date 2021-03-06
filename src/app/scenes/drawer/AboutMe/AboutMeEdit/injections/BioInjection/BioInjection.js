import React, { Component } from 'react'
import { View, Platform } from 'react-native'
import { inject, observer } from 'mobx-react'

import BaconRoutesContainer from './containers/BaconRoutesContainer'
import BioInputContainer from './containers/BioInputContainer'

const styles = {
        view: {
          flex: 1,
          alignItems: 'center'
        },
        routes: { 
          position: 'absolute', 
          bottom: 0
        }
}

@inject('firebase','SubjectEditStore','SubjectStore') @observer
export default class BioInjection extends Component {

  constructor(props) {
    super(props)
    this.firebase = this.props.firebase
    this.SubjectEditStore = this.props.SubjectEditStore
    this.SubjectStore = this.props.SubjectStore  
  }
  
  componentWillMount() {
    this.SubjectEditStore.setBio(this.SubjectStore.bio)      
  }

  render() {
    return(
      <View style={styles.view}>
        <BioInputContainer/>
        <View style={styles.routes}>
          <BaconRoutesContainer/>
        </View>
      </View>
    )
  }
}