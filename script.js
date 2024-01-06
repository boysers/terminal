import { createParagraphElement, formatTime, formatDate } from "./utils.js";

const terminalElement = document.querySelector("#terminal");
const terminalHistoryElement = document.querySelector("#terminal-history");
const commandPromptElement = document.querySelector("#command-prompt");
const commandPromptSaveElement = document.querySelector("#command-prompt-save");

const initialCommandPrompt = `:\u003E`;
const initialCommandPromptLength = initialCommandPrompt.length;

const historyCommands = [];
let commandPromptIndex = -1;

const commands = new Map([
  ["help", displayHelp],
  ["time", displayTime],
  ["date", displayDate],
  ["clear", clearTerminal],
  ["history", displayHistoryCommands],
  ["version", displayOsVersion],
]);

const commandNotFoundErrorTemplate = `'%command%' n’est pas reconnu en tant que commande.`;
const osVersion = `Terminal UI v1`;

/** @param {string} text */
function insertParagraphElement(text) {
  const paragraph = createParagraphElement(text);
  terminalHistoryElement.appendChild(paragraph);
}

/** @param {string} commandName */
function processUserInput(commandName) {
  const userInputValue = commandPromptElement.textContent.substring(initialCommandPromptLength);

  if (!commandName.trim()) return;

  insertParagraphElement(userInputValue);
  handleCommand(commandName);
}

function displayHelp() {
  commands.forEach((_command, commandName) => insertParagraphElement(commandName));
  insertSpaceParagraph();
}

/** @param {string} commandName */
function displayCommandNotFound(commandName) {
  const commandnotFoundError = commandNotFoundErrorTemplate.replace("%command%", commandName);
  insertParagraphElement(commandnotFoundError);
  insertSpaceParagraph();
}

function displayHistoryCommands() {
  [...historyCommands].reverse().forEach((command) => insertParagraphElement(command));
  insertSpaceParagraph();
}

function displayOsVersion() {
  insertOsVersionParagraph();
}

function displayTime() {
  const now = new Date();
  const time = formatTime(now);
  insertParagraphElement(time);
}

function displayDate() {
  const now = new Date();
  const date = formatDate(now);
  insertParagraphElement(date);
}

/** @param {string} commandName */
function handleCommand(commandName) {
  const executeCommand = commands.get(commandName.toLowerCase());

  if (!executeCommand) {
    displayCommandNotFound(commandName);
    return;
  }

  executeCommand();
}

function insertOsVersionParagraph() {
  insertParagraphElement(osVersion);
}

function clearTerminal() {
  terminalHistoryElement.innerHTML = "";
  insertSpaceParagraph();
}

function insertSpaceParagraph() {
  insertParagraphElement("\u00A0");
}

function insertCommandPrompt() {
  insertParagraphElement(commandPromptElement.textContent);
  commandPromptElement.textContent = initialCommandPrompt;
  commandPromptSaveElement.textContent = initialCommandPrompt;
}

/** @param {string} commandInput */
function parseCommandInput(commandInput) {
  const [commandName, ...params] = commandInput.trim().split(/\s+/);
  return { commandName, params };
}

function adjustVerticalBarPosition() {
  const styleSheet = document.styleSheets[0];
  const position = commandPromptSaveElement.clientWidth;
  styleSheet.insertRule(
    `#command-prompt::after { left: ${position}px; }`,
    styleSheet.cssRules.length
  );
}

function addToHitoryCommand(commandInput) {
  if (historyCommands[0] !== commandInput && commandInput !== "") {
    historyCommands.unshift(commandInput);
  }
}

/** @param {string} code */
function handleCtrlKey(code) {
  switch (code) {
    case "KeyC":
      handleCtrlKeyC();
      break;
    case "KeyV":
      handleCtrlKeyV();
      break;
  }
}

/** @param {KeyboardEvent} event */
function handleKeyDown(event) {
  const { key, code, ctrlKey } = event;
  commandPromptElement.classList.add("no-animation");

  if (ctrlKey) {
    handleCtrlKey(code);
    scrollToBottom();
    return;
  }

  switch (code) {
    case "ArrowLeft":
      handleArrowLeft();
      break;
    case "ArrowRight":
      handleArrowRight();
      break;
    case "ArrowUp":
      event.preventDefault();
      handleArrowUp();
      break;
    case "ArrowDown":
      event.preventDefault();
      handleArrowDown();
      break;
    case "Enter":
    case "NumpadEnter":
      handleEnter();
      break;
    case "Backspace":
      handleBackspace();
      break;
    default:
      handleCharacterInput(key, ctrlKey);
  }

  scrollToBottom();
}

function resetIndexCommand() {
  commandPromptIndex = -1;
}

async function processClipboardCommands() {
  const clipboard = await navigator.clipboard.readText();

  if (!clipboard.trim()) return;

  const inputs = clipboard.split(/\r\n|\n|\r/);
  const lastInput = inputs.pop() || "";

  inputs.forEach((commandInput) => {
    const { commandName, params } = parseCommandInput(commandInput);

    commandPromptElement.textContent = initialCommandPrompt + commandInput;
    commandPromptSaveElement.textContent = initialCommandPrompt + commandInput;

    insertCommandPrompt();
    addToHitoryCommand(commandInput);
    processUserInput(commandName);
  });

  commandPromptElement.textContent = commandPromptSaveElement.textContent + lastInput;
  commandPromptSaveElement.textContent = commandPromptSaveElement.textContent + lastInput;

  adjustVerticalBarPosition();
}

