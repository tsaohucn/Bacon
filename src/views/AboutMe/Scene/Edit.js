import React from 'react'
import { View } from 'react-native'

const styles = {
  Edit: {
    flex: 1,
    padding: 10
  }
}

const Edit = (props) => {
  return (
    <View style = {styles.Edit }>
      { props.content }
    </View>
  )
}

export { Edit }