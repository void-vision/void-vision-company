export type DemoStep = "monitor" | "approve" | "ask" | "jump";
export type SessionPhase = "working" | "input" | "approval" | "ask";

/** 会话列表、猫的提醒状态和蓝色完成比例使用同一份状态，避免各自推算。 */
export function demoState(
  sessions: readonly { status: string }[],
  step: DemoStep,
  decision: string | null,
  answer: string | null,
) {
  const phases: SessionPhase[] = sessions.map((session, index) => {
    if (index > 0) return session.status === "working" ? "working" : "input";
    if (step === "approve" && decision === null) return "approval";
    if (step === "ask" && answer === null) return "ask";
    if (step === "jump" || (step === "approve" && decision === "deny"))
      return "input";
    return "working";
  });
  const waiting = phases.some(
    (phase) => phase === "approval" || phase === "ask",
  );
  const ready = phases.filter((phase) => phase === "input").length;
  const fill =
    ready === 0
      ? 0
      : ready === phases.length
        ? 8
        : Math.min(7, Math.max(1, Math.round((ready / phases.length) * 8)));
  return {
    phases,
    count: phases.length,
    working: phases.filter((phase) => phase === "working").length,
    mood: waiting
      ? ("waiting" as const)
      : phases.includes("working")
        ? ("working" as const)
        : ("calm" as const),
    fill,
  };
}
