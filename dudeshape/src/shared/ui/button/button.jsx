import { cn } from '@/shared/lib';
import styles from './button.module.css';

export function Button({ children, variant = 'dark', className, ...props }) {
  return (
    <button className={cn(styles.btn, styles[`btn--${variant}`], className)} {...props}>
      {children}
    </button>
  );
}
