import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BirthdatePicker from "src/components/hackeps/Forms/BirthdatePicker";
import SuccessFeedback from "src/components/hackeps/Feedbacks/SuccesFeedback";

test("selects leap day in ISO format and restores trigger focus", async () => {
  const onChange = jest.fn();
  render(<BirthdatePicker onChange={onChange} onBlur={() => {}} />);
  const trigger = screen.getByRole("button", { name: "Obre el calendari" });
  fireEvent.click(trigger);
  fireEvent.change(screen.getByLabelText("Any de naixement"), {
    target: { value: "2000" },
  });
  fireEvent.change(screen.getByLabelText("Mes de naixement"), {
    target: { value: "1" },
  });
  fireEvent.click(screen.getByRole("button", { name: "29 de febrer de 2000" }));
  expect(onChange).toHaveBeenCalledWith("2000-02-29");
  await waitFor(() => expect(trigger).toHaveFocus());
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
});

test("does not offer an invalid leap day and Escape cancels without changing the date", async () => {
  const onChange = jest.fn();
  render(
    <BirthdatePicker
      value="2001-02-20"
      onChange={onChange}
      onBlur={() => {}}
    />,
  );
  const trigger = screen.getByRole("button", { name: "Obre el calendari" });
  fireEvent.click(trigger);
  expect(
    screen.queryByRole("button", { name: "29 de febrer de 2001" }),
  ).not.toBeInTheDocument();
  fireEvent.keyDown(document, { key: "Escape", keyCode: 27 });
  expect(onChange).not.toHaveBeenCalled();
  await waitFor(() => expect(trigger).toHaveFocus());
});

test("registration confirmation provides one accessible login link", () => {
  jest.spyOn(window, "scrollTo").mockImplementation(() => {});
  render(
    <MemoryRouter>
      <SuccessFeedback
        title="Compte creat"
        text="Confirma el teu correu."
        hasButton
        buttonLink="/login"
        buttonText="Inicia sessió"
      />
    </MemoryRouter>,
  );
  expect(
    screen.getByRole("heading", { name: "Compte creat" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Inicia sessió" })).toHaveAttribute(
    "href",
    "/login",
  );
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  window.scrollTo.mockRestore();
});

test("formats compact typed dates and clears stale values for invalid dates", () => {
  const onChange = jest.fn();
  render(<BirthdatePicker onChange={onChange} onBlur={() => {}} />);
  const input = screen.getByRole("textbox");
  fireEvent.change(input, { target: { value: "15072005" } });
  expect(input).toHaveValue("15/07/2005");
  expect(onChange).toHaveBeenLastCalledWith("2005-07-15");
  fireEvent.change(input, { target: { value: "31022005" } });
  expect(onChange).toHaveBeenLastCalledWith("");
  expect(screen.getByRole("alert")).toBeInTheDocument();
  fireEvent.change(input, { target: { value: "29/02/2000" } });
  expect(onChange).toHaveBeenLastCalledWith("2000-02-29");
  fireEvent.change(input, { target: { value: "" } });
  expect(onChange).toHaveBeenLastCalledWith("");
});
