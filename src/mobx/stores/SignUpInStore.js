import { observable, action, useStrict } from 'mobx'

import { emailFormatChecker } from '../../app/Utils'

useStrict(true)

export default class SignUpInStore {
  // user data
  @observable photoURL
  @observable email
  @observable password
  @observable displayName
  @observable gender
  @observable sexOrientation
  @observable city
  @observable birthday
  // error state
  @observable emailStatus
  @observable passwordStatus
  @observable displayNameStatus

  @observable emailChecker
  @observable passwordChecker
  @observable displayNameChecker
  @observable birthdayChecker
  @observable policyChecker
  //
  @observable UpInStatus
  @observable failureStatus

  constructor() {
    // user data
    this.photoURL = null
    this.email = ''
    this.password = ''
    this.displayName = ''
    this.gender = true // { true : m, false: f }
    this.sexOrientation = true // { true : 同性, false: 異性 }
    this.city = null
    this.birthday = null
    // error state
    this.emailStatus = null // 註冊 登入
    this.passwordStatus = null // 註冊/登入錯誤訊息
    this.displayNameStatus = null
    this.emailChecker = false
    this.passwordChecker = false
    this.displayNameChecker = false
    this.birthdayChecker = false
    this.policyChecker = false
    // 
    this.UpInStatus = null
    this.failureStatus = null
  }

  // user data

  @action setPhotoURL = url => {
    this.photoURL = url
  }

 // @action setUid = user_id => {
 //   this.uid = user_id
 // }

  @action setEmail = email => {
    this.email = email.trim()
  }

  @action setPassword = password => {
    this.password = password
  }

  @action setDisplayName = displayName => {
    this.displayName = displayName
  }

  @action setGender = () => {
    this.gender = !this.gender
  }

  @action setSexOrientation = () => {
    this.sexOrientation = !this.sexOrientation
  }

  @action setGoogleCity = data => {
    if (data.description) {
      this.city = data.description
    }
  }

  @action setTextInputCity = city => {
    this.city = city
  }

  @action setBirthday = birthday => {
    this.birthday = birthday    
  }

  // error state

  @action setEmailChecker = statu => {
    this.emailChecker = statu 
  }

  @action setEmailStatus = statu => {
    this.emailStatus = statu 
  }

  @action setPasswordChecker = statu => {
    this.passwordChecker = statu 
  }

  @action setPasswordStatus = statu => {
    this.passwordStatus = statu 
  }

  @action setDisplayNameChecker = statu => {
    this.displayNameChecker = statu 
  }

  @action setDisplayNameStatus = statu => {
    this.displayNameStatus = statu 
  }

  @action setBirthdayChecker = statu => {
    this.birthdayChecker = statu 
  }

  @action setPolicyNameChecker = () => {
    this.policyChecker = !this.policyChecker 
  }

  @action setUpInStatus = statu => {
    this.UpInStatus = statu
  }

  @action setFailureStatus = statu => {
    this.failureStatus = statu
  }

  @action emailChecker = () => {
    if (emailFormatChecker(this.SignUpInStore.email)) {
      this.firebase.auth().fetchProvidersForEmail(this.SignUpInStore.email).then( providers => {
        if (providers.length === 0) {
          this.SignUpInStore.setEmailChecker(true)
          this.SignUpInStore.setEmailStatus('此帳號可以使用')
          return true
        } else {
          this.SignUpInStore.setEmailChecker(false)
          this.SignUpInStore.setEmailStatus('此帳號已註冊')
          return false
        }
      }).catch((err) => {
        this.SignUpInStore.setEmailChecker(false)
        this.SignUpInStore.setEmailStatus('無法檢查帳號')
        return false
      })
    } else {
      this.SignUpInStore.setEmailChecker(false)
      this.SignUpInStore.setEmailStatus('帳號格式錯誤')
      return false 
    }
  }

  @action displayNameChecker = () => {
    if (this.SignUpInStore.displayName.length < 2) {
      this.SignUpInStore.setDisplayNameChecker(false)
      this.SignUpInStore.setDisplayNameStatus('請輸入2個字以上的暱稱')
    } else {
      this.SignUpInStore.setDisplayNameChecker(true)
      this.SignUpInStore.setDisplayNameStatus('此暱稱可以使用')
      return true     
    }
    return false   
  }

  @action passwordChecker = () => {
    const passw =  /^[A-Za-z0-9]{6,10}$/;
    if (this.SignUpInStore.password.match(passw)) {
      this.SignUpInStore.setPasswordChecker(true)
      this.SignUpInStore.setPasswordStatus('此密碼可以使用')
    } else {
      this.SignUpInStore.setPasswordChecker(false)
      this.SignUpInStore.setPasswordStatus('請輸入數字或英文字母組合的6~10字密碼')
      return false    
    }
    return true
  }
}