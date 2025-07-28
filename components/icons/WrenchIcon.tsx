
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const WrenchIcon: React.FC<SvgProps> = (props) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.83-5.83M11.42 15.17L14.49 12.1C15.22 11.37 15.22 10.24 14.49 9.51L12.06 7.08C11.33 6.35 10.2 6.35 9.47 7.08L6.4 10.15M11.42 15.17L6.4 10.15M3.94 13.91c-1.31-1.31-1.31-3.43 0-4.74l2.47-2.47c1.31-1.31 3.43-1.31 4.74 0L13.91 9.51M3.94 13.91L9.51 19.48" />
  </Svg>
);
