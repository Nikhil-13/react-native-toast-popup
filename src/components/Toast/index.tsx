import { Dimensions, ViewStyle } from "react-native";
import React, { ReactNode, useEffect, useCallback } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { defaultStyles } from "./styles";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

type Direction = "left" | "right" | "up" | "down";

interface Props {
  children?: ReactNode;
  containerStyle?: ViewStyle;
  onLeftSwipe?: () => void;
  onRightSwipe?: () => void;
  onUpSwipe?: () => void;
  hideToastCallback?: () => void;
  onDownSwipe?: () => void;
  swipeThreshold?: number;
  initialDirection?: Direction;
  animateOutDuration?: number;
  disabledSwipeDirection?: Direction[];
}

const ToastMessage = ({
  children,
  containerStyle,
  onLeftSwipe,
  onRightSwipe,
  onUpSwipe,
  hideToastCallback,
  onDownSwipe,
  swipeThreshold = 100,
  initialDirection = "down",
  animateOutDuration = 500,
  disabledSwipeDirection = [],
}: Props) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Set initial position based on initialDirection
  useEffect(() => {
    if (initialDirection === "left") {
      translateX.value = -SCREEN_WIDTH;
    } else if (initialDirection === "right") {
      translateX.value = SCREEN_WIDTH;
    } else if (initialDirection === "up") {
      translateY.value = -SCREEN_HEIGHT;
    } else if (initialDirection === "down") {
      translateY.value = SCREEN_HEIGHT;
    }

    // Animate into place with spring effect
    translateX.value = withSpring(0, { damping: 15, stiffness: 100 });
    translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, [initialDirection]);

  // Memoized swipe completion callback
  const onSwipeComplete = useCallback(
    (direction: Direction) => {
      if (direction === "left") {
        onLeftSwipe?.();
      } else if (direction === "right") {
        onRightSwipe?.();
      } else if (direction === "up") {
        onUpSwipe?.();
      } else if (direction === "down") {
        onDownSwipe?.();
      }
      hideToastCallback?.();
    },
    [onLeftSwipe, onRightSwipe, onUpSwipe, onDownSwipe]
  );

  // Gesture handling
  const pan = Gesture.Pan()
    .minDistance(swipeThreshold / 2) // Ignore minor drags
    .onChange((event) => {
      if (!disabledSwipeDirection.includes("left") && event.translationX < 0) {
        translateX.value = event.translationX;
      } else if (
        !disabledSwipeDirection.includes("right") &&
        event.translationX > 0
      ) {
        translateX.value = event.translationX;
      }

      if (!disabledSwipeDirection.includes("up") && event.translationY < 0) {
        translateY.value = event.translationY;
      } else if (
        !disabledSwipeDirection.includes("down") &&
        event.translationY > 0
      ) {
        translateY.value = event.translationY;
      }
    })
    .onFinalize((event) => {
      let exitDirection: Direction | null = null;

      if (
        !disabledSwipeDirection.includes("left") &&
        event.translationX < -swipeThreshold
      ) {
        exitDirection = "left";
      } else if (
        !disabledSwipeDirection.includes("right") &&
        event.translationX > swipeThreshold
      ) {
        exitDirection = "right";
      } else if (
        !disabledSwipeDirection.includes("up") &&
        event.translationY < -swipeThreshold
      ) {
        exitDirection = "up";
      } else if (
        !disabledSwipeDirection.includes("down") &&
        event.translationY > swipeThreshold
      ) {
        exitDirection = "down";
      }

      if (exitDirection) {
        // Animate out
        if (exitDirection === "left") {
          translateX.value = withTiming(
            -SCREEN_WIDTH,
            { duration: animateOutDuration },
            () => runOnJS(onSwipeComplete)("left")
          );
        } else if (exitDirection === "right") {
          translateX.value = withTiming(
            SCREEN_WIDTH,
            { duration: animateOutDuration },
            () => runOnJS(onSwipeComplete)("right")
          );
        } else if (exitDirection === "up") {
          translateY.value = withTiming(
            -SCREEN_HEIGHT,
            { duration: animateOutDuration },
            () => runOnJS(onSwipeComplete)("up")
          );
        } else if (exitDirection === "down") {
          translateY.value = withTiming(
            SCREEN_HEIGHT,
            { duration: animateOutDuration },
            () => runOnJS(onSwipeComplete)("down")
          );
        }
      } else {
        // If no swipe, reset position
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
      }
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ] as const,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[defaultStyles.root, animatedStyles, containerStyle]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

export default ToastMessage;
