import { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import "./BirthdatePicker.css";

const MONTHS = [
  "Gener",
  "Febrer",
  "Març",
  "Abril",
  "Maig",
  "Juny",
  "Juliol",
  "Agost",
  "Setembre",
  "Octubre",
  "Novembre",
  "Desembre",
];
const WEEKDAYS = ["Dl", "Dt", "Dc", "Dj", "Dv", "Ds", "Dg"];

export default function BirthdatePicker({
  value = "",
  onChange,
  onBlur,
  invalid,
}) {
  const formatDate = (date) =>
    date ? date.split("-").reverse().join("/") : "";
  const [draft, setDraft] = useState(() => formatDate(value));
  const [typingError, setTypingError] = useState(false);
  const lastEmitted = useRef(value);
  useEffect(() => {
    if (value !== lastEmitted.current) {
      setDraft(value ? value.split("-").reverse().join("/") : "");
      setTypingError(false);
      lastEmitted.current = value;
    }
  }, [value]);
  const emit = (date) => {
    lastEmitted.current = date;
    onChange(date);
  };
  const handleTyping = (event) => {
    const raw = event.target.value;
    const digits = raw.replace(/\D/g, "");
    setDraft(raw);
    let valid = false;
    if (digits.length === 8 && /^[\d/\s]+$/.test(raw)) {
      const day = Number(digits.slice(0, 2));
      const selectedMonth = Number(digits.slice(2, 4)) - 1;
      const selectedYear = Number(digits.slice(4));
      const date = new Date(selectedYear, selectedMonth, day);
      valid =
        selectedYear >= 1900 &&
        date <= new Date() &&
        date.getFullYear() === selectedYear &&
        date.getMonth() === selectedMonth &&
        date.getDate() === day;
      if (valid) {
        const iso = `${digits.slice(4)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`;
        setDraft(formatDate(iso));
        setYear(selectedYear);
        setMonth(selectedMonth);
        emit(iso);
      }
    }
    if (!valid) emit("");
    setTypingError(digits.length >= 8 && !valid);
  };
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(() =>
    value ? Number(value.slice(0, 4)) : today.getFullYear() - 14,
  );
  const [month, setMonth] = useState(() =>
    value ? Number(value.slice(5, 7)) - 1 : 0,
  );
  const trigger = useRef(null);
  const days = new Date(year, month + 1, 0).getDate();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;

  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  return (
    <div className="birthdate-picker">
      <div className="birthdate-field">
        <input
          id="birthdate"
          type="text"
          inputMode="numeric"
          autoComplete="bday"
          placeholder="DD/MM/AAAA"
          value={draft}
          onChange={handleTyping}
          onBlur={() => {
            setTypingError(Boolean(draft) && !lastEmitted.current);
            onBlur();
          }}
          aria-invalid={invalid || typingError}
          aria-describedby={
            typingError
              ? "birthdate-format-error"
              : invalid
                ? "birthdate-error"
                : undefined
          }
        />
        <button
          ref={trigger}
          aria-label="Obre el calendari"
          type="button"
          className="birthdate-trigger"
          aria-expanded={open}
          aria-haspopup="dialog"
          onBlur={onBlur}
          aria-controls="birthdate-calendar"
          aria-invalid={invalid}
          aria-describedby={invalid ? "birthdate-error" : undefined}
          onClick={() => setOpen(!open)}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M7 3v4m10-4v4M3 11h18" />
          </svg>
        </button>
      </div>
      {typingError && (
        <p
          id="birthdate-format-error"
          className="mt-2 text-red-400"
          role="alert"
        >
          Introdueix una data vàlida en format DD/MM/AAAA.
        </p>
      )}
      <Modal
        show={open}
        onHide={close}
        centered
        className="birthdate-modal"
        aria-label="Calendari de naixement"
      >
        <div id="birthdate-calendar" className="birthdate-calendar">
          <div className="birthdate-selects">
            <select
              autoFocus
              aria-label="Mes de naixement"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {MONTHS.map((name, index) => (
                <option key={name} value={index}>
                  {name}
                </option>
              ))}
            </select>
            <select
              aria-label="Any de naixement"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {Array.from(
                { length: today.getFullYear() - 1899 },
                (_, index) => today.getFullYear() - index,
              ).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="birthdate-days">
            {WEEKDAYS.map((day) => (
              <span className="birthdate-weekday" aria-hidden="true" key={day}>
                {day}
              </span>
            ))}
            {Array.from({ length: offset }, (_, index) => (
              <span aria-hidden="true" key={`empty-${index}`} />
            ))}
            {Array.from({ length: days }, (_, index) => {
              const day = index + 1;
              const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              return (
                <button
                  type="button"
                  key={day}
                  aria-label={`${day} de ${MONTHS[month].toLowerCase()} de ${year}`}
                  aria-pressed={value === date}
                  disabled={new Date(year, month, day) > today}
                  onClick={() => {
                    setDraft(formatDate(date));
                    setTypingError(false);
                    emit(date);
                    onBlur();
                    close();
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <p>Selecciona el mes, l’any i el dia.</p>
          <button type="button" className="birthdate-close" onClick={close}>
            Tanca el calendari
          </button>
        </div>
      </Modal>
    </div>
  );
}
