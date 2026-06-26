import React, { memo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { fontSizes, spacingSize } from '../../theme/spacing';

type Props = { title: string; onPress: () => void; loading?: boolean; disabled?: boolean };
export const Button = memo(({ title, onPress, loading, disabled }: Props) => (
  <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled || loading} style={({ pressed }) => [styles.button, (pressed || disabled) && styles.dim]}>
    {loading ? <ActivityIndicator color={colors.surface} /> : <Text style={styles.text}>{title}</Text>}
  </Pressable>
));
const styles = StyleSheet.create({ button: { alignItems: 'center', backgroundColor: colors.yellow, borderRadius: spacingSize.ss_10, padding: spacingSize.ss_10 }, text: { color: colors.surface, fontSize: fontSizes.fs_16, fontWeight: '800' }, dim: { opacity: 0.72 } });
