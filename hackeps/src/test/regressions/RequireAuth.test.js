import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import RequireAuth from "src/modules/RequireAuth";
import { checkToken } from "src/services/AuthenticationService";
jest.mock("src/services/AuthenticationService");
jest.mock("react-router-dom", () => jest.requireActual("react-router-dom"));
let token;
beforeEach(() => {
  jest.clearAllMocks();
  token = null;
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: { getItem: (key) => (key === "userToken" ? token : null) },
  });
});
function LoginDestination() {
  const location = useLocation();
  return <p>Login destination: {location.state?.nextScreen}</p>;
}
function mount() {
  return render(
    <MemoryRouter initialEntries={["/perfil/42?tab=team"]}>
      <Routes>
        <Route
          path="/perfil/:id"
          element={
            <RequireAuth>
              <p>Protected content</p>
            </RequireAuth>
          }
        />
        <Route path="/login" element={<LoginDestination />} />
      </Routes>
    </MemoryRouter>,
  );
}
test("redirects anonymous visitors while preserving their destination", async () => {
  mount();
  expect(
    await screen.findByText("Login destination: /perfil/42?tab=team"),
  ).toBeInTheDocument();
  expect(checkToken).not.toHaveBeenCalled();
});
test("does not reveal protected content for error responses", async () => {
  token = "access";
  checkToken.mockResolvedValue({ errCode: 500 });
  mount();
  await screen.findByText("Login destination: /perfil/42?tab=team");
  expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
});
test("shows protected content after explicit authorization", async () => {
  token = "access";
  checkToken.mockResolvedValue({ success: true });
  mount();
  expect(await screen.findByText("Protected content")).toBeInTheDocument();
});
