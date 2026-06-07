import Svg, { Path, Rect, Circle, Polyline } from 'react-native-svg';

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

export const FlameIcon = ({ size = 26, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 3c.5 3-2 4.2-2 6.5C10 11 11 12 11 12s.5-1 .5-2.5C13 11 15 12.2 15 15a4 4 0 0 1-8 0c0-1.4.6-2.6 1.2-3.6C8.8 13 9 14 9 14" {...s(color)} strokeWidth={1.7} />
    <Path d="M14.5 6.5c2 1.6 3.5 4 3.5 7a6 6 0 0 1-12 0c0-1 .2-1.8.5-2.6" {...s(color)} strokeWidth={1.7} />
  </Svg>
);

export const MuscleIcon = ({ size = 26, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M4 9.5v5M7 7.5v9M17 7.5v9M20 9.5v5M7 12h10" {...s(color)} strokeWidth={1.9} />
  </Svg>
);

export const HeartIcon = ({ size = 26, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 20s-7-4.4-7-9.3A3.7 3.7 0 0 1 12 8a3.7 3.7 0 0 1 7 2.7C19 15.6 12 20 12 20Z" {...s(color)} strokeWidth={1.7} />
    <Path d="M5 13h3l1.5-2.5L11.5 15 13 12h6" {...s(color)} strokeWidth={1.7} />
  </Svg>
);

export const CheckIcon = ({ size = 14, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Polyline
      points="20 6 9 17 4 12"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);


// Tab bar icons
export const HomeIcon = ({ size = 24, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M4 11 12 4l8 7" {...s(color)} />
    <Path d="M6 9.5V20h12V9.5" {...s(color)} />
  </Svg>
);

export const DumbbellIcon = ({ size = 24, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M3 9.5v5M6 7.5v9M18 7.5v9M21 9.5v5M6 12h12" {...s(color)} strokeWidth={1.9} />
  </Svg>
);

export const NutritionIcon = ({ size = 24, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 8c-1.5-2.8-5.5-3-7 0-1.4 2.8.6 8 3 10 1.2 1 2.8 1 4 0 2.4-2 4.4-7.2 3-10-1.5-3-5.5-2.8-7 0" {...s(color)} />
    <Path d="M12 8c0-2 1-3.5 3-4" {...s(color)} />
  </Svg>
);

export const BarChartIcon = ({ size = 24, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M4 19V5" {...s(color)} />
    <Path d="M4 19h16" {...s(color)} />
    <Rect x="7" y="11" width="3" height="5" rx="1" {...s(color)} />
    <Rect x="12.5" y="7" width="3" height="9" rx="1" {...s(color)} />
    <Rect x="18" y="13" width="3" height="3" rx="1" {...s(color)} />
  </Svg>
);

export const UserIcon = ({ size = 24, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="8" r="3.6" {...s(color)} />
    <Path d="M5 20a7 7 0 0 1 14 0" {...s(color)} />
  </Svg>
);

// Home screen icons
export const BellIcon = ({ size = 22, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" {...s(color)} />
    <Path d="M13.7 21a2 2 0 0 1-3.4 0" {...s(color)} />
  </Svg>
);

// PlayIcon uses fill, not stroke, so s() is not used here
export const PlayIcon = ({ size = 20, color = '#fff' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M8 5.5v13l11-6.5z" fill={color} />
  </Svg>
);

export const DropletIcon = ({ size = 18, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 3s6 6.3 6 11a6 6 0 0 1-12 0c0-4.7 6-11 6-11Z" {...s(color)} />
  </Svg>
);

export const BoltIcon = ({ size = 18, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" {...s(color)} />
  </Svg>
);

export const ChevronRightIcon = ({ size = 20, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Polyline points="9 6 15 12 9 18" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

export const TrophyIcon = ({ size = 24, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" {...s(color)} />
    <Path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 19h6M12 14v5" {...s(color)} />
  </Svg>
);


export const SearchIcon = ({ size = 22, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="11" cy="11" r="7" {...s(color)} strokeWidth={1.9} />
    <Path d="m20 20-3.5-3.5" {...s(color)} strokeWidth={1.9} />
  </Svg>
);

export const SunriseIcon = ({ size = 24, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 3v3M5 9l1.6 1.6M19 9l-1.6 1.6M2 18h20M4.5 14a7.5 7.5 0 0 1 15 0" {...s(color)} />
  </Svg>
);

export const BowlIcon = ({ size = 24, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M3 11h18a8 8 0 0 1-8 8H11a8 8 0 0 1-8-8Z" {...s(color)} />
    <Path d="M9 7c0-1.5 1-2 1.5-3M13.5 7c0-1.5 1-2 1.5-3" {...s(color)} />
  </Svg>
);

export const CookieIcon = ({ size = 24, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 3a9 9 0 1 0 9 9 3.2 3.2 0 0 1-4-4 3.2 3.2 0 0 1-5-5Z" {...s(color)} />
    <Path d="M9.5 12.5h.01M14 14.5h.01M11 16.5h.01" {...s(color)} strokeWidth={2.5} />
  </Svg>
);

export const PlusIcon = ({ size = 18, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 5v14M5 12h14" {...s(color)} strokeWidth={2.1} />
  </Svg>
);

export const CaretDownIcon = ({ size = 14, color = '#fff' }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Polyline points="6 9 12 15 18 9" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);