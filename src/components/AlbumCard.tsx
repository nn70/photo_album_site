
import Image from 'next/image';
import { Album } from '@/lib/albums';

export default function AlbumCard({ album }: { album: Album }) {
    const isPlaceholder = album.link_href === "#";
    const Tag = isPlaceholder ? 'div' : 'a';

    return (
        <Tag
            href={isPlaceholder ? undefined : album.link_href}
            className="album-card"
            target={isPlaceholder ? undefined : "_blank"}
            rel={isPlaceholder ? undefined : "noopener noreferrer"}
        >
            {/* 
        Using standard img tag if optimization is tricky with legacy CSS, 
        or Next/Image if I update CSS. 
        Legacy CSS likely targets 'img.album-thumb' with specific sizing.
        Next/Image needs width/height or fill.
        Let's try standard <img /> first to minimize CSS breakage, 
        or use <Image /> with 'unoptimized' if external domains are an issue despite config.
        With remotePatterns configured, Image is fine.
        However, for 'responsive' grid, the CSS handles size.
        Let's stick to <img /> to match legacy behavior perfectly for now, 
        or use <Image width={400} height={300} /> as a baseline.
        The legacy script used <img src="..." className="album-thumb" loading="lazy" ...>
      */}
            <div className="album-info-top">
                <h3 className="album-title">{album.title}</h3>
            </div>
            <img
                src={album.img_src}
                alt={album.title}
                className="album-thumb"
                loading="lazy"
            />
            <div className="album-description">
                {/* Description placeholder */}
            </div>
        </Tag>
    );
}
