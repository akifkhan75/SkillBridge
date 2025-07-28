
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const WrenchScrewdriverIcon: React.FC<SvgProps> = (props) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.83-5.83M11.42 15.17L14.49 12.1C15.22 11.37 15.22 10.24 14.49 9.51L12.06 7.08C11.33 6.35 10.2 6.35 9.47 7.08L6.4 10.15m0 0l-2.25 2.25M11.42 15.17l2.25-2.25M6.4 10.15L9.47 7.08m5.023 5.023L17.25 21M3.75 3.75L21 21" />
    <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 8.25L10.5 3 6 7.5 11.25 12.75 15.75 8.25z" />
  </Svg>
);
