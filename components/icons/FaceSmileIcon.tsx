
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const FaceSmileIcon: React.FC<SvgProps> = (props) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4.06 4.06 0 01-5.656 0M9 10.5h.008v.008H9v-.008zm6 0h.008v.008h-.008v-.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </Svg>
);
