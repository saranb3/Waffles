import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function LockIcon({ size = 40, style }: { size?: number; style?: any }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none" style={style}>
      <Path
        d="M96 224V160C96 97.31 145.31 48 208 48C270.69 48 320 97.31 320 160V224"
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M400 224H112C85.49 224 64 245.49 64 272V432C64 458.51 85.49 480 112 480H400C426.51 480 448 458.51 448 432V272C448 245.49 426.51 224 400 224Z"
        fill="rgba(0,0,0,0.25)"
      />
    </Svg>
  );
} 