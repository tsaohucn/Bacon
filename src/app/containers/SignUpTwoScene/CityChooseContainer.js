import React, { Component } from 'react'
import { View, TouchableOpacity, Text,Button } from 'react-native'
import { inject, observer } from 'mobx-react'
import RNGooglePlaces from 'react-native-google-places'

@inject('SignUpStore') @observer
export default class CityChooseContainer extends Component {

  constructor(props) {
    super(props)
    this.SignUpStore = this.props.SignUpStore
  }

  openSearchModal = () => {
    RNGooglePlaces.openAutocompleteModal()
    .then((place) => {
    console.log(place);
    this.SignUpStore.setAddress(place.address)
    // place represents user's selection from the
    // suggestions and it is a simplified Google Place object.
    })
    .catch(error => console.log(error.message));  // error is a Javascript Error object
  }

  current = () => {
    RNGooglePlaces.getCurrentPlace()
    .then((results) => {
      this.SignUpStore.setAddress(results[0].address)
      console.log(results)
    }
      )
    .catch((error) => console.log(error));    
  }

  render() {
    return(
      <View>
        <View>
          <Button
            title='選個位置'
            onPress={ this.openSearchModal }
          />  
        </View>    

        <View style={{marginTop: 20}}>
          <Button
            title='現在位置'
            onPress={ this.current }
          />
        </View> 

        <View style={{marginTop: 20}}>
          <Text>{this.SignUpStore.address}</Text>
        </View>
      </View>
    )
  }
}