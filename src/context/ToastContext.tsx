import React, { createContext, useContext, useState, ReactNode } from "react";
import ToastMessage from "../components/Toast";

type Direction = "left" | "right" | "up" | "bottom";

type ToastProps = {
  id: string; // Unique ID for each swipe instance
  children?: ReactNode;
  containerStyle?: object;
  initialDirection?: Direction;
  swipeThreshold?: number;
  animateOutDuration?: number;
  disabledSwipeDirection?: Direction[];
  onSwipeComplete?: () => void;
  onLeftSwipe?: () => void;
  onRightSwipe?: () => void;
  onUpSwipe?: () => void;
  onDownSwipe?: () => void;
};

type ToastContextType = {
  showToast: (props: Omit<ToastProps, "id">) => string; // Returns an ID
  hideToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [swipes, setSwipes] = useState<ToastProps[]>([]);

  // Function to add a new swipeable component
  const showToast = (props: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).slice(2, 9); // Unique ID
    setSwipes((prev) => [...prev, { ...props, id }]);
    return id; // Return ID so it can be used for removal
  };

  // Function to remove a swipeable component by ID
  const hideToast = (id: string) => {
    setSwipes((prev) => prev.filter((swipe) => swipe.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {swipes.map(({ id, ...props }) => (
        <ToastMessage
          key={id}
          {...props}
          hideToastCallback={() => hideToast(id)}
        />
      ))}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useSwipe must be used within a SwipeProvider");
  }
  return context;
};
