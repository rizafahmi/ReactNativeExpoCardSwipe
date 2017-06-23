import React from 'react'
import { View, Animated } from 'react-native'

export default ({ data, renderCard }) => {
  return (
    <View>
      {data.map(item => renderCard(item))}
    </View>
  )
}
