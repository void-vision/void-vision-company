"use client";
import { Check, MousePointer2, X } from "lucide-react";
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
import { AgentCursor, AgentLogo, Battery, Glyph, PixelCat } from "./glyphs";
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
import "./demo.css";
type Step = "monitor" | "approve" | "ask" | "jump";
type Mode = "ai" | "git" | "coffee";
const Cat = ({ blue = false, fill }: { blue?: boolean; fill?: number }) => (
  <PixelCat
    mood="calm"
    color="#e6e6e6"
    fill={fill ?? (blue ? 4 : 0)}
    px={2.4}
    blue="#4aa5ff"
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
  open,
  onClick,
  passive = false,
}: {
  t: Text;
  sessionIndex?: number;
  phase?: string;
  decision?: string | null;
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
          {decision === "deny"
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
    [answer, setAnswer] = useState<number | null>(null),
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
  const [hovered, setHovered] = useState(false),
    [autoplay, setAutoplay] = useState(true);
  const settingsDrag = useWindowDrag(
    settingsWindow,
    () => setAutoplay(false),
    settingsOpen,
  );
  const native = useRef<HTMLDivElement>(null),
    inner = useRef<HTMLDivElement>(null),
    body = useRef<HTMLDivElement>(null),
    closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelHeight = useNativeHeight(inner, body);
  const runningCount =
    DEMO_SESSIONS.filter((session) => session.status === "working").length -
    (step === "monitor" ? 0 : 1);
  const catFill = Math.max(
    1,
    Math.round((runningCount / DEMO_SESSIONS.length) * 8),
  );
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
    autoplay && !hovered && !settingsOpen && row === null && mode === "ai",
    (next) => {
      setStep(next as Step);
      setDecision(null);
      setAnswer(null);
      setJumped(next === "jump");
    },
  );
  function leaveIsland() {
    setHovered(false);
    suppressHover.current = false;
    if (pinned.current) return;
    closeTimer.current = setTimeout(() => {
      // 悬停离开后若用户已经点开或切换面板，旧关闭请求不能覆盖新的操作。
      if (pinned.current) return;
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
    setStep(next);
    setRow(null);
    setJumped(next === "jump");
  }
  function reset() {
    setWindowReset((value) => value + 1);
    settingsDrag.reset();
    choose("monitor");
    setDecision(null);
    setAnswer(null);
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
  function closeSettings() {
    pinned.current = false;
    suppressHover.current = true;
    reopenAfter.current = performance.now() + 360;
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
      onClickCapture={(event) => {
        if (!(event.target as Element).closest("[data-autoplay]"))
          setAutoplay(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && expanded) {
          event.preventDefault();
          pinned.current = false;
          suppressHover.current = true;
          reopenAfter.current = performance.now() + 360;
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
          onInteract={() => setAutoplay(false)}
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
              setHovered(true);
              setExpanded(true);
            }
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse") leaveIsland();
          }}
          onFocusCapture={(event) => {
            if (
              event.target.matches(":focus-visible") &&
              !(event.target as Element).closest("[data-compact-action]")
            ) {
              setHovered(true);
              // 聚焦只暂停轮播；展开由显式按钮处理，避免从设置返回时被动重开。
            }
          }}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              setHovered(false);
            }
          }}
          data-content={content}
          role="region"
          aria-label={t("d029")}
        >
          <NativeOutline
            expanded={expanded}
            height={expanded ? panelHeight : 30}
          />
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
                  <Cat fill={catFill} />
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
                            phase={
                              index === 0 && step === "approve" && !decision
                                ? "approval"
                                : index === 0 &&
                                    step === "ask" &&
                                    answer === null
                                  ? "ask"
                                  : step === "jump" && index === 0
                                    ? "input"
                                    : undefined
                            }
                            decision={index === 0 ? decision : null}
                            open={row === index}
                            onClick={(event) => openRow(index, event)}
                          />
                          {index === 0 &&
                            step === "approve" &&
                            row === null && (
                              <div className="f-inline">
                                <span className="f-inline-title">
                                  {t("d041")}
                                </span>
                                <code>{t("d042")}</code>
                                <p>{t("d043")}</p>
                                {decision ? (
                                  <span className="f-result" role="status">
                                    {decision === "deny"
                                      ? t("d044")
                                      : t("d045")}
                                  </span>
                                ) : (
                                  <div className="f-inline-actions">
                                    <button
                                      className="f-allow"
                                      onClick={() => setDecision("allow")}
                                    >
                                      {t("d046")}
                                    </button>
                                    <button onClick={() => setDecision("deny")}>
                                      {t("d047")}
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          {index === 0 && step === "ask" && row === null && (
                            <div className="f-inline f-question">
                              <span className="f-inline-title">
                                {t("d048")}
                              </span>
                              {answers.map((label, i) => (
                                <button
                                  key={label}
                                  aria-pressed={answer === i}
                                  onClick={() => setAnswer(i)}
                                >
                                  <span>{i + 1}</span>
                                  {label}
                                  {answer === i && <Check size={12} />}
                                </button>
                              ))}
                              {answer !== null && (
                                <p className="f-result" role="status">
                                  {t("d049")}
                                  {answers[answer]}
                                </p>
                              )}
                            </div>
                          )}
                          {row === index && (
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
            <Cat fill={catFill} />
            {coffeeOn && (
              <span className="compact-coffee-space" aria-hidden="true" />
            )}
            <span className="compact-session-count">{runningCount}</span>
            <span className="compact-session-label">{t("d051")}</span>
          </button>
          {coffeeOn && !expanded && (
            <button
              className="compact-coffee-badge"
              data-compact-action
              onClick={toggleSimpleCoffee}
              aria-label={t("d052")}
            >
              <Glyph name="coffee" />
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
                closeSettings();
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
              if (expanded) setExpanded(false);
              else expandManually();
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