function handleArrowDown() {
  if (historyCommands.length < -1) return;

  const command = historyCommands[commandPromptIndex - 1];
  if (command === undefined) return;

  commandPromptIndex--;

  commandPromptElement.textContent = initialCommandPrompt + command;
  commandPromptSaveElement.textContent = initialCommandPrompt + command;
  adjustVerticalBarPosition();
}

function handleArrowUp() {
  if (historyCommands.length < -1) {
    return;
  }

  const command = historyCommands[commandPromptIndex + 1];
  if (command === undefined) return;

  commandPromptIndex++;

  commandPromptElement.textContent = initialCommandPrompt + command;
  commandPromptSaveElement.textContent = initialCommandPrompt + command;
  adjustVerticalBarPosition();
}

function handleKeyUp() {
  commandPromptElement.classList.remove("no-animation");
}

function handleArrowLeft() {
  if (commandPromptSaveElement.textContent.length <= initialCommandPromptLength) return;

  commandPromptSaveElement.textContent = commandPromptSaveElement.textContent.slice(0, -1);

  adjustVerticalBarPosition();
}

function handleArrowRight() {
  commandPromptSaveElement.textContent = commandPromptElement.textContent.slice(
    0,
    commandPromptSaveElement.textContent.length + 1
  );

  adjustVerticalBarPosition();
}

function handleCtrlKeyC() {
  insertCommandPrompt();
  insertSpaceParagraph();
  adjustVerticalBarPosition();
  resetIndexCommand();
}

function handleCtrlKeyV() {
  processClipboardCommands();
}

function handleEnter() {
  const commandInput = commandPromptElement.textContent.substring(initialCommandPromptLength);
  const { commandName, params } = parseCommandInput(commandInput);

  addToHitoryCommand(commandInput);
  resetIndexCommand();
  insertCommandPrompt();
  processUserInput(commandName);
  adjustVerticalBarPosition();
}

/** @param {MouseEvent} event */
async function handleContextMenu(event) {
  event.preventDefault();
  processClipboardCommands();
}

function handleBackspace() {
  const command = commandPromptElement.textContent.substring(initialCommandPromptLength);
  const commandSave = commandPromptSaveElement.textContent.substring(initialCommandPromptLength);
  const commandIndex = commandSave.length - 1;
  const newCommand = command.substring(0, commandIndex) + command.substring(commandIndex + 1);

  commandPromptElement.textContent = initialCommandPrompt + newCommand;
  commandPromptSaveElement.textContent = initialCommandPrompt + commandSave.slice(0, -1);

  if (!newCommand && commandPromptIndex === 0) {
    resetIndexCommand();
  }

  // resetIndexCommand();
  adjustVerticalBarPosition();
}

/**
 * @param {string} key
 * @param {string} ctrlKey
 */
function handleCharacterInput(key, ctrlKey) {
  if (key.length !== 1 || ctrlKey) return;

  const command = commandPromptElement.textContent.substring(initialCommandPromptLength);
  const commandSave = commandPromptSaveElement.textContent.substring(initialCommandPromptLength);
  const commandIndex = commandSave.length;
  const newCommand = command.substring(0, commandIndex) + key + command.substring(commandIndex);

  commandPromptElement.textContent = initialCommandPrompt + newCommand;
  commandPromptSaveElement.textContent += key;

  adjustVerticalBarPosition();
}

function disableCommandPromptAnimation() {
  commandPromptElement.classList.add("no-animation");
  commandPromptElement.classList.add("no-vertical-bar");
}

function enableCommandPromptAnimation() {
  commandPromptElement.classList.remove("no-animation");
  commandPromptElement.classList.remove("no-vertical-bar");
}

function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight);
}

/** @param {Event} event */
async function handleSelectionChange(event) {
  event.preventDefault();

  const selection = document.getSelection().toString();

  if (!selection) return;

  await navigator.clipboard.writeText(selection);
}

function initAnimationCommandPrompt() {
  window.addEventListener("blur", disableCommandPromptAnimation);
  window.addEventListener("focus", enableCommandPromptAnimation);
}

function initPromptValueDefault() {
  commandPromptElement.textContent = initialCommandPrompt;
  commandPromptSaveElement.textContent = initialCommandPrompt;
}

function initClipboardEvent() {
  document.addEventListener("contextmenu", handleContextMenu);
  document.addEventListener("selectionchange", handleSelectionChange);
}

function initKeyEvent() {
  document.addEventListener("keyup", handleKeyUp);
  document.addEventListener("keydown", handleKeyDown);
}

function main() {
  insertOsVersionParagraph();
  insertSpaceParagraph();
  initPromptValueDefault();
  initAnimationCommandPrompt();
  adjustVerticalBarPosition();
  enableCommandPromptAnimation();
  initClipboardEvent();
  initKeyEvent();
}

main();
