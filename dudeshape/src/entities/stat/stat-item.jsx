import styles from './stat-item.module.css';

export function StatItem({ stat }) {
  return (
    <div className={styles.item}>
      <div className={styles.value}>{stat.value}</div>
      <div className={styles.label}>{stat.label}</div>
    </div>
  );
}
