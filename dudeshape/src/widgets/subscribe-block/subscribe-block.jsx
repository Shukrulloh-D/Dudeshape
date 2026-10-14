import { useState } from 'react';
import { Container } from '@/shared/ui';
import { useSubscribe } from '@/shared/api';
import styles from './subscribe-block.module.css';

export function SubscribeBlock() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const { mutate: subscribe, isPending } = useSubscribe();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    subscribe(email, {
      onSuccess: () => {
        setEmail('');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      },
    });
  };

  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.inner}>
          <h2 className={styles.title}>Subscribe to Get Our Latest News</h2>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              className={styles.input}
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className={styles.submit} type="submit" disabled={isPending}>
              {isPending ? '…' : 'Subscribe'}
            </button>
          </form>
        </div>
        {success && <div className={styles.success}>✓ Subscribed</div>}
      </Container>
    </section>
  );
}
