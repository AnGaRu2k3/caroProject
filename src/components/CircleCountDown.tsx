import { useEffect, useState, FC, ReactNode } from 'react';
import styles from '../styles/CircleCountDown.module.scss';

interface CircleCountDownProps {
  time: number;
  size: number;
  strokeWidth: number;
  onComplete?: VoidFunction;
  strokeLinecap?: 'butt' | 'round' | 'square' | 'inherit' | undefined;
  children?: ReactNode;
}

const CircleCountDown: FC<CircleCountDownProps> = ({
  time,
  size,
  strokeWidth,
  onComplete,
  strokeLinecap = 'round',
  children,
}) => {
  const radius = size / 2;
  const milliseconds = time * 1000;
  const circumference = size * Math.PI;

  const [countdown, setCountdown] = useState(milliseconds);
  const [startTime, setStartTime] = useState(Date.now());

  const strokeDashoffset = circumference - (countdown / milliseconds) * circumference;

  const getColor = () => {
    const percentage = countdown / milliseconds;
    const transitionPoint = 0.2;

    if (percentage > transitionPoint) {
      const green = 238;
      const red = 0;
      return `rgb(${red}, ${green}, 0)`;
    } else {
      const green = 0;
      const red = 238;
      return `rgb(${red}, ${green}, 0)`;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(milliseconds - elapsed, 0);

      setCountdown(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onComplete && onComplete();
      }
    }, 10);

    return () => clearInterval(interval);
  }, [milliseconds, startTime, onComplete]);

  return (
    <div className={styles.root} style={{ width: size, height: size }}>
      <div className={styles.countDownContainer}>
        <svg className={styles.svg} width={size} height={size}>
          <circle
            fill="none"
            r={radius}
            cx={radius}
            cy={radius}
            stroke={getColor()}
            strokeWidth={strokeWidth}
            strokeLinecap={strokeLinecap}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        {children && (
          <div className={styles.childrenContainer}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default CircleCountDown;
