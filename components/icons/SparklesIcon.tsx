
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const SparklesIcon: React.FC<SvgProps> = (props) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 7.5l1.406-1.406a1.875 1.875 0 00-2.652-2.652L15.594 5.188m2.656 2.312l-1.406 1.406a1.875 1.875 0 01-2.652 2.652L12.094 10.188m5.006-2.688l.28-.28A1.875 1.875 0 0017.094 5.5m0 2.294l-.28.28m0 0l-.28.28m2.846.814L18.75 9M12 15.75L11.188 14.406m1.406 1.406L12 15.75M8.25 12L7.438 10.656m1.406 1.406L8.25 12m0 0L7.438 13.344m1.406-1.406L8.25 12" />
  </Svg>
);
