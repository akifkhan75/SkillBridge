
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const BookmarkIcon: React.FC<SvgProps> = (props) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H7.5A2.25 2.25 0 005.25 6v13.5a.75.75 0 001.125.625L12 18l5.375 2.625a.75.75 0 001.125-.625V6A2.25 2.25 0 0016.5 3.75z" />
  </Svg>
);
