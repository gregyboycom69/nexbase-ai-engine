import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { OfficeExplorer } from "./office-explorer";

describe("Virtual Office", () => {
  it("zooms, pans and resets the camera through keyboard-accessible buttons", () => {
    const { container } = render(<OfficeExplorer />);
    const camera = container.querySelector("[data-office-camera]");
    expect(camera).toHaveStyle({ transform: "translate(0px, 0px) scale(1)" });

    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    fireEvent.click(screen.getByRole("button", { name: "Pan right" }));
    expect(camera).toHaveStyle({ transform: "translate(-36px, 0px) scale(1.25)" });

    fireEvent.click(screen.getByRole("button", { name: "Reset view" }));
    expect(camera).toHaveStyle({ transform: "translate(0px, 0px) scale(1)" });
  });

  it("retains room details when switching to the scene-free directory", () => {
    const { container } = render(<OfficeExplorer />);
    const rooms = screen.getByRole("group", { name: "Room directory" });
    const studio = within(rooms).getByRole("button", { name: "Creative Studio" });

    fireEvent.click(studio);
    expect(screen.getByRole("heading", { name: "Creative Studio" })).toBeVisible();
    const simpleView = screen.getByRole("button", { name: "Simple view" });
    fireEvent.click(simpleView);

    expect(simpleView).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("button", { name: "Zoom in" })).toBeNull();
    expect(container.querySelector("[data-office-camera]")).toBeNull();
    expect(studio).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(within(rooms).getByRole("button", { name: "Meeting Room" }));
    expect(screen.getByRole("heading", { name: "Meeting Room" })).toBeVisible();
  });
});
