import { AccessibilityRole } from 'react-native';

export function getA11yProps(label: string, role: AccessibilityRole = 'button') {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityRole: role,
  };
}
