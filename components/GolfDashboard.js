import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

export default function GolfDashboard() {
  const [selectedScenario, setSelectedScenario] = useState('moderate');

  // Golf shot data
  const shotData = {
    1: '20ft',
    2: '12ft',
    3: '30yds',
    4: '14ft',
    5: '8ft',
    6: '15ft',
    7: '30yds',
    8: '20yds',
    9: '8yds',
    10: '11yds',
    11: '25yds',
    12: '8yds',
    13: '35yds',
    14: '15yds',
  };

  const convertToYards = (distStr) => {
    const clean = distStr.toLowerCase().trim();
    if (clean.includes('yds') || clean.includes('yd')) {
      return parseFloat(clean.replace(/yds?/g, ''));
    } else if (clean.includes('ft')) {
      return parseFloat(clean.replace('ft', '')) / 3;
    }
    return parseFloat(clean);
  };

  // Convert all shots
  const shots = Object.entries(shotData).map(([num, dist]) => ({
    shot: parseInt(num),
    distance: convertToYards(dist),
    distanceStr: dist,
  }));

  // Accuracy threshold data
  const accuracyThresholds = [
    { threshold: 10, label: '10 yds' },
    { threshold: 12, label: '12 yds' },
    { threshold: 15, label: '15 yds' },
    { threshold: 20, label: '20 yds' },
    { threshold: 25, label: '25 yds' },
    { threshold: 30, label: '30 yds' },
  ];

  const accuracyData = accuracyThresholds.map((t) => {
    const accurate = shots.filter((s) => s.distance <= t.threshold).length;
    return {
      threshold: t.label,
      accuracy: (accurate / shots.length) * 100,
      shots: accurate,
    };
  });

  // Distance distribution data
  const distanceRanges = [
    { range: '0-5 yds', min: 0, max: 5 },
    { range: '5-10 yds', min: 5, max: 10 },
    { range: '10-15 yds', min: 10, max: 15 },
    { range: '15-20 yds', min: 15, max: 20 },
    { range: '20-30 yds', min: 20, max: 30 },
    { range: '30+ yds', min: 30, max: 100 },
  ];

  const distributionData = distanceRanges.map((r) => ({
    range: r.range,
    count: shots.filter((s) => s.distance >= r.min && s.distance < r.max).length,
  }));

  const avgDistance = (shots.reduce((sum, s) => sum + s.distance, 0) / shots.length).toFixed(2);
  const withinThreshold = shots.filter((s) => s.distance <= 12).length;
  const withinThresholdPct = ((withinThreshold / shots.length) * 100).toFixed(1);

  // Projection scenarios for next 15 shots
  const scenarios = {
    conservative: {
      name: 'Conservative (Maintain Current)',
      accuracy: 57.1,
      avgDistance: parseFloat(avgDistance),
      description: 'Continue at current performance level',
      color: '#FF9800',
    },
    moderate: {
      name: 'Moderate (Steady Improvement)',
      accuracy: 70.0,
      avgDistance: 10.5,
      description: 'Improve consistency, tighter dispersion',
      color: '#4CAF50',
    },
    ambitious: {
      name: 'Ambitious (Strong Improvement)',
      accuracy: 85.0,
      avgDistance: 7.2,
      description: 'Significant improvement in accuracy',
      color: '#2196F3',
    },
    elite: {
      name: 'Elite (Tour Level)',
      accuracy: 95.0,
      avgDistance: 4.5,
      description: 'Professional-level consistency',
      color: '#9C27B0',
    },
  };

  const currentScenario = scenarios[selectedScenario];
  const next15Shots = 15;
  const projectedAccurateShots = Math.round((currentScenario.accuracy / 100) * next15Shots);

  // Create projection data
  const projectionCompare = [
    {
      category: 'Current (14 shots)',
      accuracy: parseFloat(withinThresholdPct),
      avgDistance: parseFloat(avgDistance),
    },
    {
      category: `Projected (next 15 shots)`,
      accuracy: currentScenario.accuracy,
      avgDistance: currentScenario.avgDistance,
    },
  ];

  // Scenario comparison data for radar chart
  const scenarioRadarData = Object.entries(scenarios).map(([key, scenario]) => ({
    scenario: scenario.name.split('(')[0].trim(),
    accuracy: scenario.accuracy,
    consistency: 100 - (scenario.avgDistance / parseFloat(avgDistance)) * 100,
  }));

  // Performance distribution for projection
  const projectionDistribution = [
    { range: '0-5 yds', current: shots.filter((s) => s.distance >= 0 && s.distance < 5).length, projected: Math.round((currentScenario.accuracy / 100) * next15Shots * 0.35) },
    { range: '5-10 yds', current: shots.filter((s) => s.distance >= 5 && s.distance < 10).length, projected: Math.round((currentScenario.accuracy / 100) * next15Shots * 0.40) },
    { range: '10-15 yds', current: shots.filter((s) => s.distance >= 10 && s.distance < 15).length, projected: Math.round((currentScenario.accuracy / 100) * next15Shots * 0.20) },
    { range: '15-30 yds', current: shots.filter((s) => s.distance >= 15 && s.distance < 30).length || 0, projected: Math.round((100 - currentScenario.accuracy) / 100 * next15Shots * 0.50) },
    { range: '30+ yds', current: shots.filter((s) => s.distance >= 30).length || 0, projected: Math.round((100 - currentScenario.accuracy) / 100 * next15Shots * 0.50) },
  ];

  return (
    <div className="dashboard">
      <div className="header">
        <h1>⛳ Golf Analytics Dashboard</h1>
        <h2>Approach Shots</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{withinThresholdPct}%</div>
          <div className="stat-label">Accuracy (≤12 yds)</div>
          <div className="stat-detail">{withinThreshold} of {shots.length} shots</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{avgDistance}</div>
          <div className="stat-label">Average Distance</div>
          <div className="stat-detail">yards from flag</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Math.min(...shots.map((s) => s.distance)).toFixed(2)}</div>
          <div className="stat-label">Best Shot</div>
          <div className="stat-detail">closest to flag</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Math.max(...shots.map((s) => s.distance)).toFixed(2)}</div>
          <div className="stat-label">Worst Shot</div>
          <div className="stat-detail">farthest from flag</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Accuracy by Distance Threshold</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={accuracyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="threshold" />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
              <Legend />
              <Bar dataKey="accuracy" fill="#4CAF50" name="Accuracy %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Shot Distance Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#2196F3" name="Number of Shots" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Individual Shot Distances</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="shot" name="Shot Number" />
              <YAxis dataKey="distance" name="Distance (yds)" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Shot Distance" data={shots} fill="#FF9800" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Cumulative Shot Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={shots}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="shot" />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toFixed(2)} yds`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="distance"
                stroke="#9C27B0"
                name="Distance from Flag"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="shots-table">
        <h3>Individual Shots</h3>
        <table>
          <thead>
            <tr>
              <th>Shot</th>
              <th>Distance (Original)</th>
              <th>Distance (Yards)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {shots.map((shot) => (
              <tr key={shot.shot} className={shot.distance <= 12 ? 'accurate' : 'missed'}>
                <td>#{shot.shot}</td>
                <td>{shot.distanceStr}</td>
                <td>{shot.distance.toFixed(2)} yds</td>
                <td>{shot.distance <= 12 ? '✓ Accurate' : '✗ Missed'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="projection-section">
        <h2>📈 Next 15 Shots Projection</h2>
        <p className="section-subtitle">Select a scenario to explore different performance levels</p>

        <div className="scenario-selector">
          {Object.entries(scenarios).map(([key, scenario]) => (
            <button
              key={key}
              className={`scenario-btn ${selectedScenario === key ? 'active' : ''}`}
              onClick={() => setSelectedScenario(key)}
              style={{
                borderColor: scenario.color,
                backgroundColor: selectedScenario === key ? scenario.color : 'white',
                color: selectedScenario === key ? 'white' : scenario.color,
              }}
            >
              <div className="scenario-title">{scenario.name}</div>
              <div className="scenario-detail">{scenario.accuracy.toFixed(1)}% accuracy</div>
            </button>
          ))}
        </div>

        <div className="projection-cards">
          <div className="projection-card" style={{ borderTopColor: currentScenario.color }}>
            <div className="projection-stat">
              <div className="projection-label">Expected Accuracy</div>
              <div className="projection-value" style={{ color: currentScenario.color }}>
                {currentScenario.accuracy.toFixed(1)}%
              </div>
              <div className="projection-detail">
                {projectedAccurateShots} of {next15Shots} accurate shots
              </div>
            </div>
          </div>

          <div className="projection-card" style={{ borderTopColor: currentScenario.color }}>
            <div className="projection-stat">
              <div className="projection-label">Avg Distance from Flag</div>
              <div className="projection-value" style={{ color: currentScenario.color }}>
                {currentScenario.avgDistance.toFixed(1)} yds
              </div>
              <div className="projection-detail">
                vs {avgDistance} yds currently
              </div>
            </div>
          </div>

          <div className="projection-card" style={{ borderTopColor: currentScenario.color }}>
            <div className="projection-stat">
              <div className="projection-label">Consistency Improvement</div>
              <div className="projection-value" style={{ color: currentScenario.color }}>
                {((1 - currentScenario.avgDistance / parseFloat(avgDistance)) * 100).toFixed(0)}%
              </div>
              <div className="projection-detail">
                {currentScenario.avgDistance < parseFloat(avgDistance) ? 'tighter' : 'looser'} dispersion
              </div>
            </div>
          </div>

          <div className="projection-card" style={{ borderTopColor: currentScenario.color }}>
            <div className="projection-stat">
              <div className="projection-label">Improvement Area</div>
              <div className="projection-value" style={{ color: currentScenario.color }}>
                {(currentScenario.accuracy - parseFloat(withinThresholdPct)).toFixed(1)}%
              </div>
              <div className="projection-detail">
                gain from current level
              </div>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-container">
            <h3>Current vs Projected Accuracy</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectionCompare}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis yAxisId="left" label={{ value: 'Accuracy %', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Avg Distance (yds)', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="accuracy" fill="#4CAF50" name="Accuracy %" />
                <Bar yAxisId="right" dataKey="avgDistance" fill="#2196F3" name="Avg Distance (yds)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3>Scenario Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={scenarioRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="scenario" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Accuracy %" dataKey="accuracy" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.3} />
                <Radar name="Consistency %" dataKey="consistency" stroke="#2196F3" fill="#2196F3" fillOpacity={0.3} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3>Projected Distance Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectionDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="current" fill="#FF9800" name="Current (14 shots)" />
                <Bar dataKey="projected" fill="#4CAF50" name="Projected (15 shots)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3>Shot Improvement Trajectory</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[
                { shot: 'Current\nPerformance', distance: parseFloat(avgDistance) },
                { shot: 'Conservative', distance: scenarios.conservative.avgDistance },
                { shot: 'Moderate', distance: scenarios.moderate.avgDistance },
                { shot: 'Ambitious', distance: scenarios.ambitious.avgDistance },
                { shot: 'Elite', distance: scenarios.elite.avgDistance },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="shot" />
                <YAxis label={{ value: 'Avg Distance from Flag (yds)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `${value.toFixed(2)} yds`} />
                <Legend />
                <Line type="monotone" dataKey="distance" stroke="#FF6B6B" name="Avg Distance" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="insights-box">
          <h3>💡 Key Insights</h3>
          <ul>
            <li>
              <strong>Current Performance:</strong> You're making {withinThreshold} out of {shots.length} accurate
              shots ({withinThresholdPct}%). This is a solid baseline!
            </li>
            <li>
              <strong>{currentScenario.name.split('(')[0].trim()} Goal:</strong> {currentScenario.description}. This
              would give you {projectedAccurateShots} accurate shots per 15.
            </li>
            <li>
              <strong>Key Metric:</strong> Your average shot distance is {avgDistance} yards. Reducing this to{' '}
              {currentScenario.avgDistance.toFixed(1)} yards would significantly improve your accuracy.
            </li>
            <li>
              <strong>Next Steps:</strong> Focus on consistency in the 5-15 yard range to see the most improvement.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
