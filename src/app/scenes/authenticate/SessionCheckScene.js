import React, { Component }  from 'react'
import { AppState } from 'react-native'
import { inject, observer } from 'mobx-react'
import { Actions } from 'react-native-router-flux'
import GeoFire from 'geofire'
import Geolocation from  'Geolocation'
import UUIDGenerator from 'react-native-uuid-generator'

import Loading from '../../views/Loading/Loading'

const metadata = {
  contentType: 'image/jpeg'
}

const DefaultLanguages =  { 
  中文: false, 
  英文: false, 
  韓文: false
}

const DefaultHobbies = {
  打球: true,
  唱歌: true
}

@inject('ControlStore','SignUpStore','SignInStore','SubjectStore','SubjectEditStore','MeetChanceStore','firebase',) @observer
export default class SessionCheckScene extends Component {

  constructor(props) {
    super(props)
    this.ControlStore = this.props.ControlStore
    this.SignUpStore = this.props.SignUpStore
    this.SignInStore = this.props.SignInStore
    this.SubjectStore = this.props.SubjectStore
    this.SubjectEditStore = this.props.SubjectEditStore
    this.firebase = this.props.firebase
    this.lastAppState = AppState.currentState
    //this.MeetChanceStore = this.props.MeetChanceStore
 
    //this.geoQuery = null
    //this.geoFire = null
    
  }

  componentWillMount() {
    this.firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // 使用者登入 只要登入成功一定有 uid
        //this.uid = user.uid // 先有 uid
        //this.email = user.email
        this.SubjectStore.setUid(user.uid)
        this.SubjectStore.setEmail(user.email) // String
        if (this.ControlStore.authenticateIndicator == '註冊') {
          this.uploadAvatar() // 非同步上傳相簿
          this.uploadSignUpData() // 非同步上傳註冊資料  
          // 非同步 邂逅 巧遇 緣分 pool listener
          this.setOnline() // 非同步設置使用者上線
          AppState.addEventListener('change', this.handleAppStateChange ) // 非同步註冊 app 狀態監聽
          this.initSubjectStoreFromSignUpStore() // 同步轉移資料
        } else {
          // 全部都是非同步
          this.initSubjectStoreFromFirebase() // 非同步抓使用者資料
          // 非同步 邂逅 巧遇 緣分 pool listener
          this.setOnline() // 非同步設置使用者上線
          AppState.addEventListener('change', this.handleAppStateChange ) // 非同步註冊 app 狀態監聽
        }
        Actions.Drawer({type: 'reset'}) // 切換場景
      } else {
        // 入口點 -> 沒有使用者登入 user = null
        // 移除所有監聽函數 初始化狀態
        AppState.removeEventListener('change', this.handleAppStateChange ) // 非同步移除 app 狀態監聽
        //this.removeMeetChanceListener() // 非同步移除地理監聽
        this.SignUpStore.initialize() // 初始註冊入狀態
        this.SignInStore.initialize() // 初始化登入狀態
        this.SubjectStore.initialize() // 初始主體入狀態

        //this.MeetChanceStore.setpreyList(new Array)
        Actions.Welcome({type: 'reset'}) // 轉到註冊登入頁面
      }
    })    
  }

  uploadAvatar = () => {
    // 非同步上傳大頭照
    this.firebase.storage().ref('images/avatars/' + this.SubjectStore.uid + '/' + Object.keys(this.SignUpStore.album)[0] + '.jpg')  
    .putFile(this.SignUpStore.photoUrl.replace('file:/',''), metadata)
    .then(uploadedFile => {
      this.firebase.database().ref('users/' + this.SubjectStore.uid + '/avatar').set(uploadedFile.downloadUrl)
      .then(() => {
          this.firebase.database().ref('users/' + this.SubjectStore.uid + '/album' + '/' + Object.keys(this.SignUpStore.album)[0]).set(uploadedFile.downloadUrl)
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
    }).then(() => {
        this.ControlStore.setSignUpDataUploadIndicator('使用者資料上傳成功')
      }).catch((error) => {
        this.ControlStore.setSignUpDataUploadIndicator('使用者資料上傳失敗')
        console.log(error)
      })
  }

  initSubjectStoreFromSignUpStore = () => {
    this.SubjectStore.setNickname(this.SignUpStore.nickname) // String
    this.SubjectStore.setAddress(this.SignUpStore.address) // String
    this.SubjectStore.setBirthday(this.SignUpStore.birthday) // String
    this.SubjectStore.setBio(null) // null(placeholder)
    this.SubjectStore.setAvatar(this.SignUpStore.avatar) // String
    this.SubjectStore.setAlbum(this.SignUpStore.album) // Object 
    this.SubjectStore.setLanguages(DefaultLanguages) // Object 
    this.SubjectStore.setHobbies(DefaultHobbies) // Object 
    this.SubjectStore.setVip(false) // boolean
    this.SubjectStore.setSexualOrientation(this.sexualOrientationToString()) // String 
    this.ControlStore.setSyncDetector(true) // 同步完成
  }

  initSubjectStoreFromFirebase = () => {
    this.firebase.database().ref('users/' + this.SubjectStore.uid).once('value',
      (snap) => {
        if (snap.val()) {
          this.SubjectStore.setNickname(snap.val().nickname) // null(placeholder) String
          this.SubjectStore.setAddress(snap.val().address) // null(placeholder) String
          this.SubjectStore.setBirthday(snap.val().birthday) // null -> undefinded
          this.SubjectStore.setBio(snap.val().bio) // null(placeholder) String
          this.SubjectStore.setAvatar(snap.val().avatar) // null(placeholder) String Url
          this.SubjectStore.setAlbum(new Object(snap.val().album)) // Object 
          this.SubjectStore.setLanguages(snap.val().languages || DefaultLanguages) // Object 
          this.SubjectStore.setHobbies(snap.val().hobbies || DefaultHobbies) // Object 
          this.SubjectStore.setVip(Boolean(snap.val().vip))
          this.SubjectStore.setSexualOrientation(snap.val().sexualOrientation) //null(placeholder->邂逅) String
        } else {
          //this.SubjectStore.initialize()
        }
        this.ControlStore.setSyncDetector(true) // 同步完成
      }, error => {
        //this.SubjectStore.initialize()
        this.ControlStore.setSyncDetector(true) // 同步完成
        console.log(error)
      })
  }

  genderToString = () => (
    this.SignUpStore.gender ? 'm' : 'f'
  )

  sexualOrientationToString = () => (
    this.SignUpStore.sexualOrientation ? (this.genderToString() + 's' + this.genderToString()) : (this.genderToString() + 's' + (this.SignUpStore.gender ? 'f' : 'm'))    
  )

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
    this.firebase.database().ref("/online/" + this.SubjectStore.uid).set({
      lastOnline: Math.floor(Date.now() / 1000),
      location: "Taipei, Taiwan"
    })
  }

  setOffline() {
    this.firebase.database().ref("/online/" + this.SubjectStore.uid).remove()
  }
/*
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
*/

  render() {
    return(
      <Loading/>
  )}
}

