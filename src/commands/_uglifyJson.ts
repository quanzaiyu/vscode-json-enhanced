import { window } from "vscode";

import { JsonUtils, setText } from "../utils";

export const uglifyJson = function () {
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

  // Uglify JSON
  let uglifiedJson = JsonUtils.uglify(trimmedText);
  if (uglifiedJson !== trimmedText) {
    setText(editor, uglifiedJson);
  }
};
