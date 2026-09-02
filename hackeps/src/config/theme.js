/**
 * Configuració del fons dia / nit de la web (Home, Dates i Horari, etc.).
 *
 * enabled:
 *   true  → el sistema està actiu (si mode és "auto", usa les hores)
 *   false → s'ignora el rellotge i es queda en `fallbackMode`
 *
 * mode:
 *   "auto"  → dia entre dayStartsAt i nightStartsAt, nit la resta
 *   "day"   → sempre dia
 *   "night" → sempre nit
 */
export const THEME_CONFIG = {
  enabled: true,
  mode: "auto",
  fallbackMode: "day",
  dayStartsAt: "07:00",
  nightStartsAt: "20:00",
  day: {
    sky: "#94cbf5",
    text: "#2e2e2e",
    gradient:
      "linear-gradient(180deg, #94CBF5 0%, #65A9DD 18%, #4A8FC4 42%, #365B77 70%, #2E2E2E 100%)",
  },
  night: {
    sky: "#2c465e",
    text: "#f5f5f5",
    gradient:
      "linear-gradient(180deg, #2c465e 0%, #1a3044 35%, #15202b 70%, #0f1419 100%)",
  },
};

function parseMinutes(hhmm) {
  const [hours, minutes] = hhmm.split(":").map(Number);
  return hours * 60 + minutes;
}

export function getActiveThemeMode(now = new Date()) {
  const { enabled, mode, fallbackMode } = THEME_CONFIG;

  if (!enabled) {
    return fallbackMode === "night" ? "night" : "day";
  }

  if (mode === "day" || mode === "night") {
    return mode;
  }

  const current = now.getHours() * 60 + now.getMinutes();
  const dayStart = parseMinutes(THEME_CONFIG.dayStartsAt);
  const nightStart = parseMinutes(THEME_CONFIG.nightStartsAt);

  if (dayStart === nightStart) {
    return fallbackMode === "night" ? "night" : "day";
  }

  if (dayStart < nightStart) {
    return current >= dayStart && current < nightStart ? "day" : "night";
  }

  return current >= dayStart || current < nightStart ? "day" : "night";
}

export function getTheme(now = new Date()) {
  const activeMode = getActiveThemeMode(now);
  return {
    mode: activeMode,
    ...THEME_CONFIG[activeMode],
  };
}
