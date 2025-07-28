
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const CalendarClockIcon: React.FC<SvgProps> = (props) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25M3 18.75A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75M3 18.75V7.5M3 10.5h18" />
    <Path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75v3m0-3a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    <Path strokeLinecap="round" strokeLinejoin="round" d="M10.5 14.25h3" />
  </Svg>
);
