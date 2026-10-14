import styles from './review-block.module.css';

export function ReviewBlock({ review }) {
  return (
    <div className={styles.block}>
      <img className={styles.photo} src={review.avatar} alt={review.author} />
      <div>
        <h3 className={styles.title}>{review.title}</h3>
        <div className={styles.stars}>{'★'.repeat(review.rating)}</div>
        <p className={styles.text}>“{review.text}”</p>
        <div className={styles.author}>{review.author}</div>
        <div className={styles.role}>{review.role}</div>
        <div className={styles.controls}>
          <button className={styles.ctrl}>‹</button>
          <button className={styles.ctrl}>›</button>
        </div>
      </div>
    </div>
  );
}
