import React, { Component } from 'react'
import { Actions } from 'react-native-router-flux'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view'
import { ActivityIndicator, View, InteractionManager } from 'react-native'
import { observer, inject } from 'mobx-react'
import { intersection, minTime } from '../../../../../api/Utils'

import VisitorsTab from './tabs/VisitorsTab'
import GoodImpressionTab from './tabs/GoodImpressionTab'
import MateTab from './tabs/MateTab'
import CollectionTab from './tabs/CollectionTab'

import BaconActivityIndicator from '../../../../views/BaconActivityIndicator'
import localdb from '../../../../../configs/localdb'
 
const styles = {
  view: {
    flex: 1
  },
  tabBarUnderlineStyle : { 
    backgroundColor: '#d63768' 
  }
}

@inject('firebase','FateStore','SubjectStore') @observer
export default class FateTabScene extends Component {

  constructor(props) {
    super(props)
    this.firebase = this.props.firebase
    this.SubjectStore = this.props.SubjectStore
    this.FateStore = this.props.FateStore
  }

  componentWillMount () {
    //Actions.refresh({ key: 'Drawer', open: false })
    this.FateStore.startVisitorsLoading()
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.fetchVisitors()
    })
  }

  onChangeTab = tab => {
    this.handleOnChangeTab(tab.i)
  }

  ref = tabView => { this.tabView = tabView }

  default = () => <DefaultTabBar />

  handleOnChangeTab = (index) => {
    switch(index) {
      case 0:
        this.FateStore.startVisitorsLoading()
        this.fetchVisitors()
        break;
      case 1:
        this.FateStore.startGoodImpressionLoading()
        this.fetchGoodImpressions()
        break;
      case 2:
        this.FateStore.startMatchLoading()
        this.fetchMatchs()
        break;
      case 3:
        this.FateStore.startCollectionLoading()
        this.fetchtCollections()
        break;
      default:
      //
    }
  }

  fetchVisitors = () => {
    localdb.getIdsForKey('blockade' + this.SubjectStore.uid).then(blockade_ids => {
      let visitors = new Array
      return this.firebase.database().ref('visitorList/' + this.SubjectStore.uid).once('value',child => {
        const visitorUids = Object.keys(child.val() || new Object).filter(id => blockade_ids.indexOf(id) === -1)
        const usersPromise = visitorUids.map(uid => this.firebase.database().ref('users/' + uid).once('value'))
        Promise.all(usersPromise)
        .then(data => {
          visitors = data.map(snap => {
            return {
              key: snap.key,
              nickname: snap.val().nickname,
              avatar: snap.val().avatar,
              birthday: snap.val().birthday,
              time: child.val()[snap.key].time,
              showRedPoint:  child.val()[snap.key].showRedPoint
            }
          })
          this.FateStore.setVisitorsPreys(visitors)
          visitorUids.map(uid => this.firebase.database().ref('visitorList/' + this.SubjectStore.uid + '/' + uid + '/showRedPoint').set(false))
        })
      })
    }) 
  }

  fetchGoodImpressions = () => {
    localdb.getIdsForKey('blockade' + this.SubjectStore.uid).then(blockade_ids => {
      let goodImpressions = new Array
      Promise.all([
        this.firebase.database().ref('goodImpressionList/').orderByChild('wooner').equalTo(this.SubjectStore.uid).once('value'),
        this.firebase.database().ref('goodImpressionList/').orderByChild('prey').equalTo(this.SubjectStore.uid).once('value')
      ]).then(snap => {
        const myLove = snap[0]._value || new Object
        const loveMe = snap[1]._value || new Object
        const prey_uids = Object.keys(myLove).map(key => myLove[key].prey)
        const wooner_uids = Object.keys(loveMe).map(key => loveMe[key].wooner)
        const wooner_filter_uids = wooner_uids.filter(uid => prey_uids.indexOf(uid) === -1 ).filter(id => blockade_ids.indexOf(id) === -1)
        const usersPromise = wooner_filter_uids.map(uid => this.firebase.database().ref('users/' + uid).once('value'))
        Promise.all(usersPromise)
        .then(data => {
          goodImpressions = data.map(snap => {
            return {
              key: snap.key,
              nickname: snap.val().nickname,
              avatar: snap.val().avatar,
              birthday: snap.val().birthday,
              latitude: snap.val().latitude,
              longitude: snap.val().longitude
            }
          })
          this.FateStore.setGoodImpressionsPreys(goodImpressions)
        })
      })
    })
  }

  fetchMatchs = () => {
    localdb.getIdsForKey('blockade' + this.SubjectStore.uid).then(blockade_ids => {
      let matchs = new Array
      return Promise.all([
        this.firebase.database().ref('goodImpressionList/').orderByChild('wooner').equalTo(this.SubjectStore.uid).once('value'),
        this.firebase.database().ref('goodImpressionList/').orderByChild('prey').equalTo(this.SubjectStore.uid).once('value')
      ]).then(snap => { 
        const myLove = snap[0]._value || new Object
        const loveMe = snap[1]._value || new Object
        const myLove_obj = new Object
        const loveMe_obj = new Object

        Object.keys(myLove).forEach(key => myLove_obj[myLove[key].prey] = myLove[key].time)
        Object.keys(loveMe).forEach(key => loveMe_obj[loveMe[key].wooner] = loveMe[key].time)

        const myLove_uids = Object.keys(myLove_obj)
        const loveMe_uids = Object.keys(loveMe_obj)

        const match_uids = intersection(myLove_uids,loveMe_uids).filter(id => blockade_ids.indexOf(id) === -1)

        const usersPromise = match_uids.map(uid => this.firebase.database().ref('users/' + uid).once('value'))
        Promise.all(usersPromise)
        .then(data => {
          matchs = data.map(snap => {
            return {
              key: snap.key,
              nickname: snap.val().nickname,
              avatar: snap.val().avatar,
              birthday: snap.val().birthday,
              time: minTime(myLove_obj[snap.key],loveMe_obj[snap.key])
            }
          })
          this.FateStore.setMatchPreys(matchs)
        })

      })
    })
  }

  fetchtCollections = () => {
    let collections = new Array
    localdb.getIdsForKey('collection' + this.SubjectStore.uid).then(collectionPreylist => {
      const collectionPromises = collectionPreylist.map(uid => this.firebase.database().ref('users/' + uid).once('value'))
      // 等待全部抓完
      Promise.all(collectionPromises)
      .then(data => {  
        localdb.getAllDataForKey('collection' + this.SubjectStore.uid).then(localdata => {
          collections = data.map((snap,index) => {
            return {
              key: snap.key,
              time: localdata[index].time,
              nickname: snap.val().nickname,
              avatar: snap.val().avatar,
              birthday: snap.val().birthday     
            }
          })
          this.FateStore.setCollectionPreys(collections)
        })
      })
      .catch(err => {
        //alert(err)
      })

    }).catch(err => console.log(err))

    //this.FateStore.setCollectionPreys(new Array)
  }

  render() {
    return(
     <View style={styles.view}>
        <ScrollableTabView
          initialPage = { this.props.initialPage || 0 }
          tabBarPosition='top'
          renderTabBar={ this.default }
          tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
          tabBarBackgroundColor='white'
          tabBarActiveTextColor='#d63768'
          tabBarInactiveTextColor='#606060'
          onChangeTab={this.onChangeTab}
          ref={ this.ref }
          >
          <VisitorsTab label='Visitors' tabLabel='來訪' />
          <GoodImpressionTab label='GoodImpression' tabLabel='好感' />
          <MateTab label='Mate' tabLabel='配對' />
          <CollectionTab label='Collection' tabLabel='收藏' />
        </ScrollableTabView>
    </View>
    )
  }
}

