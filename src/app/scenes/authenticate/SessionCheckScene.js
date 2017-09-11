import React, { Component }  from 'react'
import { AppState, Platform } from 'react-native'
import { inject, observer } from 'mobx-react'
import { Actions } from 'react-native-router-flux'
import GeoFire from 'geofire'
import Geolocation from  'Geolocation'
import Moment from 'moment'
import MomentLocale from 'moment/locale/zh-tw'
import InAppBilling from 'react-native-billing'

import { calculateAge } from '../../../app/Utils'
import Loading from '../../views/Loading/Loading'
import DefaultLanguages from '../../../configs/DefaultLanguages'

const metadata = {
  contentType: 'image/jpeg'
}

@inject('ControlStore','SignUpStore','SignInStore','SubjectStore','SubjectEditStore','MeetChanceStore','MeetCuteStore','FateStore','firebase',) @observer
export default class SessionCheckScene extends Component {

  constructor(props) {
    super(props)
    this.ControlStore = this.props.ControlStore
    this.SignUpStore = this.props.SignUpStore
    this.SignInStore = this.props.SignInStore
    this.SubjectStore = this.props.SubjectStore
    this.SubjectEditStore = this.props.SubjectEditStore
    this.MeetChanceStore = this.props.MeetChanceStore
    this.MeetCuteStore = this.props.MeetCuteStore
    this.FateStore = this.props.FateStore
    this.firebase = this.props.firebase
    this.lastAppState = AppState.currentState
    // 監聽函數
    this.geoQuery = null
    this.geoFire = null
    this.meetCuteQuery = null
    this.visitorsQuery = null
    this.goodImpressionQuery = null
    //this.collectionQuery = null
    this.matchQuery = null
  }

  componentWillMount() {
    this.firebase.auth().onAuthStateChanged( user => {
      if (user) {
        // 入口點
        // 使用者登入 -> 只要登入成功一定有 uid email
        //console.warn(user.uid)
        this.SubjectStore.setUid(user.uid) // 設置 uid
        this.SubjectStore.setEmail(user.email) // 設置 email
        this.FateStore.setSelfUid(user.uid) // 設置 uid
        //////////////////////////////////////////////////////////
        if (this.ControlStore.authenticateIndicator == '註冊') {
          // 從註冊來的
          ///////// 非同步 /////////
          this.uploadAvatar() // 非同步上傳相簿
          this.uploadSignUpData() // 非同步上傳註冊資料
          this.uploadLocation() // 上傳GPS資料 巧遇監聽
          this.visitorsListener() // 來訪監聽
          this.goodImpressionListener() // 好感監聽
          this.matchListener() // 配對
          this.setOnline() // 非同步設置使用者上線
          AppState.addEventListener('change', this.handleAppStateChange ) // 非同步註冊 app 狀態監聽
          ///////// 同步 /////////
          this.uploadEmailVerity()
          this.initSubjectStoreFromSignUpStore() // 同步轉移資料
        } else {
          // 從登入來的
          //移除所有監聽函數 初始化狀態
          this.initialize()
          ///////// 非同步 /////////
          this.initSubjectStoreFromFirebase() // 非同步抓使用者資料 邂逅監聽
          this.setVip()
          this.uploadLocation() // 上傳GPS資料 巧遇監聽
          this.visitorsListener() // 來訪監聽
          this.goodImpressionListener() // 好感監聽
          this.matchListener() // 配對
          //this.collectionDB() // 從LocalDB抓配對資料
          this.setOnline() // 非同步設置使用者上線
          AppState.addEventListener('change', this.handleAppStateChange ) // 非同步註冊 app 狀態監聽
          ///////// 同步 /////////
          this.uploadEmailVerity()
        }
        Actions.Drawer({type: 'reset'}) // 進入 Drawer
      } else {
        // 入口點
        // 下線
        //this.setOffline()
        //移除所有監聽函數 初始化狀態
        this.initialize()
        // 沒有使用者登入 user = null
        Actions.Welcome({type: 'reset'}) // 轉到 Welcome
      }
    })
    Moment.updateLocale('zh-tw', MomentLocale)
  }

