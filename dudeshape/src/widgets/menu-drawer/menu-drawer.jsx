import styles from './menu-drawer.module.css';

const SCROLL_LINKS = [
  { id: 'top', label: '🏠 Home' },
  { id: 'products', label: '🛍 Products' },
  { id: 'beauty', label: '✨ About Us' },
  { id: 'footer', label: '📞 Contact Us' },
];

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

        {SCROLL_LINKS.map((link) => (
          <div key={link.id} className={styles.link} onClick={() => goTo(link.id)}>
            {link.label}
          </div>
        ))}

        <div className={styles.divider} />
        <div className={styles.label}>Account</div>

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
