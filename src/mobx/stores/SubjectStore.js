import { useStrict, observable, action, computed } from 'mobx'
import { calculateAge } from '../../app/Utils'

useStrict(true)

const DefaultLanguages = {
  中文: false,
  英文: false,
  韓文: false,
}

const DefaultHobbies = {
  打球: true,
  唱歌: true,
}

export default class SubjectStore {
  // user data
  @observable avatar
  @observable album
  @observable nickname
  @observable sexualOrientation
  @observable address
  @observable birthday
  @observable bio
  @observable photos
  @observable vip
  @observable bonus
  @observable languages
  @observable hobbies
  @observable collect
  @observable emailVerified
  @observable photoVerified
  // hide function
  @observable hideMeetCute
  @observable hideMeetChance
  @observable hideVister
  @observable hideMessage
  @observable conversations
  @observable chatStatus
  @observable visitConvSentToday

  constructor() {
    this.initialize()
  }

  // String to Value

  @computed get age() {
    return calculateAge(this.birthday)
  }

  @computed get maxCollect() {
    return this.vip ? 10 : 5
  }

  // Object to String

  @computed get languagesToString() {
    return Object.keys(this.languages).filter(key => this.languages[key] === true).join()
    // { 中文: true, 英文: true } -> 中文,英文
  }

  // Object to Array FlatList

  @computed get albumToFlatList() {
    return Object.keys(this.album).sort().map((key, index) => ({ key, uri: this.album[key], avatar: this.album[key] === this.avatar }))
    // { url: true } -> [{key: index, uri: url}]
  }

  @computed get languagesToFlatList() {
    return Object.keys(this.languages).map((key, index) => ({ key, check: this.languages[key] }))
    // { 中文: true } -> [{key: 中文, check: true}]
  }

  @computed get hobbiesToFlatList() {
    return Object.keys(this.hobbies).map((key, index) => ({ key, check: this.hobbies[key] }))
    // { 打球: true } -> [{key: 打球, check: true}]
  }

  @computed get collectCount() {
    return Object.keys(this.collect).length
  }

  // action

  @action initialize = () => {
    // user data
    //this.uid = null
    //this.email = null
    this.nickname = null
    this.address = null
    this.birthday = null
    this.bio = null
    this.languages = DefaultLanguages
    this.hobbies = new Object()
    this.collect = new Object()
    this.album = new Object
    this.avatar = null
    this.vip = false
    this.sexualOrientation = null // 有可能 null -> 萬一上傳失敗拿不到就永遠都是null了 -> 邂逅那邊先做特別處理
    this.emailVerified = false
    this.photoVerified = false
    // hide function
    this.hideMeetCute = false
    this.hideMeetChance = false
    this.hideVister = false
    this.hideMessage = false
    this.conversations = null
    this.chatStatus = null
    this.bonus = null
  }

  @action setUid = uid => {
    this.uid = uid
  }

  @action setEmail = str => {
    this.email = str
  }

  @action setNickname = str => {
    this.nickname = str
  }

  @action setBirthday = str => {
    this.birthday = str
  }

  @action setAddress = str => {
    this.address = str
  }

  @action setAvatar = url => {
    this.avatar = url
  }

  @action setSexualOrientation = str => {
    this.sexualOrientation = str
  }

  @action setBio = str => {
    this.bio = str
  }

  @action setAlbum = object => {
    this.album = object
  }

  @action addPhoto = (key, url) => {
    this.album[key] = url
    this.album = Object.assign({}, this.album)
  }

  @action deletePhoto = key => {
    delete this.album[key]
    this.album = Object.assign({}, this.album)
  }

  @action setVip = boolean => {
    this.vip = boolean
  }

  @action setLanguages = object => {
    this.languages = object
  }

  @action setHobbies = object => {
    this.hobbies = object
  }

  @action setCollect = object => {
    this.collect = object
  }

  @action switchCollect = key => {
    if (this.collect[key]) {
      this.collect[key] = false
    } else {
      this.collect[key] = Date.now()
    }
    //this.collect[key] = !this.collect[key]
    this.collect = Object.assign({},this.collect)
  }

  @action filterCollect = () => {
    this.collect = Object.keys(this.collect).reduce((r, e) => {
      if (this.collect[e] !== false ) r[e] = this.collect[e]
      return r;
    }, {})
  }

  @action setBonus = (bonus) => {
    this.bonus = bonus
  }

  @action setEmailVerified = boolean => {
    this.emailVerified = boolean
  }
  // hide function

  @action setHideMeetCute = () => {
    this.hideMeetCute = !this.hideMeetCute
  }

  @action setHideMeetChance = () => {
    this.hideMeetChance = !this.hideMeetChance
  }

  @action setHideVister = () => {
    this.hideVister = !this.hideVister
  }

  @action setHideMessage = () => {
    this.hideMessage = !this.hideMessage
  }

  @action setVisitConvSentToday = val => {
    this.visitConvSentToday = val
  }

  @action addOneToVisitConvSentToday = () => {
    this.visitConvSentToday = this.visitConvSentToday + 1
  }

  @action addBonus = (points) => {
    if (!this.bonus) {
      this.bonus = 0
    }
    this.bonus = this.bonus + points
  }

  @action deductBonus = (points) => {
    if (!this.bonus) {
      this.bonus = 0
    }
    const deducted = this.bonus - points
    if (deducted < 0 || !deducted) {
      this.bonus = 0
    } else {
      this.bonus = deducted
    }
    return this.bonus
  }

  @action setChatStatus = status => {
    this.chatStatus = status
  }

  @action setConversations = object => {
    this.conversations = object
  }

  @action addConv = (uid, data) => {
    this.conversations[uid] = data
    this.conversations = Object.assign({}, this.conversations)
  }

  @action deleteConv = (uid) => {
    delete this.conversations[uid]
    this.conversations = Object.assign({}, this.conversations)
  }

  @action setConvVisit = (uid, boolean) => {
    this.conversations[uid].visit = boolean
  }

}
