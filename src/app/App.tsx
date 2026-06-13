import { useState, useCallback, useRef } from "react";
import type { EvaluateResult } from "./components/LoadingScreen";
import "./styles/animations.css";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { HomeScreen } from "./components/HomeScreen";
import { EmptyStateScreen } from "./components/EmptyStateScreen";
import { ChallengeSquareScreen } from "./components/ChallengeSquareScreen";
import { ChallengeActiveScreen } from "./components/ChallengeActiveScreen";
import { LoadingScreen } from "./components/LoadingScreen";
import { SuccessScreen } from "./components/SuccessScreen";
import { PassScreen } from "./components/PassScreen";
import { CapabilityDetailScreen } from "./components/CapabilityDetailScreen";
import { MeScreen } from "./components/MeScreen";
import { ChallengeResultScreen } from "./components/ChallengeResultScreen";
import { TwinDetailScreen } from "./components/TwinDetailScreen";
import { MyResumeScreen } from "./components/MyResumeScreen";
import { ChallengeRecordScreen } from "./components/ChallengeRecordScreen";
import { NotificationsScreen } from "./components/NotificationsScreen";
import { SplashScreen } from "./components/SplashScreen";
import { LoginScreen } from "./components/LoginScreen";
import { CreateTwinScreen } from "./components/CreateTwinScreen";
import { JobSquareScreen } from "./components/JobSquareScreen";
import { JobDetailScreen } from "./components/JobDetailScreen";
import { ApplicationRecordScreen } from "./components/ApplicationRecordScreen";
import { PrivacySettingsScreen } from "./components/PrivacySettingsScreen";
import { LanguageRegionScreen } from "./components/LanguageRegionScreen";
import { HelpFeedbackScreen } from "./components/HelpFeedbackScreen";
import { RateUsScreen } from "./components/RateUsScreen";
import { ScoreDetailScreen } from "./components/ScoreDetailScreen";
import { AppealScreen } from "./components/AppealScreen";
import { PassVerifyScreen } from "./components/PassVerifyScreen";
import { ToastContainer, showToast } from "./components/Toast";
import { Iphone16Frame } from "./components/iPhone16Frame";
import type { UserCareerState } from "./store/userCareerStore";
import { createDefaultState, applyChallengeResult } from "./store/userCareerStore";
import { getGuestId, saveGuestState, loadGuestState } from "./utils/guestId";

const DOT_GRID = `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%231A1A1A' fill-opacity='0.05'/%3E%3C/svg%3E")`;

type TabId = "twin" | "challenge" | "pass" | "me";
type ScreenId =
  | "home"
  | "challenge-empty"
  | "challenge-square"
  | "challenge-active"
  | "challenge-loading"
  | "challenge-success"
  | "challenge-result"
  | "pass"
  | "capability-detail"
  | "me"
  | "my-resume"
  | "challenge-record"
  | "notifications"
  | "job-square"
  | "job-detail"
  | "application-record"
  | "privacy-settings"
  | "language-region"
  | "help-feedback"
  | "rate-us"
  | "score-detail"
  | "appeal"
  | "pass-verify"
  | "twin-detail";

const SCREEN_LEVELS: Record<ScreenId, number> = {
  "home": 0,
  "challenge-empty": 0,
  "challenge-square": 1,
  "challenge-active": 2,
  "challenge-loading": 2,
  "challenge-success": 2,
  "challenge-result": 2,
  "pass": 0,
  "capability-detail": 1,
  "me": 0,
  "my-resume": 1,
  "challenge-record": 1,
  "notifications": 1,
  "job-square": 1,
  "job-detail": 2,
  "application-record": 1,
  "privacy-settings": 1,
  "language-region": 1,
  "help-feedback": 1,
  "rate-us": 1,
  "score-detail": 2,
  "appeal": 3,
  "pass-verify": 1,
  "twin-detail": 1,
};

