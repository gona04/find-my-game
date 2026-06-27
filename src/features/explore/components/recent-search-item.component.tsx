import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../theme/colors';
import { spacingSize, fontSizes } from '../../../theme/spacing';

type Props = {
  label: string;
  onPress: (label: string) => void;
};

export const RecentSearchItem = memo(({ label, onPress }: Props) => (
  <TouchableOpacity style={styles.row} onPress={() => onPress(label)}>
    <Text style={styles.text}>{label}</Text>
    <Text style={styles.arrow}>→</Text>
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.surface,
    borderRadius: spacingSize.ss_12,
    paddingVertical: spacingSize.ss_12,
    paddingHorizontal: spacingSize.ss_12,
    marginBottom: spacingSize.ss_8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: colors.blackShadeOne,
    fontWeight: '700',
    fontSize: fontSizes.fs_14,
  },
  arrow: {
    color: colors.blackShadeOne,
    fontWeight: '700',
    fontSize: fontSizes.fs_14,
  },
});
