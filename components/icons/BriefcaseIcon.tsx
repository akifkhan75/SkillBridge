
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const BriefcaseIcon: React.FC<SvgProps> = (props) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.073a2.25 2.25 0 01-2.25 2.25h-12a2.25 2.25 0 01-2.25-2.25V14.15M16.5 18.75h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008zM19.5 8.25V6a2.25 2.25 0 00-2.25-2.25h-10.5A2.25 2.25 0 004.5 6v2.25m15 0v3.75a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 12V8.25m15 0H4.5M12 6.375c.621 0 1.125-.504 1.125-1.125S12.621 4.125 12 4.125s-1.125.504-1.125 1.125S11.379 6.375 12 6.375z" />
  </Svg>
);
