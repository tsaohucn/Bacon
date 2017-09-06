import React, { Component } from 'react'
import { View, Text, Button, Platform, BackHandler, ToastAndroid, FlatList } from 'react-native'
import { inject, observer } from 'mobx-react'
import { Actions } from 'react-native-router-flux'

import ArticleList from '../../../views/ArticleList'
import Articles from '../../../../configs/Articles'

@inject('firebase', 'SubjectStore') @observer 
export default class ArticleListScene extends Component {

  constructor(props) {
    super(props)
    this.firebase = this.props.firebase
    this.SubjectStore = this.props.SubjectStore
  }

  componentWillMount() {
    Actions.refresh({ key: 'Drawer', open: false })
  }

  componentDidMount = async () => {
    await this.sleep(260)
  }

  componentWillUnmount() {
  }

  sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  goToArticleDetail = (title,uri,content) => {
    Actions.ArticleDetail({articleAitle: title, uri: uri, content: content})
  }

  render() {
    return (
      <View>
        <FlatList
          removeClippedSubviews
          data={ Articles }
          numColumns={1}
          renderItem={({item}) =>
            <ArticleList 
              avatar={item.avatar}
              source={item.uri}
              title={item.title}
              onPress={ () => { this.goToArticleDetail(item.title, item.uri, item.content) } }
              />

           }
        />
      </View>
    )
  }
}