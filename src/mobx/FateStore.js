import { observable, action, computed, useStrict, runInAction, toJS, autorun } from 'mobx'
import geolib from 'geolib'
import { calculateAge } from '../api/Utils'
import localdb from '../configs/localdb'

useStrict(true)

export default class FateStore {

  @observable visitorsPreys
  @observable goodImpressionPreys
  @observable matchPreys
  @observable collectionPreys

  @observable visitorsLoading
  @observable goodImpressionLoading
  @observable matchLoading
  @observable collectionLoading

  constructor(firebase) {
    this.initialize()
  }

  @computed get visitorsPreysToFlatList() {
    return toJS(this.visitorsPreys)
  }

  @computed get goodImpressionPreysToFlatList() {
    return toJS(this.goodImpressionPreys)
  }

  @computed get matchPreysToFlatList() {
    return toJS(this.matchPreys)
  }
  
  @computed get collectionPreysToFlatList() {
    return toJS(this.collectionPreys)
  }

  @action initialize = () => {
    this.visitorsPreys = new Array
    this.goodImpressionPreys = new Array
    this.matchPreys = new Array
    this.collectionPreys = new Array

    this.visitorsLoading = true
    this.goodImpressionLoading = true
    this.matchLoading = true
    this.collectionLoading = true
  }

  @action startVisitorsLoading = () => {
    this.visitorsLoading = true
  }

  @action startGoodImpressionLoading = () => {
    this.goodImpressionLoading = true
  }

  @action startMatchLoading = () => {
    this.matchLoading = true
  }

  @action startCollectionLoading = () => {
    this.collectionLoading = true
  }

  @action setVisitorsPreys = preys => {
    this.visitorsPreys = preys
    this.visitorsLoading = false
  }

  @action setGoodImpressionsPreys = preys => {
    this.goodImpressionPreys = preys
    this.goodImpressionLoading = false
  }

  @action setMatchPreys = preys => {
     this.matchPreys = preys
     this.matchLoading = false
  }

  @action setCollectionPreys = preys => {
     this.collectionPreys = preys
     this.collectionLoading = false
  }

  @action removeGoodImpressionsPrey = id => {
    this.goodImpressionPreys.splice(this.goodImpressionPreys.findIndex(ele => ele.key === id), 1)
  }

  @action removeCollectionPrey = id => {
    this.collectionPreys.splice(this.collectionPreys.findIndex(ele => ele.key === id), 1)
  }
}


