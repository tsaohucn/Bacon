import { observable, action, computed, useStrict, runInAction, toJS } from 'mobx'
import geolib from 'geolib'
import { calculateAge } from '../api/Utils'

useStrict(true)

export default class MeetChanceStore {

  @observable preys
  // court
  @observable loading
  // user data
  /*
  @observable nickname
  @observable avatar
  @observable bio
  @observable birthday
  @observable languages
  @observable hobbies
  @observable album
  @observable vip
  @observable address
  @observable distance
  @observable emailVerified
  @observable photoVerified
  */
  //
  //@observable notFound
  //@observable meetChanceloading

  constructor(firebase) {
    this.firebase = firebase
    this.initialize()
  }

  // court
  //@computed get age() {
  //  return calculateAge(this.birthday)
  //}

  //@computed get languagesToString() {
  //  return Object.keys(this.languages).filter(key => this.languages[key] !== 0).map( key => key + this.masterLevel(this.languages[key]) ).join('，')
    //return Object.keys(this.languages).filter(key => this.languages[key] === true).join()
  //}

  //@computed get albumToArray() {
  //  return Object.keys(this.album).map((key) => (this.album[key]))
  //}

  //@computed get hobbiesToFlatList() {
  //  return Object.keys(this.hobbies).map((key,index) => ({ key: key, check: this.hobbies[key] }))
    // { 打球: true } -> [{key: 打球, check: true}]
  //}

  @computed get preysToFlatList() {
    const arr = toJS(this.preys).filter(ele => ele !== null)
    //if (arr.length > 9) {
    //  arr.length = arr.length - arr.length % 3
    //}
    return arr
  }

  @action initialize = () => {
    this.pool = new Object
    this.preyList = new Array
    this.preys = new Array
    this.loading = true
    this.index = 1
    // court
    // user data
    //this.uid = null
    //this.nickname = null
    //this.avatar = null
    //this.bio = null
    //this.birthday = null
    //this.languages = new Object
    //this.hobbies = new Object
    //this.album = new Object
    //this.vip = false
    //this.address = null
    //this.distance = null
    //this.emailVerified = false
    //this.photoVerified = false
    //this.latitude = null
    //this.longitude = null
    // config
    //this.meetChanceMinAge = 18
    //this.meetChanceMaxAge = 50
    //this.meetChanceRadar = false
    //
    //this.fetchPreyQuery
    // 
    //this.notFound = false
    // blockade
    //this.blockadePool = new Object
    //this.blockadeList = null
    //this.index = 1
    //this.refreshing = false
    //this.meetChanceloading = true
  }

  @action addPreyToPool = (uid,distance,nickname,avatar,birthday,hideMeetChance,deleted,online) => {
    this.pool[uid] = { key: uid, distance: distance, nickname: nickname, avatar: avatar, birthday: birthday, hideMeetChance: hideMeetChance, deleted: deleted, online: online }
  }

  @action fetchPreys = () => {
    this.blockadeList = this.filterBlockadeList()
    this.preyList = Object.keys(this.pool).filter( 
      key => {
        const value = this.pool[key]
        //TODO: 過濾
        //if (!(value.hideMeetChance) && !(value.deleted) && !(this.blockadeList.includes(key)) && value.birthday && ((calculateAge(value.birthday) >= this.meetChanceMinAge) && (calculateAge(value.birthday) <= (this.meetChanceMaxAge === 50 ? 99 : this.meetChanceMaxAge) )) && this.checkOnline(value.online)) {
        //  return true
        //} else {
        //  return null
        //}
        return true
      }
    ).map( key => this.pool[key] )
    // 排距離
    this.preyList.sort((a, b) => {
      return a.distance > b.distance ? 1 : -1
    })
    this.preys = this.preys.concat(this.preyList.slice(0,12))
    this.finishLoading()
  }

  @action addMorePreys = () => {
    // 沒到12個會出發兩次
    this.preys = this.preys.concat(this.preyList.slice(0 + 12*this.index,12 + 12*this.index))
    this.index = this.index + 1
  }

  @action startLoading = () => {
    this.preyList = new Array
    this.preys = new Array
    this.loading = true
    this.index = 1
  }

  @action finishLoading = () => {
    this.loading = false
  }

  @action filterBlockadeList = () => {
    return [] // 放在local
  }
  // LineCollection
/*
  @action setCourtInitialize = uid => {
    this.loading = true
    this.uid = uid
  }

  @action fetchPrey = () => {
    this.fetchPreyQuery = this.firebase.database().ref('users/' + this.uid)
    this.fetchPreyQuery.once('value').then(snap => {
      if (snap.val() && snap.val().album && snap.val().avatar) {
        //const popularityDen = snap.val().popularityDen || 0
        //const popularityNum = snap.val().popularityNum || 0
        //this.firebase.database().ref('users/' + this.uid + '/popularityNum').set(popularityNum + 1)
        //this.firebase.database().ref('users/' + this.uid + '/popularity').set((popularityNum + 1)/popularityDen)
        runInAction(() => {
          this.uid = this.uid
          this.avatar = snap.val().avatar
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
      } else {
        alert('資料出現錯誤')
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

  @action cleanMeetChanceLoading = () => {
    this.preyList = new Array
    this.preys = new Array
    this.index = 1
    this.meetChanceloading = true
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

}
*/
/*
  @action updatePreyToPool = (uid,distance) => {
    if (this.pool[uid]) {
      // 這裡常常會掛掉 this.pool[uid] = undefinded
      this.pool[uid].distance = distance
    }
  }

  @action removePreyToPool = uid => {
    delete this.pool[uid]
  }

  @action addPreyToblockadePool = (uid,time) => {
    this.blockadePool[uid] = time
  }
*/
}