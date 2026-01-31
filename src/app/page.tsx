
import { getAlbums, ensureCurrentMonthAlbum } from '@/lib/albums';
import YearSection from '@/components/YearSection';
import ChildNavigation from '@/components/ChildNavigation';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Lazy Auto-Create check on every home visit
  // Direct call to lib function avoids "revalidatePath during render" error
  await ensureCurrentMonthAlbum('horton');

  const albumData = await getAlbums();

  return (
    <main>
      <div className="hero-banner" style={{ backgroundImage: "url('/images/horton_family.jpg')" }}>
        <div className="hero-overlay">
          <h1 style={{ color: '#ffffff', textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>Horton's little World</h1>
          <p className="site-subtitle" style={{ marginBottom: 0, color: '#ffffff', textShadow: '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>可愛的張家赫來陪大家了</p>
        </div>
      </div>

      <ChildNavigation />

      <div className="content-container">
        {albumData.map((yearGroup) => (
          <YearSection key={yearGroup.year} yearGroup={yearGroup} />
        ))}
      </div>
    </main>
  );
}
