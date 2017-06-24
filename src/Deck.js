import React from 'react'
import { View, Animated, PanResponder, Dimensions } from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCALE = 1.5
const SWIPE_OUT_DURATION = 250
const SWIPE_TRESHOLD = 0.25 * SCREEN_WIDTH

export default class Deck extends React.Component {
  static defaultProps = {
    onSwipeLeft : () => {},
    onSwipeRight : () => {}
  }
  constructor (props) {
    super(props)

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
          this.forceSwipe('right')
        } else if (gesture.dx < -SWIPE_TRESHOLD) {
          this.forceSwipe('left')
        } else {
          this.resetPosition(position)
        }
      }
    })

    this.state = {
      position: position,
      panResponder: panResponder,
      index: 0
    }
  }
  getCardStyle () {
    const rotate = this.state.position.x.interpolate({
      inputRange: [(-SCREEN_WIDTH) * SCALE, 0, SCREEN_WIDTH * SCALE],
      outputRange: ['-120deg', '0deg', '120deg']
    })
    return {
      ...this.state.position.getLayout(),
      transform: [{ rotate }]
    }
  }

  resetPosition () {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 }
    })
      .start()
  }
  forceSwipe (direction) {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH
    Animated.timing(this.state.position, {
      toValue: { x: x, y: 0 },
      duration: SWIPE_OUT_DURATION
    })
      .start(() => this.onSwipeComplete(direction))
  }
  onSwipeComplete (direction) {
    const { data, onSwipeLeft, onSwipeRight } = this.props
    const item = data[this.state.index]

    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item)
  }
  render () {
    return (
      <View>
        {this.props.data.map((item, index) => {
          if (index === 0) {
            return (
              <Animated.View
                key={item.id}
                style={this.getCardStyle()}
                {...this.state.panResponder.panHandlers}
              >
                {this.props.renderCard(item)}
              </Animated.View>
            )
          }
          return (
            <View key={item.id}>
              {this.props.renderCard(item)}
            </View>
          )
        })}
      </View>
    )
  }
}
