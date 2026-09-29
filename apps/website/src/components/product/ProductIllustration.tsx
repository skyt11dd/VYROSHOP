import Image from 'next/image';

export function ProductIllustration({ category, name }: { category?: string; name?: string }) {
  const catLower = (category || name || '').toLowerCase();
  let img = '/images/xros4.jpg';
  if (catLower.includes('рідин') || catLower.includes('liquid') || catLower.includes('salt') || catLower.includes('chaser')) {
    img = '/images/chaser-salt.jpg';
  } else if (catLower.includes('однораз') || catLower.includes('disposable') || catLower.includes('elf')) {
    img = '/images/elfbar-disposable.jpg';
  } else if (catLower.includes('картридж') || catLower.includes('cartridge')) {
    img = '/images/cartridge-pack.jpg';
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 120 }}>
      <Image src={img} alt="Product" fill style={{ objectFit: 'contain' }} />
    </div>
  );
}
