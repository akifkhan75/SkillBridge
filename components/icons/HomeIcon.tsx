
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const HomeIcon: React.FC<SvgProps> = (props) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a.75.75 0 011.06 0l8.955 8.955a.75.75 0 01-1.06 1.06l-1.542-1.542V21a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V11.518l-1.542 1.542a.75.75 0 01-1.06-1.06z" />
  </Svg>
);
