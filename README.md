# react-native-toast-popup

A lightweight and customizable React Native wrapper component for displaying swipeable animated toast messages. Built using `react-native-reanimated` and `react-native-gesture-handler`, it supports swipe gestures in multiple directions with smooth animations.

## Installation

Ensure you have the required dependencies installed:

```sh
npm install react-native-reanimated react-native-gesture-handler
```

Then, install the package:

```sh
npm install react-native-toast-popup
```

## Usage

App.tsx

```tsx
//Wrap your app like this
<GestureHandlerRootView>
  <ToastProvider>
    <App />
  </ToastProvider>
</GestureHandlerRootView>
```

## Example

```tsx
import { useToast } from "react-native-toast-popup";

const MyComponent = () => {
  const { showToast } = useToast();

  returnn(
    <View>
      <Button
        title="test"
        onPress={() =>
          showToast({
            onLeftSwipe: () => console.log("left"),
            containerStyle: {
              height: 100,
              width: "40%",
              alignSelf: "center",
              backgroundColor: "red",
              top: 100,
            },
            children: (
              <Image
                style={{ height: 100 }}
                source={{
                  uri: "https://images.unsplash.com/photo-1739932215472-15ebf0ab6cf4?q=80&w=3165&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                }}
              />
            ),
          })
        }
      />
    </View>
  );
};
```

## Props

| Prop                     | Type                                | Default      | Description                                            |
| ------------------------ | ----------------------------------- | ------------ | ------------------------------------------------------ |
| `children`               | `ReactNode`                         | `null`       | Content to display inside the toast.                   |
| `containerStyle`         | `ViewStyle`                         | `{}`         | Custom styles for the toast container.                 |
| `onLeftSwipe`            | `callback Fn`                       | `() => void` | Callback triggered when swiped left.                   |
| `onRightSwipe`           | `callback Fn`                       | `() => void` | Callback triggered when swiped right.                  |
| `onUpSwipe`              | `callback Fn`                       | `() => void` | Callback triggered when swiped up.                     |
| `onDownSwipe`            | `callback Fn`                       | `() => void` | Callback triggered when swiped down.                   |
| `swipeThreshold`         | `number`                            | `100`        | Minimum swipe distance required for dismissal.         |
| `initialDirection`       | `left ,right , up ,down`            | `down`       | Initial position of the toast before animation.        |
| `animateOutDuration`     | `number`                            | `500`        | Duration (in milliseconds) of the dismissal animation. |
| `disabledSwipeDirection` | `['top', 'right', 'up' , 'bottom']` | `[]`         | Takes an array of directions to disable swipes         |

## Contributing

Contributions are welcome! Feel free to submit a pull request or report any issues.
