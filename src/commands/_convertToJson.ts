import * as vscode from 'vscode';
import { setText } from '../utils';

const { parseString } = require('xml2js');
const clipboardy = require('clipboardy');

const DOCUMENT_ERROR = 'Selection or document is invalid XML???';
const CLIPBOARD_ERROR = 'Clipboard is invalid XML???';

export function convertDocument(): void {
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor && activeEditor.selection && activeEditor.selection.active) {
    activeEditor.edit(editor => {
      const select = activeEditor.document.getText(activeEditor.selection);
      let input = select || activeEditor.document.getText();
      const callback = (err: any, result: any) => {
        if (err || !result) {
          vscode.window.showErrorMessage(DOCUMENT_ERROR);
        } else {
          const output = JSON.stringify(result, null, 2);
          setText(output);
        }
      };

      parseString(input, callback);
    });
  }
}

export function convertClipboard(): void {
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor && activeEditor.selection && activeEditor.selection.active) {
    activeEditor.edit(editor => {
      const select = activeEditor.document.getText(activeEditor.selection);

      let input = clipboardy.readSync();
      const callback = (err: any, result: any) => {
        if (err || !result) {
          vscode.window.showErrorMessage(CLIPBOARD_ERROR);
        } else {
          const output = JSON.stringify(result, null, 2);
          setText(output);
        }
      };

      parseString(input, callback);
    });
  }
}
