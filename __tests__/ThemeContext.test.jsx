import { describe, it, expect } from "vitest";
import React, { act, useContext } from "react";
import { render, screen } from "@testing-library/react";
import { ThemeContext, ThemeProvider } from "@/context/ThemeContext";

function Consumer() {
  const context = useContext(ThemeContext);

  return React.createElement(
    "div",
    { "data-testid": "theme-state" },
    context ? context.colorScheme : "missing",
  );
}

describe("ThemeContext", () => {
  it("provides a default light theme to children", async () => {
    await act(async () => {
      render(
        React.createElement(ThemeProvider, null, React.createElement(Consumer)),
      );
    });

    expect(screen.getByTestId("theme-state").textContent).toBe("light");
  });

  it("exposes the theme API shape", async () => {
    let snapshot = null;

    function Probe() {
      const context = useContext(ThemeContext);
      snapshot = context;
      return null;
    }

    await act(async () => {
      render(
        React.createElement(ThemeProvider, null, React.createElement(Probe)),
      );
    });

    expect(snapshot).toBeTruthy();
    expect(snapshot.colorScheme).toBe("light");
    expect(typeof snapshot.setColorScheme).toBe("function");
    expect(snapshot.theme).toBeTruthy();
  });

  it("returns a missing context value when used without provider", () => {
    function Probe() {
      const context = useContext(ThemeContext);
      return React.createElement(
        "div",
        { "data-testid": "no-provider" },
        context ? "has-context" : "no-context",
      );
    }

    render(React.createElement(Probe));
    expect(screen.getByTestId("no-provider").textContent).toBe("no-context");
  });
});
