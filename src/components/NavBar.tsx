
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <span className="logo-icon">📸</span>
          <span className="logo-text">
            {pathname.includes('/raenie') ? "寧寧的時光小屋" : "小赫的時光小屋"}
          </span>
        </div>
        <div className="nav-actions">
          {session ? (
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
          ) : (
            <button onClick={() => signIn("google")} className="btn-auth btn-login">Google 登入</button>
          )}
        </div>
      </div>
      <style jsx>{`
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
        .btn-login {
            background: #ffffff;
            color: #d1d5db; /* Very light gray */
            box-shadow: none;
            font-weight: 500;
            font-size: 0.85rem;
            border: 1px solid transparent;
        }
        .btn-login:hover {
            background: #fafafa;
            color: #9ca3af; /* Slightly darker on hover */
            transform: none;
            box-shadow: none;
            border-color: #f3f4f6;
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
                padding: 0 16px;
            }
            
            /* Logo text visible again based on user request */
            /* .logo-text { display: none !important; } */
            
            .nav-logo {
                margin-right: 0;
            }
            .logo-icon {
                font-size: 1.5rem; /* Reset to normal size or keep slightly larger? User said 'recover text', let's keep icon normal to fit text */
            }
            
            /* Hide user profile to save space if needed */
            .nav-actions {
                flex-grow: 1; 
                justify-content: flex-end;
            }
        }
      `}</style>
    </header>
  );
}
