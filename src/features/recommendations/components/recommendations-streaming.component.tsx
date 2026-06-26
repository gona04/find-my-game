import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export const StreamingIndicator = memo(({ status }: { status: string }) => {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 550, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 550, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View style={styles.card}>
      <Text style={styles.text}>{status || 'Thinking'}</Text>
      <Animated.Text style={[styles.dots, { opacity: pulse }]}>...</Animated.Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: { padding: 15, borderRadius: 16, backgroundColor: '#E9FFD7', marginBottom: 18, flexDirection: 'row', justifyContent: 'center' },
  text: { color: '#050505', fontWeight: 'bold' },
  dots: { color: '#050505', fontWeight: 'bold' },
});
