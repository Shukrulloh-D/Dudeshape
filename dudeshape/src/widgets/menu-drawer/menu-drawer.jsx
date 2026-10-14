import { useNavigate } from 'react-router-dom';
import styles from './menu-drawer.module.css';

export function MenuDrawer({ isOpen, onClose, onOpenProfile, onOpenCart }) {
  if (!isOpen) return null;

  const goTo = (id) => {
    onClose();
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <aside className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.head}>
          <div className={styles.title}>Menu</div>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        <div className={styles.link} onClick={() => goTo('top')}>🏠 Home</div>
        <div className={styles.link} onClick={() => goTo('products')}>🛍 Products</div>
        <div className={styles.link} onClick={() => goTo('beauty')}>✨ About Us</div>
        <div className={styles.link} onClick={() => goTo('footer')}>📞 Contact Us</div>

        <div className={styles.divider} />

        <div className={styles.section}>Account</div>
        <div className={styles.link} onClick={() => { onClose(); onOpenProfile?.(); }}>
          👤 Profile
        </div>
        <div className={styles.link} onClick={() => { onClose(); onOpenCart?.(); }}>
          🛒 Cart
        </div>
      </aside>
    </div>
  );
}
