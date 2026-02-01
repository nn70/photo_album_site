
import { YearGroup } from '@/lib/albums';
import AlbumCard from './AlbumCard';

const toChineseNum = (num: number) => {
    const chars = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    if (num <= 10) return chars[num];
    if (num < 20) return '十' + (num % 10 === 0 ? '' : chars[num % 10]);
    return num; // Fallback for older
};

export default function YearSection({ yearGroup, birthYear }: { yearGroup: YearGroup, birthYear?: number }) {
    let title = yearGroup.year.toString();
    if (birthYear) {
        const yearNum = parseInt(yearGroup.year);
        const age = yearNum - birthYear;
        if (age >= 0) {
            title += `(${toChineseNum(age)}歲)`;
        }
    }

    return (
        <section className="year-section">
            <h2 className="year-title">{title}</h2>
            <div className="album-grid">
                {yearGroup.albums.map((album, index) => (
                    <AlbumCard key={index} album={album} />
                ))}
            </div>
        </section>
    );
}
