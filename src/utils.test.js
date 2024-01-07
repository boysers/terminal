// @vitest-environment jsdom
import { expect, describe, it } from "vitest";
import { createParagraphElement, formatDate, formatTime } from "./utils";

describe("utils function", () => {
  it("create my paragraph element", () => {
    const text = "my paragraph";
    const myParagraph = createParagraphElement(text);
    expect(myParagraph.textContent).eq(text);
  });

  it("formatted time", () => {
    const now = new Date(2024, 0, 6, 13, 3, 4);
    const formattedTime = formatTime(now);
    expect(formattedTime).eq("13:03:04");
  });

  it("formatted date", () => {
    const now = new Date(2024, 0, 6, 13, 3, 4);
    const formattedDate = formatDate(now);
    expect(formattedDate).eq("06/01/2024 13:03:04 UTC+1");
  });
});
