import React from 'react';
import { View, Image, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from './Text';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  source?: { uri: string } | number;
  imageUrl?: string | null;
  name?: string;
  size?: AvatarSize;
  style?: ViewStyle;
}

export const Avatar = ({ source: sourceProp, imageUrl, name, size = 'md', style }: AvatarProps) => {
  const source = sourceProp ?? (imageUrl ? { uri: imageUrl } : undefined);
  const theme = useTheme();

  let sizeInPixels = 40;
  let textVariant: 'bodySmall' | 'body' | 'h3' | 'h2' = 'body';

  switch (size) {
    case 'sm':
      sizeInPixels = 32;
      textVariant = 'bodySmall';
      break;
    case 'md':
      sizeInPixels = 48;
      textVariant = 'body';
      break;
    case 'lg':
      sizeInPixels = 64;
      textVariant = 'h3';
      break;
    case 'xl':
      sizeInPixels = 96;
      textVariant = 'h2';
      break;
  }

  const containerStyle: ViewStyle = {
    width: sizeInPixels,
    height: sizeInPixels,
    borderRadius: sizeInPixels / 2,
    backgroundColor: theme.colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  };

  const imageStyle: ImageStyle = {
    width: '100%',
    height: '100%',
  };

  if (source) {
    return (
      <View style={[containerStyle, style]}>
        <Image source={source} style={imageStyle} />
      </View>
    );
  }

  // Fallback to initials
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  return (
    <View style={[containerStyle, style]}>
      <Text variant={textVariant} weight="bold" color={theme.colors.textSecondary}>
        {initials}
      </Text>
    </View>
  );
};
