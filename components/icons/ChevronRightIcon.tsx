import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { I18nManager } from 'react-native';

export const ChevronRightIcon: React.FC<SvgProps> = (props) => (
  <Svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : {}}
    {...props}
  >
    <Path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </Svg>
);
