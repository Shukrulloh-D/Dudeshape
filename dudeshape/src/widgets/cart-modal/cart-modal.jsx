import { Modal, Button } from '@/shared/ui';
import { useUpdateCartQty, useRemoveFromCart, useClearCart } from '@/shared/api';
import { useCart } from '@/shared/lib';
import styles from './cart-modal.module.css';

export function CartModal({ isOpen, onClose }) {
  const { items, total } = useCart();
  const { mutate: updateQty } = useUpdateCartQty();
  const { mutate: removeItem } = useRemoveFromCart();
  const { mutate: clearCart, isPending: isClearing } = useClearCart();

  const handleCheckout = () => {
    clearCart(undefined, {
      onSuccess: () => {
        alert('✓ Order placed! Cart is now empty.');
        onClose();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cart">
      {items.length === 0 ? (
        <div className={styles.empty}>Your cart is empty</div>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} className={styles.item}>
              <div>
                <div className={styles.itemTitle}>{item.title}</div>
                <div className={styles.itemPrice}>${item.price}</div>
              </div>

              <div className={styles.qtyBox}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => updateQty({ id: item.id, qty: item.qty - 1 })}
                  disabled={item.qty <= 1}
                >
                  −
                </button>
                <span className={styles.qtyValue}>{item.qty}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => updateQty({ id: item.id, qty: item.qty + 1 })}
                >
                  +
                </button>
              </div>

              <div className={styles.itemPrice}>${(item.price * item.qty).toFixed(2)}</div>

              <button className={styles.remove} onClick={() => removeItem(item.id)}>✕</button>
            </div>
          ))}

          <div className={styles.total}>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className={styles.actions}>
            <Button variant="outline" onClick={onClose}>Continue</Button>
            <Button variant="dark" onClick={handleCheckout} disabled={isClearing}>
              {isClearing ? 'Processing…' : 'Checkout'}
            </Button>
          </div>

          <button className={styles.clearBtn} onClick={() => clearCart()}>
            Clear cart
          </button>
        </>
      )}
    </Modal>
  );
}
