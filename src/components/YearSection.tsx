
import { YearGroup } from '@/lib/albums';
import AlbumCard from './AlbumCard';

export default function YearSection({ yearGroup }: { yearGroup: YearGroup }) {
    return (
        <section className="year-section">
            <h2 className="year-title">{yearGroup.year}</h2>
            <div className="album-grid">
                {yearGroup.albums.map((album, index) => (
                    <AlbumCard key={index} album={album} />
                ))}
            </div>
        </section>
    );
}
