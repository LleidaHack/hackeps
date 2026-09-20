import React from "react";
import { render, screen, act } from "@testing-library/react";
import { timeUntil } from "src/modules/countdown";
import Waiting from "src/components/hackeps/Waiting/Waiting";

afterEach(() => {
  jest.useRealTimers();
});

describe("timeUntil", () => {
  // Local-time constructors keep these assertions the same in any timezone.
  test("counts real calendar months, not blocks of 30 days", () => {
    const now = new Date(2026, 8, 19, 10); // 19 Sep 10:00
    const target = new Date(2026, 10, 28); // 28 Nov 00:00
    // 19 Sep -> 19 Nov is two calendar months, then 8 days and 14 hours.
    // The old days / 30 arithmetic reported "2 mesos 10 dies" here.
    expect(timeUntil(target, now)).toEqual({ months: 2, days: 8, hours: 14 });
  });

  test("clamps to the end of shorter months", () => {
    const now = new Date(2026, 0, 31, 12); // 31 Jan
    const target = new Date(2026, 2, 31, 12); // 31 Mar
    expect(timeUntil(target, now).months).toBe(2);
  });

  test("returns null once the target has passed", () => {
    expect(
      timeUntil(new Date("2026-11-28"), new Date("2026-11-29")),
    ).toBeNull();
    expect(
      timeUntil(new Date("2026-11-28"), new Date("2026-11-28")),
    ).toBeNull();
  });
});

describe("Waiting page", () => {
  test("names the event and shows a live countdown", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-11-27T22:00:00+01:00"));
    render(<Waiting />);
    expect(
      screen.getByRole("heading", { level: 1, name: "HackEPS 2026" }),
    ).toBeInTheDocument();
    expect(screen.getByText("dies")).toBeInTheDocument();
    expect(screen.getByText("hores")).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(60 * 60 * 1000);
    });
    expect(screen.getByText("hora")).toBeInTheDocument();
  });

  test("ticks once a minute, not once a second", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-09-19T10:00:00+02:00"));
    const interval = jest.spyOn(global, "setInterval");
    const { unmount } = render(<Waiting />);
    expect(interval).toHaveBeenCalledWith(expect.any(Function), 60000);
    unmount();
    expect(jest.getTimerCount()).toBe(0);
    interval.mockRestore();
  });

  test("does not show a zero countdown once the event is running or over", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-11-28T12:00:00+01:00"));
    const { unmount } = render(<Waiting />);
    expect(screen.getByText(/està en marxa/)).toBeInTheDocument();
    expect(screen.queryByText("hores")).not.toBeInTheDocument();
    unmount();

    jest.setSystemTime(new Date("2026-12-10T12:00:00+01:00"));
    render(<Waiting />);
    expect(screen.getByText(/ja s'ha celebrat/)).toBeInTheDocument();
  });
});
