import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { View, Modal, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native'

import Rule from '../../../../../configs/Rule'

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
@inject('SignUpStore') @observer
export default class RuleModalContainer extends Component {

  constructor(props) {
    super(props)
    this.SignUpStore = this.props.SignUpStore
  }

  close = () => {
    //this.SignUpStore.setRuleModal
  }

  render() {
    return(
        <Modal animationType={"fade"} transparent={true} visible={this.SignUpStore.ruleModal} onRequestClose={ this.close } >
          <View
            //activeOpacity={1}
            //onPress={ this.SignUpStore.setRuleModal }
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
                  <Text style={ styles.title }>個資保護政策</Text>
                </View>
                <ScrollView>
                  <Rule/>
                </ScrollView>
                <View>
                  <Text style={ styles.title } onPress={ this.SignUpStore.setRuleModal }>我知道了</Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
    )
  }
}
