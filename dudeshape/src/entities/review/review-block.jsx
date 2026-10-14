import { useState } from 'react';
import styles from './review-block.module.css';

export function ReviewBlock({ reviews }) {
  const [index, setIndex] = useState(0);

  // Защита: если данные не пришли или это не массив — ничего не рисуем
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return null;
  }

  const review = reviews[index];
  if (!review) return null;

  const next = () => setIndex((i) => (i + 1) % reviews.length);
  const prev = () => setIndex((i) => (i - 1 + reviews.length) % reviews.length);

  return (
    <div className={styles.block}>
      <img className={styles.photo} src={review.avatar} alt={review.author} />

      <div className={styles.content} key={review.id}>
        <h3 className={styles.title}>{review.title}</h3>

        <div className={styles.stars}>
          {'★'.repeat(review.rating)}
          {'☆'.repeat(5 - review.rating)}
        </div>

        <p className={styles.text}>“{review.text}”</p>
        <div className={styles.author}>{review.author}</div>
        <div className={styles.role}>{review.role}</div>

        <div className={styles.controls}>
          <button className={styles.ctrl} onClick={prev} aria-label="Previous">‹</button>
          <span className={styles.counter}>{index + 1} / {reviews.length}</span>
          <button className={styles.ctrl} onClick={next} aria-label="Next">›</button>
        </div>
      </div>
    </div>
  );
}
