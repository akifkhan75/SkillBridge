
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const MicrophoneIcon: React.FC<SvgProps> = (props) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15c-1.125 0-2.25-.282-3.219-.773M12 15c1.125 0 2.25-.282 3.219-.773M12 15V9M12 9C9 9 9 11.25 9 11.25S9 15 12 15z" />
  </Svg>
);
