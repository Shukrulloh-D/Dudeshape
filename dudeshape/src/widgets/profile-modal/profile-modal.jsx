import { useState } from 'react';
import { Modal, Button } from '@/shared/ui';
import { useLogin, useRegister } from '@/shared/api';
import { useUser, cn } from '@/shared/lib';
import styles from './profile-modal.module.css';

export function ProfileModal({ isOpen, onClose }) {
  const { user, login, logout } = useUser();
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const { mutate: doLogin, isPending: isLoginPending } = useLogin();
  const { mutate: doRegister, isPending: isRegisterPending } = useRegister();

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const reset = () => {
    setForm({ name: '', email: '', password: '' });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.email.includes('@')) { setError('Enter a valid email'); return; }
    if (form.password.length < 4) { setError('Password must be at least 4 characters'); return; }
    if (tab === 'register' && !form.name.trim()) { setError('Enter your name'); return; }

    const onSuccess = (data) => {
      login(data.token, data.user);
      reset();
      onClose();
    };
    const onError = (err) => setError(err.response?.data?.message || err.message);

    if (tab === 'login') {
      doLogin({ email: form.email, password: form.password }, { onSuccess, onError });
    } else {
      doRegister(form, { onSuccess, onError });
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={user ? 'Profile' : 'Account'}>
      {user ? (
        <div className={styles.userBox}>
          <div className={styles.userRow}>
            <div className={styles.avatar}>{user.name?.[0]?.toUpperCase() || 'U'}</div>
            <div>
              <div className={styles.userName}>{user.name}</div>
              <div className={styles.userEmail}>{user.email}</div>
            </div>
          </div>

          <div className={styles.menuList}>
            <div className={styles.menuItem}>📦 My Orders</div>
            <div className={styles.menuItem}>❤️ Favorites</div>
            <div className={styles.menuItem}>⚙️ Settings</div>
          </div>

          <button className={styles.logout} onClick={handleLogout}>Sign out</button>
        </div>
      ) : (
        <>
          <div className={styles.tabs}>
            <button
              className={cn(styles.tab, tab === 'login' && styles.tabActive)}
              onClick={() => { setTab('login'); reset(); }}
            >
              Sign In
            </button>
            <button
              className={cn(styles.tab, tab === 'register' && styles.tabActive)}
              onClick={() => { setTab('register'); reset(); }}
            >
              Register
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {tab === 'register' && (
              <div className={styles.field}>
                <label className={styles.label}>Name</label>
                <input
                  className={styles.input}
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                />
              </div>
            )}

            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                className={styles.input}
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input
                className={styles.input}
                type="password"
                placeholder="••••"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <Button type="submit" variant="dark" disabled={isLoginPending || isRegisterPending}>
              {isLoginPending || isRegisterPending
                ? 'Loading…'
                : tab === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </>
      )}
    </Modal>
  );
}
