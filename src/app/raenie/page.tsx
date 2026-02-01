
import { getAlbums, ensureCurrentMonthAlbum } from '@/lib/albums';
import YearSection from '@/components/YearSection';

import ChildNavigation from '@/components/ChildNavigation';

export const dynamic = 'force-dynamic';

export default async function RaenieHome() {
    // Check auto-create for Raenie
    await ensureCurrentMonthAlbum('raenie');

    // Use the specific data file for Raenie
    const filteredData = await getAlbums('raenie_albums.json');

    return (
        <main style={{ '--year-title-bg': '#F4B0C8' } as React.CSSProperties}>
            <div className="hero-banner" style={{ backgroundImage: "url('/images/raenie_family.jpg')" }}>
                {/* Different placeholder for differentiation: a pinkish/soft one */}
                <div className="hero-overlay">
                    <h1 style={{ color: '#ffffff', textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>Raenie's little World</h1>
                    <p className="site-subtitle" style={{ marginBottom: 0, color: '#ffffff', textShadow: '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>芮寧妹妹來跟大家請安了～</p>
                </div>
            </div>

            <ChildNavigation />

            <div className="content-container">
                {filteredData && filteredData.length > 0 ? (
                    filteredData.map((yearGroup: any) => (
                        <YearSection key={yearGroup.year} yearGroup={yearGroup} birthYear={2020} />
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>No albums found.</div>
                )}
            </div>
        </main>
    );
}
