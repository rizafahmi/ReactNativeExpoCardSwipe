import React from 'react'
import { Animated, PanResponder } from 'react-native'

export default ({ data, renderCard }) => {
  const position = new Animated.ValueXY()
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      position.setValue({
        x: gesture.dx,
        y: gesture.dy
      })
    },
    onPanResponderRelease: () => {}
  })
  return (
    <Animated.View style={position.getLayout()} {...panResponder.panHandlers}>
      {data.map(item => renderCard(item))}
    </Animated.View>
  )
}
