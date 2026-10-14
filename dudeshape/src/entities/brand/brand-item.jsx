import styles from './brand-item.module.css';

export function BrandItem({ brand }) {
  return (
    <div className={styles.item}>
      <img src={brand.logo} alt={brand.name} />
    </div>
  );
}
