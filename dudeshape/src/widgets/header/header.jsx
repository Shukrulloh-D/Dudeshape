import { useState } from 'react';
import { Container } from '@/shared/ui';
import { useCart, useUser } from '@/shared/lib';
import { CartModal } from '@/widgets/cart-modal';
import { ProfileModal } from '@/widgets/profile-modal';
import { MenuDrawer } from '@/widgets/menu-drawer';
import styles from './header.module.css';

const NAV = [
  { label: 'Home', href: '#top' },
  { label: 'Products', href: '#products' },
  { label: 'About Us', href: '#beauty' },
  { label: 'Contact Us', href: '#footer' },
];

export function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { count } = useCart();
  const { user } = useUser();

  return (
    <>
      <header className={styles.header} id="top">
        <Container>
          <div className={styles.inner}>
            <a href="#top" className={styles.logo}>Dudeshape</a>

            <nav className={styles.nav}>
              {NAV.map((item) => (
                <a key={item.label} href={item.href}>{item.label}</a>
              ))}
            </nav>

            <div className={styles.actions}>
              <button
                className={styles.iconBtn}
                onClick={() => setProfileOpen(true)}
                aria-label="Account"
              >
                {user ? (
                  <div className={styles.userBadge}>
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                ) : (
                  <img src="/images/icon-user.png" alt="" />
                )}
              </button>

              <button
                className={styles.iconBtn}
                onClick={() => setCartOpen(true)}
                aria-label="Cart"
              >
                <img src="/images/icon-cart.png" alt="" />
                {count > 0 && <span className={styles.badge}>{count}</span>}
              </button>

              <button
                className={styles.iconBtn}
                onClick={() => setMenuOpen(true)}
                aria-label="Menu"
              >
                <img src="/images/icon-menu.png" alt="" />
              </button>
            </div>
          </div>
        </Container>
      </header>

      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <MenuDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenCart={() => setCartOpen(true)}
      />
    </>
  );
}
