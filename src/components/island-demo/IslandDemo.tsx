"use client";
import { ChevronRight, MousePointer2, X } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import type { Locale as Language } from "@/content/i18n";
import type { IslandDemoContent } from "@/content/site";
import {
  AgentCursor,
  AgentLogo,
  Battery,
  Glyph,
  PixelCat,
  PixelCoffee,
} from "./glyphs";
import {
  AwakePanel,
  BrandIcon,
  Conversation,
  MacMenu,
  TerminalWindows,
  Usage,
} from "./demo-panels";
import {
  NativeOutline,
  useNativeHeight,
  useDemoTimeline,
} from "./native-shell";
import { GitPanel } from "./GitPanel";
import { useWindowDrag } from "./use-window-drag";
import { DemoProvider, useDemoContent, useText, type Text } from "./context";
import { demoState } from "./demo-state";
import "./demo.css";
type Step = "monitor" | "approve" | "ask" | "jump";
type Mode = "ai" | "git" | "coffee";
const Cat = ({
  mood,
  fill,
}: {
  mood: "calm" | "working" | "waiting";
  fill: number;
}) => (
  <PixelCat
    mood={mood}
    color={mood === "waiting" ? "#ff9233" : "#e6e6e6"}
    fill={fill}
    px={2}
    blue="#4a8dff"
  />
);
function Wallpaper() {
  return (
    <svg
      className="wallpaper"
      viewBox="0 0 1200 680"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="1200" height="680" fill="var(--wall-base)" />
      <path
        d="M-120 650C80 20 300-210 650-50S800 470 1320 520L1320 820-120 820Z"
        fill="var(--wall-one)"
      />
      <path
        d="M-100 760C160 80 460-90 790 90s180 510 590 630L1380 840Z"
        fill="var(--wall-two)"
      />
      <path
        d="M-50 820C250 260 500 90 750 310s270 340 650 350L1400 860Z"
        fill="var(--wall-three)"
      />
    </svg>
  );
}
function SessionRow({
  t,
  sessionIndex = 0,
  phase,
  decision,
  answer,
  open,
  onClick,
  passive = false,
}: {
  t: Text;
  sessionIndex?: number;
  phase?: string;
  decision?: string | null;
  answer?: string | null;
  open?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  passive?: boolean;
}) {
  const { sessions: DEMO_SESSIONS } = useDemoContent();
  const session = DEMO_SESSIONS[sessionIndex],
    working = (phase ?? session.status) === "working";
  const contents = (
    <>
      <span className="f-leading">
        <span className="f-logo">
          <BrandIcon
            name={session.icon}
            className={
              working ? `agent-motion agent-motion-${session.icon}` : ""
            }
          />
          {session.hostIcon && (
            <span className="host-badge">
              <BrandIcon name={session.hostIcon} />
            </span>
          )}
          {!working && <i className="f-unread" />}
        </span>
        <span className={`f-cursor ${working ? "working" : "waiting"}`}>
          <AgentCursor
            color={
              working
                ? "#f5f5f7"
                : phase === "approval" || phase === "ask"
                  ? "#ff9233"
                  : "#4aa5ff"
            }
            spinning={working}
            blink={!working}
          />
        </span>
      </span>
      <span className="f-copy">
        <span className="f-heading">
          <strong>{session.name}</strong>
          <span className={`f-state state-${working ? "working" : phase}`}>
            {working
              ? t("d001")
              : phase === "approval"
                ? t("d002")
                : phase === "ask"
                  ? t("d003")
                  : t("d004")}
          </span>

          <span className="f-time">{working ? t("d005") : t("d006")}</span>
        </span>
        <span className="f-prompt">
          {t("d007")}
          {session.prompt}
        </span>
        <span className="f-reply">
          {session.agent}
          {t("d008")}{" "}
          {phase === "ask"
            ? t("d048")
            : answer
              ? t("answerContinuing", { v0: answer })
              : decision === "deny"
                ? t("d009")
                : decision === "allow"
                  ? t("d010")
                  : session.reply}
        </span>
      </span>
    </>
  );
  return passive ? (
    <div className="f-row" data-session-host={session.host}>
      {contents}
    </div>
  ) : (
    <button
      type="button"
      className={`f-row ${open ? "row-open" : ""}`}
      data-session-host={session.host}
      onClick={onClick}
      aria-expanded={open || false}
      aria-label={t("d011", { v0: session.name })}
    >
      {contents}
    </button>
  );
}
const subscribe = () => () => {};
// 某些浏览器使用纪元时间戳，统一换算到悬停冷却使用的单调时钟。
const interactionTime = (event: { timeStamp: number }) =>
  event.timeStamp > 1e12
    ? event.timeStamp - performance.timeOrigin
    : event.timeStamp;
