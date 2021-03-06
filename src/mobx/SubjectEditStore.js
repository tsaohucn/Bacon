import { useStrict, observable, extendObservable, action, computed } from 'mobx'

useStrict(true)

export default class SubjectEditStore {

  @observable nickname
  @observable birthday
  @observable address
  @observable bio
  @observable languages
  @observable hobbies
  @observable latitude
  @observable longitude

  constructor() {
    this.latitude = null
    this.longitude = null
  }


  @computed get languagesToFlatList() {
    return Object.keys(this.languages).map((key,index) => ({ key: key, check: this.languages[key], master: '精通' }))
    // { 中文: true } -> [{key: 中文, check: 0/1/2/3}]
  }

  @computed get hobbiesToFlatList() {
    return Object.keys(this.hobbies).map((key,index) => ({ key: key, check: this.hobbies[key] }))
    // { 打球: true } -> [{key: 打球, check: true}]
  }

  @action setNickname = str => {
    this.nickname = str
  }

  @action setBirthday = str => {
    this.birthday = str    
  }

  @action setAddress = str => {
    this.address = str
    //.substring(0,11)
  }

  @action setBio = str => {
    this.bio = str    
  }

  @action setLanguages = object => {
    this.languages = object
  }

  @action switchLanguages = key => {
    this.languages[key] = !this.languages[key]
  }


  @action disableLanguages = key => {
    this.languages[key] = 0
  }
  
  @action oneLevelLanguages = key => {
    this.languages[key] = 1
  }

  @action twoLevelLanguages = key => {
    this.languages[key] = 2
  }

  @action threeLevelLanguages = key => {
    this.languages[key] = 3
  }

  @action setHobbies = object => {
    this.hobbies = object
  }

  @action switchHobbies = key => {
    this.hobbies[key] = !this.hobbies[key]
  }

  @action addHobby = key => {
    if (this.hobbies[key]) {
      this.switchHobbies(key)
    } else {
      this.hobbies[key] = true
      this.hobbies = Object.assign({},this.hobbies)
    }
  }

  @action setLatitude = latitude => {
    this.latitude = latitude
  }

  @action setLongitude = longitude => {
    this.longitude = longitude
  }
}