import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HackerStepperForm } from "src/components/hackeps/Forms/HackerForm";
const mount = (Component) =>
  render(
    <MemoryRouter>
      <Component />
    </MemoryRouter>,
  );
const change = (label, value) =>
  fireEvent.change(screen.getByRole("textbox", { name: label }), { target: { value } });

test("signup displays errors for the actual first and last name fields", async () => {
  mount(HackerStepperForm);
  change(/^Nom:/, "Test");
  change(/^Nom:/, "");
  change(/^Cognoms:/, "Test");
  change(/^Cognoms:/, "");
  expect(
    await screen.findByText("El nom no pot estar buit"),
  ).toBeInTheDocument();
  expect(
    await screen.findByText("Els cognoms no pot estar buit"),
  ).toBeInTheDocument();
});
