import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface Props {
  isActive: boolean;
}

export const LiveWaveform: React.FC<Props> = ({ isActive }) => {
  const anim1 = useRef(new Animated.Value(6)).current;
  const anim2 = useRef(new Animated.Value(14)).current;
  const anim3 = useRef(new Animated.Value(22)).current;
  const anim4 = useRef(new Animated.Value(12)).current;
  const anim5 = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    if (!isActive) {
      anim1.setValue(6);
      anim2.setValue(8);
      anim3.setValue(10);
      anim4.setValue(8);
      anim5.setValue(6);
      return;
    }

    const createPulse = (val: Animated.Value, min: number, max: number, duration: number) => {
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
    };

    const p1 = createPulse(anim1, 6, 26, 320);
    const p2 = createPulse(anim2, 8, 36, 400);
    const p3 = createPulse(anim3, 10, 44, 280);
    const p4 = createPulse(anim4, 8, 32, 360);
    const p5 = createPulse(anim5, 6, 24, 450);

    p1.start();
    p2.start();
    p3.start();
    p4.start();
    p5.start();

    return () => {
      p1.stop();
      p2.stop();
      p3.stop();
      p4.stop();
      p5.stop();
    };
  }, [isActive]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bar, { height: anim1 }]} />
      <Animated.View style={[styles.bar, { height: anim2 }]} />
      <Animated.View style={[styles.bar, { height: anim3, backgroundColor: '#2563EB' }]} />
      <Animated.View style={[styles.bar, { height: anim4 }]} />
      <Animated.View style={[styles.bar, { height: anim5 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    gap: 4,
  },
  bar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: '#3B82F6',
  },
});

