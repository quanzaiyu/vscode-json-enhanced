import { window, workspace } from "vscode";

import { JsonUtils, setText } from "../utils";

export const beautifyJson = function () {
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

  const indentation: number = Number(
    workspace.getConfiguration("vscode-json-enhanced").get("indentationSpaces") ||
    workspace.getConfiguration("editor").get("tabSize")
  );

  // Beautify JSON
  let beautifiedJson = JsonUtils.beautify(
    trimmedText,
    // tabs or spaces
    editor.options.insertSpaces ? indentation : "\t"
  );
  if (beautifiedJson !== trimmedText) {
    // tabs or spaces
    let tabStyle = editor.options.insertSpaces ? " " : "\t";

    if (!editor.selection.isEmpty) {
      let start = editor.selection.start;
      beautifiedJson = beautifiedJson.replace(
        /(\n)/g,
        "$1" + tabStyle.repeat(start.character)
      );
    }
    setText(beautifiedJson);
  }
};
