import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ContacteMentor from "src/components/hackeps/Contacte/ContacteMentor";
import { contacte } from "src/services/AuthenticationService";

jest.mock("src/services/AuthenticationService");

// Mentor applications are closed for HackEPS 2026: the page must not offer a
// form or send anything.
test("closed mentor applications show a notice without a form", () => {
  const { container } = render(
    <MemoryRouter>
      <ContacteMentor />
    </MemoryRouter>,
  );
  expect(
    screen.getByRole("heading", { name: "Inscripcions de mentors tancades" }),
  ).toBeInTheDocument();
  expect(container.querySelector("form")).toBeNull();
  expect(screen.getByRole("link", { name: "Torna a l’inici" })).toHaveAttribute(
    "href",
    "/",
  );
  expect(contacte).not.toHaveBeenCalled();
});
