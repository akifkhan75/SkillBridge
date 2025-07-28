
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const RectangleStackIcon: React.FC<SvgProps> = (props) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-3.75 2.018M21.75 12l-4.179-2.25M17.571 14.25l-5.571 3-5.571-3M6.429 14.25L2.25 12l4.179-2.25m11.142 0l4.179 2.25-4.179 2.25M12 21.75l-4.179-2.25L12 17.25l4.179 2.25L12 21.75z" />
  </Svg>
);
