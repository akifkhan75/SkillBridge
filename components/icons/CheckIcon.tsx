
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const CheckIcon: React.FC<SvgProps> = (props) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </Svg>
);
