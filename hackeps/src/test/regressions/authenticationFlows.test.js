import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginForm from "src/components/loginForm/LoginForm";
import Contact from "src/components/hackeps/Contacte/Contacte";
import Mentor from "src/components/hackeps/Contacte/ContacteMentor";
import ForgetPassword from "src/components/hackeps/ForgetPassword/ForgetPassword";
import {
  login,
  contacte,
  resetPassword,
} from "src/services/AuthenticationService";
const mockNavigate = jest.fn();
jest.mock("src/services/AuthenticationService");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));
const mount = (Component) =>
  render(
    <MemoryRouter>
      <Component />
    </MemoryRouter>,
  );
const change = (label, value) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
beforeEach(() => {
  jest.clearAllMocks();
});

test.each([
  { errCode: 500 },
  { errCode: -1 },
  new SyntaxError("Invalid JSON"),
  null,
])("login does not navigate for a failed response", async (result) => {
  login.mockResolvedValue(result);
  const { container } = mount(LoginForm);
  change(/Correu:/, "audit@example.test");
  change(/Contrasenya:/, "ExamplePassword42");
  fireEvent.submit(container.querySelector("form"));
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent("No hem pogut iniciar"),
  );
  expect(mockNavigate).not.toHaveBeenCalled();
});
test("login navigates only on validated credentials", async () => {
  login.mockResolvedValue({
    access_token: "access",
    refresh_token: "refresh",
    user_id: 42,
  });
  const { container } = mount(LoginForm);
  change(/Correu:/, "audit@example.test");
  change(/Contrasenya:/, "ExamplePassword42");
  fireEvent.submit(container.querySelector("form"));
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/perfil"));
});
test.each([
  { errCode: 500 },
  new SyntaxError("Invalid JSON"),
  { success: false },
])("contact never reports success for a failed response", async (result) => {
  contacte.mockResolvedValue(result);
  const { container } = mount(Contact);
  change(/Nom:/, "Audit");
  change(/E-mail:/, "audit@example.test");
  change(/Títol:/, "Test");
  change(/Missatge:/, "Test message");
  fireEvent.submit(container.querySelector("form"));
  await screen.findByText("Error enviant el teu missatge.");
  expect(
    screen.queryByText("Missatge enviat correctament."),
  ).not.toBeInTheDocument();
});
test("mentor does not report a rejected application as sent", async () => {
  contacte.mockResolvedValue({ errCode: 500 });
  const { container } = mount(Mentor);
  change(/Nom complet/, "Audit");
  change(/Correu electrònic/, "audit@example.test");
  change(/Àrea d'especialització/, "frontend");
  change(/Anys d'experiència/, "2-3");
  change(/Experiència prèvia/, "Experience");
  change(/Motivació/, "Motivation");
  change(/Disponibilitat/, "Available");
  fireEvent.click(screen.getByRole("checkbox", { name: /Accepto els/ }));
  fireEvent.submit(container.querySelector("form"));
  await screen.findByText("Error enviant el teu missatge.");
});
test("password recovery keeps the form available on failure", async () => {
  resetPassword.mockResolvedValue({ errCode: -2 });
  const { container } = mount(ForgetPassword);
  change(/Introdueix el teu correu/, "audit@example.test");
  fireEvent.submit(container.querySelector("form"));
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent(
      "No hem pogut tramitar",
    ),
  );
  expect(screen.queryByText("Sol·licitud rebuda")).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Enviar enllaç de recuperació" }),
  ).toBeEnabled();
});
