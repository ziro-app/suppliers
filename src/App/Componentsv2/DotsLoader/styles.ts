import themes from '../themes';

const backgroundColor: { [index: string]: string } = {
  whiteDots: themes.gradient.secondary,
  blackDots: themes.gradient.primary,
};

export const container: React.CSSProperties = {
  display: 'flex',
  gridColumnGap: '10px',
  justifyContent: 'center',
};

export const dots: (dotsColor: string, dotsSize: string) => React.CSSProperties = (dotsColor, dotsSize) => ({
  width: dotsSize,
  height: dotsSize,
  borderRadius: '50%',
  background: backgroundColor[dotsColor] || dotsColor,
  opacity: '0.5',
  animation: 'effect 0.96s ease-in-out infinite',
});

export const dot1: React.CSSProperties = {
  animationDelay: '0s',
};

export const dot2: React.CSSProperties = {
  animationDelay: '0.32s',
};

export const dot3: React.CSSProperties = {
  animationDelay: '0.64s',
};
