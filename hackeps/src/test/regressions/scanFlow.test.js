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
