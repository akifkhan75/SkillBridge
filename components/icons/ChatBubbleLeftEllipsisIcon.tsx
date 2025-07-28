
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const ChatBubbleLeftEllipsisIcon: React.FC<SvgProps> = (props) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.03.072-1.137.06-2.26.095-3.389.122C12.743 17.25 10.5 19.5 7.5 19.5c-3 0-5.25-2.25-5.25-5.25v-4.286c0-.97.616-1.813 1.5-2.097C4.611 8.226 5.555 8 6.555 8h10.99c1 0 1.944.226 2.705.511zM8.25 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </Svg>
);
