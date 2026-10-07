import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bodyLarge'
  | 'body'
  | 'bodySmall'
  | 'caption';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string; // Optional hex or theme key (handled internally)
  align?: 'left' | 'center' | 'right' | 'justify';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
}

export const Text = ({
  variant = 'body',
  color,
  align = 'left',
  weight,
  style,
  children,
  ...props
}: TextProps) => {
  const theme = useTheme();

  let fontSize = theme.fontSize.base;
  let defaultWeight = theme.fontWeight.normal;

  switch (variant) {
    case 'h1':
      fontSize = theme.fontSize['4xl'];
      defaultWeight = theme.fontWeight.bold;
      break;
    case 'h2':
      fontSize = theme.fontSize['3xl'];
      defaultWeight = theme.fontWeight.bold;
      break;
    case 'h3':
      fontSize = theme.fontSize.xl;
      defaultWeight = theme.fontWeight.semibold;
      break;
    case 'bodyLarge':
      fontSize = theme.fontSize.lg;
      break;
    case 'body':
      fontSize = theme.fontSize.base;
      break;
    case 'bodySmall':
      fontSize = theme.fontSize.sm;
      break;
    case 'caption':
      fontSize = theme.fontSize.xs;
      break;
  }

  const activeWeight = weight || defaultWeight;
  const textColor = color || theme.colors.textPrimary;

  // Map font weight to Inter font family
  let fontFamily = 'Inter_400Regular';
  switch (activeWeight) {
    case '500':
      fontFamily = 'Inter_500Medium';
      break;
    case '600':
      fontFamily = 'Inter_600SemiBold';
      break;
    case '700':
      fontFamily = 'Inter_700Bold';
      break;
    case '800':
      fontFamily = 'Inter_800ExtraBold';
      break;
  }

  return (
    <RNText
      style={[
        {
          fontSize,
          color: textColor,
          textAlign: align,
          fontFamily,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};
