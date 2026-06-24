import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

export const StreamingIndicator = memo(({ status }: { status: string }) => {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => { const loop = Animated.loop(Animated.sequence([Animated.timing(pulse, { toValue: 1, duration: 550, useNativeDriver: true }), Animated.timing(pulse, { toValue: 0, duration: 550, useNativeDriver: true })])); loop.start(); return () => loop.stop(); }, [pulse]);
  return <View style={styles.wrap}><Text style={styles.text}>{status || 'Thinking'}</Text><Animated.Text style={[styles.dots, { opacity: pulse }]}>...</Animated.Text></View>;
});
const styles = StyleSheet.create({ wrap: { flexDirection: 'row', justifyContent: 'center', padding: spacing.md }, text: { color: colors.primary, fontWeight: '800' }, dots: { color: colors.primary, fontWeight: '900' } });
