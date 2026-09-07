import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Colors, Radius, Spacing } from '../../constants/theme';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
}

export function PrimaryButton({ title, style, ...props }: PrimaryButtonProps) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={[styles.btn, style]} {...props}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.light.backgroundSelected,
    borderRadius: Radius.button,
    paddingVertical: 14,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.light.textInverse,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});