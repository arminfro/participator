import { useMedia } from 'react-use';

export default function useMobile() {
  const isMobile = !useMedia('(min-width: 640px)');
  console.log({ isMobile });
  return {
    isMobile,
    layoutPadding: { x: isMobile ? 20 : 50, y: isMobile ? 10 : 30 },
  };
}
