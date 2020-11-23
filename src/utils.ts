let JSON = require("json-bigint");

import {
  Position,
  Range,
  TextEditor,
  Selection
} from "vscode";

export class JsonUtils {
  /**
   * isValid
   * @param text
   */
  public static isValid(text: string): boolean {
    try {
      return typeof JSON.parse(text) === "object";
    } catch (err) {
      return false;
    }
  }

  /**
   * escape
   * @param text
   */
  public static escape(text: string): string {
    return this.isValid(text)
      ? JSON.stringify(text)
        .replace(/^"/g, "")
        .replace(/"$/g, "")
      : text;
  }

  /**
   * unescape
   * @param text
   */
  public static unescape(text: string): string {
    let formattedText = text;
    try {
      if (!text.startsWith('"')) {
        formattedText = '"'.concat(formattedText);
      }

      if (!text.endsWith('"')) {
        formattedText = formattedText.concat('"');
      }

      return JSON.parse(formattedText);
    } catch (err) {
      return text;
    }
  }

  /**
   * beautify
   * @param text
   * @param tabSize
   */
  public static beautify(text: string, tabSize?: number | string): string {
    return this.isValid(text) ? JSON.stringify(JSON.parse(text), null, tabSize) : text;
  }

  /**
   * uglify
   * @param text
   */
  public static uglify(text: string): string {
    return JsonUtils.isValid(text) ? JSON.stringify(JSON.parse(text), null, 0) : text;
  }
}

/**
 * This function is used to set the current document text
 * @param newText
 */
export const setText = (editor: TextEditor, newText: string) => {
  let doc = editor.document;
  editor.edit(builder => {
    let start, end;

    // Format whole file or selected text
    if (editor.selection.isEmpty) {
      const lastLine = doc.lineAt(doc.lineCount - 1);
      start = new Position(0, 0);
      end = new Position(doc.lineCount - 1, lastLine.text.length);
    } else {
      start = editor.selection.start;
      end = editor.selection.end;
    }

    // replace text
    builder.replace(new Range(start, end), newText);

    // Select the whole json
    editor.selection = new Selection(start, end);
  });
};
