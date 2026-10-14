import styles from './error-message.module.css';

export function ErrorMessage({ message }) {
  return <div className={styles.wrap}>Failed to load: {message}</div>;
}
