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

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const switchTab = (next) => {
    setTab(next);
    setForm({ name: '', email: '', password: '' });
    setError('');
  };

  const submit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.email.includes('@')) return setError('Invalid email');
    if (form.password.length < 4) return setError('Password must be at least 4 characters');
    if (tab === 'register' && !form.name.trim()) return setError('Enter your name');

    const mutation = tab === 'login' ? loginMutation : registerMutation;
    const payload = tab === 'login'
      ? { email: form.email, password: form.password }
      : form;

    mutation.mutate(payload, {
      onSuccess: (data) => {
        login(data.token, data.user);
        onClose();
      },
      onError: (err) => setError(err.response?.data?.message || err.message),
    });
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
            <button className={cn(styles.tab, tab === 'login' && styles.tabActive)} onClick={() => switchTab('login')}>
              Sign In
            </button>
            <button className={cn(styles.tab, tab === 'register' && styles.tabActive)} onClick={() => switchTab('register')}>
              Register
            </button>
          </div>

          <form className={styles.form} onSubmit={submit}>
            {tab === 'register' && (
              <div className={styles.field}>
                <label className={styles.label}>Name</label>
                <input
                  className={styles.input}
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
            )}
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                className={styles.input}
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input
                className={styles.input}
                type="password"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder="••••"
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <Button type="submit" variant="dark" disabled={loginMutation.isPending || registerMutation.isPending}>
              {loginMutation.isPending || registerMutation.isPending
                ? 'Loading…'
                : tab === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </>
      )}
    </Modal>
  );
}
