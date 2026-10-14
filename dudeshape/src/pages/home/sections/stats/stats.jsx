import { Container, Loader, ErrorMessage } from '@/shared/ui';
import { StatItem } from '@/entities/stat';
import { useSection } from '@/shared/api';
import styles from './stats.module.css';

export function Stats() {
  const { data, isLoading, error } = useSection('stats');

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!data?.length) return null;

  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.grid}>
          {data.map((stat) => (
            <StatItem key={stat.id} stat={stat} />
          ))}
        </div>
      </Container>
    </section>
  );
}
