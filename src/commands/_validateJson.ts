import { window } from "vscode";

import { JsonUtils } from "../utils";

export const validateJson = function () {
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

  // Determine whether JSON is valid or invalid
  JsonUtils.isValid(trimmedText)
    ? window.showInformationMessage("Valid JSON")
    : window.showErrorMessage("Invalid JSON");
};
