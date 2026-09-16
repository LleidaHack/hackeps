import React from "react";
import { render, screen } from "@testing-library/react";
import ProfileHighlights from "src/components/hackeps/Profile/ProfileHighlights";

test("highlights only the event dates including leap day", () => {
  render(
    <ProfileHighlights
      event={{
        start_date: "2028-02-28T09:00:00",
        end_date: "2028-02-29T18:00:00",
      }}
    />,
  );
  expect(screen.getByLabelText("28, HackEPS")).toBeInTheDocument();
  expect(screen.getByLabelText("29, HackEPS")).toBeInTheDocument();
  expect(screen.queryByLabelText("27, HackEPS")).not.toBeInTheDocument();
  expect(
    screen.getByText("Les medalles encara no estan disponibles."),
  ).toBeInTheDocument();
});

test("does not invent event dates when none are available", () => {
  render(<ProfileHighlights event={{}} />);
  expect(
    screen.getByText("Dates de l’esdeveniment pendents."),
  ).toBeInTheDocument();
  expect(screen.queryByLabelText(/HackEPS/)).not.toBeInTheDocument();
});
