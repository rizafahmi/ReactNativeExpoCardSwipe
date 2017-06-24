import React from 'react'
import { View, Animated, PanResponder, Dimensions } from 'react-native'

const getCardStyle = position => {
  const SCREEN_WIDTH = Dimensions.get('window').width
  const SCALE = 1.5
  const rotate = position.x.interpolate({
    inputRange: [(-SCREEN_WIDTH) * SCALE, 0, SCREEN_WIDTH * SCALE],
    outputRange: ['-120deg', '0deg', '120deg']
  })
  return {
    ...position.getLayout(),
    transform: [{ rotate }]
  }
}

const resetPosition = position => {
  Animated.spring(position, {
    toValue: { x: 0, y: 0 }
  })
    .start()
}

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
    onPanResponderRelease: () => {
      resetPosition(position)
    }
  })
  return (
    <View>
      {data.map((item, index) => {
        if (index === 0) {
          return (
            <Animated.View
              key={item.id}
              style={getCardStyle(position)}
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
