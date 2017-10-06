import { observable, action, computed, useStrict, runInAction, toJS } from 'mobx'
import _ from 'lodash'
import geolib from 'geolib'
import { calculateAge } from '../../app/Utils'

useStrict(true)

export default class MeetChanceStore {

  @observable preys
  // court
  @observable loading
  // user data
  @observable nickname
  @observable avatar
  @observable bio
  @observable birthday
  @observable languages
  @observable hobbies
  @observable album
  @observable vip
  @observable distance
  @observable emailVerified
  @observable photoVerified
  //
  @observable notFound

  constructor(firebase) {
    this.firebase = firebase
    this.initialize()
  }

  // court
  @computed get age() {
    return calculateAge(this.birthday)
  }

  @computed get languagesToString() {
    return Object.keys(this.languages).filter(key => this.languages[key] === true).join()
  }

  @computed get albumToArray() {
    return Object.keys(this.album).map((key) => (this.album[key]))
  }

  @computed get hobbiesToFlatList() {
    return Object.keys(this.hobbies).map((key,index) => ({ key: key, check: this.hobbies[key] }))
    // { 打球: true } -> [{key: 打球, check: true}]
  }

  @computed get preysToFlatList() {
    const arr = toJS(this.preys).filter(ele => ele !== null)
    if (arr.length > 9) {
      arr.length = arr.length - arr.length % 3
    }
    return arr
  }

  @action initialize = () => {
    this.pool = new Object
    this.preyList = new Array
    this.preys = new Array
    // court
    this.loading = true
    // user data
    this.uid = null
    this.nickname = null
    this.avatar = null
    this.bio = null
    this.birthday = null
    this.languages = new Object
    this.hobbies = new Object
    this.album = new Object
    this.vip = false
    this.distance = null
    this.emailVerified = false
    this.photoVerified = false
    this.latitude = null
    this.longitude = null
    // config
    this.meetChanceMinAge = 18
    this.meetChanceMaxAge = 50
    this.meetChanceRadar = false
    //
    this.fetchPreyQuery
    // 
    this.notFound = false
  }

  @action setLatitude = latitude => {
    this.latitude = latitude
  }

  @action setLongitude = longitude => {
    this.longitude = longitude
  }

  // pool

  @action addPreyToPool = (uid,distance,nickname,avatar,birthday,hideMeetChance,deleted,online,popularityDen,popularityNum) => {
    this.pool[uid] = { key: uid, distance: distance, nickname: nickname, avatar: avatar, birthday: birthday, hideMeetChance: hideMeetChance, deleted: deleted, online: online, popularityDen: popularityDen, popularityNum: popularityNum }
  }

  @action updatePreyToPool = (uid,distance) => {
    this.pool[uid].distance = distance
  }

  @action removePreyToPool = uid => {
    delete this.pool[uid]
  }

  // preyList

  @action setPreyList = () => {
    // 過濾名單
    this.preyList = Object.keys(this.pool).filter( 
      key => {
        const value = this.pool[key]
        if (!(value.hideMeetChance) && !(value.deleted) && value.birthday && ((calculateAge(value.birthday) >= this.meetChanceMinAge) && (calculateAge(value.birthday) <= (this.meetChanceMaxAge === 50 ? 99 : this.meetChanceMaxAge) )) && this.checkOnline(value.online)) {
          const popularityDen = value.popularityDen || 0
          const popularityNum = value.popularityNum || 0
          this.firebase.database().ref('users/' + value.uid + '/popularityDen').set(popularityDen + 1)
          this.firebase.database().ref('users/' + value.uid + '/popularity').set(popularityNum/(popularityDen + 1))
          return true
        } else {
          return null
        }
      }
    ).map( key => this.pool[key] )
    // 排距離
    this.preyList.sort((a, b) => {
      return a.distance > b.distance ? 1 : -1
    })

  }

