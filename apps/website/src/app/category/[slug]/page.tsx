import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';



export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const { categories } = await api.getCategories();
    const cat = categories.find((c: any) => c.slug === resolvedParams.slug);
    if (cat) return { title: `${cat.name} — VYRO Vape Shop`, description: cat.description };
  } catch {}
  return { title: 'Категорія — VYRO Vape Shop' };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const resolvedParams = await params;
  const [categoriesData, productsData] = await Promise.allSettled([
    api.getCategories(),
    api.getProducts({ category: resolvedParams.slug, limit: '40' }),
  ]);

  const categories = categoriesData.status === 'fulfilled' ? categoriesData.value?.categories || [] : [];
  let category = categories.find((c: any) => c.slug === resolvedParams.slug);
  if (!category) notFound();

  let products = productsData.status === 'fulfilled' ? productsData.value?.products || [] : [];

  return (
    <div style={{ paddingTop: 'calc(var(--header-height) + 40px)', paddingBottom: 80 }}>
      <div className="container">
        <div style={{ marginBottom: 40 }} className="animate-slide-up delay-75">
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: 8, display: 'block' }} className="animate-slide-up delay-150">
            Категорія
          </span>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: 'var(--text)' }} className="animate-slide-up delay-225">{category.name}</h1>
          {category.description && <p style={{ color: 'var(--text-secondary)', marginTop: 8, maxWidth: 640 }} className="animate-slide-up delay-300">{category.description}</p>}
          <p style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 600, marginTop: 8 }} className="animate-slide-up delay-400">{products.length} товарів в наявності</p>
        </div>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>В цій категорії поки немає товарів</div>
        ) : (
          <div className="products-grid">
            {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
