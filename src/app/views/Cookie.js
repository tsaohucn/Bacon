import React from 'react';
import { View, Image, Text, Dimensions, TouchableHighlight } from 'react-native'
import FastImage from 'react-native-fast-image'

const { width } = Dimensions.get('window')

const styles = {
  itemImageStyle: {
    width:80,
    height:80,
    marginBottom:5,
    borderRadius: 80/2,
  },
    title: {
    backgroundColor: 'transparent',
    letterSpacing: 3,
    fontFamily: 'NotoSans',  
    fontWeight: '500',
    color: '#606060',
    fontSize: 15
  }
}

//const onPressButton = () => { console.warn("點擊頭像")}

const Cookie = ({ name, ages, avatar, children }) => {

  return(
    <View style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
      <View>
        <Image source={ avatar ? { uri: avatar } : require('./Cookie/img/ico_qy_head_preload.png') } style={styles.itemImageStyle}/>
      </View>
      <View style={{marginLeft:20}}>
        <View>
          <Text style={{color: '#000000'}}>{ name }, { ages }</Text>
        </View>
        <View>
          { children }
        </View>
      </View>
    </View>
  )
}

export default Cookie