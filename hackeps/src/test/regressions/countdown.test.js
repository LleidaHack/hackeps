import React from "react";
import { render, screen, act } from "@testing-library/react";
import HomeCountdown from "src/components/hackeps/Home/HomeCountdown";
import Timer from "src/components/hackeps/Home/Timer";
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2026-11-22T10:00:00Z"));
});
afterEach(() => {
  jest.useRealTimers();
});
test("counts toward the start immediately, then toward the end", () => {
  const { container } = render(
    <HomeCountdown
      startTime={new Date("2026-11-22T11:00:00Z")}
      endTime={new Date("2026-11-23T11:00:00Z")}
      timerActive
    />,
  );
  expect(container.textContent).toBe("0mesos0dies1hora");
  act(() => {
    jest.advanceTimersByTime(3601000);
  });
  expect(container.textContent).toBe("0mesos0dies23hores");
});
test("does not restart the timer on each tick", () => {
  const interval = jest.spyOn(global, "setInterval");
  const { unmount } = render(<HomeCountdown timerActive />);
  act(() => {
    jest.advanceTimersByTime(3000);
  });
  expect(interval).toHaveBeenCalledTimes(1);
  unmount();
  expect(jest.getTimerCount()).toBe(0);
  interval.mockRestore();
});
test("uses the actual minute and second counts for legacy timer labels", () => {
  render(
    <Timer
      startTime={new Date("2026-11-22T10:01:01Z")}
      endTime={new Date("2026-11-23T11:00:00Z")}
      timerActive
    />,
  );
  expect(screen.getByText("minut")).toBeInTheDocument();
  expect(screen.getByText("segon")).toBeInTheDocument();
});
