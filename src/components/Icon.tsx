import Svg, { Path, Rect, Circle } from 'react-native-svg';

type Props = { size?: number; color?: string };

// Helper: common stroke props to keep icon code DRY
const s = (color: string) => ({
  stroke: color,
  strokeWidth: 1.8 as number,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none' as const,
});

export const MailIcon = ({ size = 20, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x="3" y="5" width="18" height="14" rx="3" {...s(color)} />
    <Path d="m3.5 7 8.5 6 8.5-6" {...s(color)} />
  </Svg>
);

export const LockIcon = ({ size = 20, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x="4" y="10" width="16" height="10" rx="3" {...s(color)} />
    <Path d="M8 10V7a4 4 0 0 1 8 0v3" {...s(color)} />
  </Svg>
);

export const EyeIcon = ({ size = 20, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" {...s(color)} />
    <Circle cx="12" cy="12" r="3" {...s(color)} />
  </Svg>
);

export const AppleIcon = ({ size = 20, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.9-3-.8c-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.8 1.1 9 .7 1.1 1.6 2.3 2.8 2.3 1.1 0 1.5-.7 2.9-.7s1.7.7 2.9.7 2-1.1 2.7-2.1c.8-1.2 1.2-2.4 1.2-2.5-.1 0-2.3-.9-2.3-3.5ZM14.1 5.6c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.7-.9 2.8 1 0 2-.5 2.6-1.3Z" />
  </Svg>
);

// Google icon uses its own brand colors so it ignores the color prop
export const GoogleIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Z" />
    <Path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" />
    <Path fill="#FBBC05" d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1A10 10 0 0 0 2 12c0 1.6.4 3.2 1.1 4.6L6.4 14Z" />
    <Path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 12 2a10 10 0 0 0-8.9 5.4L6.4 10c.8-2.4 3-4.1 5.6-4.1Z" />
  </Svg>
);

export const MaleIcon = ({ size = 38, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="10" cy="14" r="5.5" {...s(color)} />
    <Path d="M14.2 9.8 20 4m0 0h-4.5M20 4v4.5" {...s(color)} />
  </Svg>
);

export const FemaleIcon = ({ size = 38, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="9" r="5.5" {...s(color)} />
    <Path d="M12 14.5V21m-3-3h6" {...s(color)} />
  </Svg>
);