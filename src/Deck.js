import React from 'react'
import { View, Animated, PanResponder, Dimensions } from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCALE = 1.5
const SWIPE_OUT_DURATION = 250

const getCardStyle = position => {
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

const forceSwipeRight = position => {
  Animated.timing(position, {
    toValue: { x: SCREEN_WIDTH, y: 0 },
    duration: SWIPE_OUT_DURATION
  })
    .start()
}

export default ({ data, renderCard }) => {
  const SWIPE_WIDTH = Dimensions.get('window').width
  const SWIPE_TRESHOLD = 0.25 * SWIPE_WIDTH
  const position = new Animated.ValueXY()

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      position.setValue({
        x: gesture.dx,
        y: gesture.dy
      })
    },
    onPanResponderRelease: (event, gesture) => {
      if (gesture.dx > SWIPE_TRESHOLD) {
        forceSwipeRight(position)
      } else if (gesture.dx < -SWIPE_TRESHOLD) {
        console.log('Swipe Left!')
      } else {
        resetPosition(position)
      }
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
