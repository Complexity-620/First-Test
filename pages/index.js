import Head from 'next/head';
import Link from 'next/link';
import GolfDashboard from '../components/GolfDashboard';

export default function Home() {
  return (
    <>
      <Head>
        <title>Golf Analytics Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="nav-bar">
        <Link href="/">
          <span className="nav-link active">Practice Analytics</span>
        </Link>
        <Link href="/tournament">
          <span className="nav-link">Tournament Analytics</span>
        </Link>
      </div>
      <GolfDashboard />
      <style jsx>{`
        .nav-bar {
          background: rgba(0, 0, 0, 0.8);
          padding: 15px 20px;
          display: flex;
          gap: 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .nav-link {
          padding: 12px 24px;
          border-radius: 8px 8px 0 0;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-bottom: none;
          display: inline-block;
          color: white;
          text-decoration: none;
          font-weight: 500;
          padding: 12px 24px;
          border-radius: 8px 8px 0 0;
          transition: all 0.3s ease;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-bottom: none;
        }
        .nav-link.active {
          background: #667eea;
          color: white;
          font-weight: 600;
        }
        .nav-link.active {
          background: #667eea;
          color: white;
          font-weight: 600;
        }
        .nav-link:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .nav-link.active:hover {
          background: #667eea;
        }
      `}</style>
    </>
  );
}
