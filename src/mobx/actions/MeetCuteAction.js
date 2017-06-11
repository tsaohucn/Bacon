import { action } from 'mobx'
import GeoFire from 'geofire'
//import Moment from 'moment'

//useStrict(true)
const MeetCuteAction = {

  initMeetCuteShow: action(function initMeetCuteShow(){
    this.setUser()
    //console.warn(this.user.meetCuteHistory[0])
    if (this.user.meetCuteHistory == null) {
      this.user.meetCuteHistory = [this.user.uid]
      this.updateToFirebase("meetCuteHistory",[this.user.uid])
    }
    this.loading = true
  }),

  fetchPreyListsByMeetCute: action(function fetchPreyListsByMeetCute(sexOrientation){
    this.preyList = []
    this.seekMeetQs(sexOrientation)
  }),

  seekMeetQs: action(function seekMeetQs(sexOrientation) {
    switch (sexOrientation) {
      case "msf":
        this.mq("fsm");
        break;
      case "msm":
        this.mq("msm");
        break;
      case "fsm":
        this.mq("msf");
        break;
      case "fsf":
        this.mq("fsf");
        break;
    }
  }),

  seekNearBy: action(function seekNearBy(latitude, longitude){
    const query = this.firebase.database().ref("/user_locations/")
    const geoFire = new GeoFire(query)
    const geoQuery = geoFire.query({
      center: [latitude, longitude],
      radius: 1000
    })
    geoQuery.on("key_entered", (key) => {
      this.setPreyListByKey(key)
    })
    geoQuery.on("ready", () => {
      this.loading = false
    })
  }),

  mq: action(function mq(sexOrientation) {
    //sexOrientation = 'fsm'
    const query = this.firebase.database().ref("users")
      //.database()
      //.ref(`seeking/${this.store.prey.country}/${cond}`);
    //ref.orderByKey().equalTo(cond,"sexOrientation")
    query.orderByChild("sexOrientation").equalTo(sexOrientation).once("value", snap => {
        snap.forEach(childsnap => {
          //if (childsnap.val().country === 'Taiwan')

          //console.warn(this.user.meetCuteHistory.indexOf(childsnap.val().uid) != -1)
          if (!(this.user.meetCuteHistory.indexOf(childsnap.val().uid) != -1)) {
            this.preyList.push(childsnap.val())
          }
        })
      })
      .then(() => {
        if (this.preyList.length > 0){
          this.setprey(this.preyList[0])
          //this.user.meetCuteHistory.push(this.preyList[0].uid)
          //this.updateToFirebase("meetCuteHistory",this.user.meetCuteHistory.slice())
        }
      this.loading = false
    })

  }),

  setPreyListByKey: action(function setPreyListByKey(key){
    this.firebase.database().ref('users/' + key).once('value').then(snap => { this.preyList.push(snap.val()) })
  }),

  setprey: action(function setprey(prey){
    this.prey = prey
  }),

  handleLike: action(function handleLike(){
    //console.warn(this)
    //const r = this.firebase.database().ref("preys/" + this.prey.uid + "/likes").child(this.prey.uid);
    //if (this.firebase.database().ref("goodImpression")) {
      //this.firebase.database().ref("goodImpression").push({wooer: this.store.user.uid , prey: this.prey.uid})
    //} else {
      this.firebase.database().ref("goodImpression").push({wooer: this.user.uid , prey: this.prey.uid})
    //}
    //r.set({time: Moment().unix()});
    this.getNext()
  }),

  getNext: action(async function getNext(){
    this.loading = true
    this.user.meetCuteHistory.push(this.prey.uid)
    this.updateToFirebase("meetCuteHistory",this.user.meetCuteHistory.slice())
    const _index = this.preyList.indexOf(this.prey) + 1
    if (this.preyList.length > _index) {
      this.setprey(this.preyList[_index])
    } else {
      this.setprey(null)
    }
    await this.sleep(700)
    this.loading = false
  }), 

  setUser: action(function setUser(){
    this.user = this.store.user
  }),

  setAgeMin: action(function setAgeMin(age_min){
    this.age_min = age_min
  }),

  setAgeMax: action(function setAgeMax(age_max){
    this.age_max = age_max
  }),

  updateToFirebase: function updateToFirebase(key, val){
    this.firebase.database().ref('users/' + this.user.uid + '/' + key).set(val)
  },

  sleep: function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
}

export default MeetCuteAction