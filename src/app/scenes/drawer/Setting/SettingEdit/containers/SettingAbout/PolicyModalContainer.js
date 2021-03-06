import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { View, Modal, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native'

import Policy from '../../../../../../../configs/Policy'

const { width, height } = Dimensions.get('window')

const styles = {
  title: {
    backgroundColor: 'transparent',
    letterSpacing: 3,
    fontFamily: 'NotoSans',
    fontSize: 15,
    fontWeight: '500',
    color: '#606060',
    textAlign: 'center',
    padding: 10
  },
  text: {
    padding: 10
  }
}

@inject('ControlStore') @observer
export default class PolicyModalContainer extends Component {

  constructor(props) {
    super(props)
    this.ControlStore = this.props.ControlStore
  }

  close = () => {
    //this.ControlStore.setSettingPolicyModal
  }

  render() {
    return(
        <Modal animationType={"fade"} transparent={true} visible={this.ControlStore.settingPolicyModal} onRequestClose={ this.close } >
          <View
            //activeOpacity={1}
            //onPress={ this.ControlStore.setSettingPolicyModal }
            style={{
              backgroundColor: 'rgba(52, 52, 52, 0.4)',
              flex: 1,
              justifyContent: 'center'
            }}
          >
            <View
              //activeOpacity={1}
              style={{
                backgroundColor: 'white',
                alignSelf: 'center',
                alignItems: 'center',
                aspectRatio: 1.5,
                width: width*0.8,
                height: height*0.7,
                position: 'absolute',
                borderRadius: 15
              }}
            >
              <View style={{justifyContent: 'space-between'}}>
                <View>
                  <Text style={ styles.title }>服務條款</Text>
                </View>
                <ScrollView>
                  <Policy />
                </ScrollView>
                <View style={{ height: 50, justifyContent: "center" }}>
                  <Text style={ styles.title } onPress={ this.ControlStore.setSettingPolicyModal }>我知道了</Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
    )
  }
}
