import React, { PropsWithChildren, memo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

type Props = PropsWithChildren<{ style?: StyleProp<ViewStyle> }>;
export const Card = memo(({ children, style }: Props) => <View style={[styles.card, style]}>{children}</View>);
const styles = StyleSheet.create({ card: { backgroundColor: colors.surface, borderRadius: spacing.borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 2 } });
