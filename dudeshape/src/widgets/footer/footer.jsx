import { Container } from '@/shared/ui';
import styles from './footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer} id="footer">
      <Container>
        <div className={styles.grid}>
          <div>
            <div className={styles.brand}>Dudeshape</div>
            <p className={styles.brandDesc}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy
            </p>
          </div>

          <div>
            <div className={styles.colTitle}>Quick Link</div>
            <div className={styles.links}>
              <a href="#">Home</a>
              <a href="#products">Products</a>
              <a href="#beauty">About Us</a>
            </div>
          </div>

          <div>
            <div className={styles.colTitle}>Contact Us</div>
            <div className={styles.contactItem}>
              <a href="mailto:oyasimnaeem@email.com">oyasimnaeem@email.com</a>
            </div>
            <div className={styles.contactItem}>
              <a href="tel:+123456789">+123456789</a>
            </div>
            <div className={styles.socials}>
              <a href="#" aria-label="Facebook">
                <img src="/images/icon-facebook.png" alt="" />
              </a>
              <a href="#" aria-label="Twitter">
                <img src="/images/icon-twitter.png" alt="" />
              </a>
              <a href="#" aria-label="Instagram">
                <img src="/images/icon-instagram.png" alt="" />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          © 2024 Dudeshape. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