const SCREEN_TITLES: Record<ScreenId, string> = {
  "home": "首页",
  "challenge-empty": "挑战",
  "challenge-square": "挑战广场",
  "challenge-active": "挑战进行中",
  "challenge-loading": "AI评分中",
  "challenge-success": "挑战成功",
  "challenge-result": "挑战结果",
  "pass": "我的通行证",
  "capability-detail": "能力详情",
  "me": "我的",
  "my-resume": "我的简历",
  "challenge-record": "挑战记录",
  "notifications": "消息通知",
  "job-square": "岗位广场",
  "job-detail": "岗位详情",
  "application-record": "投递记录",
  "privacy-settings": "隐私设置",
  "language-region": "语言与地区",
  "help-feedback": "帮助与反馈",
  "rate-us": "给我们评分",
  "score-detail": "评分详情",
  "appeal": "评分申诉",
  "pass-verify": "通行证验证",
  "twin-detail": "职业档案",
};

type AuthScreen = "splash" | "login" | "create-twin" | "main";

const TAB_DEFAULT_SCREEN: Record<TabId, ScreenId> = {
  twin: "home",
  challenge: "challenge-empty",
  pass: "pass",
  me: "me",
};

const FULLSCREEN_IDS: ScreenId[] = [
  "challenge-active",
  "challenge-loading",
  "challenge-success",
  "challenge-result",
  "capability-detail",
  "my-resume",
  "challenge-record",
  "notifications",
  "job-detail",
  "application-record",
  "privacy-settings",
  "language-region",
  "help-feedback",
  "rate-us",
  "score-detail",
  "appeal",
  "pass-verify",
  "twin-detail",
];

