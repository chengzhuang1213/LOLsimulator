const DEFAULT_TEAMS = [
  { name: "GEN", region: "LCK", pool: 1, stage: "swiss", power: 95, varianceMin: -2, varianceMax: 1 },
  { name: "AL", region: "LPL", pool: 1, stage: "swiss", power: 94, varianceMin: -3, varianceMax: 3 },
  { name: "TLAW", region: "LCS", pool: 1, stage: "swiss", power: 84, varianceMin: -4, varianceMax: 4 },
  { name: "G2", region: "LEC", pool: 1, stage: "swiss", power: 89, varianceMin: -5, varianceMax: 5 },
  { name: "LOS", region: "CBLOL", pool: 2, stage: "swiss", power: 75, varianceMin: -5, varianceMax: 5 },
  { name: "TSW", region: "LCP", pool: 2, stage: "swiss", power: 79, varianceMin: -5, varianceMax: 5 },
  { name: "HLE", region: "LCK", pool: 2, stage: "swiss", power: 94, varianceMin: -3, varianceMax: 2 },
  { name: "BLG", region: "LPL", pool: 2, stage: "swiss", power: 92, varianceMin: -2, varianceMax: 2 },
  { name: "LYON", region: "LCS", pool: 3, stage: "swiss", power: 85, varianceMin: -4, varianceMax: 4 },
  { name: "MKOI", region: "LEC", pool: 3, stage: "swiss", power: 86, varianceMin: -4, varianceMax: 4 },
  { name: "T1", region: "LCK", pool: 3, stage: "swiss", power: 90, varianceMin: -2, varianceMax: 3 },
  { name: "TES", region: "LPL", pool: 3, stage: "swiss", power: 86, varianceMin: -4, varianceMax: 4 },
  { name: "CFO", region: "LCP", pool: 4, stage: "swiss", power: 77, varianceMin: -4, varianceMax: 4 },
  { name: "IG", region: "LPL", pool: 4, stage: "swiss", power: 87, varianceMin: -4, varianceMax: 4 },
  { name: "DK", region: "LCK", pool: 4, stage: "swiss", power: 88, varianceMin: -4, varianceMax: 3 },
  { name: "KC", region: "LEC", stage: "playin", power: 84, varianceMin: -4, varianceMax: 4 },
  { name: "C9", region: "LCS", stage: "playin", power: 80, varianceMin: -4, varianceMax: 4 },
  { name: "MVK", region: "LCP", stage: "playin", power: 74, varianceMin: -5, varianceMax: 5 },
  { name: "FUR", region: "CBLOL", stage: "playin", power: 73, varianceMin: -6, varianceMax: 6 },
];

const CUSTOM_DEFAULT_TEAMS = [
  { name: "11 FNC", power: 83, varianceMin: -3, varianceMax: 4 },
  { name: "12 TPA", power: 85, varianceMin: -4, varianceMax: 5 },
  { name: "13 SKT", power: 93, varianceMin: -3, varianceMax: 4 },
  { name: "14 SSW", power: 96, varianceMin: -1, varianceMax: 2 },
  { name: "15 SKT", power: 97, varianceMin: -1, varianceMax: 2 },
  { name: "16 SKT", power: 94, varianceMin: -2, varianceMax: 3 },
  { name: "17 SSG", power: 91, varianceMin: -2, varianceMax: 2 },
  { name: "18 IG", power: 93, varianceMin: -5, varianceMax: 5 },
  { name: "19 FPX", power: 92, varianceMin: -4, varianceMax: 4 },
  { name: "20 DWG", power: 94, varianceMin: -1, varianceMax: 1 },
  { name: "21 EDG", power: 89, varianceMin: -3, varianceMax: 3 },
  { name: "22 DRX", power: 88, varianceMin: -5, varianceMax: 6 },
  { name: "23 T1", power: 92, varianceMin: -2, varianceMax: 3 },
  { name: "24 BLG", power: 93, varianceMin: -3, varianceMax: 3 },
  { name: "24 GEN", power: 95, varianceMin: -3, varianceMax: 1 },
  { name: "24 T1", power: 95, varianceMin: -2, varianceMax: 3 },
];

const TEAM_KEY = "lol-worlds-2026-official-teams";
const STATS_KEY = "lol-worlds-alpha-stats";
const TOURNAMENT_MODES = {
  single: "单败淘汰赛",
  double: "双败淘汰赛",
};

const PHASE_NAMES = {
  "Play-In Round 1": "入围赛第一轮",
  "Play-In Upper Final": "入围赛胜者组决赛",
  "Play-In Lower Round": "入围赛败者组第一轮",
  "Play-In Lower Final": "入围赛败者组决赛",
  "Play-In Qualification Match": "入围赛最终晋级赛",
  Quarterfinal: "1/4决赛",
  Semifinal: "半决赛",
  Final: "总决赛",
};

const FINAL_LIVE_DELAY = 3000;
const TEAM_LOGOS = {
  TLAW: "assets/teams/tl.webp",
  ...Object.fromEntries(
    ["GEN", "HLE", "T1", "DK", "AL", "BLG", "TES", "IG", "G2", "MKOI", "KC", "CFO", "C9", "LYON", "TSW", "MVK", "LOS", "FUR"]
    .map((name) => [name, `assets/teams/${name.toLowerCase()}.webp`]),
  ),
};
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
  backHomePlayIn: $("#back-home-playin"),
  playInPhase: $("#playin-phase"),
  playInHeading: $("#playin-heading"),
  playInStatus: $("#playin-status"),
  playInPools: $("#playin-pools"),
  playInBoard: $("#playin-board"),
  playInMatchPhase: $("#playin-match-phase"),
  playInMatchTeams: $("#playin-match-teams"),
  playInMatchPowers: $("#playin-match-powers"),
  playInOdds: $("#playin-odds"),
  playInResult: $("#playin-result"),
  playInLog: $("#playin-log"),
  playInCurrent: $("#playin-current"),
  togglePlayInDetails: $("#toggle-playin-details"),
  quickPlayIn: $("#quick-playin"),
  nextPlayIn: $("#next-playin"),
  finalLive: $("#final-live"),
  finalLiveTitle: $("#final-live-title"),
  finalLiveToolbarScore: $("#final-live-toolbar-score"),
  finalLiveScore: $("#final-live-score"),
  finalTeamABrand: $("#final-team-a-brand"),
  finalTeamBBrand: $("#final-team-b-brand"),
  finalTeamALogo: $("#final-team-a-logo"),
  finalTeamBLogo: $("#final-team-b-logo"),
  finalTeamAName: $("#final-team-a-name"),
  finalTeamBName: $("#final-team-b-name"),
  finalWinMeterTime: $("#final-win-meter-time"),
  finalWinTeamA: $("#final-win-team-a"),
  finalWinTeamB: $("#final-win-team-b"),
  finalWinTeamARate: $("#final-win-team-a-rate"),
  finalWinTeamBRate: $("#final-win-team-b-rate"),
  finalWinMeterBar: $("#final-win-meter-bar"),
  finalLiveFeed: $("#final-live-feed"),
  finalLivePause: $("#final-live-pause"),
  finalLiveNext: $("#final-live-next"),
  finalLiveFinished: $("#final-live-finished"),
  gameTitle: $("#game-title"),
  drawPanel: $("#draw-panel"),
  drawPhase: $("#draw-phase"),
  drawTitle: $("#draw-title"),
  stickyMatchTeams: $("#sticky-match-teams"),
  stickyMatchPowers: $("#sticky-match-powers"),
  stickyMatchStatus: $("#sticky-match-status"),
  drawPool: $("#draw-pool"),
  drawStatus: $("#draw-status"),
  drawBoard: $("#swiss-draw-board"),
  drawScroll: $("#draw-scroll"),
  matchPhase: $("#match-phase"),
  matchTeams: $("#match-teams"),
  matchPowers: $("#match-powers"),
  odds: $("#odds"),
  resultBox: $("#result-box"),
  matchPanel: $("#match-panel"),
  toggleMatchDetails: $("#toggle-match-details"),
  closeMatchDetails: $("#close-match-details"),
  nextStepControls: document.querySelectorAll(".next-step-control"),
  quickSwiss: $("#quick-swiss"),
  quickKnockout: $("#quick-knockout"),
  restartCustomRun: $("#restart-custom-run"),
  reviewPlayIn: $("#review-playin"),
  reviewSwiss: $("#review-swiss"),
  tournamentHome: $("#tournament-home"),
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
let lastFocusedMatchKey = "";
let finalLiveState = null;
let finalLiveTimer = null;
let playInReviewMode = false;

function loadTeams() {
  const saved = JSON.parse(localStorage.getItem(TEAM_KEY) || "null");
  if (!Array.isArray(saved) || saved.length !== DEFAULT_TEAMS.length) {
    return structuredClone(DEFAULT_TEAMS);
  }
  return saved.map((team, index) => {
    const fallback = DEFAULT_TEAMS[index];
    const savedName = String(team.name || fallback.name).trim() || fallback.name;
    const name = fallback.name === "LOS" && savedName === "RED" ? "LOS" : savedName;
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
    return {
      name,
      power,
      varianceMin,
      varianceMax,
      region: fallback.region,
      pool: fallback.pool,
      stage: fallback.stage,
    };
  });
}

function saveTeams(teams) {
  localStorage.setItem(TEAM_KEY, JSON.stringify(teams));
}

function snapshotTeamConfig(teams) {
  return teams.map((team) => ({
    name: team.name,
    power: team.power ?? team.basePower,
    varianceMin: team.varianceMin,
    varianceMax: team.varianceMax,
    region: team.region,
    pool: team.pool,
    stage: team.stage,
  }));
}

function loadStats() {
  const raw = JSON.parse(localStorage.getItem(STATS_KEY) || '{"total":0,"champions":{}}');
  return normalizeStats(raw);
}

function saveStats(stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(normalizeStats(stats)));
}

