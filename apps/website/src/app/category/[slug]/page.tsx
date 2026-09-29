import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const { categories } = await api.getCategories();
    const cat = categories.find((c: any) => c.slug === params.slug);
    if (!cat) return { title: 'Категорія не знайдена' };
    return { title: cat.name, description: cat.description };
  } catch {
    return { title: 'Категорія' };
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const [categoriesData, productsData] = await Promise.allSettled([
    api.getCategories(),
    api.getProducts({ category: params.slug, limit: '40' }),
  ]);

  const categories = categoriesData.status === 'fulfilled' ? categoriesData.value.categories : [];
  const category = categories.find((c: any) => c.slug === params.slug);
  if (!category) notFound();

  const products = productsData.status === 'fulfilled' ? productsData.value.products : [];

  return (
    <div style={{ paddingTop: 'calc(var(--header-height) + 40px)', paddingBottom: 80 }}>
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800 }}>{category.name}</h1>
          {category.description && <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>{category.description}</p>}
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>{products.length} товарів</p>
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