function Demo({ lang }: { lang: Language }) {
  const { sessions: DEMO_SESSIONS } = useDemoContent();
  const t = useText(),
    id = useId();
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [expanded, setExpanded] = useState(false),
    [mode, setMode] = useState<Mode>("ai"),
    [step, setStep] = useState<Step>("monitor");
  const [usage, setUsage] = useState<"claude" | "codex" | null>(null);
  const [decision, setDecision] = useState<string | null>(null),
    [answer, setAnswer] = useState<string | null>(null),
    [answerDraft, setAnswerDraft] = useState(""),
    [muted, setMuted] = useState(false),
    [row, setRow] = useState<number | null>(null),
    [jumped, setJumped] = useState(false);
  const [coffeeAdvanced, setCoffeeAdvanced] = useState(false),
    [coffeeChoice, setCoffeeChoice] = useState<string | null>(null),
    [settingsOpen, setSettingsOpen] = useState(false);
  const coffeeOn = coffeeChoice !== null;
  const settingsWindow = useRef<HTMLDivElement>(null);
  const [windowReset, setWindowReset] = useState(0);
  const pinned = useRef(false),
    suppressHover = useRef(false);
  const reopenAfter = useRef(0);
  const [autoplay, setAutoplay] = useState(true);
  const [timelineRun, setTimelineRun] = useState(0);
  const settingsDrag = useWindowDrag(settingsWindow, undefined, settingsOpen);
  const native = useRef<HTMLDivElement>(null),
    inner = useRef<HTMLDivElement>(null),
    body = useRef<HTMLDivElement>(null),
    closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelHeight = useNativeHeight(inner, body);
  const state = demoState(DEMO_SESSIONS, step, decision, answer);
  const questionPending = mode === "ai" && step === "ask" && answer === null;
  const expandButton = useRef<HTMLButtonElement>(null),
    tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const steps: Step[] = ["monitor", "approve", "ask", "jump"];
  const labels = [t("d013"), t("d014"), t("d015"), t("d016")];
  const answers = [t("d017"), t("d018"), t("d019")];
  useEffect(() => {
    if (settingsOpen) settingsWindow.current?.focus({ preventScroll: true });
  }, [settingsOpen]);
  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );
  const timelineRef = useDemoTimeline(
    step,
    autoplay,
    (next) => {
      setStep(next as Step);
      setDecision(null);
      setAnswer(null);
      setAnswerDraft("");
      setJumped(
        next === "jump" && mode === "ai" && !settingsOpen && row === null,
      );
    },
    timelineRun,
  );
  function leaveIsland() {
    suppressHover.current = false;
    if (pinned.current) return;
    closeTimer.current = setTimeout(() => {
      // 悬停离开后若用户已经点开或切换面板，旧关闭请求不能覆盖新的操作。
      if (pinned.current || native.current?.matches(":hover")) return;
      const active = document.activeElement;
      if (
        active instanceof HTMLElement &&
        native.current?.contains(active) &&
        (active.matches(":focus-visible") ||
          ["INPUT", "TEXTAREA"].includes(active.tagName))
      )
        return;
      setExpanded(false);
    }, 240);
  }
  function choose(next: Step) {
    pinned.current = true;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setExpanded(true);
    setMode("ai");
    setSettingsOpen(false);
    setStep(next);
    setTimelineRun((run) => run + 1);
    setDecision(null);
    setAnswer(null);
    setAnswerDraft("");
    setRow(null);
    setJumped(next === "jump");
  }
  function answerQuestion(text: string) {
    setAnswer(text);
    setTimelineRun((run) => run + 1);
  }
  function decide(choice: "allow" | "deny") {
    setDecision(choice);
    setTimelineRun((run) => run + 1);
  }
  function reset() {
    setWindowReset((value) => value + 1);
    settingsDrag.reset();
    choose("monitor");
    setDecision(null);
    setAnswer(null);
    setAnswerDraft("");
    setMuted(false);
    setUsage(null);
    setCoffeeChoice(null);
  }
  function keyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? 3
          : event.key === "ArrowRight"
            ? (index + 1) % 4
            : event.key === "ArrowLeft"
              ? (index + 3) % 4
              : null;
    if (next === null) return;
    event.preventDefault();
    choose(steps[next]);
    tabs.current[next]?.focus();
  }
  function expandManually() {
    pinned.current = true;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setExpanded(true);
  }
  function toggleSimpleCoffee() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    pinned.current = false;
    suppressHover.current = true;
    reopenAfter.current = performance.now() + 360;
    setCoffeeChoice((value) => (value === null ? t("d023") : null));
    setExpanded(false);
  }
  function openSettings() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    pinned.current = false;
    suppressHover.current = true;
    reopenAfter.current = performance.now() + 360;
    setExpanded(false);
    setSettingsOpen(true);
  }
  function closeSettings(event: { timeStamp: number }) {
    pinned.current = false;
    suppressHover.current = true;
    reopenAfter.current = interactionTime(event) + 360;
    setExpanded(false);
    setSettingsOpen(false);
    requestAnimationFrame(() =>
      expandButton.current?.focus({ preventScroll: true }),
    );
  }
  function switchMode(next: Mode) {
    if (next === "coffee" && !coffeeAdvanced) {
      toggleSimpleCoffee();
      return;
    }
    pinned.current = true;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMode(next);
    setExpanded(true);
    setRow(null);
    setJumped(false);
    setUsage(null);
  }
  const content =
    mode === "git"
      ? "git"
      : mode === "coffee"
        ? "coffee"
        : row !== null
          ? "detail"
          : mode === "ai" && step === "approve"
            ? "approve"
            : mode === "ai" && step === "ask"
              ? "ask"
              : row !== null
                ? "detail"
                : "list";
  function openRow(index: number, event: React.MouseEvent<HTMLButtonElement>) {
    if (event.metaKey || event.ctrlKey) {
      setJumped(true);
      setRow(null);
    } else setRow(row === index ? null : index);
  }
  return (
    <div
      className="demo-block"
      id="demo"
      role="region"
      aria-label={t("d024")}
      inert={!ready}
      aria-busy={!ready}
      tabIndex={-1}
      onKeyDown={(event) => {
        if (
          questionPending &&
          !["INPUT", "TEXTAREA"].includes((event.target as HTMLElement).tagName)
        ) {
          const index = Number(event.key) - 1;
          if (index >= 0 && index < answers.length && event.key.length === 1) {
            event.preventDefault();
            answerQuestion(answers[index]);
            return;
          }
        }
        if (event.key === "Escape" && expanded) {
          event.preventDefault();
          pinned.current = false;
          suppressHover.current = true;
          reopenAfter.current = interactionTime(event) + 360;
          setExpanded(false);
          requestAnimationFrame(() =>
            expandButton.current?.focus({ preventScroll: true }),
          );
        }
      }}
    >
      <div className="demo-topline">
        <span>
          {t("d025")}
          {t("d026")}
        </span>
        <span>
          <MousePointer2 size={12} />
          {t("d027")}
        </span>
      </div>
      <div
        className={`scene unlocked ${jumped ? "jumped" : ""}`}
        tabIndex={0}
        role="region"
        aria-label={t("d028")}
      >
        <Wallpaper />
        <MacMenu lang={lang} />
        <div className="desktop-grid" />
        <TerminalWindows
          key={windowReset}
          lang={lang}
          step={step}
          jumped={jumped}
        />
        <div
          className={`native ${expanded ? "" : "compact"}`}
          ref={native}
          onClickCapture={() => {
            pinned.current = true;
          }}
          style={{ height: expanded ? panelHeight : 30 }}
          onPointerEnter={(event) => {
            if (
              event.pointerType === "mouse" &&
              !settingsOpen &&
              !suppressHover.current &&
              performance.now() >= reopenAfter.current &&
              !(event.target as Element).closest("[data-compact-action]")
            ) {
              if (closeTimer.current) clearTimeout(closeTimer.current);
              setExpanded(true);
            }
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse") leaveIsland();
          }}
          data-content={content}
          role="region"
          aria-label={t("d029")}
        >
          <NativeOutline
            expanded={expanded}
            height={expanded ? panelHeight : 30}
          />
          <div className="native-cat" data-expanded={expanded || undefined}>
            <span
              role="img"
              aria-label={t(
                state.mood === "waiting"
                  ? "catWaiting"
                  : state.mood === "working"
                    ? "catWorking"
                    : "catCalm",
              )}
            >
              <Cat mood={state.mood} fill={state.fill} />
            </span>
            <span className="compact-session-count" aria-hidden={expanded}>
              {state.count}
            </span>
          </div>
          <div
            ref={inner}
            className="native-inner"
            inert={!expanded}
            aria-hidden={!expanded}
          >
            <div className="f-toolbar">
              <div className="f-toolbar-left">
                <button
                  className="f-cat-tab"
                  onClick={() => switchMode("ai")}
                  aria-label={t("d030")}
                  aria-pressed={mode === "ai"}
                >
                  <span className="native-cat-placeholder" aria-hidden="true" />
                </button>
                <div className="f-meters">
                  {(["claude", "codex"] as const).map((provider) => (
                    <button
                      type="button"
                      className="f-meter"
                      key={provider}
                      onClick={() =>
                        setUsage(usage === provider ? null : provider)
                      }
                      aria-expanded={usage === provider}
                      aria-label={t("d031", {
                        v0:
                          provider === "claude"
                            ? "Claude 剩余用量"
                            : "Codex 剩余用量",
                        v1:
                          provider === "claude"
                            ? "Claude remaining usage"
                            : "Codex remaining usage",
                      })}
                    >
                      <AgentLogo agent={provider} />
                      {provider === "claude" ? (
                        <>
                          <Battery remaining={0.84} thin />
                          <Battery remaining={0.92} />
                        </>
                      ) : (
                        <Battery remaining={0.76} />
                      )}
                    </button>
                  ))}
                </div>
                <span className="f-passive f-add" title={t("d032")}>
                  <Glyph name="plus" />
                </span>
              </div>
              <div className="f-toolbar-right">
                {usage ? (
                  <button
                    className="usage-close"
                    onClick={() => setUsage(null)}
                    aria-label={t("d033")}
                  >
                    <Usage provider={usage} lang={lang} />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => switchMode("coffee")}
                      aria-label={t("d034")}
                      aria-pressed={
                        coffeeAdvanced ? mode === "coffee" : coffeeOn
                      }
                    >
                      <Glyph name="coffee" />
                    </button>
                    <button
                      onClick={() => switchMode("git")}
                      aria-label={t("d035")}
                      aria-pressed={mode === "git"}
                    >
                      <Glyph name="git" />
                    </button>
                    <button
                      onClick={() => setMuted(!muted)}
                      aria-pressed={muted}
                      aria-label={t("d036")}
                      title={t("d037")}
                    >
                      <Glyph name={muted ? "muted" : "sound"} />
                    </button>
                    <button
                      onClick={openSettings}
                      aria-label={t("d038")}
                      aria-haspopup="dialog"
                    >
                      <Glyph name="settings" />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div
              ref={body}
              className="f-native-body"
              id={`${id}-panel`}
              role={mode === "ai" ? "tabpanel" : "region"}
              aria-labelledby={mode === "ai" ? `${id}-${step}` : undefined}
              aria-label={
                mode === "ai"
                  ? undefined
                  : mode === "git"
                    ? t("d039")
                    : t("d040")
              }
            >
              {mode === "git" ? (
                <GitPanel en={lang === "en"} />
              ) : mode === "coffee" ? (
                <AwakePanel
                  lang={lang}
                  selected={coffeeChoice}
                  onSelect={setCoffeeChoice}
                />
              ) : (
                <div
                  className={`f-session-list ${row !== null ? "has-detail" : ""}`}
                >
                  {DEMO_SESSIONS.map(
                    (session, index) =>
                      (row === null || row === index) && (
                        <div key={session.name} className="f-session-item">
                          <SessionRow
                            t={t}
                            sessionIndex={index}
                            phase={state.phases[index]}
                            decision={index === 0 ? decision : null}
                            answer={index === 0 ? answer : null}
                            open={row === index}
                            onClick={(event) => openRow(index, event)}
                          />
                          {index === 0 &&
                            step === "approve" &&
                            decision === null &&
                            row === null && (
                              <div className="f-inline f-permission">
                                <span className="f-inline-title">
                                  <Glyph name="warning" />
                                  {t("d041")}
                                </span>
                                <div className="f-permission-command">
                                  <code>{t("d042")}</code>
                                  <p>{t("d043")}</p>
                                </div>
                                <div className="f-inline-actions">
                                  <button onClick={() => decide("deny")}>
                                    {t("d047")}
                                  </button>
                                  <button
                                    className="f-allow"
                                    onClick={() => decide("allow")}
                                  >
                                    {t("d046")}
                                  </button>
                                </div>
                              </div>
                            )}
                          {index === 0 && questionPending && (
                            <div
                              className="f-inline f-question"
                              role="group"
                              aria-label={t("questionSource")}
                            >
                              <div className="f-question-source">
                                <Glyph name="question" />
                                {t("questionSource")}
                              </div>
                              <p className="f-question-title">{t("d048")}</p>
                              <div className="f-question-options">
                                {answers.map((label, index) => (
                                  <button
                                    key={label}
                                    type="button"
                                    className="f-question-option"
                                    onClick={() => answerQuestion(label)}
                                  >
                                    <span className="f-question-number">
                                      {index + 1}
                                    </span>
                                    <span>{label}</span>
                                    <ChevronRight
                                      size={10}
                                      className="f-question-chevron"
                                      aria-hidden="true"
                                    />
                                  </button>
                                ))}
                              </div>
                              <form
                                className="f-question-compose"
                                onSubmit={(event) => {
                                  event.preventDefault();
                                  if (answerDraft.trim())
                                    answerQuestion(answerDraft.trim());
                                }}
                              >
                                <input
                                  value={answerDraft}
                                  onChange={(event) =>
                                    setAnswerDraft(event.target.value)
                                  }
                                  placeholder={t("questionPlaceholder")}
                                  aria-label={t("questionPlaceholder")}
                                />
                                <button
                                  type="submit"
                                  disabled={!answerDraft.trim()}
                                  aria-label={t("questionSubmit")}
                                >
                                  <Glyph name="send" />
                                </button>
                              </form>
                            </div>
                          )}
                          {index === 0 && step === "ask" && answer !== null && (
                            <p className="f-answer-result" role="status">
                              {t("answerSent", { v0: answer })}
                            </p>
                          )}
                          {row === index &&
                            !(index === 0 && questionPending) && (
                              <Conversation
                                key={session.name}
                                index={index}
                                lang={lang}
                                onJump={() => setJumped(true)}
                              />
                            )}
                        </div>
                      ),
                  )}
                </div>
              )}
            </div>
          </div>
          <button
            className="native-open"
            type="button"
            ref={expandButton}
            aria-label={t("d050")}
            onClick={expandManually}
            hidden={expanded}
          >
            <span className="native-cat-placeholder" aria-hidden="true" />
            <span className="compact-session-label">{t("d051")}</span>
          </button>
          {coffeeOn && !expanded && (
            <button
              className="compact-coffee-badge"
              data-compact-action
              onClick={toggleSimpleCoffee}
              aria-label={t("d052")}
            >
              <PixelCoffee size={13.5} />
            </button>
          )}
          {!expanded && (
            <div className="compact-actions">
              <button
                data-compact-action
                onClick={() => switchMode("coffee")}
                aria-label={t("d053")}
                aria-pressed={coffeeOn}
              >
                <Glyph name="coffee" />
              </button>
              <button
                data-compact-action
                onClick={() => switchMode("git")}
                aria-label={t("d054")}
              >
                <Glyph name="git" />
              </button>
            </div>
          )}
          <span className="coffee-live" aria-live="polite">
            {coffeeOn ? t("d055") : t("d056")}
          </span>
        </div>
        {settingsOpen && (
          <div
            className={
              "preview-settings" + (settingsDrag.dragging ? " is-dragging" : "")
            }
            style={settingsDrag.style}
            role="dialog"
            aria-label={t("d057")}
            tabIndex={-1}
            ref={settingsWindow}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                closeSettings(event);
              }
            }}
          >
            <div
              className="preview-settings-chrome"
              {...settingsDrag.handleProps}
              tabIndex={0}
              role="group"
              aria-label={t("d058")}
            >
              <button onClick={closeSettings} aria-label={t("d059")}>
                <X size={10} />
              </button>
              <span>
                {t("d060")}
                {t("d061")}
              </span>
            </div>
            <div className="preview-settings-content">
              <Glyph name="coffee" />
              <h3>{t("d062")}</h3>
              <label>
                <span>{t("d063")}</span>
                <input
                  type="checkbox"
                  checked={coffeeAdvanced}
                  onChange={(event) => {
                    setCoffeeAdvanced(event.target.checked);
                    if (!event.target.checked && mode === "coffee")
                      setMode("ai");
                  }}
                />
              </label>
              <p>{t("d064")}</p>
              <small>{t("d065")}</small>
            </div>
          </div>
        )}
        <span className="scene-label">{t("d066")}</span>
      </div>
      <div className="demo-controls">
        <div className="step-controls" role="tablist" aria-label={t("d067")}>
          {steps.map((value, index) => (
            <button
              key={value}
              type="button"
              role="tab"
              id={`${id}-${value}`}
              aria-controls={`${id}-panel`}
              ref={(el) => {
                tabs.current[index] = el;
              }}
              aria-selected={mode === "ai" && step === value}
              tabIndex={step === value ? 0 : -1}
              onClick={() => choose(value)}
              onKeyDown={(event) => keyDown(event, index)}
            >
              <span>
                {t("d068")}
                {index + 1}
              </span>
              {labels[index]}
              {lang === "zh" && (
                <small>{["MONITOR", "APPROVE", "ASK", "JUMP"][index]}</small>
              )}
            </button>
          ))}
        </div>
        <div className="native-demo-utility">
          <button onClick={reset}>{t("d069")}</button>
          <button
            aria-expanded={expanded}
            onClick={() => {
              pinned.current = false;
              suppressHover.current = expanded;
              if (expanded) {
                reopenAfter.current = performance.now() + 360;
                setExpanded(false);
              } else expandManually();
            }}
          >
            {expanded ? t("d070") : t("d071")}
          </button>
        </div>
      </div>
      <div
        className="demo-timeline"
        ref={timelineRef}
        role="progressbar"
        aria-label={t("d072")}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
      >
        {steps.map((value, i) => (
          <span
            key={value}
            className={
              steps.indexOf(step) > i ? "done" : value === step ? "current" : ""
            }
          >
            <i />
          </span>
        ))}
      </div>
      <button
        className="autoplay-toggle"
        data-autoplay
        type="button"
        aria-pressed={autoplay}
        onClick={() => setAutoplay(!autoplay)}
      >
        {autoplay ? t("d073") : t("d074")}
      </button>
      <p className="native-scroll-hint">{t("d075")}</p>
      <p className="demo-caption">{t("d076")}</p>
    </div>
  );
}
export function IslandDemo({
  lang,
  content,
}: {
  lang: Language;
  content: IslandDemoContent;
}) {
  return (
    <DemoProvider value={content}>
      <div className={`island-demo theme-terminal ${lang}`}>
        <Demo lang={lang} />
      </div>
    </DemoProvider>
  );
}
