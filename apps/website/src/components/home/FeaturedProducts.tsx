import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';

export function FeaturedProducts({ products }: { products: any[] }) {
  if (!products.length) return null;
  return (
    <section className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        <div className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h2>Рекомендовані товари</h2>
            <p>Кращий вибір від VYRO</p>
          </div>
          <Link href="/shop?featured=true" className="btn btn-outline" style={{ flexShrink: 0 }}>Всі →</Link>
        </div>
        <div className="products-grid">
          {products.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

export function NewArrivals({ products }: { products: any[] }) {
  if (!products.length) return null;
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h2>Новинки</h2>
            <p>Щойно з'явилося у магазині</p>
          </div>
          <Link href="/shop?isNew=true" className="btn btn-outline" style={{ flexShrink: 0 }}>Всі →</Link>
        </div>
        <div className="products-grid">
          {products.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

export function PopularProducts({ products }: { products: any[] }) {
  if (!products.length) return null;
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h2>Популярне</h2>
            <p>Обирають найчастіше</p>
          </div>
          <Link href="/shop?popular=true" className="btn btn-outline" style={{ flexShrink: 0 }}>Всі →</Link>
        </div>
        <div className="products-grid">
          {products.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
