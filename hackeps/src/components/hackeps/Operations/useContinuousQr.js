import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import { createScanGate } from "./scanFlow";

export default function useContinuousQr(enabled, onRead) {
  const video = useRef(null);
  const callback = useRef(onRead);
  callback.current = onRead;
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let active = true,
      controls;
    const gate = createScanGate();
    setError("");
    const reader = new BrowserQRCodeReader();
    reader
      .decodeFromConstraints(
        { video: { facingMode: "environment" }, audio: false },
        video.current,
        (result) => {
          if (!active || document.hidden) return;
          const code = result?.getText()?.trim() || "";
          if (gate.observe(code, Date.now())) callback.current(code);
        },
      )
      .then((value) => {
        if (active) controls = value;
        else value.stop();
      })
      .catch(() => {
        if (active)
          setError(
            "No es pot obrir la càmera. Permet-ne l’accés i torna-ho a provar, o introdueix el codi manualment.",
          );
      });
    return () => {
      active = false;
      controls?.stop();
    };
  }, [enabled, attempt]);
  return { video, error, retry: () => setAttempt((value) => value + 1) };
}
