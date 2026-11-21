import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HackerStepperForm } from "src/components/hackeps/Forms/HackerForm";
import { signupHacker } from "src/services/HackerService";

jest.mock("src/services/HackerService", () => ({ signupHacker: jest.fn() }));

test("requires explicit MLH consent and sends it with the participant", async () => {
  signupHacker.mockResolvedValue({ errCode: 500 });
  const { container } = render(
    <MemoryRouter>
      <HackerStepperForm />
    </MemoryRouter>,
  );
  const change = (placeholder, value) =>
    fireEvent.change(screen.getByPlaceholderText(placeholder), {
      target: { value },
    });
  change("Nom", "Test");
  change("Cognoms", "Participant");
  change("Contrasenya", "TestPassword123");
  change("Confirma la contrasenya", "TestPassword123");
  fireEvent.click(screen.getByRole("button", { name: "Obre el calendari" }));
  fireEvent.change(screen.getByLabelText("Any de naixement"), {
    target: { value: "2000" },
  });
  fireEvent.change(screen.getByLabelText("Mes de naixement"), {
    target: { value: "1" },
  });
  fireEvent.click(screen.getByRole("button", { name: "29 de febrer de 2000" }));
  fireEvent.click(screen.getByRole("button", { name: "Següent" }));
  await screen.findByPlaceholderText("Àlies");
  change("Àlies", "test-participant");
  change("Telèfon", "600000001");
  change("Correu electrònic", "test@example.test");
  fireEvent.click(
    screen.getByRole("checkbox", { name: /termes i condicions/ }),
  );

  const consent = screen.getByRole("checkbox", {
    name: /codi de conducta de MLH/,
  });
  expect(consent).not.toBeChecked();
  expect(consent).toHaveAttribute("aria-required", "true");
  expect(
    screen.getByRole("link", { name: /codi de conducta de MLH/ }),
  ).toHaveAttribute(
    "href",
    "https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md",
  );
  expect(screen.getByRole("button", { name: "Enviar" })).toBeDisabled();
  fireEvent.submit(container.querySelector("form"));
  expect(
    await screen.findByText("Has d'acceptar el codi de conducta de MLH"),
  ).toBeInTheDocument();
  expect(signupHacker).not.toHaveBeenCalled();

  fireEvent.click(consent);
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Enviar" })).toBeEnabled(),
  );
  fireEvent.click(consent);
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Enviar" })).toBeDisabled(),
  );
  fireEvent.click(consent);
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Enviar" })).toBeEnabled(),
  );
  fireEvent.click(screen.getByRole("button", { name: "Enviar" }));
  await waitFor(() => expect(signupHacker).toHaveBeenCalledTimes(1));
  expect(signupHacker).toHaveBeenCalledWith(
    expect.objectContaining({
      config: expect.objectContaining({ mlh_code_of_conduct: true }),
    }),
  );
  await screen.findByText("No hem pogut crear el compte. Torna-ho a provar.");
});
