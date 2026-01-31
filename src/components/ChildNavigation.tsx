
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ChildNavigation() {
    const pathname = usePathname();

    return (
        <div className="child-nav-container">
            <Link href="/" title="Horton's World" className="nav-btn" style={{
                textDecoration: 'none',
                padding: '12px 30px',
                borderRadius: '30px',
                fontWeight: '700',
                fontSize: '1rem',
                border: pathname === '/' ? '2px solid #1a73e8' : '2px solid #dadce0',
                backgroundColor: pathname === '/' ? '#e8f0fe' : '#ffffff',
                color: pathname === '/' ? '#1967d2' : '#5f6368',
                boxShadow: pathname === '/' ? '0 2px 4px rgba(26, 115, 232, 0.25)' : '0 4px 6px rgba(0,0,0,0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                flex: 1,
                maxWidth: '300px',
                textAlign: 'center'
            }}>
                ☆小赫的時光小屋 按這裡☆
            </Link>

            <Link href="/raenie" title="Raenie's World" className="nav-btn" style={{
                textDecoration: 'none',
                padding: '12px 30px',
                borderRadius: '30px',
                fontWeight: '700',
                fontSize: '1rem',
                border: pathname.includes('/raenie') ? '2px solid #1a73e8' : '2px solid #dadce0',
                backgroundColor: pathname.includes('/raenie') ? '#e8f0fe' : '#ffffff',
                color: pathname.includes('/raenie') ? '#1967d2' : '#5f6368',
                boxShadow: pathname.includes('/raenie') ? '0 2px 4px rgba(26, 115, 232, 0.25)' : '0 4px 6px rgba(0,0,0,0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                flex: 1,
                maxWidth: '300px',
                textAlign: 'center'
            }}>
                ☆妹妹的時光小屋 按這裡☆
            </Link>

            <style jsx>{`
        .child-nav-container {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            padding: 20px 24px;
            margin-bottom: 20px;
            width: 100%;
            max-width: 1400px;
            margin-left: auto;
            margin-right: auto;
            box-sizing: border-box;
        }

        /* Desktop styles served via inline-style for higher specificity assurance */
        /* Only layout container logic here */
        .child-nav-container {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            padding: 20px 24px;
            margin-bottom: 20px;
            width: 100%;
            max-width: 1400px;
            margin-left: auto;
            margin-right: auto;
            box-sizing: border-box;
        }

        /* Mobile styles */
        @media (max-width: 768px) {
            .child-nav-container {
                display: grid;
                grid-template-columns: 1fr 1fr; /* Two equal columns */
                gap: 10px; /* Smaller gap */
                padding: 10px 16px;
                width: 100%;
            }

            .nav-btn {
                width: 100% !important;
                max-width: none !important;
                padding: 10px 4px !important;
                font-size: 0.9rem !important;
                white-space: normal !important;
                line-height: 1.2 !important;
            }
        }
      `}</style>
        </div>
    );
}