/*

  @action setLatitude = latitude => {
    this.latitude = latitude
  }

  @action setLongitude = longitude => {
    this.longitude = longitude
  }

  sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  handleNewAlbum = (album,avatar) => {
    const key = this.getKeyByValue(album, avatar)
    delete album[key]
    album[0] = avatar
    return album || new Object
  }

  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value)
  }

  getDistance = (latitude,longitude) => {
    if (this.latitude && this.longitude && latitude && longitude) {
      const distance = (geolib.getDistance(
        {latitude: this.latitude, longitude: this.longitude},
        {latitude: latitude, longitude: longitude}
      )/1000).toFixed(1)
      if (distance === '0.0') {
        return '0.1'
      } else {
        return distance
      }
    } else {
      return '?'
    }  
  }

  masterLevel = (check) => {
    switch(check) {
        case 0:
            return ''
            break;
        case 1:
            return '(一般)'
            break;
        case 2:
            return '(普通)'
            break;
        case 3:
            return '(精通)'
            break;
        case true: // 相容性
            return '(一般)'
            break;        
        default:
            return ''
    }     
  }

  @action addPreyToVisitorsPool = (uid,time) => {
    this.visitorsPool[uid] = time
  }

  @action setVisitorsPreylist = () => {
    this.visitorsPreylist = Object.keys( this.visitorsPool).map( uid => ({uid: uid, time: this.visitorsPool[uid]}))
    this.visitorsPreylist.sort((a, b) => {
      return b.time > a.time ? 1 : -1
    })
  }

  @action setVisitorsFakePreys = () => {
    this.visitorsPreys = new Array
  }

  @action setVisitorsRealPreys = () => {
    const visitorsPromises = this.visitorsPreylist.map((ele,index) => (
      this.firebase.database().ref('users/' + ele.uid).once('value').then( snap => {
        if (snap.val() && !snap.val().hideVister) {
          return(
            {
              key: ele.uid,
              time: ele.time,
              nickname: snap.val().nickname,
              avatar: snap.val().avatar,
              birthday: snap.val().birthday  
            }
          )
        } else {
          return null
        }
      })
    ))

    Promise.all(visitorsPromises)
    .then(visitorsPreys => {
      runInAction(() => {
        this.visitorsPreys = visitorsPreys.filter(ele => ele)
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  @action addPreyToGoodImpressionPool = (uid,time) => {
    this.goodImpressionPool[uid] = time
  }

  @action removePreyToGoodImpressionPool = uid => {
    delete this.goodImpressionPool[uid]
  }

  @action setGoodImpressionFakePreys = () => {
    this.goodImpressionPreys = new Array
  }

  @action setGoodImpressionPreylist = () => {
    const matchPreyList = Object.keys(this.matchPool)
    const goodImpressionPreylist = Object.keys(this.goodImpressionPool)
    this.goodImpressionPreylist = goodImpressionPreylist.map(uid => {
      if ( matchPreyList.indexOf(uid) > -1) {
        return null
      } else {
        return uid
      }
    })
    this.goodImpressionPreylist = this.goodImpressionPreylist.filter(ele => ele)
  }

  @action setGoodImpressionRealPreys = () => {
    const goodImpressionPromises = this.goodImpressionPreylist.map((uid,index) => (
      this.firebase.database().ref('users/' + uid).once('value').then( snap => (
        {
          key: uid,
          distance: this.getDistance(snap.val().latitude,snap.val().longitude),
          nickname: snap.val().nickname,
          avatar: snap.val().avatar,
          birthday: snap.val().birthday  
        }
      ))
    ))

    Promise.all(goodImpressionPromises)
    .then(goodImpressionPreys => {
      runInAction(() => {
        this.goodImpressionPreys = goodImpressionPreys
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  @action setCourtInitialize = uid => {
    this.loading = true
    this.uid = uid
  }

  @action fetchPrey = () => {
    this.fetchPreyQuery = this.firebase.database().ref('users/' + this.uid)
    this.fetchPreyQuery.once('value').then(snap => {
      if (snap.val()) {
        runInAction(() => {
          this.uid = this.uid
          this.nickname = snap.val().nickname
          this.bio = snap.val().bio
          this.birthday = snap.val().birthday
          this.languages = snap.val().languages || new Object
          this.hobbies = snap.val().hobbies || new Object
          this.album = this.handleNewAlbum(snap.val().album,snap.val().avatar)//snap.val().album || new Object
          this.vip = Boolean(snap.val().vip)
          this.address = snap.val().address
          this.distance = this.getDistance(snap.val().latitude,snap.val().longitude)
          this.emailVerified = Boolean(snap.val().emailVerified)
          this.photoVerified = Boolean(snap.val().photoVerified)
          this.loading = false
        })
        //alert('抓完囉應該要重渲染')        
      } else {
        //
        alert('錯誤')
        //runInAction(() => {
        //  this.loading = false
        //})
      }
    }).catch(err => { 
        alert(err) }
      )
  }

  @action cleanFetch = () => {
    this.loading = false
    this.fetchPreyQuery.off()
    this.fetchPreyQuery = null
  }

  @action setCollectionFakePreys = () => {
    this.collectionPreys = new Array
  }

  @action setCollectionRealPreys = () => {
    localdb.getIdsForKey('collection' + this.selfUid).then(collectionPreylist => {
      console.log(collectionPreylist)
      const collectionPromises = collectionPreylist.map((uid,index) => (
        this.firebase.database().ref('users/' + uid).once('value').then( snap => (
          {
            key: uid,
            time: null,
            nickname: snap.val().nickname,
            avatar: snap.val().avatar,
            birthday: snap.val().birthday  
          }
        ))
      ))
      // 等待全部抓完
      Promise.all(collectionPromises)
      .then(collectionPreys => {
        console.log(collectionPreys)
        localdb.getAllDataForKey('collection' + this.selfUid).then(datas => {
          datas.map((ele,index)=>{
            collectionPreys[index]['time'] = ele && ele.time
          })
          runInAction(() => {
            this.collectionPreys = collectionPreys
          })
        })
      })
      .catch(err => {
        alert(err)
      })

    }).catch(err => console.log(err))
  }

 // mates

  @action addMateHistory = uid => {
    //this.mateHistory.push(uid)
  }

  @action addPreyToMatchPool = (uid,time) => {
    this.matchPool[uid] = time
  }

  @action removePreyToMatchPool = uid => {
    delete this.matchPool[uid]
  }

  @action filterMatchList = () => {
    const wooerList = Object.keys(this.goodImpressionPool)
    const PreyList = Object.keys(this.matchPool)
    this.matchPreylist = wooerList.map(uid => {
      if (PreyList.indexOf(uid) > -1) {
        const time_a = this.goodImpressionPool[uid]
        const time_b = this.matchPool[uid]
        if (time_a > time_b) {
          console.log('time_a > time_b')
          return { uid: uid, time: time_a }
        } else {
          console.log('time_b > time_a')
          return { uid: uid, time: time_b }
        }
      } else {
        return null
      }
    })
    this.matchPreylist = this.matchPreylist.filter(ele => ele)
  }

  @action setMatchFakePreys = () => {
    this.matchPreys = new Array
  }

  @action setMatchRealPreys = () => {
    const matchPromises = this.matchPreylist.map((ele,index) => (
      this.firebase.database().ref('users/' + ele.uid).once('value').then( snap => (
        {
          key: ele.uid,
          time: ele.time,
          nickname: snap.val().nickname,
          avatar: snap.val().avatar,
          birthday: snap.val().birthday  
        }
      ))
    ))

    Promise.all(matchPromises)
    .then(matchPreys => {
      runInAction(() => {
        this.matchPreys = matchPreys
      })
    })
    .catch(err => {
      console.log(err)
    })    
  }


  @action realTimeSetMatch = () => {
    this.matchPreys = this.matchPreys.push(this.goodImpressionPreys.find(ele => ele.uid === this.uid))
    this.goodImpressionPreys = this.goodImpressionPreys.filter(ele => !ele.uid === this.uid)
  }

  @action setSelfUid = uid => {
    this.selfUid = uid
  }

  // court
  @computed get age() {
    return calculateAge(this.birthday)
  }

  @computed get languagesToString() {
    return Object.keys(this.languages).filter(key => this.languages[key] !== 0).map( key => key + this.masterLevel(this.languages[key]) ).join('，')
    //return Object.keys(this.languages).filter(key => this.languages[key] === true).join()
  }

  @computed get albumToArray() {
    return Object.keys(this.album).map((key) => (this.album[key]))
  }

  @computed get hobbiesToFlatList() {
    return Object.keys(this.hobbies).map((key,index) => ({ key: key, check: this.hobbies[key] }))
    // { 打球: true } -> [{key: 打球, check: true}]
  }

  @computed get visitorsPreysToFlatList() {
    return toJS(this.visitorsPreys)
  }

  @computed get collectionPreysToFlatList() {
    return toJS(this.collectionPreys)
  }

  @computed get matchPreysToFlatList() {
    return toJS(this.matchPreys)
  }
  */