/*
  uploadLocation = () => {
    Geolocation.getCurrentPosition(
      location => {
        this.geoFire = new GeoFire(this.firebase.database().ref('/user_locations/'))
        this.geoQuery = this.geoFire.query({
          center: [location.coords.latitude,location.coords.longitude],
          radius: 3000
        })
        this.grepMeetChance(this.geoQuery)
        this.geoFire.set(this.SubjectStore.uid,[location.coords.latitude,location.coords.longitude])
          .then(() => {
            console.log("獲取位置成功並上傳"+[location.coords.latitude,location.coords.longitude]);
          }, error => {
            console.log("上傳位置失敗：" + error);
          }
        ) 

      },
      error => {
        console.log("獲取位置失敗："+ error)
      }
    )
  }

  grepMeetChance = (geoQuery) => {
    geoQuery.on("key_entered", (uid, location, distance) => {
      //
      if (!(uid === this.SubjectStore.uid)) {
        this.MeetChanceStore.addPrey({uid: uid, distance: distance})
      }
    })

    geoQuery.on("key_moved", (uid, location, distance) => {
      if (!(uid === this.SubjectStore.uid)) {
        this.MeetChanceStore.updatePrey(uid,distance)
      }
    })

    geoQuery.on("key_exited", (uid, location, distance) => {
      if (!(uid === this.SubjectStore.uid)) {
        this.MeetChanceStore.removePrey(uid)
      }
    })
  }

  removeMeetChanceListener = () => {
    if (this.geoQuery) {
      this.geoQuery.cancel()
    }
  }
*/