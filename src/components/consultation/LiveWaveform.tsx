import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface Props {
  isActive: boolean;
}

// 25-bar symmetrical soundwave matching screenshot
const BASE_HEIGHTS = [
  4, 8, 16, 24, 18, 12, 16, 22, 28, 22, 18, 24, 28, 24, 18, 22, 28, 22, 16, 12, 18, 24, 16, 8, 4,
];

export const LiveWaveform: React.FC<Props> = ({ isActive }) => {
  const animatedValues = useRef(
    BASE_HEIGHTS.map((h) => new Animated.Value(h))
  ).current;

  useEffect(() => {
    if (!isActive) {
      animatedValues.forEach((val, i) => {
        Animated.timing(val, {
          toValue: Math.max(4, BASE_HEIGHTS[i] * 0.4),
          duration: 250,
          useNativeDriver: false,
        }).start();
      });
      return;
    }

    const loops = animatedValues.map((val, i) => {
      const base = BASE_HEIGHTS[i];
      const max = Math.min(32, Math.max(14, base * 1.35));
      const min = Math.max(3, base * 0.45);
      const duration = 280 + (i % 5) * 60;

      return Animated.loop(
        Animated.sequence([
          Animated.timing(val, {
            toValue: max,
            duration,
            useNativeDriver: false,
          }),
          Animated.timing(val, {
            toValue: min,
            duration,
            useNativeDriver: false,
          }),
        ])
      );
    });

    loops.forEach((l) => l.start());

    return () => {
      loops.forEach((l) => l.stop());
    };
  }, [isActive]);

  return (
    <View style={styles.container}>
      {animatedValues.map((heightVal, idx) => (
        <Animated.View
          key={idx}
          style={[
            styles.bar,
            {
              height: heightVal,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    marginVertical: 12,
  },
  bar: {
    width: 3.2,
    backgroundColor: '#2563EB',
    borderRadius: 2,
    marginHorizontal: 1.8,
  },
});
