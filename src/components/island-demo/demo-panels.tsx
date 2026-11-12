/* eslint-disable @next/next/no-img-element -- 演示图标使用原生界面的固定尺寸。 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useWindowDrag } from "./use-window-drag";
import {
  ArrowUp,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Wifi,
  BatteryFull,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import type { Locale as Language } from "@/content/i18n";
import { useDemoContent, useText } from "./context";
export function BrandIcon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <img
      className={`brand-icon ${className}`}
      src={`/images/island-demo/brands/${name}.${name === "iterm2" ? "png" : "svg"}`}
      alt=""
      width="24"
      height="24"
    />
  );
}
export function Usage({
  provider,
}: {
  provider: "claude" | "codex";
  lang: Language;
}) {
  const t = useText();
  const windows =
    provider === "claude"
      ? [
          { label: t("d077"), remaining: 84, reset: t("d078") },
          { label: t("d079"), remaining: 92, reset: t("d080") },
        ]
      : [{ label: t("d081"), remaining: 76, reset: t("d082") }];
  return (
    <span className="usage-detail" role="status">
      {windows.map((w) => (
        <span key={w.label}>
          <span>{w.label}</span>
          <strong>
            {w.remaining}
            {t("d083")}
          </strong>
          <span>{w.reset}</span>
        </span>
      ))}
    </span>
  );
}
export function AwakePanel({
  selected,
  onSelect: setSelected,
}: {
  lang: Language;
  selected: string | null;
  onSelect: (value: string | null) => void;
}) {
  const t = useText();
  const [lid, setLid] = useState(true),
    [screen, setScreen] = useState(true),
    [auto, setAuto] = useState({ ai: true, focus: false, power: false });
  const labels = [
    t("d084"),
    t("d085"),
    t("d086"),
    t("d087"),
    t("d088"),
    t("d089"),
  ];
  const chip = (label: string, disabled = false) => (
    <button
      type="button"
      key={label}
      className={`awake-chip ${selected === label ? "active" : ""}`}
      aria-pressed={selected === label}
      disabled={disabled}
      onClick={() => setSelected(selected === label ? null : label)}
    >
      {label}
    </button>
  );
  return (
    <div className="awake-panel">
      <div className="awake-heading">
        <svg
          viewBox="0 0 9 9"
          width="28"
          height="28"
          shapeRendering="crispEdges"
          aria-hidden="true"
        >
          {[
            ".#.#.#...",
            ".........",
            "#######..",
            "#.....###",
            "#.....#.#",
            "#.....###",
            "#.....#..",
            ".#####...",
          ].flatMap((row, y) =>
            [...row].map((c, x) =>
              c === "#" ? (
                <rect
                  key={`${x}-${y}`}
                  x={x}
                  y={y}
                  width="1"
                  height="1"
                  fill="#ff9233"
                />
              ) : null,
            ),
          )}
        </svg>
        <div>
          <strong>{selected ? t("d090", { v0: selected }) : t("d091")}</strong>
          <span role="status">{selected ? t("d092") : t("d093")}</span>
        </div>
      </div>
      <div className="awake-label-row">
        <span>{t("d094")}</span>
        <div>
          <label>
            <input
              type="checkbox"
              checked={lid}
              onChange={(e) => setLid(e.target.checked)}
            />
            {t("d095")}
          </label>
          <label>
            <input
              type="checkbox"
              checked={screen}
              onChange={(e) => setScreen(e.target.checked)}
            />
            {t("d096")}
          </label>
        </div>
      </div>
      <div className="awake-chips">
        {labels.map((label) => chip(label))}
        <label className="awake-until">
          {t("d097")}
          <input
            type="time"
            aria-label={t("d098")}
            onChange={(e) => setSelected(e.target.value)}
          />
        </label>
      </div>
      <span className="awake-label">{t("d099")}</span>
      <div className="awake-chips">
        {chip(t("d100"), true)}
        {chip(t("d101"), true)}
        {chip(t("d102"))}
      </div>
      <span className="awake-label">{t("d103")}</span>
      <div className="awake-options">
        {(["ai", "focus", "power"] as const).map((key, index) => (
          <label key={key}>
            <input
              type="checkbox"
              checked={auto[key]}
              onChange={(e) => setAuto({ ...auto, [key]: e.target.checked })}
            />
            {[t("d202"), t("d203"), t("d204")][index]}
          </label>
        ))}
      </div>
      <small>{t("d104")}</small>
    </div>
  );
}
export function Conversation({
  index,
  onJump,
}: {
  lang: Language;
  index: number;
  onJump: () => void;
}) {
  const t = useText();
  const { sessions } = useDemoContent();
  const session = sessions[index],
    [message, setMessage] = useState(""),
    [sent, setSent] = useState<string[]>([]),
    [commands, setCommands] = useState(false);
  function send() {
    if (!message.trim()) return;
    setSent([...sent, message.trim()]);
    setMessage("");
  }
  return (
    <div className="conversation-detail">
      <div className="conversation-meta">
        {t("d105")}
        <button onClick={onJump} title={t("d106")}>
          <ArrowUpRight size={12} />
          {t("d107")}
        </button>
      </div>
      <div className="conversation-scroll" tabIndex={0}>
        <button
          className="command-summary"
          aria-expanded={commands}
          onClick={() => setCommands(!commands)}
        >
          {t("d108")}
          {commands ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </button>
        {commands && (
          <pre className="command-log">
            {t("d109")}
            {"\n"}
            {t("d110")}
            {"\n"}
            {t("d111")}
          </pre>
        )}
        <p>{t("d112")}</p>
        <p>{t("d113")}</p>
        <div className="conversation-bubble">{t("d114")}</div>
        <p>{t("d115")}</p>
        {sent.map((text, i) => (
          <div key={i}>
            <div className="conversation-bubble">{text}</div>
            <p>{t("d116")}</p>
          </div>
        ))}
      </div>
      <form
        className="conversation-composer"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-label={t("d117")}
          placeholder={t("d118", { v0: session.agent })}
        />
        <button type="submit" disabled={!message.trim()} aria-label={t("d119")}>
          <ArrowUp size={16} />
        </button>
      </form>
      <small>{t("d120")}</small>
    </div>
  );
}
export function MacMenu({}: { lang: Language }) {
  const t = useText();
  return (
    <div className="macbar" aria-hidden="true">
      <span className="mac-apple">
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M17.1 12.5c0-2 1.7-3 1.8-3.1-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.5-.7-2.5-.7-1.3 0-2.5.8-3.2 1.9-1.4 2.3-.4 5.7.9 7.6.6.9 1.3 1.8 2.3 1.7.9 0 1.3-.6 2.5-.6s1.6.6 2.6.6c1 0 1.6-.9 2.2-1.8.7-1 1-2 1-2.1-.1 0-1.7-.7-1.7-2.6zM15.4 6.7c.5-.7.9-1.6.8-2.5-.8 0-1.8.5-2.4 1.2-.5.6-1 1.5-.8 2.4.9 0 1.8-.4 2.4-1.1z"
          />
        </svg>
      </span>
      <strong>{t("d121")}</strong>
      <span>{t("d122")}</span>
      <span>{t("d123")}</span>
      <span>{t("d124")}</span>
      <span>{t("d125")}</span>
      <span>{t("d126")}</span>
      <span>{t("d127")}</span>
      <div className="mac-status">
        <BatteryFull size={13} />
        <Wifi size={12} />
        <Search size={11} />
        <SlidersHorizontal size={11} />
        <time>{t("d128")}</time>
      </div>
    </div>
  );
}
function TerminalFrame({
  agent,
  index,
  active,
  zIndex,
  onActivate,
  onInteract,
  children,
}: {
  agent: string;
  index: number;
  lang: Language;
  active: boolean;
  zIndex: number;
  onActivate: () => void;
  onInteract?: () => void;
  children: ReactNode;
}) {
  const t = useText();
  const window = useRef<HTMLDivElement>(null);
  const drag = useWindowDrag(window, onInteract);
  const label = t("d129", { v0: agent });
  return (
    <div
      ref={window}
      className={
        "mac-window window-" + agent + (drag.dragging ? " is-dragging" : "")
      }
      style={{ ...drag.style, zIndex }}
      data-active={active}
      onPointerDownCapture={() => {
        onActivate();
        onInteract?.();
      }}
    >
      <div
        className="window-titlebar"
        {...drag.handleProps}
        tabIndex={0}
        role="group"
        aria-label={label}
        title={t("d130")}
        onFocus={() => {
          onActivate();
          onInteract?.();
        }}
      >
        <div className="window-lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <span>
          {agent}
          {t("d131")}
          {["atlas-search", "orbit-ui", "pixel-garden"][index]}
        </span>
        <span className="window-tab">{t("d132")}</span>
      </div>
      {children}
    </div>
  );
}
export function TerminalWindows({
  lang,
  step,
  jumped,
  onInteract,
}: {
  lang: Language;
  step: string;
  jumped: boolean;
  onInteract?: () => void;
}) {
  const t = useText();
  const [order, setOrder] = useState(["gemini", "codex", "claude"]);
  useEffect(() => {
    if (!jumped) return;
    const frame = requestAnimationFrame(() =>
      setOrder((previous) =>
        previous.at(-1) === "claude"
          ? previous
          : [...previous.filter((item) => item !== "claude"), "claude"],
      ),
    );
    return () => cancelAnimationFrame(frame);
  }, [jumped]);
  const activate = (agent: string) =>
    setOrder((previous) =>
      previous.at(-1) === agent
        ? previous
        : [...previous.filter((item) => item !== agent), agent],
    );
  return (
    <div className={`mac-windows ${jumped ? "returned" : ""}`}>
      {["gemini", "codex", "claude"].map((agent, i) => (
        <TerminalFrame
          key={agent}
          agent={agent}
          index={i}
          lang={lang}
          active={order.at(-1) === agent}
          zIndex={order.indexOf(agent) + 1}
          onActivate={() => activate(agent)}
          onInteract={onInteract}
        >
          <div className="terminal-screen" aria-hidden="true">
            {i === 0 ? (
              <>
                <p>
                  <em>{t("d133")}</em> {t("d134")}
                </p>
                <p>
                  <em>{t("d135")}</em>
                  {t("d136")}
                </p>
                <p className="terminal-muted">{t("d137")}</p>
                <p>
                  <em>{t("d138")}</em> {t("d139")}
                </p>
              </>
            ) : i === 1 ? (
              <>
                <div className="codex-heading">
                  <BrandIcon name="openai" />
                  <b>{t("d140")}</b>
                  <span>{t("d141")}</span>
                </div>
                <p className="terminal-muted">
                  {t("d142")}
                  {t("d143")}
                </p>
                <p>
                  <em>{t("d144")}</em> {t("d145")}
                </p>
                <p className="terminal-muted">{t("d146")}</p>
                <p>
                  <em>{t("d147")}</em> {t("d148")}
                </p>
                <div className="terminal-prompt">
                  {t("d149")}
                  <span className="terminal-caret" />
                </div>
                <small>{t("d150")}</small>
              </>
            ) : (
              <>
                <div className="claude-heading">
                  <BrandIcon name="claude" />
                  <b>{t("d151")}</b>
                  <small>{t("d152")}</small>
                </div>
                <p className="terminal-muted">{t("d153")}</p>
                <p>
                  <em>{t("d154")}</em>
                  {t("d155")}
                </p>
                <p className="terminal-muted">{t("d156")}</p>
                <p>
                  <em>{t("d157")}</em>
                  {t("d158")}
                </p>
                <p className="terminal-muted">{t("d159")}</p>
                <div className="terminal-diff">
                  <p>{t("d160")}</p>
                  <p>{t("d161")}</p>
                </div>
                <p>
                  <em>{t("d162")}</em>
                  {t("d163")}
                </p>
                <p className="terminal-muted">
                  {" "}
                  {t("d164")}
                  <span className="terminal-pass">{t("d165")}</span>
                </p>
                <p className="terminal-result">
                  {step === "approve"
                    ? t("d166")
                    : step === "ask"
                      ? t("d167")
                      : jumped
                        ? t("d168")
                        : t("d169")}
                </p>
                <div className="terminal-prompt">
                  {t("d170")}
                  <span className="terminal-caret" />
                </div>
                <small>
                  {t("d171")}
                  {t("d172")}
                </small>
              </>
            )}
          </div>
        </TerminalFrame>
      ))}
    </div>
  );
}