  initialize = () => {
    AppState.removeEventListener('change', this.handleAppStateChange ) // 非同步移除 app 狀態監聽
    this.removeMeetChanceListener() // 非同步移除地理監聽
    this.removeMeetCuteListener() // 移除邂逅監聽
    this.removeVisitorsListener() // 移除邂逅監聽
    this.removeGoodImpressionListener() // 移除好感監聽
    this.removeMatchListener() // 配對
    this.SignUpStore.initialize() // 初始註冊入狀態
    this.SignInStore.initialize() // 初始化登入狀態
    this.SubjectStore.initialize() // 初始主體入狀態
    this.MeetChanceStore.initialize()
    this.MeetCuteStore.initialize()
    this.FateStore.initialize()
  }

  uploadAvatar = () => {
    // 非同步上傳大頭照
    this.firebase.storage().ref('images/avatars/' + this.SubjectStore.uid + '/' + Object.keys(this.SignUpStore.album)[0] + '.jpg')
    .putFile(this.SignUpStore.avatar.replace('file:/',''), metadata)
    .then(uploadedFile => {
      this.firebase.database().ref('users/' + this.SubjectStore.uid + '/avatar').set(uploadedFile.downloadUrl)
      .then(() => {
          this.firebase.database().ref('users/' + this.SubjectStore.uid + '/album/' + Object.keys(this.SignUpStore.album)[0]).set(uploadedFile.downloadUrl)
        .then(() => {
            this.ControlStore.setAvatarUploadIndicator('使用者大頭照上傳成功')
          })
        .catch(() => {
          this.ControlStore.setAvatarUploadIndicator('使用者大頭照上傳失敗')
          })
      })
      .catch(() => {
        this.ControlStore.setAvatarUploadIndicator('使用者大頭照上傳成功')
      })
    })
    .catch(() => {
      this.ControlStore.setAvatarUploadIndicator('使用者大頭照上傳失敗')
    })
  }

  uploadSignUpData = () => {
    this.firebase.database().ref('users/' + this.SubjectStore.uid).set({
      // 非同步上傳註冊資料
      sexualOrientation: this.sexualOrientationToString(),
      address: this.SignUpStore.address,
      nickname: this.SignUpStore.nickname,
      birthday: this.SignUpStore.birthday,
      //vip: false,
      bonus: 0
    }).then(() => {
        this.ControlStore.setSignUpDataUploadIndicator('使用者資料上傳成功')
      }).catch((error) => {
        this.ControlStore.setSignUpDataUploadIndicator('使用者資料上傳失敗')
        console.log(error)
      })
  }

  uploadLocation = () => {
    Geolocation.getCurrentPosition(
      location => {
        this.setLocation(location.coords.latitude,location.coords.longitude)
      },
      error => {
        console.log('獲取位置失敗：' + error)
        if (this.ControlStore.authenticateIndicator == '註冊') {
          if (this.SignUpStore.latitude && this.SignUpStore.longitude) {
            this.uploadFirebaseLocation(this.SignUpStore.latitude,this.SignUpStore.longitude)
            this.setLocation(this.SignUpStore.latitude,this.SignUpStore.longitude)
          } else {
            console.log('從firebase獲取位置失敗')
          }
        } else {
          this.firebase.database().ref('users/' + this.SubjectStore.uid).once('value', snap => {
            if (snap.val() && snap.val().latitude && snap.val().longitude) {
              console.log('從firebase獲取位置成功:' + [snap.val().latitude,snap.val().longitude])
              this.setLocation(snap.val().latitude,snap.val().longitude)
            } else {
              console.log('從firebase獲取位置失敗')
            }
          })
        }
      }
    )
  }

  uploadFirebaseLocation = (latitude,longitude) => {
    this.firebase.database().ref('users/' + this.SubjectStore.uid + '/latitude').set(latitude)
    this.firebase.database().ref('users/' + this.SubjectStore.uid + '/longitude').set(longitude)
  }

  setLocation = (latitude,longitude) => {
    this.geoFire = new GeoFire(this.firebase.database().ref('/user_locations/'))
    this.geoQuery = this.geoFire.query({
        center: [latitude,longitude],
        radius: 394 // 台灣從北到南394公里
    })
    this.meetChanceListener(this.geoQuery)
    this.geoFire.set(this.SubjectStore.uid,[latitude,longitude])
      .then(() => {
        console.log('獲取位置成功'+[latitude,longitude])
      }, error => {
        console.log('上傳位置失敗：' + error)
      }
    )
    this.SubjectStore.setLatitude(latitude)
    this.SubjectStore.setLongitude(longitude)
    this.MeetCuteStore.setLatitude(latitude)
    this.MeetCuteStore.setLongitude(longitude)
    this.MeetChanceStore.setLatitude(latitude)
    this.MeetChanceStore.setLongitude(longitude)
    this.FateStore.setLatitude(latitude)
    this.FateStore.setLongitude(longitude)
  }

