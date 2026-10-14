import { cn } from '@/shared/lib';
import styles from './container.module.css';

export function Container({ children, className }) {
  return <div className={cn(styles.container, className)}>{children}</div>;
}
