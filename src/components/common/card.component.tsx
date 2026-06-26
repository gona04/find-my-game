import React, { PropsWithChildren, memo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { spacingSize } from '../../theme/spacing';

type Props = PropsWithChildren<{ style?: StyleProp<ViewStyle> }>;
export const Card = memo(({ children, style }: Props) => <View style={[styles.card, style]}>{children}</View>);
const styles = StyleSheet.create({ card: { backgroundColor: colors.surface, borderRadius: spacingSize.ss_10, padding: spacingSize.ss_15, borderWidth: 1, borderColor: colors.shadeOfWhiteOne, shadowColor:colors.blackShadeOne, shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 2 } });
