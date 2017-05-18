import React from 'react';
import { View, ScrollView, Dimensions } from 'react-native'
import { Cookie } from './MeetChance/Cookie'
import { observer, inject } from "mobx-react/native"


const { width, height } = Dimensions.get('window')

const MeetChance = inject("prey")(observer(({ prey }) => {

  const renderCookie = prey.preyList.map((prey)=>( <Cookie name={prey.displayName} photoURL={prey.photoURL} key={prey.uid}/> ))

  return(
    <View>
      <ScrollView style={{width, height}}>
          <View style = {{backgroundColor: "#e6e6fa", justifyContent: 'center', alignItems: 'center'}}>
            <Cookie/>
          </View>
          <View style = {{flexDirection: 'row', flexWrap: 'wrap', alignItems:'flex-start', backgroundColor: "#ff0000"}}> 
            { renderCookie }
          </View>        
      </ScrollView>
    </View>
  )
}))

export { MeetChance }