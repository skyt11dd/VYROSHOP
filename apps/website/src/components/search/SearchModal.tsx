'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import styles from './SearchModal.module.css';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const popularQueries = ['Vaporesso', 'Oxva', 'Сольові рідини', 'Elf Bar', 'Картриджі'];

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('vyro_searches');
    if (stored) setRecentSearches(JSON.parse(stored));
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await api.search(q);
      setResults(res.products || []);
    } catch { setResults([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { if (query) doSearch(query); else setResults([]); }, 350);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  const handleSelect = (q: string) => {
    const searches = [q, ...recentSearches.filter(s => s !== q)].slice(0, 5);
    setRecentSearches(searches);
    localStorage.setItem('vyro_searches', JSON.stringify(searches));
    onClose();
  };

  useEffect(() => {
    if (!open) setQuery('');
    else setTimeout(() => document.getElementById('search-input')?.focus(), 100);
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.inputRow}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={styles.icon}>
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            id="search-input"
            className={styles.input}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Пошук товарів..."
            onKeyDown={e => { if (e.key === 'Enter' && query) { handleSelect(query); window.location.href = `/search?q=${encodeURIComponent(query)}`; } }}
          />
          {query && (
            <button className={styles.clear} onClick={() => setQuery('')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
          <button className={`btn btn-ghost ${styles.esc}`} onClick={onClose}>Esc</button>
        </div>

        <div className={styles.body}>
          {!query && (
            <>
              {recentSearches.length > 0 && (
                <div className={styles.section}>
                  <p className={styles.label}>Останні пошуки</p>
                  <div className={styles.tags}>
                    {recentSearches.map(s => (
                      <button key={s} className={styles.tag} onClick={() => { setQuery(s); }}>{s}</button>
                    ))}
                  </div>
                </div>
              )}
              <div className={styles.section}>
                <p className={styles.label}>Популярні запити</p>
                <div className={styles.tags}>
                  {popularQueries.map(s => (
                    <button key={s} className={styles.tag} onClick={() => setQuery(s)}>{s}</button>
                  ))}
                </div>
              </div>
            </>
          )}

          {loading && (
            <div className={styles.loading}>
              {[1,2,3].map(i => <div key={i} className={`skeleton ${styles.skeleton}`} />)}
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className={styles.empty}>
              <p>Нічого не знайдено</p>
              <span>Спробуйте змінити запит</span>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className={styles.results}>
              {results.map(p => (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  className={styles.result}
                  onClick={() => handleSelect(query)}
                >
                  <div className={styles.thumb}>
                    {p.images?.[0] && <Image src={p.images[0].url} alt={p.name} fill style={{ objectFit: 'cover' }} />}
                  </div>
                  <div className={styles.info}>
                    <span className={styles.name}>{p.name}</span>
                    <span className={styles.cat}>{p.category?.name}</span>
                  </div>
                  <span className={styles.price}>{formatPrice(p.price)} ₴</span>
                </Link>
              ))}
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                className={styles.viewAll}
                onClick={() => handleSelect(query)}
              >
                Переглянути всі результати →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
