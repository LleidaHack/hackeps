import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { memberSince } from "src/modules/memberSince";
import { readUpload } from "src/modules/uploads";
import { shufflePhotos } from "src/components/hackeps/Home/Records";
import Inscripcio from "src/components/hackeps/Inscripcio/Inscripcio";
import DatesHorari from "src/components/hackeps/Dates/DatesHorari";
import {
  getHackeps,
  getEventIsHackerRegistered,
  getEventRegistration,
} from "src/services/EventService";
import { getHackerById } from "src/services/HackerService";

jest.mock("src/services/EventService");
jest.mock("src/services/HackerService");

beforeEach(() => {
  jest.clearAllMocks();
  getHackeps.mockResolvedValue({
    id: 26,
    is_open: true,
    start_date: "2026-11-28T08:30:00+01:00",
    end_date: "2026-11-29T16:00:00+01:00",
  });
});

test("registration fills the existing account fields, but never accepts terms for the user", async () => {
  getHackerById.mockResolvedValue({
    id: 1,
    github: "https://github.com/test",
    linkedin: "https://linkedin.com/in/test",
    shirt_size: "XL",
    studies: "Informàtica",
    study_center: "UdL",
    location: "Lleida",
    food_restrictions: "Gluten",
    how_did_you_meet_us: "Un amic",
  });
  getEventIsHackerRegistered.mockResolvedValue(false);
  render(<Inscripcio />);
  await waitFor(() =>
    expect(screen.getByLabelText("Github:")).toHaveValue(
      "https://github.com/test",
    ),
  );
  expect(screen.getByRole("combobox", { name: "Talla de samarreta:" })).toHaveValue("XL");
  expect(screen.getByPlaceholderText("Estudis")).toHaveValue("Informàtica");
  expect(screen.getByPlaceholderText("Lactosa, gluten, etc.")).toHaveValue(
    "Gluten",
  );
  expect(screen.getByLabelText(/Accepto els/)).not.toBeChecked();
});

test("schedule distinguishes the same hour on Saturday and Sunday", async () => {
  render(<DatesHorari />);
  await screen.findByText("Inici del check-in");
  expect(screen.getByText("Finalitza el temps de hacking")).toBeInTheDocument();
  expect(
    document.querySelectorAll('time[datetime^="2026-11-28"]'),
  ).toHaveLength(4);
  expect(
    document.querySelectorAll('time[datetime^="2026-11-29"]'),
  ).toHaveLength(3);
  expect(screen.queryByText("Exemple")).not.toBeInTheDocument();
});

test("new and future timestamps do not display spurious days of membership", () => {
  const now = Date.parse("2026-09-20T10:00:00Z");
  expect(memberSince("2026-09-20T09:59:00", now)).toBe("Membre des d’avui");
  expect(memberSince("2026-09-21T09:00:00Z", now)).toBe("Membre des d’avui");
  expect(memberSince("2026-09-19T09:59:00Z", now)).toBe(
    "Membre des de fa 1 dia",
  );
});

test("shuffle retains every photo exactly once and does not mutate source order", () => {
  const source = [1, 2, 3, 4];
  const mixed = shufflePhotos(source, () => 0);
  expect(mixed).not.toEqual(source);
  expect([...mixed].sort()).toEqual(source);
  expect(source).toEqual([1, 2, 3, 4]);
});

test("file selection rejects SVG, spoofed types and files over 1 MiB", async () => {
  await expect(
    readUpload(
      new File(["<svg/>"], "a.svg", { type: "image/svg+xml" }),
      "image",
    ),
  ).rejects.toThrow(/JPG/);
  await expect(
    readUpload(
      new File(["<script>alert(1)</script>"], "a.png", { type: "image/png" }),
      "image",
    ),
  ).rejects.toThrow(/contingut/);
  await expect(
    readUpload(
      new File([new Uint8Array(1024 * 1024 + 1)], "a.jpg", {
        type: "image/jpeg",
      }),
      "image",
    ),
  ).rejects.toThrow(/1 MB/);
  await expect(
    readUpload(
      new File(["<!doctype html>"], "a.pdf", { type: "application/pdf" }),
      "cv",
    ),
  ).rejects.toThrow(/contingut/);
});

test("editing a registration preserves event-specific experience instead of resetting it to the account", async () => {
  getHackerById.mockResolvedValue({ id: 1, shirt_size: "M", github: "old-profile" });
  getEventIsHackerRegistered.mockResolvedValue(true);
  getEventRegistration.mockResolvedValue({ event_id: 26, user_id: 1, shirt_size: "XL", github: "event-github", description: "Projecte de robòtica", food_restrictions: "" });
  render(<Inscripcio />);
  await waitFor(() => expect(screen.getByLabelText("Github:")).toHaveValue("event-github"));
  expect(screen.getByRole("combobox", { name: "Talla de samarreta:" })).toHaveValue("XL");
  expect(screen.getByPlaceholderText(/Explica'ns/)).toHaveValue("Projecte de robòtica");
});