  @action setRealPreys = () => {
    //while (this.preyList.length === 0) {
    //  await this.sleep(300)
    //  this.setPreyList()
    //  if (this.preyList.length > 0) {
    //    break
    //  }
    //}
    this.preys = toJS(this.preyList)
  }
/*
  @action setRealPreys = () => {
    const preysPromises = this.preyList.map((ele,index) => (
      this.firebase.database().ref('users/' + ele.uid).once('value').then( snap => {
        if (snap.val() && !(snap.val().hideMeetChance) && !(snap.val().deleted) && snap.val().birthday && ((calculateAge(snap.val().birthday) >= this.meetChanceMinAge) && (calculateAge(snap.val().birthday) <= (this.meetChanceMaxAge === 50 ? 99 : this.meetChanceMaxAge) )) && this.checkOnline(snap.val().online)) {
          const popularityDen = snap.val().popularityDen || 0
          const popularityNum = snap.val().popularityNum || 0
          this.firebase.database().ref('users/' + ele.uid + '/popularityDen').set(popularityDen + 1)
          this.firebase.database().ref('users/' + ele.uid + '/popularity').set(popularityNum/(popularityDen + 1))
          return({
            key: ele.uid,
            nickname: snap.val().nickname,
            avatar: snap.val().avatar,
            birthday: snap.val().birthday
          })
        } else {
          return null
        }
      }).catch(err => console.log(err))
    ))

    Promise.all(preysPromises)
    .then(preys => {
      if (preys.length == 0) {
        //runInAction(() => {
        //  this.preys = preys
        //})
      } else {
        runInAction(() => {
          this.preys = preys
        })        
      }
    })
    .catch(err => {
      console.log(err)
    })
  }
*/
  // LineCollection

  @action setCourtInitialize = uid => {
    this.loading = true
    this.uid = uid
  }

  @action fetchPrey = () => {
    this.fetchPreyQuery = this.firebase.database().ref('users/' + this.uid)
    this.fetchPreyQuery.once('value').then(snap => {
      if (snap.val()) {
        const popularityDen = snap.val().popularityDen || 0
        const popularityNum = snap.val().popularityNum || 0
        this.firebase.database().ref('users/' + this.uid + '/popularityNum').set(popularityNum + 1)
        this.firebase.database().ref('users/' + this.uid + '/popularity').set((popularityNum + 1)/popularityDen)
        runInAction(() => {
          this.uid = this.uid
          this.avatar = snap.val().avatar
          this.nickname = snap.val().nickname
          this.bio = snap.val().bio
          this.birthday = snap.val().birthday
          this.languages = snap.val().languages || new Object
          this.hobbies = snap.val().hobbies || new Object
          this.album = snap.val().album || new Object
          this.vip = Boolean(snap.val().vip)
          this.distance = this.getDistance(snap.val().latitude,snap.val().longitude)
          this.emailVerified = Boolean(snap.val().emailVerified)
          this.photoVerified = Boolean(snap.val().photoVerified)
          this.loading = false
        })
      } else {
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

  @action setMeetChanceMinAge = int => {
    this.meetChanceMinAge = int
  }

  @action setMeetChanceMaxAge = int => {
    this.meetChanceMaxAge = int
  }

  @action setMeetChanceRadar = boolean => {
    this.meetChanceRadar = boolean
  }

  @action setMeetChanceOfflineMember = boolean => {
    this.meetChanceOfflineMember = boolean
  }

  @action cleanLoading = () => {
    this.loading = false
  }

  checkOnline = online => {
    if (!this.meetChanceOfflineMember) {
      return true
    } else if (this.meetChanceOfflineMember && online){
      return true
    } else {
      return false
    }
  }

  sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  getDistance = (latitude,longitude) => {
    if (this.latitude && this.longitude && latitude && longitude) {
      return (geolib.getDistance(
        {latitude: this.latitude, longitude: this.longitude},
        {latitude: latitude, longitude: longitude}
      )/1000).toFixed(1)
    } else {
      return '?'
    }  
  }

}
