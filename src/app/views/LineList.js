import React from 'react'
import { View, Image, Text, Dimensions, TouchableOpacity } from 'react-native'
import { BaconBadgeYes, BaconBadgeNo } from './BaconBadge/BaconBadge'

import Cookie from './Cookie/Cookie'

const DEFAULT_IMAGE = require('./Cookie/img/ico_qy_head_preload.png')

const styles = {
  article: {
    flexDirection: 'row',
    margin: 10,
    height: 100,
    borderBottomWidth: 1,
    borderColor: '#b3b3b3'
  },
  image: {
    width: 90,
    height: 90
  },
  titleView: {
    paddingLeft: 10
  },
  title: {
    width: 240,
    letterSpacing: 3,
    fontFamily: 'NotoSans',
    fontSize: 18,
    fontWeight: '400',
    color: '#606060',
    backgroundColor: 'transparent'
  },
  content: {
    paddingLeft: 10,
    justifyContent: 'center'
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 5
  },
  tags: {
    flexDirection: 'row'
  }
}

const LineList = ({title, onPress, avatar, tags, author}) => {

  const showTags = () => (
    tags.map( tag => (
      <BaconBadgeYes key={tag} text={tag}/>
    ))
  )


  return(
    <TouchableOpacity style={styles.article} onPress={ onPress }>
      <Cookie local size={90} avatar={avatar} name={author}/>
      <View style={styles.content}>
        <View style={styles.titleView}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.bottom}>
          <View style={styles.tags}>
          {
            showTags()
          }
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default LineList
