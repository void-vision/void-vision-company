import { useState } from "react";
import { Glyph } from "./glyphs";
import { useDemoContent, useText } from "./context";
/**
 * Git 标签，照原生 GitTab.swift 的源代码管理侧边栏排法：仓库胶囊 + 分支，「更改」分区里提交说明、整宽的提交按钮，
 * 下面已暂存 / 更改两组文件，图谱默认收起。数据是虚构的示例仓库。
 */
type FileChange = {
  name: string;
  dir: string;
  kind: "M" | "U" | "A";
};
const repos = [
  { name: "orbit-ui", count: 9, dot: "#f5f5f7" },
  { name: "pixel-garden", count: 6, dot: "#4a8dff" },
  { name: "demo-notes", count: 0, dot: "#8e8e93" },
];
const fileIcon = (name: string) =>
  name.endsWith(".swift") ? (
    <span className="vi-git-icon vi-git-swift">
      <Glyph name="swift" />
    </span>
  ) : (
    <span className={`vi-git-icon ${name.endsWith(".md") ? "vi-git-md" : ""}`}>
      <Glyph name="doc" />
    </span>
  );
export function GitPanel({ en }: { en: boolean }) {
  const t = useText();

  const { commits: startCommits } = useDemoContent();
  const [changes, setChanges] = useState<FileChange[]>([
    { name: "GameView.swift", dir: "ios/Snake", kind: "M" },
    { name: "snake.ts", dir: "src", kind: "M" },
    { name: "hud.ts", dir: "src/ui", kind: "M" },
    { name: "eat.wav", dir: "assets", kind: "U" },
    { name: "README.md", dir: "", kind: "M" },
  ]);
  const [staged, setStaged] = useState<FileChange[]>([
    { name: "score.ts", dir: "src", kind: "M" },
  ]);
  const [open, setOpen] = useState({
    changes: true,
    staged: true,
    unstaged: true,
    graph: true,
  });
  const [message, setMessage] = useState("");
  const [commits, setCommits] = useState(startCommits);
  const [note, setNote] = useState("");
  const toggle = (key: keyof typeof open) =>
    setOpen((value) => ({ ...value, [key]: !value[key] }));
  const stage = (file: FileChange) => {
    setChanges((list) => list.filter((item) => item !== file));
    setStaged((list) => [...list, file]);
  };
  const unstage = (file: FileChange) => {
    setStaged((list) => list.filter((item) => item !== file));
    setChanges((list) => [...list, file]);
  };
  const canCommit =
    message.trim().length > 0 && staged.length + changes.length > 0;
  // 没有已暂存的文件时，演示按「始终暂存全部并提交」处理。
  const commit = () => {
    if (!canCommit) return;
    const text = message.trim(),
      files = staged.length ? staged.length : changes.length;
    const hash = Math.abs(
      [...text].reduce((h, ch) => Math.imul(h, 31) + ch.charCodeAt(0), 7),
    )
      .toString(16)
      .padStart(8, "0")
      .slice(0, 8);
    setCommits((list) => [
      {
        id: hash,
        zh: text,
        en: text,
        hash: hash.slice(0, 7),
        ago: { zh: t("d205"), en: t("d205") },
        refs: [{ label: "main", tone: "branch" }],
      },
      ...list.map((item) => ({
        ...item,
        refs: item.refs?.filter((ref) => ref.label !== "main"),
      })),
    ]);
    if (!staged.length) setChanges([]);
    setStaged([]);
    setMessage("");
    setNote(t("d173", { v0: hash, v1: files, v2: files > 1 ? "s" : "" }));
  };
  const suggest = () => {
    const names = (staged.length ? staged : changes).map((file) =>
      file.name.replace(/\.\w+$/, ""),
    );
    if (names.length)
      setMessage(
        t("d174", {
          v0: names.slice(0, 2).join("、"),
          v1: names.slice(0, 2).join(" and "),
        }),
      );
  };
  const group = (
    key: "staged" | "unstaged",
    title: string,
    files: FileChange[],
    action: (file: FileChange) => void,
    sign: string,
  ) => (
    <div className="vi-git-group">
      <button
        type="button"
        className="vi-git-group-head"
        aria-expanded={open[key]}
        onClick={() => toggle(key)}
      >
        <Glyph name={open[key] ? "chevronDown" : "chevronRight"} />
        <b>{title}</b>
        <em>{files.length}</em>
      </button>
      {open[key] && (
        <ul>
          {files.map((file) => (
            <li key={file.name}>
              <button
                type="button"
                onClick={() => action(file)}
                aria-label={`${sign === "+" ? t("d175") : t("d176")} ${file.name}`}
              >
                {fileIcon(file.name)}
                <span className="vi-git-name">{file.name}</span>
                <small>{file.dir}</small>
                <i aria-hidden="true">{sign}</i>
                <b className={`vi-git-kind vi-git-${file.kind}`}>{file.kind}</b>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  return (
    <div className="vi-git">
      <div className="vi-git-repos">
        <div className="vi-git-chips">
          {repos.map((repo, index) => (
            <span
              key={repo.name}
              className={
                index === 1 ? "vi-git-chip vi-git-chip-on" : "vi-git-chip"
              }
            >
              <i style={{ background: repo.dot }} />
              {repo.name}
              {repo.count > 0 && (
                <em>
                  {index === 1 ? changes.length + staged.length : repo.count}
                </em>
              )}
            </span>
          ))}
        </div>
        <button
          type="button"
          className="vi-git-tool"
          aria-label={t("d177")}
          title={t("d178")}
        >
          <Glyph name="plus" />
        </button>
        <button
          type="button"
          className="vi-git-tool"
          aria-label={t("d179")}
          title={t("d180")}
        >
          <Glyph name="gear" />
        </button>
        <span className="vi-git-branch">
          <Glyph name="git" />
          {t("d181")}
        </span>
        <button
          type="button"
          className="vi-git-tool"
          aria-label={t("d182")}
          title={t("d183")}
        >
          <Glyph name="refresh" />
        </button>
      </div>
      <div className="vi-git-section">
        <button
          type="button"
          className="vi-git-section-head"
          aria-expanded={open.changes}
          onClick={() => toggle("changes")}
        >
          <Glyph name={open.changes ? "chevronDown" : "chevronRight"} />
          <b>{t("d184")}</b>
        </button>
        <span className="vi-git-actions">
          <button type="button" aria-label={t("d185")} title={t("d186")}>
            <Glyph name="list" />
          </button>
          <button type="button" aria-label={t("d187")} title={t("d188")}>
            <Glyph name="stash" />
          </button>
          <button
            type="button"
            aria-label={t("d189")}
            title={t("d190")}
            disabled={!canCommit}
            onClick={commit}
          >
            <Glyph name="check" />
          </button>
        </span>
      </div>
      {open.changes && (
        <>
          <div className="vi-git-message">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault();
                  commit();
                }
              }}
              placeholder={t("d191")}
              aria-label={t("d192")}
            />
            <button
              type="button"
              aria-label={t("d193")}
              title={t("d194")}
              onClick={suggest}
            >
              <Glyph name="sparkles" />
            </button>
          </div>
          <div
            className={`vi-git-commit ${canCommit ? "vi-git-commit-on" : ""}`}
          >
            <button type="button" disabled={!canCommit} onClick={commit}>
              <Glyph name="check" />
              {t("d195")}
            </button>
            <i aria-hidden="true" />
            <button
              type="button"
              className="vi-git-more"
              aria-label={t("d196")}
              title={t("d197")}
              onClick={suggest}
            >
              <Glyph name="chevronDown" />
            </button>
          </div>
          {note && (
            <p className="vi-git-note" role="status">
              {note}
            </p>
          )}
          {group("staged", t("d198"), staged, unstage, "−")}
          {group("unstaged", t("d199"), changes, stage, "+")}
        </>
      )}
      <button
        type="button"
        className="vi-git-history"
        aria-expanded={open.graph}
        onClick={() => toggle("graph")}
      >
        <Glyph name={open.graph ? "chevronDown" : "chevronRight"} />
        <b>{t("d200")}</b>
        <small>{commits.length}</small>
      </button>
      {open.graph && (
        <ol className="vi-git-graph">
          {commits.map((item, index) => (
            <li key={item.id} className={item.lane ? "vi-git-lane" : ""}>
              <span
                className={`vi-git-dot ${index === 0 ? "vi-git-head-dot" : ""}`}
                aria-hidden="true"
              />
              <span className="vi-git-msg">
                {item.refs?.map((ref) => (
                  <em
                    key={ref.label}
                    className={`vi-git-ref vi-git-ref-${ref.tone}`}
                  >
                    {ref.label}
                  </em>
                ))}
                {en ? item.en : item.zh}
              </span>
              <span className="vi-git-meta">
                {t("d201")}
                {item.hash} {en ? item.ago.en : item.ago.zh}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
