import { useState } from 'react';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { SubscribeBlock } from '@/widgets/subscribe-block';
import { Hero } from './sections/hero';
import { BrandsStrip } from './sections/brands-strip';
import { PopularProducts } from './sections/popular-products';
import { Stats } from './sections/stats';
import { PerfectBeauty } from './sections/perfect-beauty';

export function HomePage() {
  const [search, setSearch] = useState('');

  return (
    <div className="fade-up">
      <Header />
      <main>
        <Hero onSearch={setSearch} />
        <BrandsStrip />
        <PopularProducts search={search} />
        <Stats />
        <PerfectBeauty />
        <SubscribeBlock />
      </main>
      <Footer />
    </div>
  );
}
