import { useState } from 'react';
import { Container, Loader, ErrorMessage } from '@/shared/ui';
import { useSection } from '@/shared/api';
import styles from './hero.module.css';

export function Hero({ onSearch }) {
  const { data, isLoading, error } = useSection('banners');
  const [slide, setSlide] = useState(0);
  const [query, setQuery] = useState('');

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!data?.length) return null;

  const total = data.length;
  const banner = data[slide];

  const next = () => setSlide((s) => (s + 1) % total);
  const prev = () => setSlide((s) => (s - 1 + total) % total);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch?.(query.trim());
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.left}>
            <h1 className={styles.title} key={banner.id}>{banner.title}</h1>
            <p className={styles.subtitle}>{banner.description}</p>

            <form className={styles.searchRow} onSubmit={handleSearch}>
              <input
                className={styles.searchInput}
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className={styles.searchBtn} type="submit" aria-label="Search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </form>

            <button className={styles.shopBtn}>Shop Now</button>
          </div>

          <div className={styles.right}>
            <img src={banner.image} alt={banner.title} />
            <div className={styles.arrows}>
              <button className={styles.arrow} onClick={prev} aria-label="Previous">‹</button>
              <span className={styles.counter}>{slide + 1} / {total}</span>
              <button className={styles.arrow} onClick={next} aria-label="Next">›</button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
