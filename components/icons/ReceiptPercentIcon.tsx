
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const ReceiptPercentIcon: React.FC<SvgProps> = (props) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-1.5h5.25m-5.25 0h3M9.75 6.375c0-1.036.84-1.875 1.875-1.875h.375c1.036 0 1.875.84 1.875 1.875v1.5c0 1.035-.84 1.875-1.875 1.875h-.375C10.59 9.75 9.75 8.91 9.75 7.875v-1.5zm0 0c0-1.036.84-1.875 1.875-1.875h.375c1.036 0 1.875.84 1.875 1.875v1.5c0 1.035-.84 1.875-1.875 1.875h-.375C10.59 9.75 9.75 8.91 9.75 7.875v-1.5zm0 0h.375m-1.5 0h.375m0 0h.375m0 0h.375M2.25 8.25V6a2.25 2.25 0 012.25-2.25h15A2.25 2.25 0 0121.75 6v12a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 18V8.25z" />
  </Svg>
);