  uploadEmailVerity = () => {
    this.firebase.database().ref('users/' + this.SubjectStore.uid + '/emailVerified').set(this.firebase.auth().currentUser.emailVerified)
    this.SubjectStore.setEmailVerified(this.firebase.auth().currentUser.emailVerified)
  }

  initSubjectStoreFromSignUpStore = () => {
    this.SubjectStore.setNickname(this.SignUpStore.nickname) // String
    this.SubjectStore.setAddress(this.SignUpStore.address) // String
    this.SubjectStore.setBirthday(this.SignUpStore.birthday) // String
    this.SubjectStore.setBio(null) // null(placeholder)
    this.SubjectStore.setAvatar(this.SignUpStore.avatar) // String
    this.SubjectStore.setAlbum(this.SignUpStore.album) // Object
    this.SubjectStore.setLanguages(DefaultLanguages) // Object
    this.SubjectStore.setHobbies(new Object) // Object
    this.SubjectStore.setCollect(new Object) // Object
    this.SubjectStore.setVip(false) // boolean
    this.SubjectStore.setBonus(0) // Int
    this.SubjectStore.setVisitConvSentToday(0)
    this.SubjectStore.setSexualOrientation(this.sexualOrientationToString())
    this.ControlStore.setSyncDetector(true) // 同步完成
    this.meetCuteListener() // 非同步邂逅監聽
    this.uxSignIn() // 讓登入頁留住帳號密碼
  }

  initSubjectStoreFromFirebase = async () => {
    await this.firebase.database().ref('users/' + this.SubjectStore.uid).once('value',
      (snap) => {
        if (snap.val()) {
          this.SubjectStore.setNickname(snap.val().nickname) // null(placeholder) String
          this.SubjectStore.setAddress(snap.val().address) // null(placeholder) String
          this.SubjectStore.setBirthday(snap.val().birthday) // null -> undefinded
          this.SubjectStore.setBio(snap.val().bio) // null(placeholder) String
          this.SubjectStore.setAvatar(snap.val().avatar) // null(placeholder) String Url
          this.SubjectStore.setAlbum(new Object(snap.val().album)) // Object
          this.SubjectStore.setLanguages(Object.assign({}, DefaultLanguages, snap.val().languages)) // Object
          this.SubjectStore.setHobbies(new Object(snap.val().hobbies)) // Object
          this.SubjectStore.setCollect(new Object(snap.val().collect)) // Object
          this.SubjectStore.setSexualOrientation(snap.val().sexualOrientation)
          this.SubjectStore.setChatStatus(snap.val().chatStatus)
          this.SubjectStore.setBonus(parseInt(snap.val().bonus) || 0)
          this.SubjectStore.setConversations(snap.val().conversations)
          this.SubjectStore.setVisitConvSentToday(snap.val().visitConvSentToday || 0)
          this.SubjectStore.setUnhandledPass(new Object(snap.val().unhandledPass) || {})
          // tasks
          this.SubjectStore.setTask1(snap.val().task1)
          this.SubjectStore.setTask2(snap.val().task2)
          this.SubjectStore.setTask3(snap.val().task3)
          this.SubjectStore.setTask4(snap.val().task4)
          // hide
          this.SubjectStore.setHideMeetCute(snap.val().hideMeetCute || false)
          this.SubjectStore.setHideMeetChance(snap.val().hideMeetChance || false)
          this.SubjectStore.setHideVister(snap.val().hideVister || false)
          this.SubjectStore.setHideMessage(snap.val().hideMessage || false)
          // meetCute config
          this.MeetCuteStore.setMeetCuteMinAge(snap.val().meetCuteMinAge || 18)
          this.MeetCuteStore.setMeetCuteMaxAge(snap.val().meetCuteMaxAge || 99)
          this.MeetCuteStore.setMeetCuteRadar(snap.val().meetCuteRadar)
          this.MeetCuteStore.setMeetCuteThreePhotos(snap.val().meetCuteThreePhotos)
          // meetChance config
          this.MeetChanceStore.setMeetChanceMinAge(snap.val().meetChanceMinAge || 18)
          this.MeetChanceStore.setMeetChanceMaxAge(snap.val().meetChanceMaxAge || 99)
          this.MeetChanceStore.setMeetChanceRadar(snap.val().meetChanceRadar)
          this.MeetChanceStore.setMeetChanceOfflineMember(snap.val().meetCuteOfflineMember)
        } else {
          //
        }
        this.ControlStore.setSyncDetector(true) // 同步完成
      }, error => {
        //
        this.ControlStore.setSyncDetector(true) // 同步完成
        console.log(error)
      })
    this.updateVisitConvInvites() // 非同步重設當日發出來訪留言數
    this.meetCuteListener() // 非同步邂逅
  }

