
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const PresentationChartLineIcon: React.FC<SvgProps> = (props) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12A2.25 2.25 0 0020.25 14.25V3M3.75 14.25V3M3.75 3L12 12m0 0l2.25 2.25M12 12l-2.25 2.25M12 12l2.25-2.25M12 12l-2.25-2.25M3 18.75h18" />
  </Svg>
);
