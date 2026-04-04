import { useState, useCallback, useEffect } from "react";
import { Difficulty, LeaderboardEntry } from "@/types";
import { getLeaderboard, submitScore } from "@/lib/api";
import { stopMusic } from "@/lib/audio";
import { getSelectedSkin, setSelectedSkin, getSkinById, TargetSkin } from "@/lib/skins";
import NavBar from "@/components/layout/NavBar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import DifficultySelect from "@/components/screens/DifficultySelect";
import GameScreen from "@/components/game/GameScreen";
import GameOver from "@/components/screens/GameOver";
import HallOfFame from "@/components/screens/HallOfFame";
import RegisterModal from "@/components/screens/RegisterModal";
import MobileBlock from "@/components/screens/MobileBlock";

function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || (window.innerWidth < 768 && "ontouchstart" in window);
}

type Screen = "difficulty" | "playing" | "gameOver" | "leaderboard";

interface GameResult {
  score: number;
  avgReactionTime: number;
  accuracy: number;
}

const ALL_DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard", "impossible"];

function getOverallHighScore(): number {
  return Math.max(
    ...ALL_DIFFICULTIES.map(d => Number(localStorage.getItem(`clickbait_high_${d}`) || 0))
  );
}

function getDifficultyHighScore(difficulty: Difficulty): number {
  return Number(localStorage.getItem(`clickbait_high_${difficulty}`) || 0);
}

function saveHighScore(difficulty: Difficulty, score: number) {
  const current = Number(localStorage.getItem(`clickbait_high_${difficulty}`) || 0);
  if (score > current) {
    localStorage.setItem(`clickbait_high_${difficulty}`, String(score));
  }
}

function getInitialScreen(): { screen: Screen; view: "arcade" | "leaderboard" } {
  const hash = window.location.hash.replace("#", "");
  if (hash === "leaderboard") return { screen: "leaderboard", view: "leaderboard" };
  return { screen: "difficulty", view: "arcade" };
}