  setVip = () => {
    if (Platform.OS === "android") {
      InAppBilling.open()
      .then(() => InAppBilling.getSubscriptionDetailsArray(['3_month', 'premium_3m']).then( productDetailsArray => {
        if (productDetailsArray.length > 0) {
          this.SubjectStore.setVip(true)
        } else {
          this.SubjectStore.setVip(false)
        }
      }).catch(err => console.log(err)))
      .catch(err => console.log(err))
    } else { // iOS
      this.firebase.database().ref('users/' + this.SubjectStore.uid + '/vip').once('value').then((snap)=> {
        if (snap.exists()) {
          if (snap.val()) {
            this.SubjectStore.setVip(true)
          } else {
            this.SubjectStore.setVip(false)
          }
        }
      })
    }
  }

  meetCuteListener = () => {
    this.seekMeetQs(this.SubjectStore.sexualOrientation)
  }

  meetChanceListener = (geoQuery) => {
    geoQuery.on('key_entered', (uid, location, distance) => {
      if (!(uid === this.SubjectStore.uid)) {
        this.firebase.database().ref('users/' + uid + '/sexualOrientation').once('value').then((snap)=>{
          if (snap.val() === this.reverseString(this.SubjectStore.sexualOrientation)) {
            this.MeetChanceStore.addPreyToPool({uid: uid, distance: distance})
          }
        })
      }
    })

    geoQuery.on('key_moved', (uid, location, distance) => {
      this.MeetChanceStore.updatePreyToPool(uid,distance)
    })

    geoQuery.on('key_exited', (uid, location, distance) => {
      this.MeetChanceStore.removePreyToPool(uid)
    })
  }

  visitorsListener = () => {
    this.visitorsQuery = this.firebase.database().ref('visitors').orderByChild('prey').equalTo(this.SubjectStore.uid)
    this.visitorsQuery.on('child_added', child => {
      this.FateStore.addPreyToVisitorsPool(child.val().wooer,child.val().time)
    })
  }

  goodImpressionListener = () => {
    this.goodImpressionQuery = this.firebase.database().ref('goodImpression').orderByChild('prey').equalTo(this.SubjectStore.uid)
    this.goodImpressionQuery.on('child_added', child => {
      this.FateStore.addPreyToGoodImpressionPool(child.val().wooer,child.val().time)
      this.MeetCuteStore.addPreyToGoodImpressionPool(child.val().wooer,child.val().time)
    })
    this.goodImpressionQuery.on('child_removed', child => {
      this.FateStore.removePreyToGoodImpressionPool(child.val().wooer)
      this.MeetCuteStore.addPreyToGoodImpressionPool(child.val().wooer,child.val().time)
    })
  }

  matchListener = () => {
    this.matchQuery = this.firebase.database().ref('goodImpression').orderByChild('wooer').equalTo(this.SubjectStore.uid)
    this.matchQuery.on('child_added', child => {
      this.FateStore.addPreyToMatchPool(child.val().prey,child.val().time)
      this.MeetCuteStore.addPreyToMatchPool(child.val().prey,child.val().time)
    })
    this.matchQuery.on('child_removed', child => {
      this.FateStore.removePreyToMatchPool(child.val().prey)
      this.MeetCuteStore.removePreyToMatchPool(child.val().prey)
    })
  }

