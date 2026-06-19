const DEFAULT_TEAMS = [
  { name: "GEN", power: 94, varianceMin: -2, varianceMax: 1 },
  { name: "BLG", power: 93, varianceMin: -2, varianceMax: 2 },
  { name: "T1", power: 92, varianceMin: -2, varianceMax: 3 },
  { name: "HLE", power: 91, varianceMin: -3, varianceMax: 2 },
  { name: "JDG", power: 88, varianceMin: -3, varianceMax: 3 },
  { name: "TES", power: 87, varianceMin: -4, varianceMax: 4 },
  { name: "DK", power: 86, varianceMin: -4, varianceMax: 3 },
  { name: "G2", power: 85, varianceMin: -5, varianceMax: 5 },
  { name: "IG", power: 85, varianceMin: -4, varianceMax: 4 },
  { name: "KC", power: 83, varianceMin: -4, varianceMax: 4 },
  { name: "LYON", power: 83, varianceMin: -4, varianceMax: 4 },
  { name: "C9", power: 80, varianceMin: -4, varianceMax: 4 },
  { name: "MKOI", power: 80, varianceMin: -4, varianceMax: 4 },
  { name: "TSW", power: 77, varianceMin: -5, varianceMax: 5 },
  { name: "CFO", power: 75, varianceMin: -4, varianceMax: 4 },
  { name: "INTZ", power: 70, varianceMin: -6, varianceMax: 5 },
];

const TEAM_KEY = "lol-worlds-alpha-teams";
const STATS_KEY = "lol-worlds-alpha-stats";

const $ = (selector) => document.querySelector(selector);

const els = {
  views: document.querySelectorAll(".view"),
  startGame: $("#start-game"),
  customGame: $("#custom-game"),
  showStats: $("#show-stats"),
  editTeams: $("#edit-teams"),
  backHomeGame: $("#back-home-game"),
  backHomeStats: $("#back-home-stats"),
  backHomeStatsBottom: $("#back-home-stats-bottom"),
  backHomeEdit: $("#back-home-edit"),
  backHomeCustom: $("#back-home-custom"),
  gameTitle: $("#game-title"),
  drawPanel: $("#draw-panel"),
  drawPhase: $("#draw-phase"),
  drawTitle: $("#draw-title"),
  drawPool: $("#draw-pool"),
  drawStatus: $("#draw-status"),
  drawBoard: $("#swiss-draw-board"),
  drawScroll: $("#draw-scroll"),
  matchPhase: $("#match-phase"),
  matchTeams: $("#match-teams"),
  matchPowers: $("#match-powers"),
  odds: $("#odds"),
  resultBox: $("#result-box"),
  nextStepControls: document.querySelectorAll(".next-step-control"),
  quickSwiss: $("#quick-swiss"),
  quickKnockout: $("#quick-knockout"),
  reviewSwiss: $("#review-swiss"),
  eventLog: $("#event-log"),
  totalSims: $("#total-sims"),
  championBoard: $("#champion-board"),
  resetStats: $("#reset-stats"),
  teamForm: $("#team-form"),
  customTeamForm: $("#custom-team-form"),
  saveTeams: $("#save-teams"),
  resetTeams: $("#reset-teams"),
  startCustom: $("#start-custom"),
  resetCustom: $("#reset-custom"),
  modalOverlay: $("#modal-overlay"),
  modalKicker: $("#modal-kicker"),
  modalTitle: $("#modal-title"),
  modalBody: $("#modal-body"),
  modalClose: $("#modal-close"),
  modalConfirm: $("#modal-confirm"),
};

let tournament = null;
let pendingModalConfirm = null;

function loadTeams() {
  const saved = JSON.parse(localStorage.getItem(TEAM_KEY) || "null");
  if (!Array.isArray(saved) || saved.length !== DEFAULT_TEAMS.length) {
    return structuredClone(DEFAULT_TEAMS);
  }
  return saved.map((team, index) => {
    const fallback = DEFAULT_TEAMS[index];
    const name = String(team.name || fallback.name).trim() || fallback.name;
    const power = clamp(Number(team.power) || fallback.power, 1, 99);
    let varianceMin = clamp(
      Number.isFinite(Number(team.varianceMin)) ? Number(team.varianceMin) : fallback.varianceMin,
      -20,
      20,
    );
    let varianceMax = clamp(
      Number.isFinite(Number(team.varianceMax)) ? Number(team.varianceMax) : fallback.varianceMax,
      -20,
      20,
    );
    if (varianceMin > varianceMax) {
      [varianceMin, varianceMax] = [varianceMax, varianceMin];
    }
    return { name, power, varianceMin, varianceMax };
  });
}

function saveTeams(teams) {
  localStorage.setItem(TEAM_KEY, JSON.stringify(teams));
}

function loadStats() {
  const raw = JSON.parse(localStorage.getItem(STATS_KEY) || '{"total":0,"champions":{}}');
  return normalizeStats(raw);
}

function saveStats(stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(normalizeStats(stats)));
}