export default function App() {
  const initial = getInitialScreen();
  const [screen, setScreen] = useState<Screen>(initial.screen);
  const [currentView, setCurrentView] = useState<"arcade" | "leaderboard">(initial.view);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardFilter, setLeaderboardFilter] = useState<Difficulty | "all">("all");
  const [username, setUsername] = useState(
    () => localStorage.getItem("clickbait_username") || ""
  );
  const [showRegister, setShowRegister] = useState(
    () => !localStorage.getItem("clickbait_username")
  );
  const [highScore, setHighScoreState] = useState(0);
  const [gameHighScore, setGameHighScore] = useState(0);
  const [activeSkin, setActiveSkin] = useState<TargetSkin>(() => getSkinById(getSelectedSkin()));
  const [gameKey, setGameKey] = useState(0);
  const [leaderboardRefresh, setLeaderboardRefresh] = useState(0);

  const fetchLeaderboard = useCallback(async (filter?: Difficulty) => {
    try {
      const entries = await getLeaderboard(filter, 10);
      setLeaderboard(entries);
    } catch {
      // API not available yet — use empty
      setLeaderboard([]);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard(leaderboardFilter === "all" ? undefined : leaderboardFilter);
  }, [leaderboardFilter, leaderboardRefresh, fetchLeaderboard]);

  // Sync URL hash with screen
  useEffect(() => {
    const hash = screen === "leaderboard" ? "#leaderboard" : "#arcade";
    if (window.location.hash !== hash) {
      window.history.replaceState(null, "", hash);
    }
  }, [screen]);

  useEffect(() => {
    setHighScoreState(getOverallHighScore());
  }, []);

  const handleRegister = useCallback((name: string) => {
    setUsername(name);
    localStorage.setItem("clickbait_username", name);
    setShowRegister(false);
  }, []);

  const handleSelectDifficulty = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    setGameHighScore(getDifficultyHighScore(diff));
    setScreen("playing");
  }, []);

  const handleGameOver = useCallback(
    (result: GameResult) => {
      setGameResult(result);
      saveHighScore(difficulty, result.score);
      setHighScoreState(Math.max(getOverallHighScore(), result.score));
      setGameHighScore(Math.max(getDifficultyHighScore(difficulty), result.score));
      setScreen("gameOver");
      setLeaderboardRefresh((n) => n + 1);
    },
    [difficulty]
  );

  const handleSubmitScore = useCallback(
    async (name: string) => {
      if (!gameResult) return;
      setUsername(name);
      try {
        await submitScore({
          username: name,
          difficulty,
          score: gameResult.score,
          avgReactionTime: gameResult.avgReactionTime,
          accuracy: gameResult.accuracy,
        });
      } catch {
        // offline mode — still show leaderboard
      }
      setLeaderboardFilter(difficulty);
      setLeaderboardRefresh((n) => n + 1);
      setScreen("leaderboard");
      setCurrentView("leaderboard");
    },
    [gameResult, difficulty, fetchLeaderboard]
  );

  const abortGame = useCallback(() => {
    stopMusic();
    setGameKey((k) => k + 1);
  }, []);

  const handlePlayAgain = useCallback(() => {
    setGameKey((k) => k + 1);
    setScreen("playing");
  }, []);

  const handleChangeDifficulty = useCallback(() => {
    abortGame();
    setScreen("difficulty");
    setCurrentView("arcade");
  }, [abortGame]);

  const handleNavigate = useCallback(
    (view: "arcade" | "leaderboard") => {
      abortGame();
      setCurrentView(view);
      if (view === "leaderboard") {
        setScreen("leaderboard");
        setLeaderboardRefresh((n) => n + 1);
      } else {
        setScreen("difficulty");
      }
    },
    [leaderboardFilter, fetchLeaderboard, abortGame]
  );

  const handleLogoClick = useCallback(() => {
    abortGame();
    setScreen("difficulty");
    setCurrentView("arcade");
    setLeaderboardRefresh((n) => n + 1);
  }, [abortGame]);

  const renderContent = () => {
    switch (screen) {
      case "difficulty":
        return (
          <DifficultySelect
            onSelect={handleSelectDifficulty}
            leaderboard={leaderboard}
            currentUsername={username}
            highScore={highScore}
            activeSkin={activeSkin}
            onSkinSelect={(skin) => {
              setActiveSkin(skin);
              setSelectedSkin(skin.id);
            }}
          />
        );
      case "playing":
        return (
          <GameScreen
            key={gameKey}
            difficulty={difficulty}
            highScore={gameHighScore}
            skin={activeSkin}
            onGameOver={handleGameOver}
            onBack={handleChangeDifficulty}
          />
        );
      case "gameOver":
        return gameResult ? (
          <GameOver
            score={gameResult.score}
            avgReactionTime={gameResult.avgReactionTime}
            accuracy={gameResult.accuracy}
            difficulty={difficulty}
            isHighScore={gameResult.score >= highScore}
            currentUsername={username}
            leaderboard={leaderboard}
            onSubmitScore={handleSubmitScore}
            onPlayAgain={handlePlayAgain}
            onChangeDifficulty={handleChangeDifficulty}
          />
        ) : null;
      case "leaderboard":
        return (
          <HallOfFame
            entries={leaderboard}
            currentFilter={leaderboardFilter}
            onFilterChange={setLeaderboardFilter}
            currentUsername={username}
          />
        );
    }
  };

  // if (isMobile()) {
  //   return <MobileBlock />;
  // }

  if (showRegister) {
    return (
      <div className="h-screen bg-surface">
        <RegisterModal onRegister={handleRegister} />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-surface">
      <div className="scanline" />
      <NavBar currentView={currentView} onNavigate={handleNavigate} onLogoClick={handleLogoClick} showNav={screen === "playing"} />
      <div className="flex flex-1 overflow-hidden">
        {screen !== "playing" && (
          <Sidebar
            username={username}
            highScore={highScore}
            currentView={currentView}
            onNavigate={handleNavigate}
          />
        )}
        {renderContent()}
      </div>
      <Footer />
    </div>
  );
}
