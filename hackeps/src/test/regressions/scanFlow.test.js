import { loginDestination } from "src/modules/loginDestination";
import {
  createScanGate,
  readyToScan,
} from "src/components/hackeps/Operations/scanFlow";
test("volunteers always land in the scanner while participant deep links survive", () => {
  expect(loginDestination({ access_role: "lleidahacker" }, "/perfil")).toBe(
    "/organitzacio",
  );
  expect(loginDestination({ type: "lleida_hacker" }, "/perfil")).toBe(
    "/organitzacio",
  );
  expect(
    loginDestination({ access_role: "participant" }, "/perfil/equip"),
  ).toBe("/perfil/equip");
});
test("a QR rearms only after it has disappeared", () => {
  const gate = createScanGate();
  expect(gate.observe("A", 100)).toBe(true);
  expect(gate.observe("A", 5000)).toBe(false);
  gate.observe("", 6500);
  expect(gate.observe("A", 6600)).toBe(true);
});
test("a closed round or missing target cannot auto-submit", () => {
  const data = { meals: [{ id: 1 }], meal_rounds: { 1: { open: false } } };
  expect(readyToScan({ kind: "meal", target: "1" }, data)).toBe(false);
  expect(readyToScan({ kind: "meal", target: "" }, data)).toBe(false);
});

test("a QR seen while blocked is not consumed by the stationary-code gate", () => {
  const gate = createScanGate();
  expect(gate.observe("A", 100)).toBe(true);
  expect(gate.observe("B", 200, () => false)).toBe(false);
  expect(gate.observe("B", 300, () => true)).toBe(true);
  expect(gate.observe("B", 400)).toBe(false);
});

test("only the configured activity asks for a time", () => {
  const {
    isTimedActivity,
    durationMilliseconds,
  } = require("src/components/hackeps/Operations/scanFlow");
  const data = { activities: [{ id: "bull", timed: true }, { id: "plain" }] };
  expect(isTimedActivity({ kind: "activity", target: "bull" }, data)).toBe(
    true,
  );
  expect(isTimedActivity({ kind: "activity", target: "plain" }, data)).toBe(
    false,
  );
  expect(isTimedActivity({ kind: "meal", target: "bull" }, data)).toBe(false);
  expect(durationMilliseconds("24,35")).toBe(24350);
  expect(durationMilliseconds("1.001")).toBe(1001);
  for (const value of ["", "0", "-1", "Infinity", "3e2", "1.0001", "3600.001"])
    expect(durationMilliseconds(value)).toBeNull();
});