function normalizeStats(stats) {
  const champions = stats && typeof stats.champions === "object" && stats.champions ? stats.champions : {};
  const championRuns =
    stats && typeof stats.championRuns === "object" && stats.championRuns ? stats.championRuns : {};
  return {
    total: Number.isFinite(Number(stats?.total)) ? Number(stats.total) : 0,
    champions,
    championRuns,
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function showView(name) {
  els.views.forEach((view) => view.classList.remove("active"));
  $(`#view-${name}`).classList.add("active");
}

function setNextStepText(text) {
  els.nextStepControls.forEach((button) => {
    button.textContent = text;
  });
}

function updateDrawControls() {
  if (!tournament) return;
  const isSwissPhase = tournament.phase === "swiss";
  const hasKnockout = Boolean(tournament.knockout);
  const isKnockoutPhase = tournament.phase === "knockout" || tournament.phase === "complete";

  if (els.quickSwiss) els.quickSwiss.hidden = !isSwissPhase;
  if (els.quickKnockout) els.quickKnockout.hidden = !isKnockoutPhase;
  if (els.reviewSwiss) {
    els.reviewSwiss.hidden = !hasKnockout;
    els.reviewSwiss.textContent = tournament.displayMode === "swiss" ? "查看淘汰赛" : "回顾瑞士轮";
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function teamId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function winRate(teamA, teamB, match = null) {
  const powerA = match ? matchPower(match, teamA) : teamA.basePower;
  const powerB = match ? matchPower(match, teamB) : teamB.basePower;
  return clamp(50 + (powerA - powerB) * 1.357, 5, 95);
}

function formatRate(rate) {
  return `${Math.round(rate)}%`;
}

function formatSigned(value) {
  return value > 0 ? `+${value}` : `${value}`;
}

function effectiveVarianceRange(team) {
  let min = team.varianceMin;
  let max = team.varianceMax;
  if (team.lastGameResult === "win") {
    min += 1;
  } else if (team.lastGameResult === "loss") {
    max -= 1;
  }
  if (min > max) {
    min = max = Math.round((min + max) / 2);
  }
  return { min, max };
}

function rollVariance(team) {
  const { min, max } = effectiveVarianceRange(team);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function prepareMatch(match) {
  if (match.prepared || match.kind === "source") return;
  match.variance = {
    [match.teamA.name]: rollVariance(match.teamA),
    [match.teamB.name]: rollVariance(match.teamB),
  };
  match.matchPower = {
    [match.teamA.name]: clamp(match.teamA.basePower + match.variance[match.teamA.name], 1, 99),
    [match.teamB.name]: clamp(match.teamB.basePower + match.variance[match.teamB.name], 1, 99),
  };
  match.prepared = true;
}

function matchPower(match, team) {
  prepareMatch(match);
  return match.matchPower[team.name];
}

function resetMatchPower(match) {
  delete match.variance;
  delete match.matchPower;
  match.prepared = false;
}

function recordLastGameResult(match, gameWinner) {
  const gameLoser = gameWinner.name === match.teamA.name ? match.teamB : match.teamA;
  gameWinner.lastGameResult = "win";
  gameLoser.lastGameResult = "loss";
}

function swissTargetWins(record) {
  return ["2-0", "0-2", "2-1", "1-2", "2-2"].includes(record) ? 2 : 1;
}

function matchTargetWins(match) {
  if (match.kind === "final") return 4;
  if (match.kind === "series") return 3;
  return match.targetWins || 1;
}

function ensureMatchScore(match) {
  if (match.score) return;
  match.score = { [match.teamA.name]: 0, [match.teamB.name]: 0 };
  match.gamesPlayed = 0;
  if (match.kind === "final") {
    match.score[match.upperChampion.name] = 1;
  }
}

function simulateMatchGame(match) {
  if (tournament.revealed && !match.result) {
    resetMatchPower(match);
  }
  ensureMatchScore(match);
  const rate = winRate(match.teamA, match.teamB, match);
  const roll = Math.floor(Math.random() * 100) + 1;
  const gameWinner = roll <= rate ? match.teamA : match.teamB;
  match.score[gameWinner.name] += 1;
  match.gamesPlayed += 1;
  recordLastGameResult(match, gameWinner);

  const targetWins = matchTargetWins(match);
  const isComplete =
    match.score[match.teamA.name] >= targetWins || match.score[match.teamB.name] >= targetWins;
  const winner = isComplete
    ? match.score[match.teamA.name] > match.score[match.teamB.name]
      ? match.teamA
      : match.teamB
    : null;
  const loser = winner ? (winner.name === match.teamA.name ? match.teamB : match.teamA) : null;

  return { roll, gameWinner, isComplete, winner, loser, targetWins };
}

function matchScoreText(match, winner = null, loser = null) {
  ensureMatchScore(match);
  if (winner && loser) {
    return `${match.score[winner.name]}-${match.score[loser.name]}`;
  }
  return `${match.score[match.teamA.name]}-${match.score[match.teamB.name]}`;
}

function pickLine(lines) {
  return lines[Math.floor(Math.random() * lines.length)];
}

function gameReview(match, roll, winner) {
  const rateA = winRate(match.teamA, match.teamB, match);
  const favorite = rateA >= 50 ? match.teamA : match.teamB;
  const underdog = favorite.name === match.teamA.name ? match.teamB : match.teamA;
  const rollBoundary = rateA;
  const didFavoriteWin = winner.name === favorite.name;

  if (!didFavoriteWin) {
    const upsetDepth =
      underdog.name === match.teamA.name ? rollBoundary - roll : roll - rollBoundary;
    if (upsetDepth >= 21) {
      return pickLine([
        `世界赛震动！${underdog.name}完成不可思议的奇迹。`,
        `没人能想到的结果发生了，${underdog.name}击败${favorite.name}。`,
        `电竞史上又一经典冷门诞生，${underdog.name}掀翻${favorite.name}。`,
      ]);
    }
    if (upsetDepth >= 11) {
      return pickLine([
        `${underdog.name}完成惊天冷门，${favorite.name}轰然倒下。`,
        `世界赛历史又添名场面，${underdog.name}掀翻夺冠热门${favorite.name}。`,
      ]);
    }
    return pickLine([
      `${underdog.name}爆冷击败${favorite.name}，送出一场冷门。`,
      `${underdog.name}抓住机会，硬生生从${favorite.name}手里抢下胜利。`,
    ]);
  }

  const distance =
    favorite.name === match.teamA.name ? rollBoundary - roll : roll - rollBoundary;
  if (distance >= 50) {
    return pickLine([
      `${favorite.name}没有给${underdog.name}任何机会，打出一场玲珑塔。`,
      `${favorite.name}从头压制到尾，${underdog.name}全场毫无还手之力。`,
      `${favorite.name}轻松收下比赛，${underdog.name}甚至没能摸到比赛节奏。`,
    ]);
  }
  if (distance >= 30) {
    return pickLine([
      `${favorite.name}全场掌控局势，顺利击败${underdog.name}。`,
      `${favorite.name}优势明显，比赛早早失去悬念。`,
    ]);
  }
  if (distance >= 15) {
    return pickLine([
      `${favorite.name}稳扎稳打拿下比赛。`,
      `${favorite.name}发挥更胜一筹，成功战胜${underdog.name}。`,
    ]);
  }
  if (distance >= 5) {
    return pickLine([
      `${underdog.name}顽强抵抗，${favorite.name}最终有惊无险拿下胜利。`,
      `${favorite.name}打得满头大汗，最终艰难取胜。`,
    ]);
  }
  return pickLine([
    `${favorite.name}在悬崖边完成逃生，仅以毫厘之差击败${underdog.name}。`,
    `${underdog.name}险些创造奇迹，${favorite.name}最后时刻惊险守住胜利。`,
    `${favorite.name}差点翻车，最终惊险守住胜利。`,
  ]);
}

function seriesReview(match, winner, loser) {
  const winnerScore = match.score[winner.name];
  const loserScore = match.score[loser.name];
  if (match.kind === "swiss") return "";
  if (winnerScore === 3 && loserScore === 0) {
    return `${winner.name}横扫晋级，没有留给${loser.name}任何机会。`;
  }
  if (winnerScore === 3 && loserScore === 1) {
    return `${loser.name}一度看到希望，但${winner.name}稳稳终结比赛。`;
  }
  if (winnerScore === 3 && loserScore === 2) {
    return `双方鏖战五局，${winner.name}最终笑到最后。`;
  }
  if (winnerScore === 4 && loserScore <= 1) {
    return `${winner.name}强势加冕，总决赛几乎没有悬念。`;
  }
  if (winnerScore === 4 && loserScore <= 2) {
    return `${winner.name}掌控总决赛节奏，稳稳收下冠军。`;
  }
  if (winnerScore === 4 && loserScore === 3) {
    return `总决赛打满，${winner.name}在最后一刻捧起奖杯。`;
  }
  return `${winner.name}笑到最后，淘汰${loser.name}。`;
}

function createTournament(sourceTeams = loadTeams(), options = {}) {
  const teams = sourceTeams.map((team) => ({
    ...team,
    basePower: team.power,
    id: teamId(team.name),
    wins: 0,
    losses: 0,
    lastGameResult: null,
    status: "active",
    opponents: [],
  }));

  tournament = {
    teams,
    phase: "swiss",
    swissRound: 1,
    currentQueue: [],
    currentMatch: null,
    revealed: false,
    draw: null,
    displayDraw: null,
    swissHistory: [],
    displayMode: "swiss",
    isCustom: Boolean(options.isCustom),
    qualifiers: [],
    eliminated: [],
    knockout: null,
    log: [],
    champion: null,
    completedMatches: [],
  };

  queueSwissRound();
  tournament.log.unshift(`本届参赛队伍：${teams.map((team) => team.name).join("、")}。点击下一步开始抽签。`);
  showView("game");
  renderGame();
}

function queueSwissRound() {
  const active = tournament.teams.filter((team) => team.status === "active");
  const matches = createSwissPairs(active).map(([teamA, teamB]) => ({
    phase: `Swiss Round ${tournament.swissRound}`,
    kind: "swiss",
    teamA,
    teamB,
    record: `${teamA.wins}-${teamA.losses}`,
    targetWins: swissTargetWins(`${teamA.wins}-${teamA.losses}`),
    bestOf: swissTargetWins(`${teamA.wins}-${teamA.losses}`) * 2 - 1,
  }));
  tournament.draw = {
    kind: "swiss",
    phase: `Swiss Round ${tournament.swissRound}`,
    matches,
    revealedTeams: 0,
  };
  tournament.displayDraw = tournament.draw;
  tournament.currentQueue = [];
  tournament.currentMatch = null;
  tournament.revealed = false;
}

function createSwissPairs(activeTeams) {
  const groups = new Map();
  activeTeams.forEach((team) => {
    const record = `${team.wins}-${team.losses}`;
    if (!groups.has(record)) groups.set(record, []);
    groups.get(record).push(team);
  });

  const records = [...groups.keys()].sort((a, b) => {
    const [aw, al] = a.split("-").map(Number);
    const [bw, bl] = b.split("-").map(Number);
    return bw - aw || al - bl;
  });

  const pairs = [];
  records.forEach((record) => {
    const group = shuffle(groups.get(record));
    while (group.length > 1) {
      const teamA = group.shift();
      let opponentIndex = group.findIndex(
        (candidate) => !teamA.opponents.includes(candidate.name),
      );
      if (opponentIndex < 0) opponentIndex = 0;
      const [teamB] = group.splice(opponentIndex, 1);
      pairs.push([teamA, teamB]);
    }
  });

  return pairs;
}

function advanceSwiss(match, winner, loser) {
  winner.wins += 1;
  loser.losses += 1;
  match.teamA.opponents.push(match.teamB.name);
  match.teamB.opponents.push(match.teamA.name);

  if (winner.wins === 3) {
    winner.status = "qualified";
    tournament.qualifiers.push(winner);
  }
  if (loser.losses === 3) {
    loser.status = "eliminated";
    tournament.eliminated.push(loser);
  }
}

function startKnockout() {
  tournament.phase = "knockout";
  tournament.draw = null;
  tournament.displayDraw = null;
  tournament.displayMode = "knockout";
  const seeds = [...tournament.qualifiers].sort((a, b) => {
    return b.wins - a.wins || a.losses - b.losses || b.basePower - a.basePower;
  });
  const highPool = seeds.slice(0, 4);
  const lowPool = seeds.slice(4, 8);
  tournament.knockout = {
    seeds,
    stage: "UB_R1",
    matches: {},
    ubR1Winners: [],
    ubR1Losers: [],
    lbR1Winners: [],
    ubR2Winners: [],
    ubR2Losers: [],
    lbR2Winners: [],
    ubChampion: null,
    ubFinalLoser: null,
    lbFinalWinner: null,
    lbChampion: null,
    drawMatches: [],
    drawRevealedTeams: 0,
  };
  showModal(
    "8强已经产生",
    seeds.map((team) => team.name).join("、"),
    "瑞士轮结束",
  );
  tournament.log.unshift(`POOL B 低顺位池：${lowPool.map((team) => team.name).join(", ")}`);
  tournament.log.unshift(`POOL A 高顺位池：${highPool.map((team) => team.name).join(", ")}`);
  tournament.log.unshift("瑞士轮结束，8支队伍进入双败淘汰赛。");
  const bracketDraw = createKnockoutDraw(seeds);
  tournament.log.unshift(`淘汰赛抽签：${bracketDraw.logs.join(" / ")}`);
  tournament.knockout.drawMatches = bracketDraw.matches;
  bracketDraw.matches.forEach((match) => {
    tournament.knockout.matches[match.slot] = match;
  });
  if (els.drawScroll) els.drawScroll.scrollLeft = 0;
}

function createKnockoutDraw(seeds) {
  const undefeated = shuffle(seeds.filter((team) => team.wins === 3 && team.losses === 0));
  const threeOne = shuffle(seeds.filter((team) => team.wins === 3 && team.losses === 1));
  const threeTwo = shuffle(seeds.filter((team) => team.wins === 3 && team.losses === 2));

  if (undefeated.length < 2 || threeTwo.length < 3 || threeOne.length < 3) {
    return {
      logs: ["战绩池异常，按瑞士排名直接落位"],
      matches: [
        buildSeries("Upper Bracket Round 1", seeds[0], seeds[7], "UB_R1", "W1"),
        buildSeries("Upper Bracket Round 1", seeds[1], seeds[6], "UB_R1", "W2"),
        buildSeries("Upper Bracket Round 1", seeds[2], seeds[5], "UB_R1", "W3"),
        buildSeries("Upper Bracket Round 1", seeds[3], seeds[4], "UB_R1", "W4"),
      ],
    };
  }

  const topSeed = undefeated[0];
  const bottomSeed = undefeated[1];
  const topOpponent = threeTwo.shift();
  const bottomOpponent = threeTwo.shift();
  const mixedPool = shuffle([...threeOne, ...threeTwo]);
  const matches = [
    buildSeries("Upper Bracket Round 1", topSeed, topOpponent, "UB_R1", "W1"),
    buildSeries("Upper Bracket Round 1", mixedPool[0], mixedPool[1], "UB_R1", "W2"),
    buildSeries("Upper Bracket Round 1", bottomSeed, bottomOpponent, "UB_R1", "W3"),
    buildSeries("Upper Bracket Round 1", mixedPool[2], mixedPool[3], "UB_R1", "W4"),
  ];

  return {
    logs: [
      `3-0分半区：${topSeed.name} / ${bottomSeed.name}`,
      `3-2对手：${topSeed.name} vs ${topOpponent.name}，${bottomSeed.name} vs ${bottomOpponent.name}`,
      `剩余池：${mixedPool.map((team) => team.name).join(", ")}`,
    ],
    matches,
  };
}

function queueKnockoutMatches(...matches) {
  matches.forEach((match) => {
    tournament.knockout.matches[match.slot] = match;
    tournament.currentQueue.push(match);
  });
}

function buildSeries(phase, teamA, teamB, stage, slot) {
  return { phase, kind: "series", stage, slot, teamA, teamB, bestOf: 5 };
}

function buildFinal(teamA, teamB, upperChampion) {
  const match = {
    phase: "Grand Final",
    kind: "final",
    stage: "FINAL",
    slot: "FINAL",
    teamA,
    teamB,
    bestOf: 7,
    upperChampion,
  };
  match.score = { [teamA.name]: 0, [teamB.name]: 0 };
  match.score[upperChampion.name] = 1;
  match.gamesPlayed = 0;
  return match;
}

function advanceKnockout(match, winner, loser) {
  const k = tournament.knockout;

  if (match.stage === "UB_R1") {
    k.ubR1Winners.push(winner);
    k.ubR1Losers.push(loser);
    if (k.ubR1Winners.length === 4) {
      queueKnockoutMatches(
        buildSeries("Lower Bracket Round 1", k.ubR1Losers[0], k.ubR1Losers[1], "LB_R1", "L1"),
        buildSeries("Lower Bracket Round 1", k.ubR1Losers[2], k.ubR1Losers[3], "LB_R1", "L2"),
        buildSeries("Upper Bracket Semifinal", k.ubR1Winners[0], k.ubR1Winners[1], "UB_R2", "W5"),
        buildSeries("Upper Bracket Semifinal", k.ubR1Winners[2], k.ubR1Winners[3], "UB_R2", "W6"),
      );
    }
  }

  if (match.stage === "LB_R1") {
    k.lbR1Winners.push(winner);
    tournament.log.unshift(`${loser.name} 第二次失败，被淘汰。`);
  }

  if (match.stage === "UB_R2") {
    k.ubR2Winners.push(winner);
    k.ubR2Losers.push(loser);
    const sourceSlot = k.ubR2Losers.length === 1 ? "L4" : "L3";
    k.matches[sourceSlot] = {
      phase: "Lower Bracket Entry",
      kind: "source",
      slot: sourceSlot,
      teamA: loser,
      result: { winner: loser, scoreText: "" },
    };
    if (k.ubR2Winners.length === 2 && k.lbR1Winners.length === 2) {
      queueKnockoutMatches(
        buildSeries("Lower Bracket Round 2", k.lbR1Winners[0], k.ubR2Losers[1], "LB_R2", "L5"),
        buildSeries("Lower Bracket Round 2", k.lbR1Winners[1], k.ubR2Losers[0], "LB_R2", "L6"),
        buildSeries("Upper Bracket Final", k.ubR2Winners[0], k.ubR2Winners[1], "UB_FINAL", "W7"),
      );
    }
  }

  if (match.stage === "LB_R2") {
    k.lbR2Winners.push(winner);
    tournament.log.unshift(`${loser.name} 第二次失败，被淘汰。`);
    if (k.lbR2Winners.length === 2) {
      queueKnockoutMatches(
        buildSeries("Lower Bracket Final", k.lbR2Winners[0], k.lbR2Winners[1], "LB_FINAL", "L7"),
      );
    }
  }

  if (match.stage === "UB_FINAL") {
    k.ubChampion = winner;
    k.ubFinalLoser = loser;
    tournament.log.unshift(`${loser.name} 胜者组决赛失利，进入败者组最终轮。`);
    if (k.lbFinalWinner) {
      queueKnockoutMatches(
        buildSeries("Lower Bracket Grand Final", k.lbFinalWinner, loser, "LB_GRAND_FINAL", "L8"),
      );
    }
  }

  if (match.stage === "LB_FINAL") {
    k.lbFinalWinner = winner;
    tournament.log.unshift(`${loser.name} 第二次失败，被淘汰。`);
    if (k.ubFinalLoser) {
      queueKnockoutMatches(
        buildSeries("Lower Bracket Grand Final", winner, k.ubFinalLoser, "LB_GRAND_FINAL", "L8"),
      );
    }
  }

  if (match.stage === "LB_GRAND_FINAL") {
    k.lbChampion = winner;
    tournament.log.unshift(`${loser.name} 第二次失败，被淘汰。`);
    if (k.ubChampion) {
      queueKnockoutMatches(buildFinal(k.ubChampion, winner, k.ubChampion));
    }
  }

  if (match.stage === "FINAL") {
    finishTournament(winner);
  }
}

function recordCompletedMatch(match) {
  if (!tournament?.completedMatches || !match.result) return;
  ensureMatchScore(match);
  tournament.completedMatches.push({
    phase: match.phase,
    kind: match.kind,
    teamA: match.teamA.name,
    teamB: match.teamB.name,
    winner: match.result.winner.name,
    loser: match.result.loser.name,
    scoreA: match.score[match.teamA.name],
    scoreB: match.score[match.teamB.name],
    scoreText: match.result.scoreText,
    displayScore: match.result.displayScore,
    bestOf: match.bestOf,
    upperChampion: match.upperChampion?.name || null,
  });
}

function buildChampionRun(champion) {
  const matches = (tournament.completedMatches || []).filter((match) => {
    return match.teamA === champion.name || match.teamB === champion.name;
  });
  const road = matches.map((match, index) => {
    const isTeamA = match.teamA === champion.name;
    const opponent = isTeamA ? match.teamB : match.teamA;
    const championScore = isTeamA ? match.scoreA : match.scoreB;
    const opponentScore = isTeamA ? match.scoreB : match.scoreA;
    const won = match.winner === champion.name;
    const prefix = won ? "胜" : "负";
    return {
      round: index + 1,
      phase: match.phase,
      opponent,
      result: prefix,
      score: `${championScore}-${opponentScore}`,
      text: `${match.phase}：${prefix} ${opponent} (${championScore}-${opponentScore})`,
    };
  });

  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    champion: champion.name,
    createdAt: new Date().toLocaleString("zh-CN"),
    swissRecord: `${champion.wins}-${champion.losses}`,
    road,
  };
}

function finishTournament(champion) {
  tournament.phase = "complete";
  tournament.champion = champion;
  if (!tournament.isCustom) {
    const stats = loadStats();
    const championRun = buildChampionRun(champion);
    stats.total += 1;
    stats.champions[champion.name] = (stats.champions[champion.name] || 0) + 1;
    if (!Array.isArray(stats.championRuns[champion.name])) {
      stats.championRuns[champion.name] = [];
    }
    stats.championRuns[champion.name].unshift(championRun);
    saveStats(stats);
  }
  tournament.log.unshift(`${champion.name} 获得本届世界赛冠军。`);
  showModal(`冠军：${champion.name}队`, "本届世界赛模拟结束。", "总决赛结束");
}

function showModal(title, body, kicker = "赛事提示") {
  if (!els.modalOverlay) return;
  pendingModalConfirm = null;
  els.modalKicker.textContent = kicker;
  els.modalTitle.textContent = title;
  els.modalBody.textContent = body;
  els.modalClose.textContent = "继续";
  els.modalConfirm.classList.add("hidden");
  els.modalConfirm.textContent = "确认";
  els.modalOverlay.classList.remove("hidden");
}

function showChampionRunModal(teamName, run, runNumber) {
  if (!els.modalOverlay) return;
  const road = Array.isArray(run.road) ? run.road : [];
  pendingModalConfirm = null;
  els.modalKicker.textContent = "冠军档案";
  els.modalTitle.textContent = `${teamName} 冠军之路 #${runNumber}`;
  els.modalBody.innerHTML = `
    <div class="champion-run-modal-meta">
      <span>夺冠时间：${escapeHtml(run.createdAt || "历史记录")}</span>
      <span>瑞士轮成绩：${escapeHtml(run.swissRecord || "-")}</span>
    </div>
    <ol class="champion-run-modal-list">
      ${
        road.length
          ? road.map((step) => `<li>${escapeHtml(step.text || "")}</li>`).join("")
          : "<li>这次冠军记录没有保存详细赛程。</li>"
      }
    </ol>
  `;
  els.modalClose.textContent = "关闭";
  els.modalConfirm.classList.add("hidden");
  els.modalConfirm.textContent = "确认";
  els.modalOverlay.classList.remove("hidden");
}

function showConfirmModal(title, body, onConfirm, options = {}) {
  if (!els.modalOverlay) return;
  pendingModalConfirm = onConfirm;
  els.modalKicker.textContent = options.kicker || "危险操作";
  els.modalTitle.textContent = title;
  els.modalBody.textContent = body;
  els.modalClose.textContent = options.cancelText || "取消";
  els.modalConfirm.textContent = options.confirmText || "确认";
  els.modalConfirm.classList.remove("hidden");
  els.modalOverlay.classList.remove("hidden");
}

function hideModal() {
  if (!els.modalOverlay) return;
  els.modalOverlay.classList.add("hidden");
  pendingModalConfirm = null;
}

function getNextMatch() {
  if (tournament.currentQueue.length === 0) {
    if (tournament.phase === "swiss") {
      if (tournament.qualifiers.length === 8) {
        startKnockout();
      } else {
        tournament.swissRound += 1;
        queueSwissRound();
      }
    }
  }

  tournament.currentMatch = tournament.currentQueue.shift() || null;
  tournament.revealed = false;
}

function advanceDraw() {
  if (!tournament.draw) return false;

  const totalTeams = tournament.draw.matches.length * 2;
  if (tournament.draw.revealedTeams < totalTeams) {
    const drawIndex = tournament.draw.revealedTeams;
    const matchIndex = Math.floor(drawIndex / 2);
    const side = drawIndex % 2 === 0 ? "teamA" : "teamB";
    const match = tournament.draw.matches[matchIndex];
    tournament.draw.revealedTeams += 1;
    tournament.log.unshift(`${match.phase} 抽签：${match[side].name}`);
    if (side === "teamB" && !match.inSwissHistory) {
      match.inSwissHistory = true;
      tournament.swissHistory.push(match);
      tournament.log.unshift(`${match.phase} 对阵产生：${match.teamA.name} vs ${match.teamB.name}`);
    }
    return true;
  }

  tournament.currentQueue = [...tournament.draw.matches];
  tournament.draw = null;
  getNextMatch();
  return true;
}

function isKnockoutDrawing() {
  return (
    tournament?.phase === "knockout" &&
    tournament.knockout?.drawMatches?.length &&
    tournament.knockout.drawRevealedTeams < tournament.knockout.drawMatches.length * 2
  );
}

function advanceKnockoutDraw() {
  if (!isKnockoutDrawing()) return false;
  const drawIndex = tournament.knockout.drawRevealedTeams;
  const matchIndex = Math.floor(drawIndex / 2);
  const side = drawIndex % 2 === 0 ? "teamA" : "teamB";
  const match = tournament.knockout.drawMatches[matchIndex];
  tournament.knockout.drawRevealedTeams += 1;
  tournament.log.unshift(`淘汰赛抽签：${match[side].name}`);
  if (side === "teamB") {
    tournament.log.unshift(`淘汰赛对阵产生：${match.teamA.name} vs ${match.teamB.name}`);
  }
  if (tournament.knockout.drawRevealedTeams === tournament.knockout.drawMatches.length * 2) {
    tournament.currentQueue = [...tournament.knockout.drawMatches];
    tournament.log.unshift("淘汰赛抽签完成。点击下一步开始8强赛。");
  }
  return true;
}

function remainingSwissDrawTeams() {
  if (!tournament.draw) return [];
  const currentIndex = Math.floor(tournament.draw.revealedTeams / 2);
  const currentMatch = tournament.draw.matches[currentIndex];
  if (!currentMatch) return [];
  return tournament.draw.matches
    .flatMap((match, matchIndex) =>
      ["teamA", "teamB"].map((side, sideIndex) => ({
        team: match[side],
        record: match.record,
        revealIndex: matchIndex * 2 + sideIndex,
      })),
    )
    .filter((entry) => entry.record === currentMatch.record && entry.revealIndex >= tournament.draw.revealedTeams)
    .map((entry) => entry.team.name)
    .sort(sortDrawPoolNames);
}

function remainingKnockoutDrawTeams() {
  if (!tournament.knockout?.drawMatches) return [];
  return tournament.knockout.drawMatches
    .flatMap((match, matchIndex) =>
      ["teamA", "teamB"].map((side, sideIndex) => ({
        team: match[side],
        revealIndex: matchIndex * 2 + sideIndex,
      })),
    )
    .filter((entry) => entry.revealIndex >= tournament.knockout.drawRevealedTeams)
    .map((entry) => entry.team.name)
    .sort(sortDrawPoolNames);
}

function remainingKnockoutDrawPools() {
  if (!tournament.knockout?.seeds) return [];
  const remaining = new Set(remainingKnockoutDrawTeams());
  return ["3-0", "3-1", "3-2"]
    .map((record) => ({
      title: `${record}池`,
      names: tournament.knockout.seeds
        .filter((team) => `${team.wins}-${team.losses}` === record && remaining.has(team.name))
        .map((team) => team.name)
        .sort(sortDrawPoolNames),
    }))
    .filter((group) => group.names.length);
}

function sortDrawPoolNames(nameA, nameB) {
  return nameA.localeCompare(nameB, "en");
}

function revealCurrentMatch() {
  const match = tournament.currentMatch;
  const game = simulateMatchGame(match);
  game.review = gameReview(match, game.roll, game.gameWinner);
  match.lastGame = game;

  if (match.kind === "swiss") {
    if (game.isComplete) {
      match.result = {
        roll: game.roll,
        winner: game.winner,
        loser: game.loser,
        scoreText: matchScoreText(match, game.winner, game.loser),
        displayScore: `${game.winner.name} def. ${game.loser.name} (${matchScoreText(match, game.winner, game.loser)})`,
      };
      recordCompletedMatch(match);
      advanceSwiss(match, game.winner, game.loser);
      tournament.log.unshift(
        `${match.phase}: ${match.result.displayScore} 随机数：${game.roll} ${game.review}`,
      );
    } else {
      tournament.log.unshift(
        `${match.phase} Game ${match.gamesPlayed}: ${game.gameWinner.name} 获胜，比分 ${matchScoreText(match)}，随机数：${game.roll} ${game.review}`,
      );
    }
  } else {
    if (game.isComplete) {
      match.result = {
        winner: game.winner,
        loser: game.loser,
        scoreText: matchScoreText(match, game.winner, game.loser),
        displayScore: `${game.winner.name} def. ${game.loser.name} (${matchScoreText(match, game.winner, game.loser)})`,
      };
      match.seriesReview = seriesReview(match, game.winner, game.loser);
      recordCompletedMatch(match);
      advanceKnockout(match, game.winner, game.loser);
      tournament.log.unshift(`${match.phase}: ${match.result.displayScore} 随机数：${game.roll} ${game.review} ${match.seriesReview}`);
    } else {
      tournament.log.unshift(
        `${match.phase} Game ${match.gamesPlayed}: ${game.gameWinner.name} 获胜，比分 ${matchScoreText(match)}，随机数：${game.roll} ${game.review}`,
      );
    }
  }

  tournament.revealed = true;
}

function handleNextStep() {
  if (tournament.draw) {
    advanceDraw();
    renderGame();
    return;
  }

  if (isKnockoutDrawing()) {
    advanceKnockoutDraw();
    renderGame();
    return;
  }

  if (!tournament.currentMatch) {
    getNextMatch();
    renderGame();
    return;
  }

  if (!tournament.revealed || !tournament.currentMatch.result) {
    revealCurrentMatch();
    renderGame();
    return;
  }

  if (tournament.phase === "complete" && tournament.currentQueue.length === 0) {
    if (tournament.isCustom) {
      showView("home");
    } else {
      showStatsView();
    }
    return;
  }

  getNextMatch();
  renderGame();
}

function fastForwardTo(target) {
  if (!tournament) {
    createTournament();
  }

  let guard = 0;
  const shouldContinue = () => {
    if (!tournament || guard >= 3000) return false;
    if (target === "swiss") return tournament.phase === "swiss";
    if (target === "knockout") return tournament.phase !== "complete";
    return false;
  };

  while (shouldContinue()) {
    handleNextStep();
    guard += 1;
  }

  if (target === "knockout" && tournament.knockout) {
    tournament.displayMode = "knockout";
  }

  renderGame();
}

function confirmFastForward(target) {
  const isSwiss = target === "swiss";
  showConfirmModal(
    isSwiss ? "确认快速模拟瑞士轮？" : "确认快速模拟淘汰赛？",
    isSwiss
      ? "这会保留当前已产生的结果，并自动模拟到瑞士轮结束。"
      : "这会保留当前已产生的结果，并自动模拟到本届赛事结束。",
    () => {
      hideModal();
      fastForwardTo(target);
    },
    {
      confirmText: isSwiss ? "快速模拟瑞士轮" : "快速模拟淘汰赛",
      cancelText: "取消",
      kicker: "防误触确认",
    },
  );
}

function toggleSwissReview() {
  if (!tournament || !tournament.knockout) return;
  tournament.displayMode = tournament.displayMode === "swiss" ? "knockout" : "swiss";
  if (tournament.displayMode === "knockout" && els.drawScroll) {
    els.drawScroll.scrollLeft = 0;
    els.drawScroll.dataset.mode = "";
  }
  renderGame();
}


function renderGame() {
  renderLog();
  els.gameTitle.textContent =
    tournament.phase === "complete" ? `冠军：${tournament.champion.name}` : "赛事进行中";

  if (tournament.draw) {
    renderDraw();
    renderDrawWaiting();
    return;
  }

  renderTournamentBoard();

  if (isKnockoutDrawing()) {
    renderKnockoutDrawWaiting();
    return;
  }

  if (!tournament.currentMatch) {
    getNextMatch();
  }

  const match = tournament.currentMatch;
  if (!match) {
    els.matchPhase.textContent = "Tournament Complete";
    els.matchTeams.textContent = `${tournament.champion.name} 冠军`;
    els.matchPowers.textContent = "";
    els.odds.innerHTML = "";
    els.resultBox.classList.remove("hidden");
    els.resultBox.textContent = tournament.isCustom
      ? "自定义赛事已经结束，本次结果不会写入数据统计。"
      : "本次模拟已经写入数据统计。";
    setNextStepText(tournament.isCustom ? "返回首页" : "查看统计");
    return;
  }

  prepareMatch(match);
  const rateA = winRate(match.teamA, match.teamB, match);
  const rateB = 100 - rateA;
  els.matchPhase.textContent = match.phase;
  els.matchTeams.textContent = `${match.teamA.name} vs ${match.teamB.name}`;
  els.matchPowers.innerHTML = renderMatchPowerDetails(match);
  els.odds.innerHTML = renderOddsMeter(match, rateA, rateB);

  if (!tournament.revealed) {
    els.resultBox.classList.add("hidden");
    els.resultBox.textContent = "";
    setNextStepText("下一步");
    return;
  }

  els.resultBox.classList.remove("hidden");
  if (match.lastGame) {
    const { roll, gameWinner } = match.lastGame;
    const scoreLine = `${match.teamA.name} ${match.score[match.teamA.name]} : ${match.score[match.teamB.name]} ${match.teamB.name}`;
    const doneLine = match.result
      ? `<br>${match.result.displayScore}${match.seriesReview ? `<br>${match.seriesReview}` : ""}`
      : "";
    els.resultBox.innerHTML = `随机数：<strong>${roll}</strong><br>${gameWinner.name}本局获胜<br>${scoreLine}<br>${match.lastGame.review}${doneLine}`;
  } else if (match.kind === "final") {
    els.resultBox.innerHTML = `胜者组冠军 ${match.upperChampion.name} 初始 1-0 领先<br>${match.result.displayScore}`;
  } else {
    els.resultBox.textContent = match.result.displayScore;
  }
  setNextStepText(tournament.phase === "complete" ? (tournament.isCustom ? "返回首页" : "查看统计") : "下一步");
}

function renderKnockoutDrawWaiting() {
  const totalTeams = tournament.knockout.drawMatches.length * 2;
  const nextNumber = tournament.knockout.drawRevealedTeams + 1;
  els.matchPhase.textContent = "Knockout Draw";
  els.matchTeams.textContent = "8强抽签";
  els.matchPowers.textContent = "";
  els.odds.innerHTML = "";
  els.resultBox.classList.remove("hidden");
  els.resultBox.textContent = `点击下一步，抽出第 ${nextNumber} 个8强队伍。可抽队伍见上方队伍池。`;
  if (tournament.knockout.drawRevealedTeams >= totalTeams) {
    els.resultBox.textContent = "8强抽签完成。点击下一步开始淘汰赛。";
  }
  setNextStepText("下一步");
}

function drawPoolTitle() {
  const record = currentSwissDrawRecord();
  return record ? `${record} 可抽队伍` : "可抽队伍";
}

function renderDrawPool(title, names) {
  if (!els.drawPool) return;
  const hasNames = Array.isArray(names) && names.some((entry) => {
    return typeof entry === "string" || entry.names?.length;
  });
  if (!hasNames) {
    els.drawPool.classList.add("hidden");
    els.drawPool.innerHTML = "";
    return;
  }
  els.drawPool.classList.remove("hidden");
  const content =
    typeof names[0] === "string"
      ? `
          <div>
            ${names.map((name) => `<span>${name}</span>`).join("")}
          </div>
        `
      : names
          .map(
            (group) => `
              <div class="draw-pool-group">
                <em>${group.title}</em>
                <div>
                  ${group.names.map((name) => `<span>${name}</span>`).join("")}
                </div>
              </div>
            `,
          )
          .join("");
  els.drawPool.innerHTML = `
    <strong>${title}</strong>
    ${content}
  `;
}

function renderMatchPowerDetails(match) {
  return [match.teamA, match.teamB]
    .map((team) => {
      const variance = match.variance[team.name];
      const aura =
        team.lastGameResult === "win"
          ? "上局胜利，本场波动下限+1"
          : team.lastGameResult === "loss"
            ? "上局失利，本场波动上限-1"
            : "无";
      return `
        <span class="power-detail">
          <strong>${team.name}</strong>
          基础战力：${team.basePower}
          气势：${aura}
          波动：${formatSigned(variance)}
          本场战力：${matchPower(match, team)}
        </span>
      `;
    })
    .join("");
}

function renderOddsMeter(match, rateA, rateB) {
  const roll = match.lastGame?.roll || null;
  const winnerName = match.lastGame?.gameWinner?.name || null;
  const aLost = winnerName && winnerName !== match.teamA.name;
  const bLost = winnerName && winnerName !== match.teamB.name;
  const markerLeft = roll ? clamp(roll, 1, 100) : null;

  return `
    <div class="odds-meter ${winnerName ? "has-result" : ""}">
      <div class="meter-labels">
        <span class="${aLost ? "is-dimmed" : ""}">${match.teamA.name}</span>
        <strong>${formatRate(rateA)}</strong>
        <strong>${formatRate(rateB)}</strong>
        <span class="${bLost ? "is-dimmed" : ""}">${match.teamB.name}</span>
      </div>
      <div class="meter-track" aria-label="${match.teamA.name} ${formatRate(rateA)}, ${match.teamB.name} ${formatRate(rateB)}">
        <div class="meter-segment meter-left ${aLost ? "is-dimmed" : ""}" style="width: ${rateA}%"></div>
        <div class="meter-segment meter-right ${bLost ? "is-dimmed" : ""}" style="width: ${rateB}%"></div>
        <div class="meter-boundary" style="left: ${rateA}%"></div>
        ${
          markerLeft
            ? `<div class="meter-marker" style="left: ${markerLeft}%"><span>${roll}</span></div>`
            : ""
        }
      </div>
    </div>
  `;
}

function renderLog() {
  els.eventLog.innerHTML =
    tournament.log.map((line, index) => `<p class="${index === 0 ? "is-latest" : ""}">${line}</p>`).join("") ||
    "<p>暂无记录</p>";
  els.eventLog.scrollTop = 0;
}

function renderDrawWaiting() {
  els.matchPhase.textContent = tournament.draw.phase;
  els.matchTeams.textContent = "瑞士轮抽签";
  els.matchPowers.textContent = "";
  els.odds.innerHTML = "";
  els.resultBox.classList.remove("hidden");

  const totalTeams = tournament.draw.matches.length * 2;
  if (tournament.draw.revealedTeams < totalTeams) {
    const nextNumber = tournament.draw.revealedTeams + 1;
    const currentMatch = tournament.draw.matches[Math.floor(tournament.draw.revealedTeams / 2)];
    els.resultBox.textContent = `点击下一步，从 ${currentMatch.record} 池抽出第 ${nextNumber} 个队伍。可抽队伍见上方队伍池。`;
    setNextStepText("下一步");
  } else {
    els.resultBox.textContent = "本轮抽签完成。点击下一步开始模拟比赛。";
    setNextStepText("下一步");
  }
}

function renderTournamentBoard() {
  if (tournament.displayMode === "swiss") {
    renderDraw();
    return;
  }
  if (tournament.phase === "knockout" || (tournament.phase === "complete" && tournament.knockout)) {
    renderKnockoutBoard();
    return;
  }
  renderDraw();
}

function renderDraw() {
  const draw = tournament.draw || tournament.displayDraw;
  const visibleMatches = tournament.swissHistory || [];
  if ((!draw && visibleMatches.length === 0) || (tournament.phase !== "swiss" && tournament.displayMode !== "swiss")) {
    els.drawPanel.classList.add("hidden");
    return;
  }

  els.drawPanel.classList.remove("hidden");
  els.drawPanel.classList.remove("is-knockout");
  els.drawPanel.classList.add("is-swiss");
  updateDrawControls();
  if (els.drawScroll) els.drawScroll.dataset.mode = "swiss";
  els.drawBoard.className = "swiss-draw-board";
  els.drawPhase.textContent = draw ? draw.phase : `Swiss Round ${tournament.swissRound}`;
  els.drawTitle.textContent = "瑞士轮抽签";
  renderDrawPool(drawPoolTitle(), tournament.draw ? remainingSwissDrawTeams() : []);
  els.drawStatus.textContent =
    tournament.draw && draw.revealedTeams < draw.matches.length * 2
      ? `${draw.revealedTeams}/${draw.matches.length * 2} 队已抽出`
      : "本轮对阵与赛果";

  const recordOrder = ["0-0", "1-0", "0-1", "2-0", "1-1", "0-2", "2-1", "1-2", "2-2"];
  const notes = {
    "2-0": "第一、二名",
    "2-1": "第三、四、五名",
    "2-2": "第六、七、八名",
  };

  els.drawBoard.innerHTML = recordOrder
    .map((record) => {
      const activeDrawMatches = tournament.draw ? tournament.draw.matches.filter((match) => match.record === record) : [];
      const groupMatches = [
        ...visibleMatches.filter((match) => match.record === record),
        ...activeDrawMatches.filter((match) => !match.inSwissHistory),
      ];
      const visibleRecordMatches = visibleMatches.filter((match) => match.record === record).length;
      const totalSlots = Math.max(
        visibleRecordMatches,
        draw ? draw.matches.filter((match) => match.record === record).length : 0,
        defaultDrawSlots(record),
      );
      const matchRows = Array.from({ length: totalSlots }, (_, index) => {
        const match = groupMatches[index];
        if (!match) {
          return `
            <div class="draw-match">
              <span class="draw-team placeholder">TBD</span>
              <span class="draw-vs">VS</span>
              <span class="draw-team placeholder">TBD</span>
            </div>
          `;
        }
        return `
          <div class="draw-match">
            ${renderSwissDrawTeam(match, "teamA")}
            <span class="draw-vs">VS</span>
            ${renderSwissDrawTeam(match, "teamB")}
          </div>
        `;
      }).join("");
      const rows = matchRows;
      const isEmpty = totalSlots === 0;
      const terminalClass = notes[record] ? " is-terminal" : "";
      return `
        <div class="draw-card${isEmpty ? " is-empty" : ""}${terminalClass}" data-record="${record}">
          <div class="draw-record">${record}</div>
          <div class="draw-matches">${rows}</div>
          <div class="draw-format">${record === "0-0" || record === "1-0" || record === "0-1" || record === "1-1" ? "BO1" : "BO3"}</div>
          ${notes[record] ? `<div class="draw-note">${notes[record]}</div>` : ""}
        </div>
      `;
    })
    .join("");
}

function renderKnockoutBoard() {
  const bracket = tournament.knockout;
  if (!bracket) {
    els.drawPanel.classList.add("hidden");
    return;
  }

  els.drawPanel.classList.remove("hidden");
  els.drawPanel.classList.remove("is-swiss");
  els.drawPanel.classList.add("is-knockout");
  updateDrawControls();
  if (els.drawScroll && els.drawScroll.dataset.mode !== "knockout") {
    els.drawScroll.scrollLeft = 0;
    els.drawScroll.dataset.mode = "knockout";
  }
  els.drawPhase.textContent = "Knockout Stage";
  els.drawTitle.textContent = "双败淘汰赛";
  renderDrawPool("可抽队伍", isKnockoutDrawing() ? remainingKnockoutDrawPools() : []);
  els.drawStatus.textContent = bracketStatusText();

  const slots = [
    ["W1", "胜者组第一轮", "upper", "队伍1", "队伍8"],
    ["W2", "胜者组第一轮", "upper", "队伍2", "队伍7"],
    ["W3", "胜者组第一轮", "upper", "队伍3", "队伍6"],
    ["W4", "胜者组第一轮", "upper", "队伍4", "队伍5"],
    ["W5", "胜者组第二轮", "upper", "W1胜者", "W2胜者"],
    ["W6", "胜者组第二轮", "upper", "W3胜者", "W4胜者"],
    ["W7", "胜者组决赛", "upper", "W5胜者", "W6胜者"],
    ["L1", "败者组第一轮", "lower", "W1败者", "W2败者"],
    ["L2", "败者组第一轮", "lower", "W3败者", "W4败者"],
    ["L3", "败者组入口", "lower", "W5败者", ""],
    ["L4", "败者组入口", "lower", "W6败者", ""],
    ["L5", "败者组第二轮", "lower", "L1胜者", "L3队伍"],
    ["L6", "败者组第二轮", "lower", "L2胜者", "L4队伍"],
    ["L7", "败者组决赛", "lower", "L5胜者", "L6胜者"],
    ["L8", "败者组最终轮", "lower", "L7胜者", "W7败者"],
    ["FINAL", "总决赛", "final", "W7胜者", "L8胜者"],
  ];

  els.drawBoard.className = "knockout-board";
  els.drawBoard.innerHTML = slots
    .map(([slot, label, type, placeholderA, placeholderB]) =>
      renderBracketCard(slot, label, type, placeholderA, placeholderB),
    )
    .join("");
}

function bracketStatusText() {
  if (tournament.phase === "complete") return `${tournament.champion.name} 冠军`;
  if (isKnockoutDrawing()) return `${tournament.knockout.drawRevealedTeams}/${tournament.knockout.drawMatches.length * 2} 队已抽出`;
  if (tournament.currentMatch) return tournament.currentMatch.phase;
  return "等待下一场";
}

function renderBracketCard(slot, label, type, placeholderA, placeholderB) {
  const match = tournament.knockout.matches[slot];
  const teamA = match?.teamA;
  const teamB = match?.teamB;
  return `
    <div class="bracket-card ${type}" data-slot="${slot}">
      <div class="bracket-label">${slot} · ${label}</div>
      <div class="bracket-teams">
        ${renderBracketTeam(match, teamA, placeholderA)}
        ${placeholderB === "" ? "" : renderBracketTeam(match, teamB, placeholderB)}
      </div>
    </div>
  `;
}

function renderBracketTeam(match, team, placeholder) {
  if (!team) {
    return `<div class="bracket-team placeholder">${placeholder}</div>`;
  }
  const revealState = knockoutTeamRevealState(match, team);
  if (revealState === "hidden") {
    return `<div class="bracket-team placeholder">${placeholder}</div>`;
  }
  const resultClass = teamDrawClass(match, team);
  return `<div class="bracket-team${resultClass}">${renderTeamScore(match, team, "bracket-team-score")}</div>`;
}

function renderSwissDrawTeam(match, side) {
  if (swissTeamRevealState(match, side) === "hidden") {
    return `<span class="draw-team placeholder">TBD</span>`;
  }
  const team = match[side];
  return `<span class="draw-team${teamDrawClass(match, team)}">${renderTeamScore(match, team, "draw-team-score")}</span>`;
}

function swissTeamRevealState(match, side) {
  if (!tournament.draw || !tournament.draw.matches.includes(match)) return "revealed";
  const matchIndex = tournament.draw.matches.indexOf(match);
  const sideIndex = side === "teamA" ? 0 : 1;
  const revealIndex = matchIndex * 2 + sideIndex;
  return tournament.draw.revealedTeams > revealIndex ? "revealed" : "hidden";
}

function knockoutTeamRevealState(match, team) {
  if (!isKnockoutDrawing() || !match || match.stage !== "UB_R1") return "revealed";
  const index = tournament.knockout.drawMatches.indexOf(match);
  if (index < 0) return "revealed";
  const side = team.name === match.teamA.name ? 0 : 1;
  const revealIndex = index * 2 + side;
  if (tournament.knockout.drawRevealedTeams > revealIndex) return "revealed";
  return "hidden";
}

function currentSwissDrawRecord() {
  if (!tournament.draw) return null;
  const match = tournament.draw.matches[Math.floor(tournament.draw.revealedTeams / 2)];
  return match?.record || null;
}

function renderTeamScore(match, team, scoreClass) {
  const score = match.score ? match.score[team.name] : 0;
  return `${team.name}<span class="${scoreClass}">${score}</span>`;
}

function teamDrawClass(match, team) {
  if (isCurrentUnfinishedMatch(match)) return " is-current";
  if (!match.result) return "";
  if (match.result.winner.name === team.name) return " is-winner";
  return " is-loser";
}

function isCurrentUnfinishedMatch(match) {
  return tournament.currentMatch === match && !match.result;
}

function defaultDrawSlots(record) {
  const slots = {
    "0-0": 8,
    "1-0": 4,
    "0-1": 4,
    "2-0": 2,
    "1-1": 4,
    "0-2": 2,
    "2-1": 3,
    "1-2": 3,
    "2-2": 3,
  };
  return slots[record] || 0;
}

function showStatsView() {
  const stats = loadStats();
  const teams = loadTeams();
  els.totalSims.textContent = stats.total;
  const rows = teams
    .map((team) => {
      const wins = stats.champions[team.name] || 0;
      const rate = stats.total ? `${((wins / stats.total) * 100).toFixed(1)}%` : "0.0%";
      return { name: team.name, wins, rate };
    })
    .sort((a, b) => b.wins - a.wins || a.name.localeCompare(b.name));

  els.championBoard.innerHTML = rows
    .map(
      (row) => {
        const runs = Array.isArray(stats.championRuns[row.name]) ? stats.championRuns[row.name] : [];
        const missingRuns = Math.max(0, row.wins - runs.length);
        if (row.wins <= 0) {
          return `
            <div class="champion-row champion-row-static">
              <strong>${escapeHtml(row.name)}</strong>
              <span>${row.wins}</span>
              <span>${row.rate}</span>
            </div>
          `;
        }
        return `
          <div class="champion-entry">
            <div class="champion-row">
              <div class="champion-name-cell">
                <strong>${escapeHtml(row.name)}</strong>
                <button class="champion-toggle" type="button" aria-expanded="false">展开</button>
              </div>
              <span>${row.wins}</span>
              <span>${row.rate}</span>
            </div>
            <div class="champion-links" hidden>
              <span>冠军之路</span>
              ${renderChampionRunLinks(row.name, row.wins, runs, missingRuns)}
            </div>
          </div>
        `;
      },
    )
    .join("");
  showView("stats");
}

function renderChampionRunLinks(teamName, totalWins, runs, missingRuns) {
  const links = runs
    .map((run, index) => {
      const runNumber = totalWins - index;
      return `
        <button class="champion-run-link" type="button" data-team="${escapeHtml(teamName)}" data-run-index="${index}" data-run-number="${runNumber}">
          冠军之路 #${runNumber}
        </button>
      `;
    })
    .join("");
  const missing = missingRuns
    ? `<em class="champion-run-missing">另有 ${missingRuns} 次早期冠军无详细记录</em>`
    : "";
  return links + missing;
}

function handleChampionBoardClick(event) {
  const toggle = event.target.closest(".champion-toggle");
  if (toggle) {
    const entry = toggle.closest(".champion-entry");
    const links = entry?.querySelector(".champion-links");
    if (!links) return;
    const isOpening = links.hidden;
    links.hidden = !isOpening;
    toggle.textContent = isOpening ? "收起" : "展开";
    toggle.setAttribute("aria-expanded", String(isOpening));
    return;
  }

  const button = event.target.closest(".champion-run-link");
  if (!button) return;
  const stats = loadStats();
  const teamName = button.dataset.team;
  const runIndex = Number(button.dataset.runIndex);
  const runNumber = Number(button.dataset.runNumber);
  const runs = Array.isArray(stats.championRuns[teamName]) ? stats.championRuns[teamName] : [];
  const run = runs[runIndex];
  if (!run) {
    showModal("冠军之路缺失", "这条冠军记录没有保存详细赛程。", "冠军档案");
    return;
  }
  showChampionRunModal(teamName, run, runNumber);
}





function renderTeamConfigForm(form, teams = [], options = {}) {
  const blank = Boolean(options.blank);
  form.innerHTML = `
    <div class="custom-form-head">
      <span>队伍</span>
      <span>战力</span>
      <span>波动下限</span>
      <span>波动上限</span>
    </div>
  ` + Array.from({ length: DEFAULT_TEAMS.length }, (_, index) => teams[index] || {})
    .map((team, index) => {
      const name = blank ? "" : team.name || DEFAULT_TEAMS[index].name;
      const power = blank ? "" : team.power || DEFAULT_TEAMS[index].power;
      const min = blank ? "" : Number.isFinite(Number(team.varianceMin)) ? team.varianceMin : DEFAULT_TEAMS[index].varianceMin;
      const max = blank ? "" : Number.isFinite(Number(team.varianceMax)) ? team.varianceMax : DEFAULT_TEAMS[index].varianceMax;
      return `
        <div class="team-row custom-team-row">
          <input name="name-${index}" type="text" value="${name}" maxlength="12" aria-label="队伍${index + 1}名称" />
          <input name="power-${index}" type="number" min="1" max="99" value="${power}" aria-label="队伍${index + 1}基础战力" />
          <input name="varianceMin-${index}" type="number" min="-20" max="20" value="${min}" aria-label="队伍${index + 1}波动下限" />
          <input name="varianceMax-${index}" type="number" min="-20" max="20" value="${max}" aria-label="队伍${index + 1}波动上限" />
        </div>
      `;
    })
    .join("");
}

function readTeamConfigForm(form, options = {}) {
  const formData = new FormData(form);
  const usedNames = new Set();
  const teams = DEFAULT_TEAMS.map((defaultTeam, index) => {
    const rawName = String(formData.get(`name-${index}`) || "").trim();
    const name = rawName || (options.allowBlankName ? `TEAM${index + 1}` : defaultTeam.name);
    const power = clamp(Number(formData.get(`power-${index}`)) || defaultTeam.power, 1, 99);
    let varianceMin = clamp(Number(formData.get(`varianceMin-${index}`)) || 0, -20, 20);
    let varianceMax = clamp(Number(formData.get(`varianceMax-${index}`)) || 0, -20, 20);
    if (varianceMin > varianceMax) {
      [varianceMin, varianceMax] = [varianceMax, varianceMin];
    }
    if (usedNames.has(name)) {
      showModal("队名重复", "同一届赛事里不能出现重复队名，请修改后再开始。", "队伍配置");
      return null;
    }
    usedNames.add(name);
    return { name, power, varianceMin, varianceMax };
  });

  if (teams.some((team) => !team)) return null;
  return teams;
}

function showEditView() {
  renderTeamConfigForm(els.teamForm, loadTeams(), { blank: false });
  showView("edit");
}

function saveTeamForm() {
  const teams = readTeamConfigForm(els.teamForm, { allowBlankName: false });
  if (!teams) return;
  saveTeams(teams);
  showView("home");
}

function showCustomView() {
  renderCustomTeamForm();
  showView("custom");
}

function renderCustomTeamForm() {
  renderTeamConfigForm(els.customTeamForm, [], { blank: true });
}

function startCustomTournament() {
  const teams = readTeamConfigForm(els.customTeamForm, { allowBlankName: true });
  if (!teams) return;
  createTournament(teams, { isCustom: true });
  tournament.log.unshift("自定义赛事开始，本次结果不会写入数据统计。");
  renderGame();
}

els.startGame.addEventListener("click", () => createTournament());
els.customGame.addEventListener("click", showCustomView);
els.showStats.addEventListener("click", showStatsView);
els.editTeams.addEventListener("click", showEditView);
els.backHomeGame.addEventListener("click", () => showView("home"));
els.backHomeStats.addEventListener("click", () => showView("home"));
els.backHomeStatsBottom.addEventListener("click", () => showView("home"));
els.backHomeEdit.addEventListener("click", () => showView("home"));
els.backHomeCustom.addEventListener("click", () => showView("home"));
els.nextStepControls.forEach((button) => button.addEventListener("click", handleNextStep));
els.quickSwiss.addEventListener("click", () => confirmFastForward("swiss"));
els.quickKnockout.addEventListener("click", () => confirmFastForward("knockout"));
els.reviewSwiss.addEventListener("click", toggleSwissReview);
els.championBoard.addEventListener("click", handleChampionBoardClick);
els.saveTeams.addEventListener("click", saveTeamForm);
els.resetTeams.addEventListener("click", () => {
  saveTeams(DEFAULT_TEAMS);
  showEditView();
});
els.startCustom.addEventListener("click", startCustomTournament);
els.resetCustom.addEventListener("click", renderCustomTeamForm);
function confirmResetStats() {
  saveStats({ total: 0, champions: {}, championRuns: {} });
  showStatsView();
  hideModal();
}

els.resetStats.addEventListener("click", () => {
  showConfirmModal(
    "确认清空统计？",
    "这会删除总模拟次数和冠军榜记录，操作后无法恢复。",
    confirmResetStats,
    { confirmText: "确认清空", cancelText: "我再想想", kicker: "清空统计" },
  );
});
els.modalClose.addEventListener("click", hideModal);
els.modalConfirm.addEventListener("click", () => {
  if (pendingModalConfirm) pendingModalConfirm();
});
els.modalOverlay.addEventListener("click", (event) => {
  if (event.target === els.modalOverlay) hideModal();
});