export default function App() {
  // 所有state必须在最前面定义，不能在条件分支中
  const [authenticated, setAuthenticated] = useState(false);
  const [authScreen, setAuthScreen] = useState<AuthScreen>("splash");
  const [activeTab, setActiveTab] = useState<TabId>("twin");
  const [screen, setScreen] = useState<ScreenId>("home");
  const [screenDirection, setScreenDirection] = useState<"forward" | "back">("forward");
  const [selectedJobId, setSelectedJobId] = useState<string>("job-001");
  const [challengeQuestion, setChallengeQuestion] = useState<string>("");
  const [challengeAnswer, setChallengeAnswer] = useState<string>("");
  const [challengeResult, setChallengeResult] = useState<EvaluateResult | null>(null);
  const [userCareerState, setUserCareerState] = useState<UserCareerState | null>(null);
  const [currentGuestId, setCurrentGuestId] = useState<string>("");
  const prevScreenRef = useRef<ScreenId>(screen);
  const historyRef = useRef<ScreenId[]>(["home"]);
  const historyIndexRef = useRef(0);

  const updateUserState = useCallback((state: UserCareerState) => {
    setUserCareerState(state);
    saveGuestState(currentGuestId, state);
  }, [currentGuestId]);

  const goTo = useCallback((s: ScreenId) => {
    const prevLevel = SCREEN_LEVELS[prevScreenRef.current] ?? 0;
    const newLevel = SCREEN_LEVELS[s] ?? 0;
    setScreenDirection(newLevel > prevLevel ? "forward" : "back");
    prevScreenRef.current = s;
    
    historyRef.current = [...historyRef.current.slice(0, historyIndexRef.current + 1), s];
    historyIndexRef.current = historyRef.current.length - 1;
    
    setScreen(s);
    document.title = `CareerPass - ${SCREEN_TITLES[s] || "首页"}`;
  }, []);

  const goBack = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      const prevScreen = historyRef.current[historyIndexRef.current];
      setScreenDirection("back");
      prevScreenRef.current = prevScreen;
      setScreen(prevScreen);
      document.title = `CareerPass - ${SCREEN_TITLES[prevScreen] || "首页"}`;
    }
  }, []);

  const handleLogin = useCallback((guestId: string) => {
    setCurrentGuestId(guestId);
    // 检查是否为回头客
    const savedState = loadGuestState(guestId) as UserCareerState | null;
    if (savedState) {
      // 回头客：直接恢复数据，跳过创建化身流程
      setUserCareerState(savedState);
      setAuthScreen("main");
    } else {
      // 新用户：进入创建化身流程
      setAuthScreen("create-twin");
    }
    setAuthenticated(true);
  }, []);

  const handleTwinCreated = useCallback((state: UserCareerState) => {
    saveGuestState(currentGuestId, state);
    setUserCareerState(state);
    setAuthScreen("main");
  }, [currentGuestId]);

  const handleLogout = useCallback(() => {
    setAuthenticated(false);
    setAuthScreen("splash");
    setActiveTab("twin");
    setScreen("home");
    setUserCareerState(null);
    // 不删除 localStorage！下次一键登录自动恢复数据
  }, []);

  const handleTabChange = useCallback(
    (tab: string) => {
      const t = tab as TabId;
      setActiveTab(t);
      setScreen(TAB_DEFAULT_SCREEN[t]);
    },
    []
  );

  // 未认证状态 - 渲染启动页或登录页
  if (!authenticated) {
    const isSplash = authScreen === "splash";
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: isSplash ? "#1A1A1A" : "#D8D5CE", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: "24px" 
      }}>
        <Iphone16Frame>
          {isSplash ? (
            <SplashScreen onEnter={() => {
              const guestId = getGuestId();
              const savedState = loadGuestState(guestId) as UserCareerState | null;
              if (savedState) {
                // 回头客：直接恢复，跳过登录页
                setCurrentGuestId(guestId);
                setUserCareerState(savedState);
                setAuthenticated(true);
                setAuthScreen("main");
              } else {
                setAuthScreen("login");
              }
            }} />
          ) : (
            <LoginScreen onLogin={handleLogin} onBack={() => setAuthScreen("splash")} />
          )}
        </Iphone16Frame>
      </div>
    );
  }

  // 已登录但未创建职业化身 - 引导用户创建
  if (authScreen === "create-twin") {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: "#1A1A1A", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: "24px" 
      }}>
        <Iphone16Frame>
          <CreateTwinScreen onComplete={handleTwinCreated} />
        </Iphone16Frame>
      </div>
    );
  }

  // 认证后的主应用
  const isFullscreen = FULLSCREEN_IDS.includes(screen);
  const showHeader = !isFullscreen && screen !== "challenge-square";
  const showTabBar = !isFullscreen;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#D8D5CE",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <Iphone16Frame>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: DOT_GRID,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
          }}
        >
          {showHeader && <Header />}

          <div
            style={{
              flex: 1,
              overflow: "hidden",
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              key={screen}
              style={{
                flex: 1,
                overflowY: "auto",
                scrollbarWidth: "none",
                animation: screenDirection === "forward" 
                  ? "screenSlideIn 0.3s ease-out both" 
                  : "screenFadeIn 0.3s ease-out both",
              }}
            >
              {screen === "home" && <HomeScreen onNavigate={goTo} userCareerState={userCareerState} />}

              {screen === "challenge-empty" && (
                <EmptyStateScreen onBrowse={() => goTo("challenge-square")} />
              )}

              {screen === "challenge-square" && (
                <ChallengeSquareScreen
                  onAccept={() => goTo("challenge-active")}
                  onBack={goBack}
                  userCareerState={userCareerState}
                />
              )}

              {screen === "challenge-active" && (
                <ChallengeActiveScreen
                  onSubmit={(answer: string) => {
                    setChallengeAnswer(answer);
                    setChallengeQuestion("字节跳动正在开发一款面向Z世代的短视频创作工具，目前处于0到1阶段。作为产品经理，你需要在30分钟内分析竞品生态，找出差异化切入点，并提出核心功能方案。");
                    goTo("challenge-loading");
                  }}
                  onBack={goBack}
                  userCareerState={userCareerState}
                />
              )}

              {screen === "challenge-loading" && (
                <LoadingScreen
                  question={challengeQuestion}
                  answer={challengeAnswer}
                  onComplete={(result?: EvaluateResult) => {
                    if (result) {
                      setChallengeResult(result);
                      // 应用挑战结果 → 升级用户能力
                      if (userCareerState) {
                        const updatedState = applyChallengeResult(
                          userCareerState,
                          `challenge-${Date.now()}`,
                          result.skillGrowth,
                          result.rankChange?.after || userCareerState.rank,
                          result.capabilities.filter(c => c.unlockEquip).map(c => c.unlockEquip!),
                        );
                        updateUserState(updatedState);
                      }
                    }
                    goTo("challenge-success");
                  }}
                />
              )}

              {screen === "challenge-success" && (
                <SuccessScreen
                  result={challengeResult}
                  userCareerState={userCareerState}
                  onViewPass={() => {
                    setActiveTab("pass");
                    goTo("pass");
                  }}
                  onViewDetail={() => goTo("challenge-result")}
                  onShare={() => {}}
                  onContinueChallenge={() => goTo("challenge-square")}
                />
              )}

              {screen === "pass" && (
                <PassScreen
                  onCapabilityDetail={() => goTo("capability-detail")}
                  onFindOpportunity={() => goTo("job-square")}
                  onViewCompanyJobs={() => goTo("job-square")}
                  onVerifyPass={() => goTo("pass-verify")}
                  userCareerState={userCareerState}
                />
              )}

              {screen === "capability-detail" && (
                <CapabilityDetailScreen onBack={goBack} userCareerState={userCareerState} />
              )}

              {screen === "me" && <MeScreen onNavigate={goTo} onLogout={handleLogout} userCareerState={userCareerState} />}

              {screen === "challenge-result" && (
                <ChallengeResultScreen
                  onBack={goBack}
                  onViewScoreDetail={() => goTo("score-detail")}
                  result={challengeResult}
                  userCareerState={userCareerState}
                />
              )}

              {screen === "twin-detail" && (
                <TwinDetailScreen onBack={goBack} userCareerState={userCareerState} />
              )}

              {screen === "score-detail" && (
                <ScoreDetailScreen onBack={goBack} onAppeal={() => goTo("appeal")} />
              )}

              {screen === "appeal" && <AppealScreen onBack={goBack} />}

              {screen === "pass-verify" && <PassVerifyScreen onBack={goBack} />}

              {screen === "my-resume" && (
                <MyResumeScreen onBack={() => goTo("me")} />
              )}

              {screen === "challenge-record" && (
                <ChallengeRecordScreen onBack={() => goTo("me")} onViewResult={(id) => goTo("challenge-result")} />
              )}

              {screen === "notifications" && (
                <NotificationsScreen onBack={() => goTo("me")} />
              )}

              {screen === "job-square" && (
                <JobSquareScreen
                  onViewJob={(id) => {
                    setSelectedJobId(id);
                    goTo("job-detail");
                  }}
                  onBack={goBack}
                />
              )}

              {screen === "job-detail" && (
                <JobDetailScreen
                  jobId={selectedJobId}
                  onBack={goBack}
                  onApply={() => {
                    showToast("投递成功！可继续挑选其他岗位", "success");
                  }}
                />
              )}

              {screen === "application-record" && (
                <ApplicationRecordScreen onBack={() => goTo("me")} />
              )}

              {screen === "privacy-settings" && (
                <PrivacySettingsScreen onBack={goBack} />
              )}

              {screen === "language-region" && (
                <LanguageRegionScreen onBack={goBack} />
              )}

              {screen === "help-feedback" && (
                <HelpFeedbackScreen onBack={goBack} />
              )}

              {screen === "rate-us" && (
                <RateUsScreen onBack={goBack} />
              )}
            </div>
          </div>

          {showTabBar && (
            <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
          )}
          <ToastContainer />
        </div>
      </Iphone16Frame>
    </div>
  );
}
