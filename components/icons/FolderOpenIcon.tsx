
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const FolderOpenIcon: React.FC<SvgProps> = (props) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12.75h0l-4.724 4.724a2.25 2.25 0 01-3.182 0l-4.724-4.724H4.51c-.88 0-1.704-.297-2.357-.825A2.25 2.25 0 011.5 15.625V10.5c0-1.036.84-1.875 1.875-1.875h.375c.621 0 1.125.504 1.125 1.125V15c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V10.875c0-.621.504-1.125 1.125-1.125h.375c1.036 0 1.875.84 1.875 1.875v4.875c0 .88-.297 1.704-.825 2.357A2.25 2.25 0 0119.5 21z" />
  </Svg>
);
