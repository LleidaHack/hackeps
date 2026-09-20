import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ContacteMentor from "src/components/hackeps/Contacte/ContacteMentor";
import { contacte } from "src/services/AuthenticationService";

jest.mock("src/services/AuthenticationService");

test("mentor applications require explicit acceptance of terms before sending", async () => {
  contacte.mockResolvedValue({ success: true });
  const { container } = render(<MemoryRouter><ContacteMentor /></MemoryRouter>);
  const values = {
    name: "Mentor de prova", email: "mentor@example.com", specialization: "frontend",
    experience: "2-3", mentorExperience: "Tallers universitaris", motivation: "Ajudar els equips",
    availability: "Dissabte al matí",
  };
  for (const [name, value] of Object.entries(values)) {
    fireEvent.change(container.querySelector(`[name="${name}"]`), { target: { value } });
  }
  const terms = screen.getByRole("checkbox", { name: /Accepto els/ });
  expect(terms).not.toBeChecked();
  expect(terms).toHaveAttribute("aria-required", "true");
  expect(container.querySelector('[name="company"]')).not.toHaveAttribute("aria-required");
  fireEvent.click(screen.getByRole("button", { name: "Enviar candidatura" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Has d'acceptar els termes i condicions");
  expect(contacte).not.toHaveBeenCalled();
  expect(screen.getByRole("link", { name: "termes i condicions" })).toHaveAttribute("href", "/terms");
  fireEvent.click(terms);
  fireEvent.click(screen.getByRole("button", { name: "Enviar candidatura" }));
  await waitFor(() => expect(contacte).toHaveBeenCalledTimes(1));
});
