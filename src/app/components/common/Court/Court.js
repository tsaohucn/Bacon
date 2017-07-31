import React, {Component} from 'react'
import { Dimensions, Image, Modal, View, Text, Button, TouchableOpacity } from 'react-native'
import Carousel from 'react-native-looped-carousel'
import SwipeCards from 'react-native-swipe-cards'
import ImageZoom from 'react-native-image-pan-zoom'

const { width, height } = Dimensions.get('window')


//const data = [
//  { id: 2, text: 'Amanda', age: 28, uri: 'https://pic.pimg.tw/wuntinglin/4b84e20809d8f.jpg' },
//  { id: 3, text: 'Emma', age: 29, uri: 'https://i.imgur.com/FHxVpN4.jpg' },
//
//];

export default class Court extends Component {

  constructor(props) {
    super(props)
    this.nope = this.props.nope
    this.yup = this.props.yup
  }

  renderCard = (card) => (      
    <Image
      key={card.id}
      source={{uri: card.uri}}
      style={{width, height: width}}
    /> 
  )

  onPressRightIcon = () => {
    this.refs['swiper']._goToNextCard() 
    this.nope()
  }

  onPressLeftIcon = () => {
    this.refs['swiper']._goToNextCard() 
    this.yup()
  }

  nextphoto = () => {
    this.carousel._animateNextPage()
  }

  renderAlbum = (photos) => (
    photos.map( photo => (
      <ImageZoom 
        key={ele.key}
        cropWidth={width}
        cropHeight={height}
        imageWidth={width}
        imageHeight={height}
      >
        <Image style={{height, width}} resizeMode={'contain'} source={{uri: ele.uri}}/>
      </ImageZoom>
    ))
  )

  renderOnePhoto = () => (
    <ImageZoom
      cropWidth={width}
      cropHeight={height}
      imageWidth={width}
      imageHeight={height}
    >
      <Image style={{height, width}} resizeMode={'contain'} source={{uri: 'https://i.imgur.com/FHxVpN4.jpg'}}/>
    </ImageZoom>
  )

  render() {

    const { cards, rightIcon, leftIcon, verityEmail, verityPhoto, album, photos, closeAlbum, openAlbum, displayName, age, langs, distance } = this.props

    return (
      <View style={{flex:1}}>

        <Modal animationType={"fade"} onRequestClose={()=>{}} visible={ album || false } transparent={false}>
          <Carousel
            ref={(carousel) => { this.carousel = carousel }}
            swipe={false}
            style={{flex:1,backgroundColor: 'black'}}
            bullets
            autoplay={false}
            pageInfoTextStyle={{color: 'red'}}
            onAnimateNextPage={(p) => console.log(p)}
            >
            { photos ? this.renderAlbum(photos) : this.renderOnePhoto() }
          </Carousel>
          <View style={{width, position: 'absolute', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20}}>
              <View ><Text onPress={ closeAlbum } style={{color:'white',fontFamily: 'NotoSans'}}>返回</Text></View>
              <View ><Text onPress={ this.nextphoto } style={{color:'white',fontFamily: 'NotoSans'}}>下一張</Text></View>
          </View>
        </Modal>

      <SwipeCards
        ref = {'swiper'}
        cards={ cards }
        renderCard={ this.renderCard }
        dragY={false}
        onClickHandler={ openAlbum }
        cardKey='id'
        stack
        stackOffsetX={0}
        stackOffsetY={0}
        smoothTransition
        showMaybe={false}

      />

      <TouchableOpacity style={{position: 'absolute',top: 320, right: 60}} onPress={ this.onPressRightIcon }>
        <Image source={ rightIcon }/>
      </TouchableOpacity>

      <TouchableOpacity style={{position: 'absolute',top: 320, left: 60}} onPress={ this.onPressLeftIcon }>
        <Image source={ leftIcon } />
      </TouchableOpacity>


      <View style={{position: 'absolute',top: 400, flexDirection: 'row', alignSelf: 'center', alignItems: 'center'}}>
        <Image style={{marginRight: 5}} source={verityEmail ? require('./img/ico_meet_email_1.png') : require('./img/ico_meet_email_1.png')}/>
        <Image style={{marginRight: 5}} source={verityPhoto ? require('./img/ico_meet_picture_1.png') : require('./img/ico_meet_picture_1.png')}/>
        <Text style={{fontSize: 20,color: '#606060',fontFamily: 'NotoSans'}}>{ displayName }</Text>
        <Text style={{fontSize: 20,color: '#606060',fontFamily: 'NotoSans'}}>, </Text>
        <Text style={{fontSize: 20,color: '#606060',fontFamily: 'NotoSans'}}>{ age }</Text>
      </View>

      <View style={{position: 'absolute',top: 440, alignSelf: 'center', alignItems: 'center'}}><Text style={{fontSize: 10,color: '#606060'}}>好看的千篇一律，有趣的靈魂卻是萬里挑一</Text></View>
    
      <View style={{position: 'absolute',top: 460, flexDirection: 'row', alignSelf: 'center', alignItems: 'center'}}>
        <Image style={{marginRight: 5}} source={require('./img/ico_meet_globe.png')}/>
        <Text style={{fontSize: 10,color: '#606060',fontFamily: 'NotoSans'}}>{ langs }</Text>
      </View>

      <View style={{position: 'absolute',top: 480, flexDirection: 'row', alignSelf: 'center', alignItems: 'center'}}>
        <Image style={{marginRight: 5}} source={require('./img/ico_meet_locate.png')}/>
        <Text style={{fontSize: 10,color: '#606060',fontFamily: 'NotoSans'}}>{ distance }</Text>
      </View>

      <TouchableOpacity style={{position: 'absolute',top: 500, flexDirection: 'row', alignSelf: 'center', alignItems: 'center'}}>
        <Image style={{marginRight: 5}} source={require('./img/btn_meet_block.png')}/>
        <Text style={{fontSize: 10,color: '#606060',fontFamily: 'NotoSans'}}>封鎖此人</Text>
      </TouchableOpacity>

    </View>
  )}
}