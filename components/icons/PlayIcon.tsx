
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const PlayIcon: React.FC<SvgProps> = (props) => (
  <Svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <Path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </Svg>
);
