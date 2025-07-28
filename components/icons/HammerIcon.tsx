
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const HammerIcon: React.FC<SvgProps> = (props) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M11.418 2.146a.75.75 0 01.217.062l4.5 2.25a.75.75 0 01.365.642V10.5a.75.75 0 01-.75.75h-2.134a.75.75 0 00-.67.417l-.842 1.402a.75.75 0 01-1.314.05L9.67 11.317a.75.75 0 00-.67-.417H6.75a.75.75 0 01-.75-.75V5.099a.75.75 0 01.365-.642l4.5-2.25a.75.75 0 01.553-.051zM5.25 12.75V15a2.25 2.25 0 002.25 2.25h3v2.25a.75.75 0 001.5 0V17.25h3A2.25 2.25 0 0018.75 15v-2.25H5.25z" />
  </Svg>
);
