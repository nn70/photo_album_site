
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const toChineseNum = (num: number) => {
  const chars = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  if (num <= 10) return chars[num];
  if (num < 20) return '十' + (num % 10 === 0 ? '' : chars[num % 10]);
  return num; // Fallback for older
};

export default function NavBar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isRaenie = pathname.includes('/raenie');
  const startYear = isRaenie ? 2020 : 2016;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);

  const handleYearScroll = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value;
    const element = document.getElementById(`year-${year}`);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    // Reset selection so it can be clicked again if needed (visual preferance)
    e.target.value = "";
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <span
            className="logo-icon"
            onClick={() => !session && signIn("google")}
            style={{ cursor: !session ? 'pointer' : 'default' }}
            title={!session ? "點擊登入" : ""}
          >
            📸
          </span>
          <span className="logo-text">
            {isRaenie ? "寧寧的時光小屋" : "小赫的時光小屋"}
          </span>
        </div>
        <div className="nav-actions">
          <div className="year-selector-wrapper">
            <select onChange={handleYearScroll} className="btn-year-select" defaultValue="">
              <option value="" disabled>📅選年份</option>
              {years.map(year => {
                const age = year - startYear;
                const ageText = age >= 0 ? `(${toChineseNum(age)}歲)` : '';
                return (
                  <option key={year} value={year}>{year}年 {ageText}</option>
                );
              })}
            </select>
          </div>

          {session && (
            <>
              <Link href="/admin" className={`nav-link ${pathname === '/admin' ? 'active' : ''}`}>
                管理後台
              </Link>
              <div className="user-profile">
                <div className="user-avatar">
                  {session.user?.image ? (
                    <img src={session.user.image} alt="User" />
                  ) : (
                    <span className="avatar-placeholder">{session.user?.name?.[0]}</span>
                  )}
                </div>
                <button onClick={() => signOut()} className="btn-auth btn-logout">登出</button>
              </div>
            </>
          )}
        </div>
      </div>
      <style jsx>{`
        /* ... existing styles ... */
        .btn-year-select {
            appearance: none;
            background: #ffffff;
            color: #555;
            border: 1px solid #eee;
            padding: 0.5rem 1.8rem 0.5rem 1rem;
            border-radius: 50px;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            outline: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 0.7rem center;
            background-size: 1rem;
            font-family: inherit;
        }
        .btn-year-select:hover {
            background-color: #fafafa;
            color: #1a73e8;
            stroke: #1a73e8; /* For SVG if consistent */
        }
        
        .navbar {
          background-color: rgba(255, 255, 255, 0.9); /* Slightly more opaque */
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0,0,0,0.05);
          padding: 0.8rem 0;
          position: sticky;
          top: 0;
          z-index: 1000;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          /* No text-decoration or color needed for div, but keeping layout */
          cursor: default; /* Not clickable */
          user-select: none;
        }
        /* No hover transform for non-link logo */
        
        .logo-text {
            font-family: system-ui, -apple-system, sans-serif;
            font-weight: 800;
            font-size: 1.5rem;
            background: linear-gradient(135deg, #4F46E5 0%, #EC4899 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -0.5px;
            text-shadow: 0px 2px 4px rgba(0,0,0,0.1);
            white-space: nowrap;
        }
        
        .logo-icon {
            font-size: 1.6rem;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        .nav-actions {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }
        
        .nav-link {
          text-decoration: none;
          color: #5f6368;
          font-weight: 500;
          font-size: 0.95rem;
          transition: color 0.2s;
          position: relative;
        }
        .nav-link:hover, .nav-link.active {
          color: #1a73e8;
        }
        .nav-link.active::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 100%;
            height: 2px;
            background: #1a73e8;
            border-radius: 2px;
        }
        .user-profile {
            display: flex;
            align-items: center;
            gap: 12px;
            padding-left: 12px;
            border-left: 1px solid #eee;
        }
        .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .user-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .avatar-placeholder {
            width: 100%;
            height: 100%;
            background: #1a73e8;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9rem;
        }
        .btn-auth {
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .btn-logout {
            background: #f1f3f4;
            color: #5f6368;
        }
        .btn-logout:hover {
            background: #e8eaed;
            color: #1f1f1f;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
            .nav-container {
                padding: 0 12px;
            }
            
            .nav-logo {
                margin-right: 0;
                flex-shrink: 1; /* Allow logo container to shrink if super tight */
                min-width: 0;   /* enable flex item shrinking */
            }
            .logo-text {
                font-size: 1.5rem; /* Maximize size */
                overflow: hidden;
                text-overflow: ellipsis; 
            }
            .logo-icon {
                font-size: 1.3rem; 
            }
            
            .nav-actions {
                flex-grow: 0; /* Stop taking too much space */
                justify-content: flex-end;
                gap: 0.5rem;
                flex-shrink: 0;
            }
            
            .btn-year-select {
                width: 90px; /* Force fixed width */
                padding: 0.4rem 1.4rem 0.4rem 0.6rem; 
                font-size: 0.8rem;
                background-position: right 0.3rem center;
                text-overflow: ellipsis; /* Just in case */
            }
        }
      `}</style>
    </header>
  );
}
