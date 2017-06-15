import React from 'react';
import { View, Image, Text, Dimensions, TouchableHighlight } from 'react-native'

const { width } = Dimensions.get('window')

const styles = {
    contentViewStyle: {
        // 主轴方向
        //flexDirection:'row',
        // 换行
        //flexWrap:'wrap'
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },

    itemStyle: {
        // 对齐方式
        alignItems:'center',
        justifyContent:'center',
        // 尺寸
        width:80,
        height:80,
        // 左边距
        //marginLeft:20,
        marginTop:20,
        margin: 10,
    },

    itemImageStyle: {
        // 尺寸
        width:80,
        height:80,
        // 间距
        marginBottom:5,
        borderRadius: 80/2,
    },

    online:{
      position: 'absolute',
      bottom: 15,
      right: 1,
      height: 15,
      width: 15,
      backgroundColor: '#46ec2c',
      //backgroundColor: '#e5e5e5',
      borderRadius: 15/2,
      borderStyle: 'solid',
      borderColor: '#ffffff',
      borderWidth: 2
    },

    offline:{
      position: 'absolute',
      bottom: 15,
      right: 1,
      height: 15,
      width: 15,
      //backgroundColor: '#46ec2c',
      backgroundColor: '#e5e5e5',
      borderRadius: 15/2,
      borderStyle: 'solid',
      borderColor: '#ffffff',
      borderWidth: 2
    }
}

const ADD_IMAGE = require('hookup/src/images/addImage.png')

const Cookie = ({ name, photoURL, onPressButton }) => {

  return(
    <View style={{alignItems: 'center', margin: 5, width: 80 }}>
      <TouchableHighlight onPress={onPressButton}>
        <Image source={ photoURL ? { uri: photoURL } : ADD_IMAGE } style={styles.itemImageStyle}/>
      </TouchableHighlight>
      <View>
        <Text lineBreakMode="tail" numberOfLines={1} >{ name }</Text>
      </View>
    </View>
  )
}

export default Cookie