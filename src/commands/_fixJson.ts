import {
  Position,
  Range,
  TextEditor,
  TextEditorDecorationType,
  TextEditorEdit,
  window,
  workspace,
} from "vscode";
import * as jsonic from "jsonic";

interface Options {
  decoration: TextEditorDecorationType;
}

interface Result {
  status: string;
  text: string;
  error: {
    [key: string]: any;
  };
}

export const fix = (options: Options) => (
  editor: TextEditor,
  edit: TextEditorEdit
) => {
  const { selection, document } = editor;
  const text = selection.isEmpty
    ? document.getText()
    : document.getText(selection);

  const indentation: number = Number(
    workspace.getConfiguration("vscode-json-enhanced").get("indentationSpaces") ||
    workspace.getConfiguration("editor").get("tabSize")
  );
  const result = fixText(text, { indentation });
  if (result.status === "ok") {
    edit.replace(
      selection.isEmpty
        ? new Range(new Position(0, 0), new Position(document.lineCount, 0))
        : selection,
      result.text
    );
    editor.setDecorations(options.decoration, []);
  } else {
    window.setStatusBarMessage(`Fixing failed: ${result.error.message}`, 5000);
    editor.setDecorations(options.decoration, [
      {
        range: new Range(
          new Position(result.error.line - 1, result.error.column - 1),
          new Position(
            result.error.line - 1,
            result.error.column - 1 + result.error.foundLength
          )
        ),
        hoverMessage: result.error.message,
      },
    ]);
  }
};

const fixText = (text: string, options: { indentation: number }): Result => {
  try {
    return {
      status: "ok",
      error: {},
      text: JSON.stringify(jsonic(text), undefined, options.indentation),
    };
  } catch (e) {
    let result: Result = {
      status: "error",
      error: { message: e.message },
      text: "",
    };
    if (e.name === "SyntaxError") {
      result.error = Object.assign({}, result.error, {
        line: e.line,
        column: e.column,
        foundLength: e.found.length,
        message: `(${e.line}, ${e.column}) ${result.error.message}`,
      });
    }
    return result;
  }
};
