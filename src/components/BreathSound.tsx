"use client";

import { useEffect } from "react";

/**
 * The soft two-breath sound from the v2 design, synthesised with Web Audio.
 * Browsers only allow audio after a user gesture, so it plays on the first
 * interaction, once per session.
 */
export function BreathSound() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("vv-breath") === "1") return;
    } catch {}
    const events = ["pointerdown", "keydown", "touchstart"] as const;
    let done = false;

    const play = (): boolean => {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return true;
      let ctx: AudioContext;
      try {
        ctx = new AC();
      } catch {
        return false;
      }
      if (ctx.state === "suspended") void ctx.resume();

      const sr = ctx.sampleRate;
      const buf = ctx.createBuffer(1, sr * 3, sr);
      const data = buf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < data.length; i++) {
        last = last * 0.86 + (Math.random() * 2 - 1) * 0.42;
        data[i] = last;
      }
      const out = ctx.createGain();
      out.gain.value = 0.9;
      out.connect(ctx.destination);

      const seg = (start: number, freq: number, peak: number, rise: number, fall: number) => {
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = freq;
        bp.Q.value = 0.7;
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = freq * 2.6;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, start);
        g.gain.exponentialRampToValueAtTime(peak, start + rise);
        g.gain.exponentialRampToValueAtTime(0.0001, start + rise + fall);
        src.connect(bp).connect(lp).connect(g).connect(out);
        src.start(start);
        src.stop(start + rise + fall + 0.05);
      };
      const breath = (t0: number, inFreq: number, outFreq: number, peakIn: number, peakOut: number) => {
        seg(t0, inFreq, peakIn, 1.5, 0.7);
        seg(t0 + 2.35, outFreq, peakOut, 0.55, 1.75);
      };
      const t = ctx.currentTime + 0.25;
      breath(t, 640, 380, 0.085, 0.07);
      breath(t + 5.1, 600, 350, 0.055, 0.045);
      setTimeout(() => void ctx.close().catch(() => {}), 12000);
      return true;
    };

    const go = () => {
      if (done || !play()) return;
      done = true;
      try {
        sessionStorage.setItem("vv-breath", "1");
      } catch {}
      events.forEach((e) => window.removeEventListener(e, go));
    };
    events.forEach((e) => window.addEventListener(e, go, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, go));
  }, []);

  return null;
}
