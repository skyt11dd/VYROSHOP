'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './AgeGate.module.css';

export function AgeGate() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const confirmed = localStorage.getItem('vyro_age_verified');
    if (!confirmed) {
      setShow(true);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem('vyro_age_verified', 'true');
    setShow(false);
  };

  const handleDecline = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.logoWrap}>
          <Image
            src="/logo.png"
            alt="VYRO"
            width={160}
            height={42}
            className={styles.logo}
            priority
          />
        </div>
        <div className={styles.badge}>18+ STRICTLY ADULTS ONLY</div>
        <h2 className={styles.title}>Вам виповнилося 18 років?</h2>
        <p className={styles.text}>
          Цей вебсайт містить інформацію про вейп-продукцію, POD-системи та нікотиновмісні товари.
          Доступ дозволено виключно повнолітнім особам.
        </p>
        <div className={styles.actions}>
          <button className="btn btn-primary" onClick={handleConfirm} style={{ flex: 1 }}>
            Так, мені є 18 років
          </button>
          <button className="btn btn-outline" onClick={handleDecline} style={{ flex: 1 }}>
            Ні, вийти
          </button>
        </div>
      </div>
    </div>
  );
}
