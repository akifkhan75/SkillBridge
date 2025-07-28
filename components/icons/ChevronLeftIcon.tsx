import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { I18nManager } from 'react-native';

export const ChevronLeftIcon: React.FC<SvgProps> = (props) => (
  <Svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : {}}
    {...props}
  >
    <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </Svg>
);
