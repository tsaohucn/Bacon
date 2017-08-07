import React from 'react'
import { View, Text,TouchableOpacity, Dimensions } from 'react-native'
import { CheckBox } from 'react-native-elements'
import BaconRoutes from './BaconRoutes/BaconRoutes'

const { width, height } = Dimensions.get('window')

const styles = {
  text: {
    backgroundColor: 'transparent',
    letterSpacing: 3,
    fontFamily: 'NotoSans',
    fontSize: 17,
    fontWeight: '500',
    color: '#606060',
    textAlign: 'center',    
  }
}

const Bonus = ({topCheck, middleCheck, upperCheck}) => {
  return(
    <View style={{flex: 1,width}}>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 15, marginRight: 40}}>
        <View style={{flexDirection: 'row', alignItems: 'center',justifyContent: 'center'}}>
          <CheckBox
          containerStyle={{width: 45, backgroundColor: 'transparent',borderWidth: 0}}
          //title='Click Here'
          checkedIcon='dot-circle-o'
          uncheckedIcon='circle-o'
          checkedColor='#d63768'
          uncheckedColor='#d63768'
          checked={topCheck}
          />
          <Text style={styles.text}>Q點 200點</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.text}>NT$ 99</Text>
        </View>
      </View>

      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 15, marginRight: 40}}>
        <View style={{flexDirection: 'row', alignItems: 'center',justifyContent: 'center'}}>
          <CheckBox
          containerStyle={{width: 45, backgroundColor: 'transparent',borderWidth: 0}}
          //title='Click Here'
          checkedIcon='dot-circle-o'
          uncheckedIcon='circle-o'
          checkedColor='#d63768'
          uncheckedColor='#d63768'
          checked={middleCheck}
          />
          <Text style={styles.text}>Q點 500點</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.text}>NT$ 289</Text>
        </View>
      </View>

      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 15, marginRight: 40}}>
        <View style={{flexDirection: 'row', alignItems: 'center',justifyContent: 'center'}}>
          <CheckBox
          containerStyle={{width: 45, backgroundColor: 'transparent',borderWidth: 0}}
          //title='Click Here'
          checkedIcon='dot-circle-o'
          uncheckedIcon='circle-o'
          checkedColor='#d63768'
          uncheckedColor='#d63768'
          checked={upperCheck}
          />
          <Text style={styles.text}>Q點 1000點</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.text}>NT$ 549</Text>
        </View>
      </View>
    </View>
  )
}

export default Bonus