  removeMeetCuteListener = () => {
    if (this.meetCuteQuery) {
      this.meetCuteQuery.off()
      this.meetCuteQuery = null
    }
  }

  removeMeetChanceListener = () => {
    if (this.geoQuery) {
      this.geoQuery.cancel()
      this.geoQuery = null
      this.geoFire = null
    }
  }

  removeVisitorsListener = () => {
    if (this.visitorsQuery) {
      this.visitorsQuery.off()
      this.visitorsQuery = null
    }
  }

  removeGoodImpressionListener = () => {
    if (this.goodImpressionQuery) {
      this.goodImpressionQuery.off()
      this.goodImpressionQuery = null
    }
  }

  removeMatchListener = () => {
    if (this.matchQuery) {
      this.matchQuery.off()
      this.matchQuery = null
    }
  }

  //////********************//////

  reverseString = str => {
    return str.split("").reverse().join("")
  }

  seekMeetQs = sexualOrientation => {
    switch (sexualOrientation) {
      case 'msf':
        'fsm'
        break
      case 'msm':
        'msm'
        break
      case 'fsm':
        'msf'
        break
      case 'fsf':
        'fsf'
        break
    }
  }

  seekMeetQs = sexualOrientation => {
    switch (sexualOrientation) {
      case 'msf':
        this.mq('fsm')
        break
      case 'msm':
        this.mq('msm')
        break
      case 'fsm':
        this.mq('msf')
        break
      case 'fsf':
        this.mq('fsf')
        break
    }
  }

  mq = sexualOrientation => {
    this.meetCuteQuery = this.firebase.database().ref('users').orderByChild('sexualOrientation').equalTo(sexualOrientation)
    this.meetCuteQuery.on('child_added', child => {
      this.MeetCuteStore.addPreyToPool(child.key,child.val().birthday)
    })
    this.meetCuteQuery.on('child_changed', child => {
      // birthday changed
      if (this.MeetCuteStore.pool[child.key] !== child.val().birthday) {
        this.MeetCuteStore.addPreyToPool(child.key,child.val().birthday)
      }
    })
  }

  handleAppStateChange = nextAppState => {
    if (AppState.currentState === 'active') {
      this.setOnline()
      // 設置使用者上線
    } else if (this.lastAppState.match('active') && (nextAppState === 'inactive' || nextAppState === 'background')) {
      this.setOffline()
      // 設置使用者下線
    }
    this.lastAppState = nextAppState
  }

  setOnline = () => {
    this.firebase.database().ref('/users/' + this.SubjectStore.uid + '/online').set(true)
    this.firebase.database().ref('/online/' + this.SubjectStore.uid).set({
      lastOnline: Math.floor(Date.now() / 1000),
      location: 'Taipei, Taiwan'
    })
  }

  setOffline() {
    this.firebase.database().ref('/users/' + this.SubjectStore.uid + '/online').set(false)
    this.firebase.database().ref('/online/' + this.SubjectStore.uid).remove().catch(err => { console.log(err) })
  }

  genderToString = () => (
    this.SignUpStore.gender ? 'm' : 'f'
  )

  sexualOrientationToString = () => (
    this.SignUpStore.sexualOrientation ? (this.genderToString() + 's' + this.genderToString()) : (this.genderToString() + 's' + (this.SignUpStore.gender ? 'f' : 'm'))
  )

  uxSignIn = () => {
    this.SignInStore.setEmail(this.SignUpStore.email)
    this.SignInStore.setPassword(this.SignUpStore.password)
  }

  sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  updateVisitConvInvites = () => {
    const start = Moment().startOf("day").unix()
    const end = Moment().endOf("day").unix()
    let sent = 0
    this.firebase.database().ref(`users/${this.SubjectStore.uid}/conversations/`)
    .orderByChild("createTime")
    .startAt(start)
    .endAt(end)
    .once("value")
    .then(snap => {
      sent = snap.numChildren()
      snap.forEach(child => {
        if (child.val().wooer != this.SubjectStore.uid) {
          sent -= 1
        }
      })
      return sent
    })
    .then(() => {
      console.log("Total new convs today: ", sent)
      this.SubjectStore.setVisitConvSentToday(sent)
      this.firebase.database().ref(`users/${this.SubjectStore.uid}/visitConvSentToday/`).set(sent)
    })
  }

  render() {
    return (
      <Loading />
    )
  }
}
