import React from 'react'
import { View, Animated, PanResponder } from 'react-native'

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
    <View>
      {data.map((item, index) => {
        if (index === 0) {
          return (
            <Animated.View
              key={item.id}
              style={position.getLayout()}
              {...panResponder.panHandlers}
            >
              {renderCard(item)}
            </Animated.View>
          )
        }
        return (
          <View key={item.id}>
            {renderCard(item)}
          </View>
        )
      })}
    </View>
  )
}
