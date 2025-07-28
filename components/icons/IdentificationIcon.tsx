
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const IdentificationIcon: React.FC<SvgProps> = (props) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    <Path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6h-4.5m4.5 0v-2.25m0 2.25c0 .621-.504 1.125-1.125 1.125H3.375A1.125 1.125 0 012.25 18v-2.25m18 0A2.25 2.25 0 0018 13.5H6A2.25 2.25 0 003.75 15.75m16.5 0v-2.25" />
  </Svg>
);
