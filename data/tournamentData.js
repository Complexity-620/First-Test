// Tournament data structure with detailed hole information
// HOW TO ADD DATA:
// 1. Update date to the tournament date (YYYY-MM-DD format)
// 2. Update tees with the yardage for each hole (18 values)
// 3. Update pars with the par for each hole (18 values) - if different from defaults
// 4. Update scores with your actual score for each hole (18 values)
//
// Example:
// scores: [4, 5, 3, 4, 6, 4, 2, 5, 4, 5, 5, 4, 4, 3, 6, 4, 4, 4]
// tees: [380, 420, 150, 410, 520, 380, 180, 430, 390, 540, 420, 160, 410, 380, 550, 380, 170, 420]

export const tournamentData = {
  courses: {
    cincoRanch: {
      id: 'cinco-ranch',
      name: 'Cinco Ranch Golf Club',
      // Front 9 pars: holes 1-9
      // Back 9 pars: holes 10-18
      pars: [4, 4, 3, 5, 3, 5, 4, 4, 4, 4, 4, 3, 4, 4, 5, 3, 4, 4],
      // Yardage for each hole (White tees)
      tees: [341, 303, 133, 472, 133, 491, 367, 304, 351, 373, 291, 126, 371, 356, 484, 127, 418, 362],
      // Your scores for each hole (18 values)
      scores: [7, 5, 5, 6, 5, 6, 6, 6, 7, 7, 7, 5, 6, 6, 7, 3, 6, 7], // February 24th tournament
      date: "2026-02-24", // February 24th
      teeName: 'White', // White tees
    },
    meadowbrook: {
      id: 'meadowbrook',
      name: 'Meadowbrook Farms',
      pars: [4, 4, 3, 4, 5, 4, 3, 4, 4, 5, 4, 3, 4, 4, 5, 4, 3, 4],
      tees: [380, 420, 150, 410, 520, 380, 180, 430, 390, 540, 420, 160, 410, 380, 550, 380, 170, 420],
      scores: null, // ADD YOUR SCORES HERE
      date: null,
      teeName: 'Championship',
    },
    willowfork: {
      id: 'willowfork',
      name: 'Willowfork Country Club',
      pars: [4, 4, 3, 4, 5, 4, 3, 4, 4, 5, 4, 3, 4, 4, 5, 4, 3, 4],
      tees: [380, 420, 150, 410, 520, 380, 180, 430, 390, 540, 420, 160, 410, 380, 550, 380, 170, 420],
      scores: null, // ADD YOUR SCORES HERE
      date: null,
      teeName: 'Championship',
    },
  },
};

export const calculatePerformance = (courseData) => {
  if (!courseData.scores) return null;

  const { pars, scores, tees } = courseData;

  const holes = pars.map((par, i) => {
    const score = scores[i];
    const teeYardage = tees[i];
    const toPar = score - par;
    let result = '';

    if (toPar < -1) result = 'Eagle';
    else if (toPar === -1) result = 'Birdie';
    else if (toPar === 0) result = 'Par';
    else if (toPar === 1) result = 'Bogey';
    else result = 'Double+';

    return {
      hole: i + 1,
      par,
      score,
      teeYardage,
      toPar,
      result,
    };
  });

  const totalScore = scores.reduce((a, b) => a + b, 0);
  const totalPar = pars.reduce((a, b) => a + b, 0);
  const totalYardage = tees.reduce((a, b) => a + b, 0);
  const scoreToPar = totalScore - totalPar;

  const birdies = holes.filter((h) => h.toPar === -1).length;
  const parCount = holes.filter((h) => h.toPar === 0).length;
  const bogeys = holes.filter((h) => h.toPar === 1).length;
  const eagles = holes.filter((h) => h.toPar < -1).length;
  const doublePlus = holes.filter((h) => h.toPar > 1).length;

  // Additional statistics
  const scoringAverage = totalScore / 18;
  const par3Average = holes.filter(h => h.par === 3).reduce((sum, h) => sum + h.score, 0) / holes.filter(h => h.par === 3).length;
  const par4Average = holes.filter(h => h.par === 4).reduce((sum, h) => sum + h.score, 0) / holes.filter(h => h.par === 4).length;
  const par5Average = holes.filter(h => h.par === 5).reduce((sum, h) => sum + h.score, 0) / holes.filter(h => h.par === 5).length;

  return {
    holes,
    totalScore,
    totalPar,
    totalYardage,
    scoreToPar,
    score_to_par_str: scoreToPar > 0 ? `+${scoreToPar}` : scoreToPar < 0 ? `${scoreToPar}` : 'E',
    statistics: {
      eagles,
      birdies,
      pars: parCount,
      bogeys,
      doublePlus,
    },
    averages: {
      overall: scoringAverage.toFixed(1),
      par3: par3Average.toFixed(1),
      par4: par4Average.toFixed(1),
      par5: par5Average.toFixed(1),
    },
  };
};
