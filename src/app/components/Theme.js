import React from 'react'
import { View, Image, Text, TouchableOpacity } from 'react-native'

const styles = {
  botton: {
    fontSize: 20, 
    color: 'white', 
    textAlign: 'center', 
    fontWeight: 'bold'    
  }

}

const Theme = ({children,bottonText,buttonOnPress,returnOnPress}) => {
  return(
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-between'}}>

      <View style={{marginTop: 20}}>
        <Image source={require('../../images/ico_titlebar_logo.png')} />
      </View>

      <View style={{position: 'absolute', top: 20, left: 20}}>
        <TouchableOpacity activeOpacity={0.2} onPress={returnOnPress} >
          <Image source={require('../../images/btn_back.png')} />
        </TouchableOpacity>
      </View>

      { children }

      <View style={{position: 'relative', marginBottom: 120 }}>
        <TouchableOpacity onPress={buttonOnPress}> 
          <Image style={{justifyContent: 'center'}} source={require('../../images/btn_gredient.png')}>
            <Text style={ styles.botton }>{ bottonText }</Text>
          </Image>
        </TouchableOpacity>
      </View>

      <View>
        <Image source={require('../../images/pic_index_wave.png')} />
      </View>

    </View>
  )
}

export default Theme