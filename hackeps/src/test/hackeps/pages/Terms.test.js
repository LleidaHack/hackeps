import React from "react";
import { render, screen } from "@testing-library/react";
import Terms from "src/pages/hackeps/Terms";
import { MemoryRouter } from "react-router-dom";

describe("Terms - Render", () => {
  test(`renders without crashing + header and footer.`, async () => {
    render(
      <MemoryRouter>
        <Terms />
      </MemoryRouter>,
    );

    // Verifica que tenim el footer i el header
    const footerElement = screen.getByTestId("launchFooterHackeps");
    expect(footerElement).toBeInTheDocument();
    const headerElement = screen.getByTestId("launchHeaderHackeps");
    expect(headerElement).toBeInTheDocument();
  });
});
