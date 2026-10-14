import { Container, Loader, ErrorMessage } from '@/shared/ui';
import { ReviewBlock } from '@/entities/review';
import { useSection } from '@/shared/api';
import styles from './perfect-beauty.module.css';

export function PerfectBeauty() {
  const beauty = useSection('beauty');
  const reviews = useSection('reviews');

  if (beauty.isLoading || reviews.isLoading) return <Loader />;
  if (reviews.error) return <ErrorMessage message={reviews.error.message} />;

  const beautyImage = beauty.data?.image || '/images/beauty.png';

  return (
    <section className={styles.section} id="beauty">
      <Container>
        <div className={styles.top}>
          <div>
            <h2 className={styles.title}>The Perfect Beauty Of You</h2>
            <p className={styles.text}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
              when an unknown printer took a galley of type and scrambled it to make a type
              specimen book.
            </p>
            <p className={styles.text}>
              It has survived not only five centuries, but also the leap into electronic
              typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text
              of the printing and typesetting industry.
            </p>
            <button className={styles.shopBtn}>Shop Now</button>
          </div>

          <img className={styles.image} src={beautyImage} alt="Perfect Beauty" />
        </div>

        <ReviewBlock reviews={reviews.data} />
      </Container>
    </section>
  );
}