function normalizeStats(stats) {
  const champions = { ...(stats && typeof stats.champions === "object" && stats.champions ? stats.champions : {}) };
  const championRuns = {
    ...(stats && typeof stats.championRuns === "object" && stats.championRuns ? stats.championRuns : {}),
  };
  [["GENG", "GEN"], ["RED", "LOS"], ["TL", "TLAW"]].forEach(([oldName, newName]) => {
    if (!champions[oldName] && !championRuns[oldName]) return;
    champions[newName] = (Number(champions[newName]) || 0) + (Number(champions[oldName]) || 0);
    championRuns[newName] = [
      ...(Array.isArray(championRuns[newName]) ? championRuns[newName] : []),
      ...(Array.isArray(championRuns[oldName]) ? championRuns[oldName] : []),
    ];
    delete champions[oldName];
    delete championRuns[oldName];
  });
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

function renderLogLines(container, lines) {
  container.innerHTML = lines.length
    ? lines
        .map((line, index) => `<p class="${index === 0 ? "is-latest" : ""}">${escapeHtml(line)}</p>`)
        .join("")
    : "<p>暂无记录</p>";
  container.scrollTop = 0;
}

function showView(name) {
  if (name !== "game") clearFinalLiveTimer();
  els.views.forEach((view) => view.classList.remove("active"));
  $(`#view-${name}`).classList.add("active");
}

function setNextStepText(text) {
  els.nextStepControls.forEach((button) => {
    button.textContent = text;
  });
}

function matchAdvanceText(match) {
  const gamesPlayed = Number(match?.gamesPlayed) || 0;
  if (gamesPlayed > 0) return "进行下一局";
  if (match?.stage === "QF" && tournament?.knockout?.qfWinners.length === 0) {
    return "开始八强赛";
  }
  return match?.bestOf === 1 ? "进行本场比赛" : "进行第一局";
}

function playInStageAdvanceText(match) {
  if (tournament.phase === "playin-complete") return "进入瑞士轮";
  const nextMatch = tournament.currentQueue[0];
  if (!nextMatch || nextMatch.stage === match.stage) return "进入下一场";
  const labels = {
    PI_UPPER_FINAL: "开始胜者组决赛",
    PI_LOWER_R1: "开始败者组首轮",
    PI_LOWER_FINAL: "开始败者组决赛",
    PI_FINAL: "开始最终晋级赛",
  };
  return labels[nextMatch.stage] || "进入下一场";
}

function completedMatchAdvanceText(match) {
  if (match.kind === "playin") return playInStageAdvanceText(match);
  if (match.kind === "swiss") {
    if (tournament.currentQueue.length > 0) return "进入下一场";
    if (tournament.qualifiers.length === 8) return "开始八强抽签";
    return `开始第 ${tournament.swissRound + 1} 轮抽签`;
  }
  const nextMatch = tournament.currentQueue[0];
  if (nextMatch?.stage === "SF" && match.stage !== "SF") return "开始半决赛";
  if (nextMatch?.stage === "FINAL" && match.stage !== "FINAL") return "开始决赛";
  return "进入下一场";
}

function updateDrawControls() {
  if (!tournament) return;
  const isSwissPhase = tournament.phase === "swiss";
  const hasKnockout = Boolean(tournament.knockout);
  const isKnockoutPhase = tournament.phase === "knockout" || tournament.phase === "complete";
  const isFinal = isFinalMatch();

  if (els.quickSwiss) els.quickSwiss.hidden = !isSwissPhase;
  if (els.quickKnockout) els.quickKnockout.hidden = !isKnockoutPhase || isFinal;
  els.nextStepControls.forEach((button) => {
    button.hidden = isFinal;
  });
  if (els.restartCustomRun) {
    els.restartCustomRun.hidden = !(tournament.isCustom && tournament.phase === "complete");
  }
  if (els.reviewPlayIn) {
    els.reviewPlayIn.hidden = !tournament.playIn?.winner;
  }
  if (els.reviewSwiss) {
    els.reviewSwiss.hidden = !hasKnockout;
    els.reviewSwiss.textContent = tournament.displayMode === "swiss" ? "返回当前赛事" : "回顾瑞士轮";
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

function swissDrawTeamLabel(team) {
  const region = team.region || "";
  const seed = Number.isFinite(Number(team.pool)) ? `${team.pool}号种子` : "";
  return `${region}${seed}${team.name}`;
}

function swissDrawVarianceLabel(team) {
  return `${formatSigned(team.varianceMin)}至${formatSigned(team.varianceMax)}`;
}

function swissDrawLine(lines, match, revealIndex) {
  const round = Number(String(match.phase).match(/\d+/)?.[0]) || 1;
  return lines[(revealIndex + round - 1) % lines.length];
}

function swissDrawTeamIntroduction(match, side, revealIndex) {
  const team = match[side];
  const label = swissDrawTeamLabel(team);
  const seed = Number.isFinite(Number(team.pool)) ? `${team.pool}号种子` : "";
  const origin = [team.region, seed].filter(Boolean).join("");
  const openings = side === "teamA"
    ? [
        `抽出的是${label}！`,
        `第一支队伍揭晓——${label}。`,
        `${team.name}率先落位${origin ? `，来自${origin}` : ""}。`,
        `${team.name}被抽出，基础战力${team.basePower}。`,
        `${team.name}登场，他们的波动范围是${swissDrawVarianceLabel(team)}。`,
      ]
    : [
        `抽到了${label}！`,
        `对手揭晓——${label}。`,
        `${team.name}进入这一签位${origin ? `，来自${origin}` : ""}。`,
        `${team.name}成为对手，基础战力${team.basePower}。`,
        `最终落位的是${team.name}，波动范围${swissDrawVarianceLabel(team)}。`,
      ];
  return swissDrawLine(openings, match, revealIndex);
}

function swissDrawMatchCommentary(match, revealIndex) {
  const { teamA, teamB } = match;
  const powerGap = Math.abs(teamA.basePower - teamB.basePower);
  const stronger = teamA.basePower >= teamB.basePower ? teamA : teamB;
  const underdog = stronger === teamA ? teamB : teamA;
  const strongerFloor = stronger.basePower + stronger.varianceMin;
  const underdogCeiling = underdog.basePower + underdog.varianceMax;
  const recordLead = match.record !== "0-0" && revealIndex % 3 === 0
    ? `双方目前同为${match.record}，`
    : "";

  if (teamA.region && teamA.region === teamB.region) {
    return swissDrawLine([
      `${recordLead}同赛区队伍提前相遇，彼此知根知底，这场内战不会轻松！`,
      `${recordLead}一场赛区内战就此确定，老对手之间没有秘密！`,
      `${recordLead}${teamA.region}内战来袭，这组对决注定火药味十足！`,
    ], match, revealIndex);
  }
  if (teamA.basePower >= 88 && teamB.basePower >= 88 && powerGap <= 6) {
    return swissDrawLine([
      `${recordLead}双方基础战力相差${powerGap}点，而且都处在顶尖战力区间，这将会是一场强强对决！`,
      `${recordLead}${teamA.name}与${teamB.name}都是高战力队伍，这一签看点十足！`,
      `${recordLead}顶尖战力正面碰撞，谁都没有轻松过关的把握！`,
    ], match, revealIndex);
  }
  if (powerGap <= 2) {
    return swissDrawLine([
      `${recordLead}双方基础战力仅差${powerGap}点，临场波动很可能决定胜负！`,
      `${recordLead}纸面实力几乎难分高下，这会是一场五五开的较量！`,
      `${recordLead}这组对阵最考验临场发挥，任何一点波动都可能改变结果！`,
    ], match, revealIndex);
  }
  if (underdogCeiling >= strongerFloor) {
    return swissDrawLine([
      `${recordLead}${stronger.name}纸面战力占优，但${underdog.name}的波动上限足以制造悬念！`,
      `${recordLead}优势属于${stronger.name}，不过${underdog.name}仍保留着爆冷窗口！`,
      `${recordLead}${stronger.name}是更被看好的一方，但这组对阵并非没有变数！`,
    ], match, revealIndex);
  }
  if (powerGap >= 10) {
    return swissDrawLine([
      `${recordLead}${stronger.name}拥有${powerGap}点基础战力优势，${underdog.name}需要打出接近波动上限的表现！`,
      `${recordLead}${stronger.name}是明显的优势方，${underdog.name}必须拿出超常发挥！`,
      `${recordLead}纸面差距不小，这将是${underdog.name}的一场硬仗！`,
    ], match, revealIndex);
  }

  const volatileTeam = [teamA, teamB].sort(
    (left, right) => (right.varianceMax - right.varianceMin) - (left.varianceMax - left.varianceMin),
  )[0];
  return swissDrawLine([
    `${recordLead}${stronger.name}稍占上风，不过${volatileTeam.name}的波动范围让这组对决仍有变数！`,
    `${recordLead}纸面优势并不绝对，这一签仍然留下了足够的悬念！`,
    `${recordLead}双方各有机会，比赛当天的状态可能比排名更加重要！`,
  ], match, revealIndex);
}

function swissDrawCommentary(match, side, revealIndex) {
  const introduction = swissDrawTeamIntroduction(match, side, revealIndex);
  return side === "teamA" ? introduction : `${introduction}${swissDrawMatchCommentary(match, revealIndex)}`;
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
  if (match.kind === "series" || match.kind === "playin") return 3;
  return match.targetWins || 1;
}

function ensureMatchScore(match) {
  if (match.score) return;
  match.score = { [match.teamA.name]: 0, [match.teamB.name]: 0 };
  match.gamesPlayed = 0;
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

function renderLastGameResult(match) {
  const { roll, gameWinner, review } = match.lastGame;
  const scoreLine = `${match.teamA.name} ${match.score[match.teamA.name]} : ${match.score[match.teamB.name]} ${match.teamB.name}`;
  const completedSeries = match.result
    ? `<br>${escapeHtml(match.result.displayScore)}${match.seriesReview ? `<br>${escapeHtml(match.seriesReview)}` : ""}`
    : "";
  return `随机数：<strong>${roll}</strong><br>${escapeHtml(gameWinner.name)}本局获胜<br>${escapeHtml(scoreLine)}<br>${escapeHtml(review)}${completedSeries}`;
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
  return `${winner.name}笑到最后，淘汰${loser.name}。`;
}

function createTournament(sourceTeams = loadTeams(), options = {}) {
  const isCustom = Boolean(options.isCustom);
  clearFinalLiveTimer();
  finalLiveState = null;
  if (els.finalLive) els.finalLive.classList.add("hidden");
  lastFocusedMatchKey = "";
  const sourceConfig = snapshotTeamConfig(sourceTeams);
  const teams = sourceConfig.map((team) => ({
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
    allTeams: teams,
    phase: isCustom ? "swiss" : "playin",
    swissRound: 1,
    currentQueue: [],
    currentMatch: null,
    revealed: false,
    draw: null,
    swissHistory: [],
    displayMode: "swiss",
    mode: "single",
    isCustom,
    customRestartTeams: isCustom ? sourceConfig : null,
    qualifiers: [],
    eliminated: [],
    knockout: null,
    playIn: null,
    log: [],
    champion: null,
    completedMatches: [],
  };

  setMatchDetailsOpen(false);
  tournament.log.unshift("赛事模式：官方单败淘汰赛。");
  const playInTeams = teams.filter((team) => team.stage === "playin");
  if (isCustom || playInTeams.length !== 4) {
    beginSwissStage(teams);
    return;
  }

  initializePlayIn();
}

function resetTeamForSwiss(team) {
  team.wins = 0;
  team.losses = 0;
  team.lastGameResult = null;
  team.status = "active";
  team.opponents = [];
  return team;
}

function beginSwissStage(sourceTeams = null) {
  let swissTeams = sourceTeams;
  if (!swissTeams) {
    const directTeams = tournament.allTeams.filter((team) => team.stage === "swiss");
    const playInWinner = tournament.playIn?.winner;
    if (!playInWinner) return;
    playInWinner.pool = 4;
    swissTeams = [...directTeams, playInWinner];
  }

  tournament.teams = swissTeams.map(resetTeamForSwiss);
  tournament.phase = "swiss";
  tournament.swissRound = 1;
  tournament.currentQueue = [];
  tournament.currentMatch = null;
  tournament.revealed = false;
  tournament.draw = null;
  tournament.swissHistory = [];
  tournament.displayMode = "swiss";
  tournament.qualifiers = [];
  tournament.eliminated = [];
  tournament.knockout = null;
  queueSwissRound();
  tournament.log.unshift(`瑞士轮参赛队伍：${tournament.teams.map((team) => team.name).join("、")}。`);
  showView("game");
  renderGame();
}

function buildPlayInSeries(phase, teamA, teamB, stage, slot) {
  return { phase, kind: "playin", stage, slot, teamA, teamB, bestOf: 5 };
}

function initializePlayIn() {
  const entrants = shuffle(tournament.allTeams.filter((team) => team.stage === "playin"));
  if (entrants.length !== 4) {
    showModal("入围赛配置错误", "官方入围赛需要4支队伍。", "无法开始赛事");
    showView("home");
    return;
  }

  const openingMatches = [
    buildPlayInSeries("Play-In Round 1", entrants[0], entrants[1], "PI_R1", "PI1"),
    buildPlayInSeries("Play-In Round 1", entrants[2], entrants[3], "PI_R1", "PI2"),
  ];

  tournament.playIn = {
    entrants,
    matches: { PI1: openingMatches[0], PI2: openingMatches[1] },
    drawMatches: openingMatches,
    drawRevealedTeams: 0,
    drawComplete: false,
    openingWinners: [],
    openingLosers: [],
    upperChampion: null,
    upperFinalLoser: null,
    lowerRoundWinner: null,
    lowerChampion: null,
    winner: null,
  };
  tournament.currentQueue = [];
  tournament.currentMatch = null;
  tournament.revealed = false;
  tournament.log.unshift("入围赛开始：4队完全随机抽签，全部比赛为BO5双败赛制。最终1队晋级瑞士轮。");
  setPlayInDetailsOpen(false);
  showView("playin");
  renderPlayIn();
}

function queuePlayInMatches(...matches) {
  matches.forEach((match) => {
    tournament.playIn.matches[match.slot] = match;
    tournament.currentQueue.push(match);
  });
}

function getNextPlayInMatch() {
  tournament.currentMatch = tournament.currentQueue.shift() || null;
  tournament.revealed = false;
}

function advancePlayInDraw() {
  const playIn = tournament.playIn;
  const totalTeams = playIn.drawMatches.length * 2;
  if (playIn.drawRevealedTeams < totalTeams) {
    const drawIndex = playIn.drawRevealedTeams;
    const matchIndex = Math.floor(drawIndex / 2);
    const side = drawIndex % 2 === 0 ? "teamA" : "teamB";
    const match = playIn.drawMatches[matchIndex];
    playIn.drawRevealedTeams += 1;
    tournament.log.unshift(`入围赛抽签：${match[side].name}`);
    if (side === "teamB") {
      tournament.log.unshift(`入围赛首轮对阵：${match.teamA.name} vs ${match.teamB.name}`);
    }
    return;
  }

  playIn.drawComplete = true;
  tournament.currentQueue = [...playIn.drawMatches];
  getNextPlayInMatch();
}

function advancePlayIn(match, winner, loser) {
  const playIn = tournament.playIn;

  if (match.stage === "PI_R1") {
    playIn.openingWinners.push(winner);
    playIn.openingLosers.push(loser);
    if (playIn.openingWinners.length === 2) {
      queuePlayInMatches(
        buildPlayInSeries(
          "Play-In Upper Final",
          playIn.openingWinners[0],
          playIn.openingWinners[1],
          "PI_UPPER_FINAL",
          "PI3",
        ),
        buildPlayInSeries(
          "Play-In Lower Round",
          playIn.openingLosers[0],
          playIn.openingLosers[1],
          "PI_LOWER_R1",
          "PI4",
        ),
      );
    }
    return;
  }

  if (match.stage === "PI_UPPER_FINAL") {
    playIn.upperChampion = winner;
    playIn.upperFinalLoser = loser;
    return;
  }

  if (match.stage === "PI_LOWER_R1") {
    playIn.lowerRoundWinner = winner;
    tournament.log.unshift(`${loser.name} 入围赛两败淘汰。`);
    queuePlayInMatches(
      buildPlayInSeries(
        "Play-In Lower Final",
        playIn.upperFinalLoser,
        winner,
        "PI_LOWER_FINAL",
        "PI5",
      ),
    );
    return;
  }

  if (match.stage === "PI_LOWER_FINAL") {
    playIn.lowerChampion = winner;
    tournament.log.unshift(`${loser.name} 入围赛两败淘汰。`);
    queuePlayInMatches(
      buildPlayInSeries(
        "Play-In Qualification Match",
        playIn.upperChampion,
        winner,
        "PI_FINAL",
        "PI6",
      ),
    );
    return;
  }

  if (match.stage === "PI_FINAL") {
    playIn.winner = winner;
    tournament.phase = "playin-complete";
    tournament.log.unshift(`${winner.name} 赢得最终晋级赛，晋级瑞士轮。`);
    tournament.log.unshift(`${loser.name} 入围赛淘汰。`);
  }
}

function handlePlayInNext() {
  if (!tournament?.playIn) return;
  if (!tournament.playIn.drawComplete) {
    advancePlayInDraw();
    renderPlayIn();
    return;
  }

  if (tournament.phase === "playin-complete" && tournament.currentMatch?.result) {
    beginSwissStage();
    return;
  }

  if (!tournament.currentMatch) {
    getNextPlayInMatch();
    renderPlayIn();
    return;
  }

  if (!tournament.revealed || !tournament.currentMatch.result) {
    revealCurrentMatch();
    renderPlayIn();
    return;
  }

  getNextPlayInMatch();
  renderPlayIn();
}

function fastForwardPlayIn() {
  let guard = 0;
  while (tournament?.phase === "playin" && guard < 1000) {
    handlePlayInNext();
    guard += 1;
  }
  renderPlayIn();
}

function confirmFastForwardPlayIn() {
  showConfirmModal(
    "确认快速模拟入围赛？",
    "这会保留当前已产生的结果，并自动模拟到最终晋级队产生。",
    () => {
      hideModal();
      fastForwardPlayIn();
    },
    {
      confirmText: "快速模拟入围赛",
      cancelText: "取消",
      kicker: "防误触确认",
    },
  );
}

function queueSwissRound() {
  const active = tournament.teams.filter((team) => team.status === "active");
  const matches = createSwissPairs(active).map(({ teamA, teamB, poolLabel }) => ({
    phase: `Swiss Round ${tournament.swissRound}`,
    kind: "swiss",
    teamA,
    teamB,
    record: `${teamA.wins}-${teamA.losses}`,
    poolLabel,
    targetWins: swissTargetWins(`${teamA.wins}-${teamA.losses}`),
    bestOf: swissTargetWins(`${teamA.wins}-${teamA.losses}`) * 2 - 1,
  }));
  tournament.draw = {
    phase: `Swiss Round ${tournament.swissRound}`,
    matches,
    revealedTeams: 0,
    lastCommentary: "",
  };
  tournament.currentQueue = [];
  tournament.currentMatch = null;
  tournament.revealed = false;
}

function createSwissPairs(activeTeams) {
  if (tournament.swissRound === 1) {
    const seededPairs = createFirstRoundPairs(activeTeams);
    if (seededPairs) return seededPairs;
  }

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
    const recordPairs = pairSwissRecordGroup(groups.get(record));
    if (!recordPairs) {
      throw new Error(`${record} 战绩池无法生成无重复对手的合法对阵。`);
    }
    pairs.push(...recordPairs);
  });

  return pairs;
}

function pairSwissRecordGroup(teams) {
  function findPairing(remaining, pairs) {
    if (remaining.length === 0) return pairs;
    const [teamA, ...opponents] = remaining;
    const candidates = shuffle(opponents).filter(
      (teamB) => !teamA.opponents.includes(teamB.name),
    );
    for (const teamB of candidates) {
      const nextRemaining = opponents.filter((team) => team !== teamB);
      const result = findPairing(nextRemaining, [
        ...pairs,
        { teamA, teamB, poolLabel: null },
      ]);
      if (result) return result;
    }
    return null;
  }

  return findPairing(shuffle(teams), []);
}

function createFirstRoundPairs(activeTeams) {
  const pools = new Map([1, 2, 3, 4].map((pool) => [pool, []]));
  activeTeams.forEach((team) => {
    if (pools.has(team.pool)) pools.get(team.pool).push(team);
  });
  if ([...pools.values()].some((pool) => pool.length !== 4)) return null;

  const firstHalf = pairSeedPools(pools.get(1), pools.get(4), "1号池 vs 4号池");
  const secondHalf = pairSeedPools(pools.get(2), pools.get(3), "2号池 vs 3号池");
  if (!firstHalf || !secondHalf) return null;
  return [...firstHalf, ...secondHalf];
}

function pairSeedPools(sourcePool, opponentPool, poolLabel) {
  const sources = shuffle(sourcePool);

  function findPairing(index, remaining, pairs) {
    if (index === sources.length) return pairs;
    const teamA = sources[index];
    const candidates = shuffle(remaining).filter((team) => team.region !== teamA.region);
    for (const teamB of candidates) {
      const nextRemaining = remaining.filter((team) => team !== teamB);
      const result = findPairing(index + 1, nextRemaining, [
        ...pairs,
        { teamA, teamB, poolLabel },
      ]);
      if (result) return result;
    }
    return null;
  }

  return findPairing(0, opponentPool, []);
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
  tournament.displayMode = "knockout";
  const seeds = [...tournament.qualifiers].sort((a, b) => {
    return b.wins - a.wins || a.losses - b.losses || b.basePower - a.basePower;
  });
  const highPool = seeds.slice(0, 4);
  const lowPool = seeds.slice(4, 8);
  tournament.knockout = createSingleKnockoutState(seeds);
  showModal(
    "8强已经产生",
    seeds.map((team) => team.name).join("、"),
    "瑞士轮结束",
  );
  tournament.log.unshift(`POOL B 低顺位池：${lowPool.map((team) => team.name).join(", ")}`);
  tournament.log.unshift(`POOL A 高顺位池：${highPool.map((team) => team.name).join(", ")}`);
  tournament.log.unshift("瑞士轮结束，8支队伍进入单败淘汰赛。");
  const bracketDraw = createKnockoutDraw(seeds);
  tournament.log.unshift(`淘汰赛抽签：${bracketDraw.logs.join(" / ")}`);
  tournament.knockout.drawMatches = bracketDraw.matches;
  bracketDraw.matches.forEach((match) => {
    tournament.knockout.matches[match.slot] = match;
  });
  if (els.drawScroll) els.drawScroll.scrollLeft = 0;
}

function createSingleKnockoutState(seeds) {
  return {
    mode: "single",
    seeds,
    matches: {},
    qfWinners: [],
    sfWinners: [],
    drawMatches: [],
    drawRevealedTeams: 0,
  };
}

function createKnockoutDraw(seeds) {
  const undefeated = shuffle(seeds.filter((team) => team.wins === 3 && team.losses === 0));
  const threeOne = shuffle(seeds.filter((team) => team.wins === 3 && team.losses === 1));
  const threeTwo = shuffle(seeds.filter((team) => team.wins === 3 && team.losses === 2));

  if (undefeated.length < 2 || threeTwo.length < 3 || threeOne.length < 3) {
    return {
      logs: ["战绩池异常，按瑞士排名直接落位"],
      matches: [
        buildOpeningKnockoutSeries(seeds[0], seeds[7], 1),
        buildOpeningKnockoutSeries(seeds[1], seeds[6], 2),
        buildOpeningKnockoutSeries(seeds[2], seeds[5], 3),
        buildOpeningKnockoutSeries(seeds[3], seeds[4], 4),
      ],
    };
  }

  const topSeed = undefeated[0];
  const bottomSeed = undefeated[1];
  const topOpponent = threeTwo.shift();
  const bottomOpponent = threeTwo.shift();
  const mixedPool = shuffle([...threeOne, ...threeTwo]);
  const matches = [
    buildOpeningKnockoutSeries(topSeed, topOpponent, 1),
    buildOpeningKnockoutSeries(mixedPool[0], mixedPool[1], 2),
    buildOpeningKnockoutSeries(bottomSeed, bottomOpponent, 3),
    buildOpeningKnockoutSeries(mixedPool[2], mixedPool[3], 4),
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

function buildOpeningKnockoutSeries(teamA, teamB, index) {
  return buildSeries("Quarterfinal", teamA, teamB, "QF", `S${index}`);
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

function advanceKnockout(match, winner, loser) {
  advanceSingleKnockout(match, winner, loser);
}

function advanceSingleKnockout(match, winner, loser) {
  const k = tournament.knockout;
  tournament.log.unshift(`${loser.name} 单败出局。`);

  if (match.stage === "QF") {
    k.qfWinners.push(winner);
    if (k.qfWinners.length === 4) {
      queueKnockoutMatches(
        buildSeries("Semifinal", k.qfWinners[0], k.qfWinners[1], "SF", "S5"),
        buildSeries("Semifinal", k.qfWinners[2], k.qfWinners[3], "SF", "S6"),
      );
    }
  }

  if (match.stage === "SF") {
    k.sfWinners.push(winner);
    if (k.sfWinners.length === 2) {
      queueKnockoutMatches(
        buildSeries("Final", k.sfWinners[0], k.sfWinners[1], "FINAL", "S7"),
      );
    }
  }

  if (match.stage === "FINAL") {
    finishTournament(winner);
  }
}

function localizedPhaseName(phase) {
  if (PHASE_NAMES[phase]) return PHASE_NAMES[phase];
  return String(phase || "").replace(/^Swiss Round (\d+)$/, "瑞士轮第$1轮");
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
    const phaseName = localizedPhaseName(match.phase);
    return {
      round: index + 1,
      phase: phaseName,
      opponent,
      result: prefix,
      score: `${championScore}-${opponentScore}`,
      text: `${phaseName}：${prefix} ${opponent} (${championScore}-${opponentScore})`,
    };
  });

  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    champion: champion.name,
    createdAt: new Date().toLocaleString("zh-CN"),
    swissRecord: `${champion.wins}-${champion.losses}`,
    mode: "single",
    modeName: TOURNAMENT_MODES.single,
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
      <span>淘汰赛赛制：${escapeHtml(run.modeName || TOURNAMENT_MODES[run.mode] || "历史记录")}</span>
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
    tournament.draw.lastCommentary = swissDrawCommentary(match, side, drawIndex);
    tournament.log.unshift(`${match.phase} 抽签：${tournament.draw.lastCommentary}`);
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
    tournament.log.unshift("淘汰赛抽签完成，可以开始8强赛。");
  }
  return true;
}

function remainingSwissDrawTeams() {
  if (!tournament.draw) return [];
  const currentIndex = Math.floor(tournament.draw.revealedTeams / 2);
  const currentMatch = tournament.draw.matches[currentIndex];
  if (!currentMatch) return [];
  const remainingEntries = tournament.draw.matches
    .flatMap((match, matchIndex) =>
      ["teamA", "teamB"].map((side, sideIndex) => ({
        team: match[side],
        record: match.record,
        poolLabel: match.poolLabel,
        revealIndex: matchIndex * 2 + sideIndex,
      })),
    )
    .filter((entry) => entry.revealIndex >= tournament.draw.revealedTeams);

  if (currentMatch.poolLabel) {
    return [1, 2, 3, 4]
      .map((pool) => ({
        title: `${pool}号池`,
        names: remainingEntries
          .filter((entry) => entry.team.pool === pool)
          .map((entry) => entry.team.name)
          .sort(sortDrawPoolNames),
      }))
      .filter((group) => group.names.length);
  }

  return remainingEntries
    .filter((entry) => {
      return entry.record === currentMatch.record;
    })
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
      if (match.kind === "playin") {
        advancePlayIn(match, game.winner, game.loser);
      } else {
        advanceKnockout(match, game.winner, game.loser);
      }
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
    if (target === "knockout") return tournament.phase !== "complete" && !isFinalMatch();
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
      : "这会保留当前已产生的结果，并自动模拟到决赛；决赛将进入逐段直播模式。",
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

function showPlayInReview() {
  const playIn = tournament?.playIn;
  if (!playIn?.winner) return;
  playInReviewMode = true;
  clearFinalLiveTimer();
  showView("playin");
  els.backHomePlayIn.textContent = "返回当前赛事";
  els.backHomePlayIn.classList.add("review-return");
  els.quickPlayIn.hidden = true;
  els.nextPlayIn.hidden = true;
  renderPlayInPools();
  renderPlayInBoard();
  renderPlayInLog(true);

  const match = playIn.matches.PI6;
  els.playInPhase.textContent = "Play-In Review";
  els.playInHeading.textContent = "入围赛回顾";
  els.playInStatus.textContent = `${playIn.winner.name} 晋级瑞士轮`;
  els.playInMatchPhase.textContent = "最终晋级赛";
  els.playInMatchTeams.textContent = match ? `${match.teamA.name} vs ${match.teamB.name}` : `${playIn.winner.name} 晋级`;

  if (!match) {
    els.playInMatchPowers.innerHTML = "";
    els.playInOdds.innerHTML = "";
    els.playInResult.classList.add("hidden");
    return;
  }

  prepareMatch(match);
  const rateA = winRate(match.teamA, match.teamB, match);
  els.playInMatchPowers.innerHTML = renderMatchPowerDetails(match);
  els.playInOdds.innerHTML = renderOddsMeter(match, rateA, 100 - rateA);
  els.playInResult.classList.remove("hidden");
  els.playInResult.innerHTML = match.result
    ? `${escapeHtml(match.result.displayScore)}<br>${escapeHtml(match.seriesReview)}`
    : "最终晋级赛记录不可用。";
}

function renderPlayIn() {
  const playIn = tournament.playIn;
  if (!playIn) return;
  playInReviewMode = false;
  els.backHomePlayIn.textContent = "首页";
  els.backHomePlayIn.classList.remove("review-return");
  els.quickPlayIn.hidden = false;
  els.nextPlayIn.hidden = false;
  renderPlayInPools();
  renderPlayInBoard();
  renderPlayInLog();

  if (!playIn.drawComplete) {
    const totalTeams = playIn.drawMatches.length * 2;
    els.playInPhase.textContent = "Play-In Draw";
    els.playInHeading.textContent = "入围赛抽签";
    els.playInStatus.textContent = `${playIn.drawRevealedTeams}/${totalTeams} 队已抽出`;
    els.playInMatchPhase.textContent = "完全随机抽签";
    els.playInMatchTeams.textContent = "等待抽签";
    els.playInMatchPowers.innerHTML = "";
    els.playInOdds.innerHTML = "";
    els.playInResult.classList.remove("hidden");
    els.playInResult.textContent =
      playIn.drawRevealedTeams < totalTeams
        ? `准备抽出第 ${playIn.drawRevealedTeams + 1} 支队伍。`
        : "首轮抽签完成，可以开始入围赛。";
    els.nextPlayIn.textContent =
      playIn.drawRevealedTeams === 0
        ? "开始入围赛抽签"
        : playIn.drawRevealedTeams < totalTeams
          ? "继续抽签"
          : "开始入围赛";
    return;
  }

  const match = tournament.currentMatch;
  if (!match) {
    els.playInPhase.textContent = tournament.phase === "playin-complete" ? "Play-In Complete" : "Play-In";
    els.playInHeading.textContent = tournament.phase === "playin-complete" ? "入围赛结束" : "等待下一场";
    els.playInStatus.textContent = tournament.playIn.winner
      ? `${tournament.playIn.winner.name} 晋级瑞士轮`
      : "等待下一场";
    els.playInMatchPhase.textContent = "Play-In";
    els.playInMatchTeams.textContent = tournament.playIn.winner
      ? `${tournament.playIn.winner.name} 晋级`
      : "等待比赛";
    els.playInMatchPowers.innerHTML = "";
    els.playInOdds.innerHTML = "";
    els.playInResult.classList.add("hidden");
    els.nextPlayIn.textContent = tournament.playIn.winner ? "进入瑞士轮" : "进入下一场";
    return;
  }

  prepareMatch(match);
  const rateA = winRate(match.teamA, match.teamB, match);
  const rateB = 100 - rateA;
  els.playInPhase.textContent = match.phase;
  els.playInHeading.textContent = localizedPhaseName(match.phase);
  els.playInStatus.textContent = tournament.phase === "playin-complete"
    ? `${tournament.playIn.winner.name} 晋级瑞士轮`
    : match.phase;
  els.playInMatchPhase.textContent = match.phase;
  els.playInMatchTeams.textContent = `${match.teamA.name} vs ${match.teamB.name}`;
  els.playInMatchPowers.innerHTML = renderMatchPowerDetails(match);
  els.playInOdds.innerHTML = renderOddsMeter(match, rateA, rateB);

  if (!tournament.revealed) {
    els.playInResult.classList.add("hidden");
    els.playInResult.textContent = "";
    els.nextPlayIn.textContent = matchAdvanceText(match);
    return;
  }

  els.playInResult.classList.remove("hidden");
  if (match.lastGame) {
    els.playInResult.innerHTML = renderLastGameResult(match);
  }
  els.nextPlayIn.textContent = tournament.phase === "playin-complete"
    ? "进入瑞士轮"
    : match.result
      ? completedMatchAdvanceText(match)
      : matchAdvanceText(match);
}

function renderPlayInPools() {
  els.playInPools.innerHTML = `
    <div class="playin-pool">
      <strong>完全随机抽签池</strong>
      <div>
        ${[...tournament.playIn.entrants]
          .sort((teamA, teamB) => sortDrawPoolNames(teamA.name, teamB.name))
          .map((team) => `<span>${escapeHtml(team.name)} <small>${escapeHtml(team.region)}</small></span>`)
          .join("")}
      </div>
    </div>
  `;
}

function renderPlayInBoard() {
  const slots = [
    ["PI1", "首轮一", "待抽队伍", "待抽队伍"],
    ["PI2", "首轮二", "待抽队伍", "待抽队伍"],
    ["PI3", "胜者组决赛", "PI1胜者", "PI2胜者"],
    ["PI4", "败者组第一轮", "PI1败者", "PI2败者"],
    ["PI5", "败者组决赛", "PI3败者", "PI4胜者"],
    ["PI6", "最终晋级赛", "PI3胜者", "PI5胜者"],
  ];
  els.playInBoard.innerHTML = slots
    .map(([slot, label, placeholderA, placeholderB]) =>
      renderPlayInCard(slot, label, placeholderA, placeholderB),
    )
    .join("");
}

function renderPlayInCard(slot, label, placeholderA, placeholderB) {
  const match = tournament.playIn.matches[slot];
  return `
    <div class="playin-card" data-slot="${slot}">
      <div class="playin-card-label">${label} · BO5</div>
      <div class="playin-card-teams">
        ${renderPlayInCardTeam(match, "teamA", placeholderA)}
        ${renderPlayInCardTeam(match, "teamB", placeholderB)}
      </div>
    </div>
  `;
}

function renderPlayInCardTeam(match, side, placeholder) {
  if (!match || playInTeamRevealState(match, side) === "hidden") {
    return `<div class="playin-card-team placeholder">${placeholder}</div>`;
  }
  const team = match[side];
  const score = match.score ? match.score[team.name] : 0;
  return `<div class="playin-card-team${teamDrawClass(match, team)}">${escapeHtml(team.name)}<small class="region-tag">${escapeHtml(team.region)}</small><span>${score}</span></div>`;
}

function playInTeamRevealState(match, side) {
  const playIn = tournament.playIn;
  const openingIndex = playIn.drawMatches.indexOf(match);
  if (playIn.drawComplete || openingIndex < 0) return "revealed";
  const sideIndex = side === "teamA" ? 0 : 1;
  const revealIndex = openingIndex * 2 + sideIndex;
  return playIn.drawRevealedTeams > revealIndex ? "revealed" : "hidden";
}

function renderPlayInLog(reviewOnly = false) {
  const lines = reviewOnly
    ? tournament.log.filter((line) => line.includes("入围赛") || line.startsWith("Play-In"))
    : tournament.log;
  renderLogLines(els.playInLog, lines);
}

function isFinalMatch(match = tournament?.currentMatch) {
  return Boolean(match && match.stage === "FINAL");
}

function clearFinalLiveTimer() {
  if (finalLiveTimer) {
    clearTimeout(finalLiveTimer);
    finalLiveTimer = null;
  }
}

function finalSeriesScore(match, score = match.score) {
  return `${score?.[match.teamA.name] || 0} : ${score?.[match.teamB.name] || 0}`;
}

function finalEventPart(text, tone = "") {
  return { text, tone };
}

function finalSegment(time, parts, commentary, reactions) {
  return { time, parts, commentary, reactions };
}

function randomInteger(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function pickFinalGameDuration(storyType) {
  const roll = Math.random();
  if (storyType === "comeback") {
    if (roll < 0.42) return randomInteger(32, 40);
    if (roll < 0.78) return randomInteger(41, 49);
    return randomInteger(50, 57);
  }
  if (storyType === "macro") {
    if (roll < 0.18) return randomInteger(34, 40);
    if (roll < 0.68) return randomInteger(41, 49);
    return randomInteger(50, 57);
  }
  if (storyType === "close") {
    if (roll < 0.32) return randomInteger(32, 40);
    if (roll < 0.78) return randomInteger(41, 49);
    return randomInteger(50, 57);
  }
  if (storyType === "chaos") {
    if (roll < 0.42) return randomInteger(27, 34);
    if (roll < 0.82) return randomInteger(35, 43);
    return randomInteger(44, 52);
  }
  if (roll < 0.28) return randomInteger(25, 31);
  if (roll < 0.68) return randomInteger(32, 40);
  if (roll < 0.9) return randomInteger(41, 49);
  return randomInteger(50, 57);
}

function finalTimelineNodeCount(duration) {
  return clamp(Math.round(6 + ((duration - 25) / 30) * 4), 6, 10);
}

function buildFinalMinutesBackward(duration, nodeCount) {
  const minutes = Array(nodeCount);
  minutes[nodeCount - 1] = duration;

  for (let index = nodeCount - 2; index >= 0; index -= 1) {
    const idealMinute = Math.round(3 + ((duration - 3) * index) / (nodeCount - 1));
    let earliestMinute = 2 + index * 3;
    if (index === 3) earliestMinute = Math.max(earliestMinute, 15);
    if (index === 4) earliestMinute = Math.max(earliestMinute, 20);
    const latestMinute = minutes[index + 1] - 3;
    minutes[index] = clamp(idealMinute + randomInteger(-2, 2), earliestMinute, latestMinute);
  }

  return minutes;
}

function buildFinalLiveTimeline(match, game) {
  const winner = game.gameWinner;
  const loser = winner.name === match.teamA.name ? match.teamB : match.teamA;
  const winnerRate = winRate(winner, loser, match);
  const storyRoll = Math.random();
  let storyType;
  if (winnerRate < 45 && Math.random() < 0.42) storyType = "comeback";
  else if (storyRoll < 0.2) storyType = "controlled";
  else if (storyRoll < 0.45) storyType = "close";
  else if (storyRoll < 0.65) storyType = "macro";
  else if (storyRoll < 0.84) storyType = "chaos";
  else storyType = "comeback";
  const duration = pickFinalGameDuration(storyType);
  game.duration = duration;
  game.storyType = storyType;
  const w = () => finalEventPart(winner.name, "team");
  const l = () => finalEventPart(loser.name, "team");
  const text = (value) => finalEventPart(value);
  const major = (value) => finalEventPart(value, "major");
  const dragon = (value) => finalEventPart(value, "dragon");
  const baron = (value) => finalEventPart(value, "baron");
  const tower = (value) => finalEventPart(value, "tower");
  const gold = (value) => finalEventPart(value, "gold");
  const elder = (value) => finalEventPart(value, "elder");
  const choose = (time, variants) => {
    const selected = pickLine(variants);
    return finalSegment(time, selected.parts(), selected.commentary(), selected.reactions());
  };
  const buildLateFiller = (minute) => {
    const variantsByStory = {
      close: [
        { parts: () => [l(), major("先手击杀一人"), text("，但"), w(), major("拖到队友复活完成反击"), text("。")], commentary: () => `两边连续交换技能，没有任何一方能够真正拉开差距。`, reactions: () => ["“又打回来了！”", "“这局谁都不肯退。”"] },
        { parts: () => [w(), dragon("控下元素龙"), text("，"), l(), tower("交换掉边路二塔"), text("。")], commentary: () => `一边拿资源、一边拿防御塔，双方仍在用不同方式维持均势。`, reactions: () => ["“还是五五开。”", "“每一波交换都很关键。”"] },
        { parts: () => [l(), text("绕后逼出关键闪现，"), w(), text("及时拉开，没有让团战爆发。")], commentary: () => `双方都看到了机会，却也都清楚失误一次就可能葬送整局。`, reactions: () => ["“全是心理博弈。”", "“差一点就开起来了！”"] },
      ],
      macro: [
        { parts: () => [w(), text("用兵线牵制上半区，悄然"), dragon("控下元素龙"), text("。")], commentary: () => `${winner.name}没有正面接触，通过兵线把资源稳稳收入囊中。`, reactions: () => ["“人还没到，资源已经没了。”", "“这就是运营节奏。”"] },
        { parts: () => [l(), tower("拆掉边路二塔"), text("，"), w(), text("则入侵野区并清空资源。")], commentary: () => `双方继续交换地图价值，经济差仍没有明显拉开。`, reactions: () => ["“你拿塔，我拿野区。”", "“这局比的是耐心。”"] },
        { parts: () => [w(), text("连续排空大龙区视野，迫使"), l(), text("抱团前来检查。")], commentary: () => `${winner.name}正在用视野制造压力，真正的目标是让对手失去边线处理空间。`, reactions: () => ["“大龙还没打，兵线先亏了。”", "“地图正在慢慢变窄。”"] },
      ],
      chaos: [
        { parts: () => [l(), major("河道率先击杀两人"), text("，"), w(), major("追击完成二换三"), text("。")], commentary: () => `技能和人头不断交换，这场比赛已经彻底进入乱战节奏！`, reactions: () => ["“到底谁赢了？”", "“屏幕上全是技能！”"] },
        { parts: () => [w(), text("越塔失败损失两人，却在复活后"), major("反抓对方双C"), text("。")], commentary: () => `双方都在寻找下一波机会，根本没有留下喘息时间。`, reactions: () => ["“刚送完又打回来了！”", "“这局完全停不下来。”"] },
        { parts: () => [l(), dragon("抢下小龙"), text("，"), w(), major("追击打出一换三"), text("。")], commentary: () => `资源属于${loser.name}，但团战经济却被${winner.name}收入囊中。`, reactions: () => ["“龙是谁的，人头又是谁的？”", "“又是一波大交换！”"] },
      ],
    };
    const variants = variantsByStory[storyType] ? [...variantsByStory[storyType]] : [
      { parts: () => [w(), baron("控下第二条大龙"), text("，利用兵线继续压缩"), l(), text("的活动空间。")], commentary: () => `${winner.name}没有急着结束，而是继续用大龙稳步扩大优势。`, reactions: () => ["“又一条大龙！”", `“${loser.name}几乎出不了高地了。”`] },
      { parts: () => [l(), text("在野区冒险排眼，"), w(), major("抓住机会击杀两人"), text("并转向下一条地图资源。")], commentary: () => `${winner.name}耐心等到了对手的视野失误，比赛节奏再次加快。`, reactions: () => ["“这个眼不能排！”", "“减员之后资源守不住了。”"] },
      { parts: () => [w(), tower("拆掉一路高地"), text("，但"), l(), major("守住主水晶完成止损"), text("。")], commentary: () => `${loser.name}暂时守住比赛，可超级兵会持续牵制他们。`, reactions: () => ["“还没有结束！”", "“下一波兵线压力太大了。”"] },
      { parts: () => [w(), dragon("拿到关键元素龙"), text("，随后逼退"), l(), text("并接管下半野区。")], commentary: () => `${winner.name}继续积累资源优势，没有给对手轻易开团的角度。`, reactions: () => ["“资源还在被蚕食。”", `“${winner.name}打得很稳。”`] },
    ];
    if (minute >= 35) {
      variants.push(
        { parts: () => [w(), elder("拿下远古龙"), text("，"), l(), text("只能退回高地防守。")], commentary: () => `远古龙到手，${winner.name}已经获得了结束比赛的最佳机会。`, reactions: () => ["“远古龙拿到了！”", "“这波高地怎么守？”"] },
        { parts: () => [l(), text("孤注一掷争夺远古龙，"), w(), major("完成抢龙并反杀三人"), text("。")], commentary: () => `${winner.name}在最关键的惩戒对决中胜出，现场已经彻底沸腾！`, reactions: () => ["“又抢到了！”", "“这可能就是最后一波了！”"] },
      );
    }
    return choose(`${minute}分钟`, variants);
  };
  const completeTimeline = (baseSegments, chanceCurve) => {
    const nodeCount = finalTimelineNodeCount(duration);
    const minutes = buildFinalMinutesBackward(duration, nodeCount);
    const fillerCount = nodeCount - baseSegments.length;
    const segments = [
      ...baseSegments.slice(0, -1),
      ...Array.from({ length: fillerCount }, () => null),
      baseSegments[baseSegments.length - 1],
    ];

    return segments.map((segment, index) => {
      const curvePosition = (index / (segments.length - 1)) * (chanceCurve.length - 1);
      const lowerIndex = Math.floor(curvePosition);
      const upperIndex = Math.min(lowerIndex + 1, chanceCurve.length - 1);
      const curveProgress = curvePosition - lowerIndex;
      const winnerChance = Math.round(
        chanceCurve[lowerIndex] + (chanceCurve[upperIndex] - chanceCurve[lowerIndex]) * curveProgress,
      );
      return {
        ...(segment || buildLateFiller(minutes[index])),
        time: `${minutes[index]}分钟`,
        winnerChance,
      };
    });
  };

  const controlled = [
    choose("3分钟", [
      { parts: () => [w(), major("下路完成线杀"), text("，中路同时逼出闪现。")], commentary: () => `${winner.name}从第一波对线就开始施压，决赛准备非常充分！`, reactions: () => [`“${winner.name}今天手感火热！”`, "“开局节奏也太快了。”"] },
      { parts: () => [w(), text("打野入侵成功，"), major("击杀对方打野并拿下一血"), text("。")], commentary: () => `${winner.name}完全读懂了对方的开野路线，这是一波有准备的入侵。`, reactions: () => ["“开局就进野区？”", `“${winner.name}胆子太大了！”`] },
      { parts: () => [w(), major("中路完成单杀"), text("，随后帮助下路建立线权。")], commentary: () => `决赛舞台上的单杀！${winner.name}已经掌握中路主动权。`, reactions: () => ["“单杀！”", "“现场第一波欢呼来了！”"] },
      { parts: () => [w(), text("辅助提前游走，配合打野在河道"), major("打出零换二"), text("。")], commentary: () => `${winner.name}的联动速度明显更快，${loser.name}完全来不及支援。`, reactions: () => ["“这辅助来得也太快了。”", "“河道直接炸了。”"] },
    ]),
    choose("7分钟", [
      { parts: () => [w(), dragon("拿下第一条小龙"), text("，但"), l(), tower("越塔击杀上路"), text("完成止损。")], commentary: () => `${winner.name}拿到团队资源，${loser.name}则选择从边线追回经济。`, reactions: () => ["“资源换人头，哪边更赚？”", `“${loser.name}还没有乱。”`] },
      { parts: () => [l(), dragon("控下第一条小龙"), text("，"), w(), major("下路打出双杀"), text("。")], commentary: () => `${loser.name}拿到小龙，但下路两颗人头让${winner.name}获得了更直接的经济。`, reactions: () => ["“小龙换双杀？”", "“下路差距要出来了。”"] },
      { parts: () => [w(), text("抓住回城时间差，连续控下河蟹与"), dragon("第一条小龙"), text("。")], commentary: () => `${winner.name}没有强行打架，却通过节奏连续拿到地图资源。`, reactions: () => ["“这运营很舒服。”", `“${loser.name}一直慢半拍。”`] },
    ]),
    choose("13分钟", [
      { parts: () => [w(), text("释放峡谷先锋，"), tower("撞掉中路一塔"), text("并建立"), gold("两千经济领先"), text("。")], commentary: () => `中路一塔被拆后，${winner.name}进入野区会更加自由。`, reactions: () => ["“视野压力要来了。”", `“${winner.name}运营起来了！”`] },
      { parts: () => [w(), tower("连续拆掉上下两座外塔"), text("，转线速度完全压制"), l(), text("。")], commentary: () => `${winner.name}把对线优势快速扩散到了整张地图。`, reactions: () => ["“塔掉得太快了。”", "“经济差已经很明显了。”"] },
      { parts: () => [l(), text("试图争夺先锋，"), w(), major("正面打出一换三"), text("并收下先锋。")], commentary: () => `${loser.name}想阻止资源滚动，但这波团战反而让差距继续扩大。`, reactions: () => ["“不接这波可能更好。”", `“${winner.name}团战处理太清楚了。”`] },
    ]),
    choose("20分钟", [
      { parts: () => [l(), text("强行争夺小龙，"), w(), major("打出零换四"), text("并拿到"), dragon("龙魂听牌"), text("。")], commentary: () => `${winner.name}的领先已经转化成正面团战优势，${loser.name}很难继续接团。`, reactions: () => ["“差一点就是团灭。”", "“龙魂压力太大了。”"] },
      { parts: () => [w(), text("在中路抓住落单辅助，随后"), dragon("控下第三条小龙"), text("。")], commentary: () => `一次抓单同时带来视野与小龙，${winner.name}的决策非常连贯。`, reactions: () => ["“辅助不能这样走。”", "“听牌龙到手了！”"] },
      { parts: () => [l(), text("绕后开团，"), w(), major("双C极限拉扯完成反打"), text("。")], commentary: () => `${loser.name}找到了机会，但${winner.name}双C的处理让这次绕后功亏一篑。`, reactions: () => ["“就差一点！”", `“${winner.name}双C太冷静了。”`] },
    ]),
    choose("28分钟", [
      { parts: () => [w(), major("打出团灭"), text("，顺势"), baron("拿下大龙"), text("。")], commentary: () => `团灭加大龙！这很可能就是决定本局比赛的一波。`, reactions: () => ["“大龙毁一生！”", "“这一波要结束了！”"] },
      { parts: () => [l(), text("尝试偷大龙，"), w(), major("完成抢龙并反杀三人"), text("。")], commentary: () => `${winner.name}不仅抢到了大龙，还彻底粉碎了对手最后的冒险。`, reactions: () => ["“抢到了！”", "“全场都站起来了！”"] },
      { parts: () => [w(), dragon("拿下龙魂"), text("，随后在河道"), major("打出一换四"), text("。")], commentary: () => `龙魂与团战双丰收，${winner.name}已经把胜利握在手中。`, reactions: () => ["“龙魂团结束了。”", `“${loser.name}没有退路了。”`] },
    ]),
    choose(`${duration}分钟`, [
      { parts: () => [w(), text("利用"), baron("大龙兵线"), tower("连破两路高地"), text("，最终结束比赛。")], commentary: () => `${winner.name}没有给对手第二次机会，稳稳收下本局胜利！`, reactions: () => [`“${winner.name}！${winner.name}！”`, "“决赛现场彻底沸腾了！”"] },
      { parts: () => [w(), major("在基地前打出团灭"), text("，一波终结比赛。")], commentary: () => `${winner.name}用最直接的方式结束了本局，最后一波没有任何犹豫！`, reactions: () => ["“团灭！结束了！”", "“这就是决赛执行力！”"] },
      ...(duration >= 35 ? [
        { parts: () => [w(), elder("拿下远古龙"), text("，正面击溃"), l(), text("并推平基地。")], commentary: () => `远古龙成为最后的胜负手，${winner.name}赢下这场鏖战！`, reactions: () => ["“远古龙伤害太夸张了！”", "“终于分出胜负了！”"] },
      ] : []),
    ]),
  ];

  if (storyType === "controlled") return completeTimeline(controlled, [56, 62, 70, 80, 90, 100]);

  if (storyType === "close") return completeTimeline([
    choose("3分钟", [
      { parts: () => [w(), major("中路抢到一血"), text("，"), l(), major("下路立刻完成线杀"), text("。")], commentary: () => `两边在不同战线同时打开局面，决赛从开场就进入针锋相对的节奏！`, reactions: () => ["“一边一个人头！”", "“今天谁都不想让。”"] },
      { parts: () => [l(), text("入侵野区反掉红区，"), w(), text("则越过河道控下双河蟹。")], commentary: () => `双方打野选择不同的交换路线，开局资源几乎完全持平。`, reactions: () => ["“镜像交换。”", "“两边都算得很清楚。”"] },
      { parts: () => [w(), major("上路完成单杀"), text("，但"), l(), major("中野联动击杀两人"), text("。")], commentary: () => `个人操作与团队联动各有斩获，场上的天平仍在中央摇摆。`, reactions: () => ["“刚领先又被打回来了！”", "“这才是决赛！”"] },
    ]),
    choose("8分钟", [
      { parts: () => [w(), dragon("拿到第一条小龙"), text("，"), l(), tower("用先锋撞出中路镀层"), text("。")], commentary: () => `资源交换非常清晰，一边积累小龙，一边投资中路经济。`, reactions: () => ["“各取所需。”", "“现在还看不出谁更赚。”"] },
      { parts: () => [l(), dragon("抢到第一条小龙"), text("，"), w(), major("河道追击收下两个人头"), text("。")], commentary: () => `${loser.name}拿到战略资源，${winner.name}则靠击杀维持经济领先。`, reactions: () => ["“龙拿到了，但人走不掉。”", "“还是均势！”"] },
      { parts: () => [w(), text("下路四包二被及时察觉，双方支援到场后"), major("打成二换二"), text("。")], commentary: () => `十个人几乎同时赶到下路，第一场大规模碰撞没有分出胜负。`, reactions: () => ["“全来了！”", "“打完还是一样。”"] },
    ]),
    choose("14分钟", [
      { parts: () => [l(), tower("先拆中路一塔"), text("，"), w(), tower("随后连破两座边塔"), text("完成回应。")], commentary: () => `地图被迅速打开，双方的转线速度都没有给对手留下空档。`, reactions: () => ["“拆塔竞速！”", "“经济差只有几百。”"] },
      { parts: () => [w(), text("先锋团率先开到辅助，"), l(), major("双C反手打出一换二"), text("。")], commentary: () => `${winner.name}先手很好，但${loser.name}的后排处理更加冷静。`, reactions: () => ["“开得漂亮，反打更漂亮！”", "“局势又变了。”"] },
      { parts: () => [l(), text("用边线牵制拿到先锋，"), w(), dragon("交换第二条小龙"), text("。")], commentary: () => `两队继续避开对方的强势区域，把比赛维持在可以接受的均势。`, reactions: () => ["“还是资源互换。”", "“谁先犯错谁就危险。”"] },
    ]),
    choose("21分钟", [
      { parts: () => [l(), major("小龙团率先击杀打野"), text("，"), w(), major("双C拉扯完成二换三"), text("。")], commentary: () => `少一人的${winner.name}竟然打赢后半段团战，现场声音瞬间翻转！`, reactions: () => ["“这都能打回来？”", "“双C操作拉满了！”"] },
      { parts: () => [w(), dragon("抢下听牌龙"), text("，但撤退途中被"), l(), major("追击击杀三人"), text("。")], commentary: () => `${winner.name}保住了小龙节奏，${loser.name}则把团战收益全部兑现成经济。`, reactions: () => ["“龙拿到了，人全留下了！”", "“胜率还是咬得很紧。”"] },
      { parts: () => [w(), major("中路开团打出一换三"), text("，"), l(), text("复活后立刻抓住落单上单止损。")], commentary: () => `双方不断抓住彼此回合之间的空档，没有人能把优势安全带走。`, reactions: () => ["“你打一波，我还一波。”", "“这局太胶着了！”"] },
    ]),
    choose("29分钟", [
      { parts: () => [l(), text("率先开打大龙，"), w(), major("进场抢龙并带走两人"), text("。")], commentary: () => `大龙易主！${winner.name}终于在最紧张的资源争夺中取得领先。`, reactions: () => ["“抢到了！”", "“这一波可能改变比赛！”"] },
      { parts: () => [w(), dragon("拿下龙魂"), text("，随后与"), l(), major("正面打成三换三"), text("。")], commentary: () => `龙魂已经到手，但${loser.name}用强硬团战证明比赛远未结束。`, reactions: () => ["“有龙魂也不能大意。”", "“还在拉扯！”"] },
      { parts: () => [l(), major("高地前找到完美开团"), text("，"), w(), text("拖到关键队员复活后完成反守。")], commentary: () => `${winner.name}的基地一度岌岌可危，但他们把比赛硬生生拖回下一回合。`, reactions: () => ["“水晶差点没了！”", "“守住了，真的守住了！”"] },
    ]),
    choose(`${duration}分钟`, [
      { parts: () => [w(), baron("赢下最终大龙团"), text("，带着强化兵线一波结束比赛。")], commentary: () => `长时间的均势终于被打破，${winner.name}把最后一次机会变成了冠军局胜利！`, reactions: () => ["“终于分出胜负！”", `“${winner.name}顶住了！”`] },
      { parts: () => [l(), text("先手冲击基地，"), w(), major("背水一战完成团灭"), text("并反推结束比赛。")], commentary: () => `${winner.name}在主水晶前守住最后一口气，随后做出了不回城、直接反推的决断！`, reactions: () => ["“基地保住了！”", "“反推！反推！”"] },
      ...(duration >= 35 ? [
        { parts: () => [w(), major("在远古龙前打出三换五"), text("，仅存的队员一路推进终结比赛。")], commentary: () => `双方战至最后一人，${winner.name}靠微弱人数优势结束这场拉锯战！`, reactions: () => ["“只剩一个人也能一波！”", "“太窒息了！”"] },
      ] : []),
    ]),
  ], [52, 47, 55, 48, 72, 100]);

  if (storyType === "macro") return completeTimeline([
    choose("4分钟", [
      { parts: () => [w(), text("中野提前布置河道视野，安全控下双河蟹。")], commentary: () => `没有人头爆发，${winner.name}先用视野和路线取得微小主动。`, reactions: () => ["“开局很安静。”", "“两边都在算下一步。”"] },
      { parts: () => [l(), text("反掉一组野怪，"), w(), text("则通过推线让三路同时获得回城优势。")], commentary: () => `双方没有强行碰撞，而是在资源和兵线之间做精细交换。`, reactions: () => ["“这局比的是基本功。”", "“一点资源都不肯白给。”"] },
      { parts: () => [w(), text("上路主动让线传送回城，提前为第一条小龙完成装备补给。")], commentary: () => `一个看似普通的回城时间，可能已经决定了下一处资源的归属。`, reactions: () => ["“提前一分钟就在准备。”", "“运营局来了。”"] },
    ]),
    choose("9分钟", [
      { parts: () => [w(), dragon("无伤控下第一条小龙"), text("，"), l(), text("在上半区反掉两组野怪。")], commentary: () => `${winner.name}拿战略资源，${loser.name}拿即时经济，双方都接受这次交换。`, reactions: () => ["“各拿一边地图。”", "“还是没有人头。”"] },
      { parts: () => [l(), text("利用线权先拿先锋，"), w(), dragon("同时收下第一条小龙"), text("。")], commentary: () => `镜像资源交换，两队的比赛计划都执行得非常完整。`, reactions: () => ["“谁都抓不到破绽。”", "“标准的资源置换。”"] },
      { parts: () => [w(), text("假装进攻下路，实际转身控下先锋。")], commentary: () => `${winner.name}用一次视野欺骗调动了三名对手，轻松拿到上半区资源。`, reactions: () => ["“被骗到下路了！”", "“这个转向很聪明。”"] },
    ]),
    choose("16分钟", [
      { parts: () => [w(), tower("释放先锋拆掉中路一塔"), text("，随后立即分散处理两条边线。")], commentary: () => `中塔一掉，${winner.name}的视野终于可以向前延伸。`, reactions: () => ["“第一座塔很关键。”", "“地图要被打开了。”"] },
      { parts: () => [l(), tower("先拆下路一塔"), text("，"), w(), tower("交换中路一塔"), text("并入侵野区。")], commentary: () => `表面是一塔换一塔，${winner.name}却借中路线权拿到了更深的视野。`, reactions: () => ["“真正赚的是视野。”", "“野区开始不好进了。”"] },
      { parts: () => [w(), text("连续转线逼出两次传送，经济领先只有"), gold("一千"), text("，节奏优势却在扩大。")], commentary: () => `计分板差距不大，但${loser.name}已经越来越难以同时处理三条兵线。`, reactions: () => ["“钱没差多少，人一直被调动。”", "“慢慢被牵住了。”"] },
    ]),
    choose("23分钟", [
      { parts: () => [w(), text("排空大龙区视野，逼迫"), l(), text("抱团检查后转身"), dragon("拿下听牌龙"), text("。")], commentary: () => `${winner.name}用大龙制造假压力，真正目标始终是下半区资源。`, reactions: () => ["“被调虎离山了！”", "“这条龙拿得太轻松。”"] },
      { parts: () => [l(), text("五人集结守住小龙，"), w(), tower("趁机连拆两座边塔"), text("。")], commentary: () => `${loser.name}守住资源，却付出了整片边线地图作为代价。`, reactions: () => ["“小龙没丢，塔全没了。”", "“这交换真的赚吗？”"] },
      { parts: () => [w(), major("抓住一次转线时间差击杀辅助"), text("，但没有冒险开打大龙。")], commentary: () => `${winner.name}选择把减员变成视野和兵线优势，而不是进行高风险赌龙。`, reactions: () => ["“不打龙，很冷静。”", "“先把地图吃干净。”"] },
    ]),
    choose("32分钟", [
      { parts: () => [w(), text("连续三次逼迫对手检查大龙，终于"), major("抓住落单打野"), text("并"), baron("稳稳收下大龙"), text("。")], commentary: () => `长达数分钟的视野压迫终于兑现，${winner.name}等到了最安全的出手时机。`, reactions: () => ["“耐心等到打野落单！”", "“这条大龙没有悬念。”"] },
      { parts: () => [l(), text("试图用边线偷塔，"), w(), baron("果断开打大龙"), text("并在回防前安全撤退。")], commentary: () => `${winner.name}准确判断了对方回城时间，用一次果断决策打破僵局。`, reactions: () => ["“开得太快了！”", "“回城已经来不及了。”"] },
      { parts: () => [w(), dragon("拿下龙魂"), text("，全员保持满状态，没有给"), l(), text("反打窗口。")], commentary: () => `没有华丽团战，${winner.name}靠每一次提前落位积累出了决定性资源。`, reactions: () => ["“几乎没打架就拿到龙魂。”", "“这运营太严密了。”"] },
    ]),
    choose(`${duration}分钟`, [
      { parts: () => [w(), text("依靠三路兵线同步推进，"), tower("连破高地"), text("并在主水晶前结束比赛。")], commentary: () => `${winner.name}把微小优势一步步变成无法处理的兵线压力，完成了一场教科书式胜利。`, reactions: () => ["“兵线全进来了！”", "“从头到尾都被牵着走。”"] },
      { parts: () => [w(), baron("控下第二条大龙"), text("，利用强化兵线迫使"), l(), text("放弃基地。")], commentary: () => `第二条大龙成为最后砝码，${winner.name}没有给对手任何赌团的机会。`, reactions: () => ["“太稳了。”", "“找不到能翻的团战。”"] },
      ...(duration >= 35 ? [
        { parts: () => [w(), elder("拿下远古龙"), text("，分推选手直接拆毁主水晶。")], commentary: () => `所有人都在远古龙区拉扯，${winner.name}却用边线完成了最后一击！`, reactions: () => ["“基地！看基地！”", "“这就是兵线理解！”"] },
      ] : []),
    ]),
  ], [51, 53, 58, 64, 82, 100]);

  if (storyType === "chaos") return completeTimeline([
    choose("3分钟", [
      { parts: () => [w(), text("一级入侵爆发十人混战，双方"), major("打成三换三"), text("，一血由"), w(), text("收下。")], commentary: () => `比赛才刚开始，召唤师峡谷已经乱成一团！`, reactions: () => ["“一级就打六个人头？”", "“这局要疯狂了！”"] },
      { parts: () => [l(), major("野区拿下一血"), text("，"), w(), major("追击过河反杀两人"), text("。")], commentary: () => `双方完全没有撤退的意思，第一轮交锋就连续发生反转。`, reactions: () => ["“还在追！”", "“谁都不想停手。”"] },
      { parts: () => [w(), major("下路二级打出双杀"), text("，"), l(), text("打野赶到后收掉残血两人。")], commentary: () => `下路四个人全部倒下，人头与经验被重新洗牌。`, reactions: () => ["“一个都没走掉！”", "“下路已经炸成烟花了。”"] },
    ]),
    choose("7分钟", [
      { parts: () => [l(), tower("三人越上击杀两人"), text("，"), w(), major("下路反越塔拿到三杀"), text("。")], commentary: () => `两边同时越塔，镜头甚至不知道该先看哪一边！`, reactions: () => ["“导播忙不过来了！”", "“下路三杀！”"] },
      { parts: () => [w(), dragon("强行开打小龙"), text("，随后河道混战"), major("打成四换三"), text("。")], commentary: () => `${winner.name}拿到小龙却付出更多人头，这波到底谁赚还要重新计算。`, reactions: () => ["“龙拿了，人也全没了。”", "“经济又反过去了！”"] },
      { parts: () => [l(), major("中路越塔失败送出三人"), text("，复活后却立刻在先锋处"), major("还以零换二"), text("。")], commentary: () => `优势只维持了不到一分钟，比赛再次回到不可预测的状态。`, reactions: () => ["“刚打完又来？”", "“完全没有运营时间。”"] },
    ]),
    choose("14分钟", [
      { parts: () => [w(), text("先锋团抢先击杀两人，追击途中被"), l(), major("绕后反杀三人"), text("。")], commentary: () => `团战从正面一路打到野区，最后站着的人反而来自后进场的${loser.name}。`, reactions: () => ["“反包过来了！”", "“又反转了！”"] },
      { parts: () => [l(), tower("拆掉中路一塔"), text("，"), w(), major("利用狭窄路口打出零换三"), text("。")], commentary: () => `${loser.name}刚拿到地图优势，马上就在撤退路线付出惨重代价。`, reactions: () => ["“塔拿到了，回不去了！”", "“这就是乱战局。”"] },
      { parts: () => [w(), major("辅助闪现开团命中三人"), text("，双方支援陆续到场后总计爆发七个人头。")], commentary: () => `一记闪现开团点燃全场，十名选手分成数个战场同时交火！`, reactions: () => ["“到处都在打！”", "“人头数已经看不懂了。”"] },
    ]),
    choose("21分钟", [
      { parts: () => [l(), dragon("抢下关键小龙"), text("，"), w(), major("一路追到高地打出团灭"), text("。")], commentary: () => `小龙属于${loser.name}，但${winner.name}的追击把整波团战彻底改写。`, reactions: () => ["“拿龙的人被团灭了！”", "“追到高地去了！”"] },
      { parts: () => [w(), major("野区先手秒掉双C"), text("，却因追击过深被"), l(), major("反杀四人"), text("。")], commentary: () => `一波本该结束的团战被贪心改写，${loser.name}又把局势拉了回来。`, reactions: () => ["“别追了！”", "“剩下的人全收掉了！”"] },
      { parts: () => [l(), text("偷打大龙被发现，双方在龙坑"), major("打成四换四"), text("，大龙最终回血。")], commentary: () => `九个人先后倒下，大龙却成了这场混战里唯一的赢家。`, reactions: () => ["“龙没打掉，人全没了。”", "“太混乱了！”"] },
    ]),
    choose("28分钟", [
      { parts: () => [w(), major("正面打出团灭"), text("并"), baron("拿下大龙"), text("，终于建立明确领先。")], commentary: () => `打了整局乱战，${winner.name}终于把一次团战完整转化成地图资源！`, reactions: () => ["“这次没有再出意外！”", "“大龙到手了！”"] },
      { parts: () => [l(), baron("抢到大龙"), text("，"), w(), major("随即完成团灭"), text("并保住三路兵线。")], commentary: () => `大龙被抢走，但${winner.name}杀掉全部龙种，反而保住了局势主动。`, reactions: () => ["“龙抢了，人没了！”", "“一个龙种都没跑掉。”"] },
      { parts: () => [w(), dragon("拿下龙魂"), text("，随后在河道"), major("连续收割四人"), text("。")], commentary: () => `龙魂终于让混乱的团战出现倾斜，${winner.name}开始掌控战场。`, reactions: () => ["“伤害挡不住了！”", `“${winner.name}要接管比赛！”`] },
    ]),
    choose(`${duration}分钟`, [
      { parts: () => [w(), major("基地前打出最后一波团灭"), text("，在全场欢呼中结束比赛。")], commentary: () => `从一级打到基地，${winner.name}在最后一次混战中笑到了最后！`, reactions: () => ["“终于结束了！”", "“整局都没有停过！”"] },
      { parts: () => [l(), text("试图偷家，"), w(), major("回城守住后反推主水晶"), text("。")], commentary: () => `最后的偷家尝试失败，${winner.name}没有犹豫，直接沿中路完成反推！`, reactions: () => ["“守住了！”", "“另一边基地没人！”"] },
      ...(duration >= 35 ? [
        { parts: () => [w(), elder("混战中抢下远古龙"), text("，残局追击完成团灭并终结比赛。")], commentary: () => `最混乱的一波诞生了最清晰的结果：远古龙属于${winner.name}，胜利也属于他们！`, reactions: () => ["“远古龙被抢了！”", "“最后还是惩戒决定一切！”"] },
      ] : []),
    ]),
  ], [57, 46, 59, 49, 84, 100]);

  return completeTimeline([
    choose("3分钟", [
      { parts: () => [l(), major("中路完成单杀"), text("，下路同时取得线权。")], commentary: () => `${loser.name}一上来就把决赛强度拉满了，${winner.name}必须尽快稳住局面！`, reactions: () => [`“${loser.name}今天状态太好了！”`, "“这开局要出事了。”"] },
      { parts: () => [l(), text("野区入侵成功，"), major("拿下一血并反掉两组野怪"), text("。")], commentary: () => `${winner.name}的打野路线被完全看穿，前期节奏已经落后。`, reactions: () => ["“野区要守不住了。”", `“${loser.name}准备太充分了。”`] },
      { parts: () => [l(), major("下路打出双杀"), text("，开局直接建立巨大优势。")], commentary: () => `${loser.name}下路一波打穿，${winner.name}必须重新调整比赛计划。`, reactions: () => ["“下路炸了！”", "“这还是决赛吗？”"] },
    ]),
    choose("8分钟", [
      { parts: () => [w(), dragon("拿下第一条小龙"), text("，但"), l(), tower("越塔击杀上路"), text("继续扩大优势。")], commentary: () => `${winner.name}拿到资源止损，${loser.name}则把领先集中到了边线。`, reactions: () => ["“资源换人头。”", `“${winner.name}还没有乱。”`] },
      { parts: () => [l(), dragon("控下第一条小龙"), text("并拆掉下路镀层，经济差来到"), gold("两千"), text("。")], commentary: () => `${loser.name}的领先正在稳定增长，${winner.name}需要主动制造变数。`, reactions: () => ["“已经两千经济了。”", "“翻盘点在哪里？”"] },
      { parts: () => [w(), major("抓死对方打野"), text("，但"), l(), tower("交换掉上路一塔"), text("。")], commentary: () => `${winner.name}终于找到人头，可地图资源仍然掌握在${loser.name}手中。`, reactions: () => ["“总算止血了。”", "“但塔还是掉了。”"] },
    ]),
    choose("15分钟", [
      { parts: () => [l(), tower("用先锋撞掉中路一塔"), text("，经济领先扩大到"), gold("三千"), text("。")], commentary: () => `${winner.name}的活动空间正在被压缩，这已经到了必须寻找机会的阶段。`, reactions: () => ["“不会真的要一边倒吧？”", `“${winner.name}粉丝开始紧张了。”`] },
      { parts: () => [l(), text("连续控下先锋与第二条小龙，完全掌握河道视野。")], commentary: () => `${loser.name}正在用资源迫使${winner.name}进入自己设定的节奏。`, reactions: () => ["“地图全黑了。”", "“这个局面太难打了。”"] },
      { parts: () => [l(), major("上路打出零换三"), text("，随后拆掉二塔。")], commentary: () => `${winner.name}这波支援慢了一步，差距已经非常危险。`, reactions: () => ["“支援完全脱节了。”", `“${loser.name}要滚起来了。”`] },
    ]),
    choose("22分钟", [
      { parts: () => [w(), text("抓住辅助布置视野的空档，"), major("连续击杀两人"), text("并控下"), dragon("听牌龙"), text("。")], commentary: () => `比赛的转折点出现了！${winner.name}用一次果断抓单重新回到比赛。`, reactions: () => ["“这也能抓到机会！”", "“现场声音突然反过来了！”"] },
      { parts: () => [l(), text("推进过深，"), w(), major("高地前完成防守团灭"), text("。")], commentary: () => `${winner.name}守住了最关键的一波，比赛悬念重新回来了！`, reactions: () => ["“高地守住了！”", "“这不会要翻吧？”"] },
      { parts: () => [w(), major("抢下关键小龙并反杀三人"), text("，一口气追回全部经济差。")], commentary: () => `抢龙加反打！${winner.name}把一场几乎失控的比赛拉了回来。`, reactions: () => ["“抢到了！”", "“经济已经追平了！”"] },
    ]),
    choose("28分钟", [
      { parts: () => [l(), text("强行接大龙团，"), w(), major("打出零换三"), text("并"), baron("收下大龙"), text("。")], commentary: () => `${winner.name}完成反超！前期的劣势在这一波之后全部被抹平。`, reactions: () => ["“要翻盘了！”", `“${loser.name}这波太着急了。”`] },
      { parts: () => [w(), major("在大龙坑完成抢龙"), text("，随后追击打出团灭。")], commentary: () => `抢龙、团灭、反超！${winner.name}用一波不可思议的操作改变比赛。`, reactions: () => ["“这是什么抢龙！”", "“全场疯了！”"] },
      { parts: () => [w(), dragon("拿下龙魂"), text("，利用强化效果"), major("正面击溃"), l(), text("。")], commentary: () => `${winner.name}忍耐到了龙魂团，现在局势已经彻底反转。`, reactions: () => ["“龙魂翻盘！”", `“${loser.name}前面的优势全没了。”`] },
    ]),
    choose(`${duration}分钟`, [
      { parts: () => [w(), text("利用"), baron("大龙兵线"), tower("逼上高地"), text("，赢下最后团战并结束比赛。")], commentary: () => `${winner.name}顶住了前期压力，用一场完整的翻盘拿下本局！`, reactions: () => ["“全场都站起来了！”", `“${winner.name}的韧性太强了！”`] },
      { parts: () => [w(), major("基地前完成绝地反打"), text("，一路反推终结比赛。")], commentary: () => `${winner.name}没有回城，直接反推！这是决赛舞台上的大胆判断。`, reactions: () => ["“要一波了！”", "“这居然能翻回来！”"] },
      ...(duration >= 35 ? [
        { parts: () => [w(), elder("抢下远古龙"), text("，随后"), major("打出团灭"), text("完成惊天逆转。")], commentary: () => `远古龙抢夺决定了一切，${winner.name}把比赛从悬崖边拉了回来！`, reactions: () => ["“远古龙被抢了！”", "“这场比赛太疯狂了！”"] },
      ] : []),
    ]),
  ], [35, 28, 20, 55, 90, 100]);
}

function startFinalLiveGame(match) {
  clearFinalLiveTimer();
  ensureMatchScore(match);
  const scoreBefore = { ...match.score };
  const game = simulateMatchGame(match);
  game.review = gameReview(match, game.roll, game.gameWinner);
  tournament.revealed = false;
  finalLiveState = {
    match,
    game,
    scoreBefore,
    segments: buildFinalLiveTimeline(match, game),
    index: -1,
    playing: true,
    committed: false,
  };
  renderFinalLive();
  focusFinalLive();
  scheduleFinalLive();
}

function focusFinalLive() {
  if (!els.finalLive?.scrollIntoView) return;
  const focus = () => els.finalLive.scrollIntoView({ behavior: "smooth", block: "center" });
  if (typeof requestAnimationFrame === "function") requestAnimationFrame(focus);
  else focus();
}

function commitFinalLiveGame() {
  const state = finalLiveState;
  if (!state || state.committed) return;
  const { match, game } = state;
  match.lastGame = game;

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
    tournament.log.unshift(`${match.phase}: ${match.result.displayScore} ${game.review} ${match.seriesReview}`);
  } else {
    tournament.log.unshift(
      `${match.phase} Game ${match.gamesPlayed}: ${game.gameWinner.name} 获胜，比分 ${matchScoreText(match)}。${game.review}`,
    );
  }

  tournament.revealed = true;
  state.committed = true;
  state.playing = false;
  clearFinalLiveTimer();
  renderGame();
}

function renderFinalEventParts(parts) {
  const allowedTones = new Set(["team", "major", "dragon", "baron", "tower", "gold", "elder"]);
  return parts
    .map((part) => {
      const value = escapeHtml(part.text);
      return allowedTones.has(part.tone)
        ? `<strong class="final-event-${part.tone}">${value}</strong>`
        : value;
    })
    .join("");
}

function setFinalTeamLogo(image, team) {
  const path = TEAM_LOGOS[team.name];
  image.hidden = !path;
  if (path) {
    image.src = path;
    image.alt = `${team.name} 队徽`;
  }
}

function renderFinalLive() {
  const state = finalLiveState;
  if (!state || !els.finalLive) return;
  const { match, game } = state;
  els.finalLive.classList.remove("hidden");
  els.finalLiveTitle.textContent = `决赛第 ${match.gamesPlayed} 局`;
  els.finalTeamAName.textContent = match.teamA.name;
  els.finalTeamBName.textContent = match.teamB.name;
  setFinalTeamLogo(els.finalTeamALogo, match.teamA);
  setFinalTeamLogo(els.finalTeamBLogo, match.teamB);
  const championName = match.result?.winner?.name || "";
  els.finalTeamABrand.classList.toggle("is-champion", championName === match.teamA.name);
  els.finalTeamBBrand.classList.toggle("is-champion", championName === match.teamB.name);
  const displayedScore = finalSeriesScore(match, state.committed ? match.score : state.scoreBefore);
  els.finalLiveScore.textContent = displayedScore;
  els.finalLiveToolbarScore.textContent = `${match.teamA.name} ${displayedScore} ${match.teamB.name}`;

  const currentSegment = state.index >= 0 ? state.segments[state.index] : null;
  const pregameTeamAChance = Math.round(winRate(match.teamA, match.teamB, match));
  const winnerChance = currentSegment?.winnerChance;
  const teamAChance = Number.isFinite(winnerChance)
    ? game.gameWinner.name === match.teamA.name
      ? winnerChance
      : 100 - winnerChance
    : pregameTeamAChance;
  const teamBChance = 100 - teamAChance;
  els.finalWinMeterTime.textContent = currentSegment?.time || "赛前";
  els.finalWinTeamA.textContent = match.teamA.name;
  els.finalWinTeamB.textContent = match.teamB.name;
  els.finalWinTeamARate.textContent = `${teamAChance}%`;
  els.finalWinTeamBRate.textContent = `${teamBChance}%`;
  els.finalWinMeterBar.style.width = `${teamAChance}%`;
  els.finalWinMeterBar.parentElement.setAttribute("aria-valuenow", String(teamAChance));
  els.finalWinMeterBar.parentElement.setAttribute(
    "aria-valuetext",
    `${match.teamA.name} ${teamAChance}%，${match.teamB.name} ${teamBChance}%`,
  );

  const visibleSegments = state.segments.slice(0, state.index + 1).reverse();
  els.finalLiveFeed.innerHTML = visibleSegments.length
    ? visibleSegments
        .map(
          (segment, index) => `
            <article class="final-live-entry${index === 0 ? " is-latest" : ""}">
              <strong>${escapeHtml(segment.time)}</strong>
              <p>${renderFinalEventParts(segment.parts)}</p>
              <p class="final-commentary">解说：${escapeHtml(segment.commentary)}</p>
              <div class="final-reactions">${segment.reactions.map((reaction) => `<span>${escapeHtml(reaction)}</span>`).join("")}</div>
            </article>
          `,
        )
        .join("")
    : '<p class="final-live-waiting">选手已经进入比赛，直播即将开始……</p>';

  els.finalLivePause.disabled = state.committed;
  els.finalLivePause.textContent = state.playing ? "暂停" : "继续";
  const tournamentComplete = tournament.phase === "complete";
  els.finalLivePause.hidden = tournamentComplete;
  els.finalLiveNext.hidden = tournamentComplete;
  els.finalLiveFinished.hidden = !tournamentComplete;
  if (state.committed) {
    els.finalLiveNext.disabled = game.isComplete;
    els.finalLiveNext.textContent = game.isComplete ? "决赛结束" : "开始下一局";
  } else {
    els.finalLiveNext.disabled = false;
    els.finalLiveNext.textContent = "立即显示下一条";
  }
  els.finalLiveFeed.scrollTop = 0;
}

function scheduleFinalLive() {
  clearFinalLiveTimer();
  if (!finalLiveState?.playing || finalLiveState.committed || document.hidden) return;
  finalLiveTimer = setTimeout(advanceFinalLive, FINAL_LIVE_DELAY);
}

function advanceFinalLive() {
  const state = finalLiveState;
  if (!state) return;
  clearFinalLiveTimer();
  if (state.committed) {
    if (!state.game.isComplete) startFinalLiveGame(state.match);
    return;
  }
  state.index += 1;
  if (state.index >= state.segments.length - 1) {
    state.index = state.segments.length - 1;
    renderFinalLive();
    commitFinalLiveGame();
    return;
  }
  renderFinalLive();
  scheduleFinalLive();
}

function toggleFinalLivePlayback() {
  if (!finalLiveState || finalLiveState.committed) return;
  finalLiveState.playing = !finalLiveState.playing;
  renderFinalLive();
  if (finalLiveState.playing) scheduleFinalLive();
  else clearFinalLiveTimer();
}

function ensureFinalLiveMode(match) {
  if (!isFinalMatch(match) || tournament.displayMode === "swiss") {
    clearFinalLiveTimer();
    if (els.finalLive) els.finalLive.classList.add("hidden");
    return;
  }
  updateDrawControls();
  if (!finalLiveState || finalLiveState.match !== match) {
    startFinalLiveGame(match);
    return;
  }
  renderFinalLive();
  scheduleFinalLive();
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
    setStickyMatchSummary(`${tournament.champion.name} 冠军`, "赛事已经结束");
    return;
  }

  prepareMatch(match);
  const rateA = winRate(match.teamA, match.teamB, match);
  const rateB = 100 - rateA;
  els.matchPhase.textContent = match.phase;
  els.matchTeams.textContent = `${match.teamA.name} vs ${match.teamB.name}`;
  els.matchPowers.innerHTML = renderMatchPowerDetails(match);
  els.odds.innerHTML = renderOddsMeter(match, rateA, rateB);
  renderStickyMatchSummary(match, rateA, rateB);
  focusCurrentMatchCard(match);
  ensureFinalLiveMode(match);

  if (!tournament.revealed) {
    els.resultBox.classList.add("hidden");
    els.resultBox.textContent = "";
    setNextStepText(matchAdvanceText(match));
    return;
  }

  els.resultBox.classList.remove("hidden");
  if (match.lastGame) {
    els.resultBox.innerHTML = renderLastGameResult(match);
  } else {
    els.resultBox.textContent = match.result.displayScore;
  }
  setNextStepText(
    tournament.phase === "complete"
      ? tournament.isCustom
        ? "返回首页"
        : "查看统计"
      : match.result
        ? completedMatchAdvanceText(match)
        : matchAdvanceText(match),
  );
  renderStickyMatchSummary(match, rateA, rateB);
}

function setStickyMatchSummary(teams, status, powers = "") {
  if (els.stickyMatchTeams) els.stickyMatchTeams.textContent = teams;
  if (els.stickyMatchPowers) els.stickyMatchPowers.textContent = powers;
  if (els.stickyMatchStatus) els.stickyMatchStatus.textContent = status;
}

function renderStickyMatchSummary(match, rateA, rateB) {
  const teams = `${match.teamA.name} vs ${match.teamB.name}`;
  const powers = `${match.teamA.name} 战力 ${matchPower(match, match.teamA)} · ${match.teamB.name} 战力 ${matchPower(match, match.teamB)}`;
  if (match.lastGame) {
    const score = `${match.score[match.teamA.name]} : ${match.score[match.teamB.name]}`;
    const suffix = match.result ? match.result.displayScore : `${match.lastGame.gameWinner.name} 本局获胜`;
    setStickyMatchSummary(teams, `${score} · ${suffix}`, powers);
    return;
  }
  setStickyMatchSummary(teams, `胜率 ${formatRate(rateA)} : ${formatRate(rateB)}`, powers);
}

function setMatchDetailsOpen(isOpen) {
  if (!els.matchPanel || !els.toggleMatchDetails) return;
  els.matchPanel.classList.toggle("hidden", !isOpen);
  els.toggleMatchDetails.textContent = isOpen ? "收起详情" : "比赛详情";
  els.toggleMatchDetails.setAttribute("aria-expanded", String(isOpen));
}

function setPlayInDetailsOpen(isOpen) {
  if (!els.playInCurrent || !els.togglePlayInDetails) return;
  els.playInCurrent.classList.toggle("hidden", !isOpen);
  els.togglePlayInDetails.textContent = isOpen ? "收起详情" : "比赛详情";
  els.togglePlayInDetails.setAttribute("aria-expanded", String(isOpen));
}

function togglePlayInDetails() {
  setPlayInDetailsOpen(els.playInCurrent?.classList.contains("hidden"));
}

function toggleMatchDetails() {
  setMatchDetailsOpen(els.matchPanel?.classList.contains("hidden"));
}

function focusCurrentMatchCard(match) {
  if (!els.drawScroll || !els.drawBoard?.querySelector) return;
  const matchKey = `${match.phase}:${match.teamA.name}:${match.teamB.name}`;
  if (lastFocusedMatchKey === matchKey) return;

  const focusCard = () => {
    const currentTeam = els.drawBoard.querySelector(".is-current");
    const card = currentTeam?.closest(".draw-card, .bracket-card");
    if (!card) return;
    const targetLeft = Math.max(
      0,
      card.offsetLeft - (els.drawScroll.clientWidth - card.offsetWidth) / 2,
    );
    if (typeof els.drawScroll.scrollTo === "function") {
      els.drawScroll.scrollTo({ left: targetLeft, behavior: "smooth" });
    } else {
      els.drawScroll.scrollLeft = targetLeft;
    }
    lastFocusedMatchKey = matchKey;
  };

  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(focusCard);
  } else {
    focusCard();
  }
}

function renderKnockoutDrawWaiting() {
  const totalTeams = tournament.knockout.drawMatches.length * 2;
  const nextNumber = tournament.knockout.drawRevealedTeams + 1;
  els.matchPhase.textContent = "Knockout Draw";
  els.matchTeams.textContent = "8强抽签";
  els.matchPowers.textContent = "";
  els.odds.innerHTML = "";
  els.resultBox.classList.remove("hidden");
  els.resultBox.textContent = `准备抽出第 ${nextNumber} 个8强队伍。可抽队伍见上方队伍池。`;
  if (tournament.knockout.drawRevealedTeams >= totalTeams) {
    els.resultBox.textContent = "8强抽签完成，可以开始8强赛。";
  }
  setStickyMatchSummary("8强抽签", els.resultBox.textContent);
  setNextStepText(
    tournament.knockout.drawRevealedTeams === 0
      ? "开始八强抽签"
      : tournament.knockout.drawRevealedTeams < totalTeams
        ? "继续八强抽签"
        : "开始八强赛",
  );
}

function drawPoolTitle() {
  const match = currentSwissDrawMatch();
  if (match?.poolLabel) return `首轮四档种子池 · 当前 ${match.poolLabel}`;
  return match?.record ? `${match.record} 可抽队伍` : "可抽队伍";
}

function teamRegionClass(team) {
  const region = String(team?.region || "").toLowerCase();
  return ["lck", "lpl", "lec", "lcp", "lcs", "cblol"].includes(region) ? ` region-${region}` : "";
}

function findTournamentTeam(name) {
  return tournament?.teams.find((team) => team.name === name) || null;
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
            ${names.map((name) => `<span class="draw-pool-team${teamRegionClass(findTournamentTeam(name))}">${escapeHtml(name)}</span>`).join("")}
          </div>
        `
      : names
          .map(
            (group) => `
              <div class="draw-pool-group">
                <em>${group.title}</em>
                <div>
                  ${group.names.map((name) => `<span class="draw-pool-team${teamRegionClass(findTournamentTeam(name))}">${escapeHtml(name)}</span>`).join("")}
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
          <strong>${escapeHtml(team.name)}</strong>
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
  const teamAName = escapeHtml(match.teamA.name);
  const teamBName = escapeHtml(match.teamB.name);

  return `
    <div class="odds-meter ${winnerName ? "has-result" : ""}">
      <div class="meter-labels">
        <span class="${aLost ? "is-dimmed" : ""}">${teamAName}</span>
        <strong>${formatRate(rateA)}</strong>
        <strong>${formatRate(rateB)}</strong>
        <span class="${bLost ? "is-dimmed" : ""}">${teamBName}</span>
      </div>
      <div class="meter-track" aria-label="${teamAName} ${formatRate(rateA)}, ${teamBName} ${formatRate(rateB)}">
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
  renderLogLines(els.eventLog, tournament.log);
}

function renderDrawWaiting() {
  els.matchPhase.textContent = tournament.draw.phase;
  els.matchTeams.textContent = "瑞士轮抽签";
  els.matchPowers.textContent = "";
  els.odds.innerHTML = "";
  els.resultBox.classList.remove("hidden");

  const totalTeams = tournament.draw.matches.length * 2;
  const commentary = tournament.draw.lastCommentary;
  if (tournament.draw.revealedTeams < totalTeams) {
    if (commentary) {
      els.resultBox.textContent = commentary;
    } else {
      const nextNumber = tournament.draw.revealedTeams + 1;
      const currentMatch = tournament.draw.matches[Math.floor(tournament.draw.revealedTeams / 2)];
      const groupName = currentMatch.poolLabel || `${currentMatch.record} 池`;
      els.resultBox.textContent = `准备从 ${groupName} 抽出第 ${nextNumber} 个队伍。可抽队伍见上方队伍池。`;
    }
    setNextStepText(tournament.draw.revealedTeams === 0 ? `开始第 ${tournament.swissRound} 轮抽签` : "继续抽签");
  } else {
    els.resultBox.textContent = `${commentary ? `${commentary} ` : ""}本轮抽签完成，可以开始比赛。`;
    setNextStepText(`开始第 ${tournament.swissRound} 轮`);
  }
  setStickyMatchSummary("瑞士轮抽签", els.resultBox.textContent);
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
  const draw = tournament.draw;
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
      const isEmpty = totalSlots === 0;
      const terminalClass = notes[record] ? " is-terminal" : "";
      return `
        <div class="draw-card${isEmpty ? " is-empty" : ""}${terminalClass}" data-record="${record}">
          <div class="draw-record">${record}</div>
          <div class="draw-matches">${matchRows}</div>
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
  els.drawTitle.textContent = TOURNAMENT_MODES[tournament.knockout.mode];
  renderDrawPool("可抽队伍", isKnockoutDrawing() ? remainingKnockoutDrawPools() : []);
  els.drawStatus.textContent = bracketStatusText();

  const slots = [
    ["S1", "1/4决赛", "upper", "队伍1", "队伍8"],
    ["S2", "1/4决赛", "upper", "队伍2", "队伍7"],
    ["S3", "1/4决赛", "upper", "队伍3", "队伍6"],
    ["S4", "1/4决赛", "upper", "队伍4", "队伍5"],
    ["S5", "半决赛", "upper", "S1胜者", "S2胜者"],
    ["S6", "半决赛", "upper", "S3胜者", "S4胜者"],
    ["S7", "总决赛", "final", "S5胜者", "S6胜者"],
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
  return `<div class="bracket-team${resultClass}${teamRegionClass(team)}">${renderTeamScore(match, team, "bracket-team-score")}</div>`;
}

function renderSwissDrawTeam(match, side) {
  if (swissTeamRevealState(match, side) === "hidden") {
    return `<span class="draw-team placeholder">TBD</span>`;
  }
  const team = match[side];
  return `<span class="draw-team${teamDrawClass(match, team)}${teamRegionClass(team)}">${renderTeamScore(match, team, "draw-team-score")}</span>`;
}

function swissTeamRevealState(match, side) {
  if (!tournament.draw || !tournament.draw.matches.includes(match)) return "revealed";
  const matchIndex = tournament.draw.matches.indexOf(match);
  const sideIndex = side === "teamA" ? 0 : 1;
  const revealIndex = matchIndex * 2 + sideIndex;
  return tournament.draw.revealedTeams > revealIndex ? "revealed" : "hidden";
}

function knockoutTeamRevealState(match, team) {
  if (!isKnockoutDrawing() || !match || !["UB_R1", "QF"].includes(match.stage)) return "revealed";
  const index = tournament.knockout.drawMatches.indexOf(match);
  if (index < 0) return "revealed";
  const side = team.name === match.teamA.name ? 0 : 1;
  const revealIndex = index * 2 + side;
  if (tournament.knockout.drawRevealedTeams > revealIndex) return "revealed";
  return "hidden";
}

function currentSwissDrawMatch() {
  if (!tournament.draw) return null;
  return tournament.draw.matches[Math.floor(tournament.draw.revealedTeams / 2)] || null;
}

function renderTeamScore(match, team, scoreClass) {
  const score = match.score ? match.score[team.name] : 0;
  const regionTag = team.region ? `<small class="region-tag">${escapeHtml(team.region)}</small>` : "";
  return `${escapeHtml(team.name)}${regionTag}<span class="${scoreClass}">${score}</span>`;
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
  const defaults = options.defaults || DEFAULT_TEAMS;
  form.innerHTML = `
    <div class="custom-form-head">
      <span>队伍</span>
      <span>战力</span>
      <span>波动下限</span>
      <span>波动上限</span>
    </div>
  ` + Array.from({ length: defaults.length }, (_, index) => teams[index] || {})
    .map((team, index) => {
      const name = blank ? "" : team.name || defaults[index].name;
      const power = blank ? "" : team.power || defaults[index].power;
      const min = blank ? "" : Number.isFinite(Number(team.varianceMin)) ? team.varianceMin : defaults[index].varianceMin;
      const max = blank ? "" : Number.isFinite(Number(team.varianceMax)) ? team.varianceMax : defaults[index].varianceMax;
      return `
        <div class="team-row custom-team-row">
          <input name="name-${index}" type="text" value="${escapeHtml(name)}" maxlength="12" aria-label="队伍${index + 1}名称" />
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
  const defaults = options.defaults || DEFAULT_TEAMS;
  const teams = defaults.map((defaultTeam, index) => {
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
    return {
      name,
      power,
      varianceMin,
      varianceMax,
      region: options.includeTournamentMetadata === false ? undefined : defaultTeam.region,
      pool: options.includeTournamentMetadata === false ? undefined : defaultTeam.pool,
      stage: options.includeTournamentMetadata === false ? undefined : defaultTeam.stage,
    };
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
  renderTeamConfigForm(els.customTeamForm, CUSTOM_DEFAULT_TEAMS, {
    blank: false,
    defaults: CUSTOM_DEFAULT_TEAMS,
  });
}

function restartCustomTournament() {
  if (!tournament?.isCustom || !tournament.customRestartTeams) return;
  const teams = snapshotTeamConfig(tournament.customRestartTeams);
  createTournament(teams, { isCustom: true });
  tournament.log.unshift("以当前自定义设定重开，本次结果不会写入数据统计。");
  renderGame();
}

function startCustomTournament() {
  const teams = readTeamConfigForm(els.customTeamForm, {
    allowBlankName: true,
    includeTournamentMetadata: false,
    defaults: CUSTOM_DEFAULT_TEAMS,
  });
  if (!teams) return;
  createTournament(teams, { isCustom: true });
  tournament.log.unshift("自定义赛事开始，本次结果不会写入数据统计。");
  renderGame();
}

function confirmResetStats() {
  saveStats({ total: 0, champions: {}, championRuns: {} });
  showStatsView();
  hideModal();
}

els.startGame.addEventListener("click", () => createTournament(loadTeams()));
els.customGame.addEventListener("click", showCustomView);
els.showStats.addEventListener("click", showStatsView);
els.editTeams.addEventListener("click", showEditView);
els.backHomeGame.addEventListener("click", () => showView("home"));
els.backHomeStats.addEventListener("click", () => showView("home"));
els.backHomeStatsBottom.addEventListener("click", () => showView("home"));
els.backHomeEdit.addEventListener("click", () => showView("home"));
els.backHomeCustom.addEventListener("click", () => showView("home"));
els.backHomePlayIn.addEventListener("click", () => {
  if (playInReviewMode) {
    playInReviewMode = false;
    showView("game");
    renderGame();
    return;
  }
  showView("home");
});
els.nextPlayIn.addEventListener("click", handlePlayInNext);
els.quickPlayIn.addEventListener("click", confirmFastForwardPlayIn);
els.togglePlayInDetails.addEventListener("click", togglePlayInDetails);
els.finalLivePause.addEventListener("click", toggleFinalLivePlayback);
els.finalLiveNext.addEventListener("click", advanceFinalLive);
els.nextStepControls.forEach((button) => button.addEventListener("click", handleNextStep));
els.quickSwiss.addEventListener("click", () => confirmFastForward("swiss"));
els.quickKnockout.addEventListener("click", () => confirmFastForward("knockout"));
els.restartCustomRun.addEventListener("click", restartCustomTournament);
els.reviewPlayIn.addEventListener("click", showPlayInReview);
els.reviewSwiss.addEventListener("click", toggleSwissReview);
els.tournamentHome.addEventListener("click", () => showView("home"));
els.toggleMatchDetails.addEventListener("click", toggleMatchDetails);
els.closeMatchDetails.addEventListener("click", () => setMatchDetailsOpen(false));
document.addEventListener("visibilitychange", () => {
  if (document.hidden) clearFinalLiveTimer();
  else scheduleFinalLive();
});
els.championBoard.addEventListener("click", handleChampionBoardClick);
els.saveTeams.addEventListener("click", saveTeamForm);
els.resetTeams.addEventListener("click", () => {
  saveTeams(DEFAULT_TEAMS);
  showEditView();
});
els.startCustom.addEventListener("click", startCustomTournament);
els.resetCustom.addEventListener("click", renderCustomTeamForm);
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
