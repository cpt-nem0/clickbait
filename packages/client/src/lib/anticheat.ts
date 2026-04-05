export interface BehaviorSignals {
  reactionTimes: number[];
  clickOffsets: { dx: number; dy: number }[];
  mouseMoveCountPerClick: number[];
  perfectCenterClicks: number;
  totalClicks: number;
}

export function createBehaviorTracker() {
  const signals: BehaviorSignals = {
    reactionTimes: [],
    clickOffsets: [],
    mouseMoveCountPerClick: [],
    perfectCenterClicks: 0,
    totalClicks: 0,
  };

  let movesSinceLastClick = 0;

  return {
    trackMouseMove() {
      movesSinceLastClick++;
    },

    trackClick(
      clickX: number,
      clickY: number,
      targetCenterX: number,
      targetCenterY: number,
      reactionTime: number
    ) {
      const dx = clickX - targetCenterX;
      const dy = clickY - targetCenterY;

      signals.reactionTimes.push(reactionTime);
      signals.clickOffsets.push({ dx, dy });
      signals.mouseMoveCountPerClick.push(movesSinceLastClick);
      signals.totalClicks++;

      if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
        signals.perfectCenterClicks++;
      }

      movesSinceLastClick = 0;
    },

    getSignals(): BehaviorSignals {
      return { ...signals };
    },
  };
}

export interface CheatVerdict {
  isSus: boolean;
  reasons: string[];
}

export function analyzeSignals(signals: BehaviorSignals): CheatVerdict {
  const reasons: string[] = [];

  if (signals.totalClicks < 3) {
    return { isSus: false, reasons: [] };
  }

  // 1. Reaction time too consistent (low standard deviation)
  if (signals.reactionTimes.length >= 5) {
    const mean = signals.reactionTimes.reduce((a, b) => a + b, 0) / signals.reactionTimes.length;
    const variance =
      signals.reactionTimes.reduce((sum, t) => sum + (t - mean) ** 2, 0) /
      signals.reactionTimes.length;
    const stddev = Math.sqrt(variance);

    if (stddev < 20) {
      reasons.push("REACTION_TIME_TOO_CONSISTENT");
    }

    // 2. Average reaction time below human limit
    if (mean < 100) {
      reasons.push("SUPERHUMAN_REACTION_TIME");
    }
  }

  // 3. Too many perfect center clicks (bot precision)
  const centerRate = signals.perfectCenterClicks / signals.totalClicks;
  if (signals.totalClicks >= 5 && centerRate > 0.8) {
    reasons.push("AIMBOT_PRECISION");
  }

  // 4. No mouse movement between clicks (teleporting cursor / scripted)
  const zeroMoveClicks = signals.mouseMoveCountPerClick.filter((m) => m === 0).length;
  const zeroMoveRate = zeroMoveClicks / signals.totalClicks;
  if (signals.totalClicks >= 5 && zeroMoveRate > 0.7) {
    reasons.push("NO_MOUSE_MOVEMENT");
  }

  // 5. Click offset variance too low (robotic aim)
  if (signals.clickOffsets.length >= 5) {
    const dxValues = signals.clickOffsets.map((o) => o.dx);
    const dyValues = signals.clickOffsets.map((o) => o.dy);
    const dxMean = dxValues.reduce((a, b) => a + b, 0) / dxValues.length;
    const dyMean = dyValues.reduce((a, b) => a + b, 0) / dyValues.length;
    const dxVar = dxValues.reduce((s, v) => s + (v - dxMean) ** 2, 0) / dxValues.length;
    const dyVar = dyValues.reduce((s, v) => s + (v - dyMean) ** 2, 0) / dyValues.length;

    if (Math.sqrt(dxVar) < 3 && Math.sqrt(dyVar) < 3) {
      reasons.push("CLICK_POSITION_TOO_PRECISE");
    }
  }

  return {
    isSus: reasons.length >= 2,
    reasons,
  };
}
