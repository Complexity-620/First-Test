import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  ScatterChart,
} from 'recharts';
import { tournamentData, calculatePerformance } from '../../data/tournamentData';

export default function CourseDetail() {
  const router = useRouter();
  const { course } = router.query;

  if (!course || !tournamentData.courses[course]) {
    return <div>Loading...</div>;
  }

  const courseData = tournamentData.courses[course];
  const performance = calculatePerformance(courseData);

  return (
    <>
      <Head>
        <title>{courseData.name} - Tournament Analytics</title>
      </Head>

      <div className="nav-bar">
        <Link href="/">
          <span className="nav-link">Practice Analytics</span>
        </Link>
        <Link href="/tournament">
          <span className="nav-link active">Tournament Analytics</span>
        </Link>
      </div>

      <div className="course-detail-container">
        <div className="detail-header">
          <h1>{courseData.name}</h1>
        </div>

        {!performance ? (
          <div className="no-data">
            <div className="no-data-content">
              <div className="no-data-icon">⏳</div>
              <h2>Data Pending</h2>
              <p>Scorecard data for {courseData.name} hasn't been added yet.</p>
              <p>Share your scores and I'll add them to the analytics dashboard!</p>
            </div>
          </div>
        ) : (
          <>
            <div className="score-summary">
              <div className="summary-card">
                <div className="summary-label">Total Score</div>
                <div className="summary-value">{performance.totalScore}</div>
              </div>
              <div className="summary-card">
                <div className="summary-label">Par</div>
                <div className="summary-value">{performance.totalPar}</div>
              </div>
              <div className="summary-card">
                <div className="summary-label">Score to Par</div>
                <div className={`summary-value ${performance.scoreToPar >= 0 ? 'positive' : 'negative'}`}>
                  {performance.score_to_par_str}
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-label">Total Yardage</div>
                <div className="summary-value">{performance.totalYardage.toLocaleString()}</div>
                <div className="summary-detail">{courseData.teeName} Tees</div>
              </div>
            </div>

            <div className="tournament-info">
              <div className="info-card">
                <h4>Tournament Details</h4>
                <p><strong>Date:</strong> {courseData.date ? new Date(courseData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Not specified'}</p>
                <p><strong>Course:</strong> {courseData.name}</p>
                <p><strong>Tees:</strong> {courseData.teeName}</p>
              </div>

              <div className="info-card">
                <h4>Scoring Averages</h4>
                <p><strong>Overall:</strong> {performance.averages.overall} per hole</p>
                <p><strong>Par 3s:</strong> {performance.averages.par3} ({performance.holes.filter(h => h.par === 3).length} holes)</p>
                <p><strong>Par 4s:</strong> {performance.averages.par4} ({performance.holes.filter(h => h.par === 4).length} holes)</p>
                <p><strong>Par 5s:</strong> {performance.averages.par5} ({performance.holes.filter(h => h.par === 5).length} holes)</p>
              </div>
            </div>

            <div className="statistics-grid">
              <div className="stat-box">
                <div className="stat-icon">🦅</div>
                <div className="stat-count">{performance.statistics.eagles}</div>
                <div className="stat-name">Eagles</div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">🐦</div>
                <div className="stat-count">{performance.statistics.birdies}</div>
                <div className="stat-name">Birdies</div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">⚪</div>
                <div className="stat-count">{performance.statistics.pars}</div>
                <div className="stat-name">Pars</div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">📊</div>
                <div className="stat-count">{performance.statistics.bogeys}</div>
                <div className="stat-name">Bogeys</div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">❌</div>
                <div className="stat-count">{performance.statistics.doublePlus}</div>
                <div className="stat-name">Double+</div>
              </div>
            </div>

            <div className="charts-section">
              <div className="chart-container">
                <h3>Score to Par Distribution</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Eagles', value: performance.statistics.eagles },
                        { name: 'Birdies', value: performance.statistics.birdies },
                        { name: 'Pars', value: performance.statistics.pars },
                        { name: 'Bogeys', value: performance.statistics.bogeys },
                        { name: 'Double+', value: performance.statistics.doublePlus },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#FFD700" />
                      <Cell fill="#FF8C00" />
                      <Cell fill="#4CAF50" />
                      <Cell fill="#FF5252" />
                      <Cell fill="#9C27B0" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h3>Score Trend</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={performance.holes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hole" />
                    <YAxis />
                    <Tooltip formatter={(value) => value} />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#2196F3" name="Your Score" strokeWidth={2} />
                    <Line type="monotone" dataKey="par" stroke="#9C27B0" name="Par" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="scorecard-container">
              <h3>Scorecard</h3>
              <div className="scorecard">
                {/* Header */}
                <div className="scorecard-header">
                  <div className="player-name">Jonathan</div>
                  <div className="course-name">{courseData.name}</div>
                  <div className="date-tees">{courseData.date ? new Date(courseData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''} - {courseData.teeName} Tees</div>
                </div>

                {/* Front 9 */}
                <div className="nine-holes">
                  <h4>Front 9</h4>
                  <table className="scorecard-table">
                    <thead>
                      <tr>
                        <th>Hole</th>
                        {performance.holes.slice(0, 9).map((hole) => (
                          <th key={hole.hole}>{hole.hole}</th>
                        ))}
                        <th>Out</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="label-cell">Par</td>
                        {performance.holes.slice(0, 9).map((hole) => (
                          <td key={`par-${hole.hole}`}>{hole.par}</td>
                        ))}
                        <td className="total-cell">{performance.holes.slice(0, 9).reduce((sum, hole) => sum + hole.par, 0)}</td>
                      </tr>
                      <tr>
                        <td className="label-cell">Score</td>
                        {performance.holes.slice(0, 9).map((hole) => (
                          <td key={`score-${hole.hole}`} className={`score-cell result-${hole.result.toLowerCase()}`} data-over-par={Math.max(0, hole.toPar)}>
                            {hole.score}
                          </td>
                        ))}
                        <td className="total-cell">{performance.holes.slice(0, 9).reduce((sum, hole) => sum + hole.score, 0)}</td>
                      </tr>
                      <tr>
                        <td className="label-cell">+/-</td>
                        {performance.holes.slice(0, 9).map((hole) => (
                          <td key={`toPar-${hole.hole}`} className="to-par-cell">
                            {hole.toPar > 0 ? `+${hole.toPar}` : hole.toPar}
                          </td>
                        ))}
                        <td className="total-cell">
                          {(() => {
                            const frontToPar = performance.holes.slice(0, 9).reduce((sum, hole) => sum + hole.toPar, 0);
                            return frontToPar > 0 ? `+${frontToPar}` : frontToPar;
                          })()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Back 9 */}
                <div className="nine-holes">
                  <h4>Back 9</h4>
                  <table className="scorecard-table">
                    <thead>
                      <tr>
                        <th>Hole</th>
                        {performance.holes.slice(9, 18).map((hole) => (
                          <th key={hole.hole}>{hole.hole}</th>
                        ))}
                        <th>In</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="label-cell">Par</td>
                        {performance.holes.slice(9, 18).map((hole) => (
                          <td key={`par-${hole.hole}`}>{hole.par}</td>
                        ))}
                        <td className="total-cell">{performance.holes.slice(9, 18).reduce((sum, hole) => sum + hole.par, 0)}</td>
                      </tr>
                      <tr>
                        <td className="label-cell">Score</td>
                        {performance.holes.slice(9, 18).map((hole) => (
                          <td key={`score-${hole.hole}`} className={`score-cell result-${hole.result.toLowerCase()}`} data-over-par={Math.max(0, hole.toPar)}>
                            {hole.score}
                          </td>
                        ))}
                        <td className="total-cell">{performance.holes.slice(9, 18).reduce((sum, hole) => sum + hole.score, 0)}</td>
                      </tr>
                      <tr>
                        <td className="label-cell">+/-</td>
                        {performance.holes.slice(9, 18).map((hole) => (
                          <td key={`toPar-${hole.hole}`} className="to-par-cell">
                            {hole.toPar > 0 ? `+${hole.toPar}` : hole.toPar}
                          </td>
                        ))}
                        <td className="total-cell">
                          {(() => {
                            const backToPar = performance.holes.slice(9, 18).reduce((sum, hole) => sum + hole.toPar, 0);
                            return backToPar > 0 ? `+${backToPar}` : backToPar;
                          })()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Overall Totals */}
                <div className="overall-totals">
                  <table className="totals-table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Front 9</th>
                        <th>Back 9</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="label-cell">Par</td>
                        <td>{performance.holes.slice(0, 9).reduce((sum, hole) => sum + hole.par, 0)}</td>
                        <td>{performance.holes.slice(9, 18).reduce((sum, hole) => sum + hole.par, 0)}</td>
                        <td className="grand-total">{performance.totalPar}</td>
                      </tr>
                      <tr>
                        <td className="label-cell">Score</td>
                        <td>{performance.holes.slice(0, 9).reduce((sum, hole) => sum + hole.score, 0)}</td>
                        <td>{performance.holes.slice(9, 18).reduce((sum, hole) => sum + hole.score, 0)}</td>
                        <td className="grand-total">{performance.totalScore}</td>
                      </tr>
                      <tr>
                        <td className="label-cell">+/-</td>
                        <td>
                          {(() => {
                            const frontToPar = performance.holes.slice(0, 9).reduce((sum, hole) => sum + hole.toPar, 0);
                            return frontToPar > 0 ? `+${frontToPar}` : frontToPar;
                          })()}
                        </td>
                        <td>
                          {(() => {
                            const backToPar = performance.holes.slice(9, 18).reduce((sum, hole) => sum + hole.toPar, 0);
                            return backToPar > 0 ? `+${backToPar}` : backToPar;
                          })()}
                        </td>
                        <td className="grand-total">{performance.scoreToPar >= 0 ? `+${performance.scoreToPar}` : performance.scoreToPar}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="additional-factors-section">
              <h3>Additional Tournament Factors (Coming Soon)</h3>
              <p>Future features will include tracking weather conditions, course conditions, equipment changes, and other factors that may affect performance.</p>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .course-detail-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          background: #2e7d32;
          min-height: 100vh;
        }

        .nav-bar {
          background: rgba(0, 0, 0, 0.8);
          padding: 15px 20px;
          display: flex;
          gap: 30px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-link {
          color: white;
          text-decoration: none;
          font-weight: 500;
          transition: opacity 0.3s;
          cursor: pointer;
        }

        .nav-link:hover {
          opacity: 0.7;
        }

        .nav-link.active {
          font-weight: 600;
          opacity: 1;
        }

        .detail-header {
          color: white;
          margin-bottom: 30px;
          padding: 20px;
        }

        .back-link {
          display: inline-block;
          color: white;
          text-decoration: none;
          margin-bottom: 15px;
          font-weight: 500;
          transition: opacity 0.3s;
          cursor: pointer;
        }

        .back-link:hover {
          opacity: 0.8;
        }

        .detail-header h1 {
          font-size: 2.5em;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .no-data {
          background: white;
          background: white;
          background: white;
          background: white;
          border-radius: 15px;
          padding: 60px 20px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .no-data-icon {
          font-size: 4em;
          margin-bottom: 20px;
        }

        .no-data-content h2 {
          color: #667eea;
          margin-bottom: 10px;
        }

        .no-data-content p {
          color: #999;
          font-size: 1.1em;
          line-height: 1.6;
        }

        .score-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .tournament-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .info-card {
          background: white;
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .info-card h4 {
          color: #667eea;
          margin-bottom: 15px;
          font-size: 1.1em;
        }

        .info-card p {
          margin: 8px 0;
          color: #666;
        }

        .summary-card {
          background: white;
          background: white;
          border-radius: 10px;
          padding: 25px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .summary-label {
          color: #999;
          font-size: 0.9em;
          margin-bottom: 10px;
        }

        .summary-value {
          font-size: 2.5em;
          font-weight: bold;
          color: #667eea;
        }

        .summary-value.positive {
          color: #FF5252;
        }

        .summary-value.negative {
          color: #4CAF50;
        }

        .statistics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 10px;
          margin-bottom: 30px;
        }

        .stat-box {
          background: white;
          background: white;
          border-radius: 10px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          font-size: 2em;
          margin-bottom: 10px;
        }

        .stat-count {
          font-size: 2em;
          font-weight: bold;
          color: #667eea;
        }

        .stat-name {
          font-size: 0.9em;
          color: #999;
          margin-top: 5px;
        }

        .charts-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        @media (max-width: 768px) {
          .charts-section {
            grid-template-columns: 1fr;
          }
        }

        .chart-container {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .chart-container h3 {
          color: white;
          margin-bottom: 20px;
        }

        .scorecard-container {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }

        .scorecard-container h3 {
          color: white;
          margin-bottom: 20px;
          text-align: center;
          font-size: 1.8em;
        }

        .scorecard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #333;
        }

        .player-name {
          font-size: 1.4em;
          font-weight: bold;
          color: white;
        }

        .course-name {
          font-size: 1.2em;
          color: #666;
          text-align: center;
          flex: 1;
        }

        .date-tees {
          font-size: 0.9em;
          color: #666;
          text-align: right;
        }

        .nine-holes {
          margin-bottom: 30px;
        }

        .nine-holes h4 {
          color: white;
          margin-bottom: 10px;
          font-size: 1.2em;
          text-align: center;
        }

        .scorecard-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          border: 2px solid #333;
        }

        .scorecard-table th {
          background: rgba(255, 255, 255, 0.1);
          padding: 8px 4px;
          text-align: center;
          font-weight: 600;
          color: white;
          border: 1px solid #333;
          font-size: 0.9em;
        }

        .scorecard-table td {
          padding: 8px 4px;
          text-align: center;
          border: 1px solid #ddd;
          font-size: 0.9em;
        }

        .label-cell {
          background: #f9f9f9;
          font-weight: bold;
          text-align: left;
          padding-left: 12px;
        }

        .total-cell {
          background: #e8f5e8;
          font-weight: bold;
          color: #2e7d32;
        }

        .score-cell {
          font-weight: bold;
          position: relative;
        }

        .score-cell[data-over-par="1"] {
          border: 2px solid #ff9800;
          border-radius: 4px;
        }

        .score-cell[data-over-par="2"] {
          border: 4px solid #ff5722;
          border-radius: 4px;
        }

        .score-cell[data-over-par="3"] {
          border: 6px solid #f44336;
          border-radius: 4px;
        }

        .score-cell[data-over-par="4"] {
          border: 8px solid #d32f2f;
          border-radius: 4px;
        }

        .score-cell[data-over-par="5"] {
          border: 10px solid #b71c1c;
          border-radius: 4px;
        }

        .to-par-cell {
          font-weight: 600;
        }

        .result-eagle .score-cell {
          background: #fff9c4;
        }

        .result-birdie .score-cell {
          background: #ffebee;
        }

        .result-par .score-cell {
          background: rgba(255, 255, 255, 0.1);
        }

        .result-bogey .score-cell,
        .result-double+ .score-cell {
          background: #e8f5e8;
        }

        .overall-totals {
          margin-top: 20px;
        }

        .totals-table {
          width: 100%;
          border-collapse: collapse;
          border: 2px solid #333;
          margin: 0 auto;
          max-width: 400px;
        }

        .totals-table th,
        .totals-table td {
          padding: 10px;
          text-align: center;
          border: 1px solid #333;
          font-weight: bold;
        }

        .totals-table th {
          background: #333;
          color: white;
        }

        .grand-total {
          background: #667eea;
          color: white;
          font-size: 1.2em;
        }

        .additional-factors-section {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }

        .additional-factors-section h3 {
          color: white;
          margin-bottom: 15px;
          font-size: 1.4em;
          text-align: center;
        }

        .additional-factors-section p {
          color: #666;
          line-height: 1.6;
          text-align: center;
        }
      `}</style>

    </>
  );
}
