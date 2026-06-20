import { useLottie } from 'lottie-react';
import loadingAnimation from '@/assets/loading.json';

export function LoadingAnimation({ className = 'h-32 w-32' }) {
  const { View } = useLottie({
    animationData: loadingAnimation,
    loop: true,
  });

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {View}
    </div>
  );
}
