
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const PaintBrushIcon: React.FC<SvgProps> = (props) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.39m3.421 3.42a15.995 15.995 0 004.764-4.764l3.876-3.876a1.5 1.5 0 00-2.121-2.121l-3.876 3.876a15.995 15.995 0 00-4.764 4.764m-3.42-3.42a15.995 15.995 0 00-4.764-4.764L3.876 7.732a1.5 1.5 0 00-2.121 2.121l3.876 3.876a15.995 15.995 0 004.764 4.764z" />
  </Svg>
);
