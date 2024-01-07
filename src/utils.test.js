// @vitest-environment jsdom
import { expect, describe, it } from "vitest";
import {
  createParagraphElement,
  formatDate,
  formatTime,
  insertParagraphElementWithText,
} from "./utils";

describe("createParagraphElement", () => {
  it("creates a paragraph element with specified text", () => {
    const myParagraphText = "My paragraph";
    const paragraphElement = createParagraphElement(myParagraphText);
    expect(paragraphElement.textContent).eq(myParagraphText);
  });

  it("handles empty text", () => {
    const emptyText = "";
    const emptyParagraphElement = createParagraphElement(emptyText);
    expect(emptyParagraphElement.textContent).eq(emptyText);
  });
});

describe("insertParagraphElementWithText", () => {
  it("inserts paragraph element with text into the parent element", () => {
    const text = "Test text";
    const parentElement = document.createElement("div");

    insertParagraphElementWithText(text, parentElement);

    expect(parentElement.childNodes.length).eq(1);
    expect(parentElement.childNodes[0].textContent).eq(text);
  });

  it("inserts multiple paragraph elements into the parent element", () => {
    const texts = ["First paragraph", "Second paragraph", "Third paragraph"];
    const parentElement = document.createElement("div");

    texts.forEach((text) => insertParagraphElementWithText(text, parentElement));

    expect(parentElement.childNodes.length).eq(texts.length);
    texts.forEach((text, index) => {
      expect(parentElement.childNodes[index].textContent).eq(text);
    });
  });
});

describe("formatTime", () => {
  it("formats time correctly", () => {
    const mockedNow = new Date(2024, 0, 6, 13, 3, 4);
    const formattedTime = formatTime(mockedNow);
    expect(formattedTime).eq("13:03:04");
  });

  it("formats time correctly for midnight", () => {
    const mockedMidnightNow = new Date(2024, 0, 7, 0, 0, 0);
    const formattedTime = formatTime(mockedMidnightNow);
    expect(formattedTime).eq("00:00:00");
  });
});

describe("formatDate", () => {
  it("formats date correctly", () => {
    const mockedNow = new Date(2024, 0, 6, 13, 3, 4);
    const formattedDate = formatDate(mockedNow);
    expect(formattedDate).eq("06/01/2024 13:03:04 UTC+1");
  });
});
