/**
 * @param {string} text
 * @returns {HTMLParagraphElement}
 */
export function createParagraphElement(text) {
  const paragraph = document.createElement("p");
  paragraph.appendChild(document.createTextNode(text));
  return paragraph;
}

/**
 * @param {Date} date
 * @returns {string}
 */
export function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, 0);
  const minutes = date.getMinutes().toString().padStart(2, 0);
  const seconds = date.getSeconds().toString().padStart(2, 0);
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
  const local = "fr-FR";
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };
  return new Intl.DateTimeFormat(local, options).format(date);
}
