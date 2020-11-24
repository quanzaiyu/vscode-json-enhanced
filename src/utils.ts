let JSON = require("json-bigint");

import * as YAML from 'yaml';

import {
  Position,
  Range,
  TextEditor,
  Selection,
  window,
  Uri,
  workspace
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

export class YamlUtils {
  // 将YAML转换为JSON
  public static toJson(yaml: string): string {
    try {
      const json = YAML.parse(yaml, { });
      return JSON.stringify(json, undefined, 2);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to parse JSON. Please make sure it has a valid format and try again.');
    }
  }

  // 将JSON转换为YAML
  public static fromJson(json: string): string {
    const indent =
      workspace.getConfiguration('vscode-json-enhanced').get<number>('indentationSpaces') ||
      workspace.getConfiguration("editor").get<number>("tabSize");

    try {
      return YAML.stringify(JSON.parse(json), { indent });
    } catch (error) {
      throw new Error('Failed to parse YAML. Please make sure it has a valid format and try again.');
    }
  }
}

/**
 * 替换编辑器中的文本
 * @param newText
 */
export const setText = (newText: string) => {
  const editor = window.activeTextEditor;
  if (!editor) {return;}

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

// 获取当前激活激活的编辑器文档的Uri
export function getActiveTextEditorUri(): Uri {
	const editor = window.activeTextEditor;
	if (!editor) {
		throw new Error('Failed to get active text editor');
	}
	return editor.document.uri;
}

// 展示错误信息
export function showError(message?: string) {
	const defaultMessage = 'Something went wrong, please validate your file and try again or create an issue if the problem persist';
	if (!message) {
		message = defaultMessage;
	}
	window.showErrorMessage(message);
}

// 重命名文件名并写入文件内容
export async function changeFile(oldUri: Uri, newUri: Uri, newText: string) {
	try {
		await workspace.fs.writeFile(oldUri, Buffer.from(newText));
		await workspace.fs.rename(oldUri, newUri);
	} catch (error) {
		showError(error.message);
	}
}
