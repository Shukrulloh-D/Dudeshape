import { useAddToCart } from '@/shared/api';
import styles from './product-card.module.css';

export function ProductCard({ product }) {
  const { mutate: addToCart, isPending } = useAddToCart();

  return (
    <article className={styles.card}>
      <img className={styles.image} src={product.image} alt={product.title} />
      <div className={styles.body}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.footer}>
          <div className={styles.actions}>
            <button className={styles.btnBuy}>Buy Now</button>
            <button
              className={styles.btnCart}
              onClick={() => addToCart({ productId: product.id, qty: 1 })}
              disabled={isPending}
            >
              {isPending ? '…' : 'Add To Cart'}
            </button>
          </div>
          <span className={styles.price}>${product.price}</span>
        </div>
      </div>
    </article>
  );
}
