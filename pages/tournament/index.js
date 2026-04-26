import Link from 'next/link';
import Head from 'next/head';
import { tournamentData } from '../../data/tournamentData';

export default function TournamentHome() {
  const courses = Object.entries(tournamentData.courses).map(([key, course]) => ({
    key,
    ...course,
  }));

  return (
    <>
      <Head>
        <title>Jonathan's Freshman Year Tournament Analytics</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="tournament-container">
        <div className="nav-bar">
          <Link href="/">
            <span className="nav-link">Practice Analytics</span>
          </Link>
          <Link href="/tournament">
            <span className="nav-link active">Tournament Analytics</span>
          </Link>
        </div>
        <div className="tournament-header">
          <h1>⛳ Jonathan's Freshman Year Tournament Analytics</h1>
          <p>Texas High School Golf Tournament Scorecard Analysis</p>
        </div>

        <div className="course-selection">
          <h2>Select a Course</h2>
          <p className="subtitle">Choose a tournament course to view your performance</p>

          <div className="course-grid">
            {courses.map((course) => (
              <Link key={course.id} href={`/tournament/${course.key}`}>
                <div className="course-card">
                  <div className="course-icon">⛳</div>
                  <div className="course-name">{course.name}</div>
                  <div className="course-status">
                    {course.scores ? '✓ Data Available' : '⏳ Awaiting Data'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="info-section">
          <h3>About This Analytics</h3>
          <p>
            This dashboard analyzes your tournament score performance from your freshman year. Track your
            performance metrics including:
          </p>
          <ul>
            <li>Score vs Par analysis (Eagles, Birdies, Pars, Bogeys)</li>
            <li>Hole-by-hole breakdown and consistency</li>
            <li>Tournament performance trends</li>
            <li>Course difficulty and your accuracy per hole</li>
          </ul>
        </div>

        <div className="add-data-section">
          <h3>Ready to Add More Data?</h3>
          <p>
            Share your scorecard data (the score on each hole for each course), and I'll update the analytics
            dashboard with your performance metrics.
          </p>
        </div>

        <div className="milestone-section">
          <h3>🎯 Journey Started</h3>
          <p>
            <strong>Date started to grind:</strong> February 2026
          </p>
          <p>
            Tracking progress and improvement in tournament golf performance.
          </p>
        </div>
      </div>

      <style jsx>{`
        .tournament-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          background: #e8f5e8;
          min-height: 100vh;
        }

        .tournament-header {
          text-align: center;
          color: white;
          margin-bottom: 50px;
          padding: 40px 20px;
        }

        .tournament-header h1 {
          font-size: 2.8em;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .tournament-header p {
          font-size: 1.1em;
          opacity: 0.9;
        }

        .course-selection {
          border-radius: 15px;
          padding: 40px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .course-selection h2 {
          color: white;
          margin-bottom: 10px;
          font-size: 1.8em;
        }

        .subtitle {
          color: #999;
          margin-bottom: 30px;
        }

        .course-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .course-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          padding: 30px;
          text-align: center;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .course-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }

        .course-icon {
          font-size: 3em;
          margin-bottom: 15px;
        }

        .course-name {
          font-size: 1.3em;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .course-status {
          font-size: 0.9em;
          opacity: 0.9;
        }

        .add-data-section,
        .milestone-section {
          border-radius: 15px;
          padding: 30px;
          margin-bottom: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .add-data-section h3,
        .milestone-section h3 {
          color: #667eea;
          margin-bottom: 15px;
          font-size: 1.3em;
        }

        .add-data-section p,
        .milestone-section p {
          color: #666;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .info-section ul {
          list-style: none;
          padding-left: 0;
        }

        .info-section li {
          color: #666;
          padding: 8px 0;
          padding-left: 25px;
          position: relative;
        }

        .info-section li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #667eea;
          font-weight: bold;
        }
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
          display: inline-block;
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
