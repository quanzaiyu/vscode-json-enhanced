import { window } from "vscode";

import { JsonUtils, setText } from "../utils";

export const unescapeJson = function () {
  // Get active editor
  let editor = window.activeTextEditor;
  if (!editor) {
    return;
  }

  // Get the document
  let doc = editor.document;
  let text = doc.getText(editor.selection) || doc.getText();

  // Remove trailing and leading whitespace
  let trimmedText = text.trim().replace(/(?:^[\n\t\r]|[\n\t\r]$)/g, "");

  // Unescape JSON
  let unescapedJson = JsonUtils.unescape(trimmedText);

  if (unescapedJson !== trimmedText) {
    setText(unescapedJson);
  }
};
