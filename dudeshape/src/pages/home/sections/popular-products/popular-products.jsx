import { Container, Loader, ErrorMessage, SectionTitle } from '@/shared/ui';
import { ProductCard } from '@/entities/product';
import { useSection } from '@/shared/api';
import styles from './popular-products.module.css';

export function PopularProducts({ search = '' }) {
  const { data, isLoading, error } = useSection('products');

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!data?.length) return null;

  const filtered = search
    ? data.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    : data;

  return (
    <section className={styles.section} id="products">
      <Container>
        <div className={styles.head}>
          <div className={styles.headLeft}>
            <SectionTitle>Our Popular Product</SectionTitle>
            <p className={styles.subtitle}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy
            </p>
          </div>

          <a href="#" className={styles.discoverLink}>
            Discover Our Products <span>→</span>
          </a>
        </div>

        {search && (
          <div className={styles.searchInfo}>
            Search result for «{search}» — {filtered.length} item(s)
          </div>
        )}

        {filtered.length === 0 ? (
          <p className={styles.empty}>Nothing found</p>
        ) : (
          <div className={styles.grid}>
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
