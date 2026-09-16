import { forwardRef, useState } from "react";

const PasswordInput = forwardRef(({ visibilityLabel, ...props }, ref) => {
  const [visible, setVisible] = useState(false);

  return (
    <span className="password-input">
      <input aria-label={props.placeholder} {...props} ref={ref} type={visible ? "text" : "password"} />
      <button
        type="button"
        className="password-visibility-toggle"
        aria-label={`${visible ? "Amaga" : "Mostra"} ${visibilityLabel}`}
        aria-pressed={visible}
        onClick={() => setVisible((value) => !value)}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
          {visible && <path d="m3 3 18 18" />}
        </svg>
      </button>
    </span>
  );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
