import { Container, Loader, ErrorMessage } from '@/shared/ui';
import { BrandItem } from '@/entities/brand';
import { useSection } from '@/shared/api';
import styles from './brands-strip.module.css';

export function BrandsStrip() {
  const { data, isLoading, error } = useSection('brands');

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.grid}>
          {data.map((brand) => (
            <BrandItem key={brand.id} brand={brand} />
          ))}
        </div>
      </Container>
    </section>
  );
}
