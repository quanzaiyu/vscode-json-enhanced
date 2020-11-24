import * as vscode from 'vscode';
import { setText } from '../utils';

const { parseString } = require('xml2js');
const clipboardy = require('clipboardy');

export function convertDocument(): void {
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor && activeEditor.selection && activeEditor.selection.active) {
    const select = activeEditor.document.getText(activeEditor.selection);
    let input = select || activeEditor.document.getText();
    const callback = (err: any, result: any) => {
      if (err || !result) {
        vscode.window.showErrorMessage('Selection or document is invalid XML');
      } else {
        const output = JSON.stringify(result, null, 2);
        setText(output);
      }
    };
    parseString(input, callback);
  }
}

export function convertClipboard(): void {
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor && activeEditor.selection && activeEditor.selection.active) {
    let input = clipboardy.readSync();
    const callback = (err: any, result: any) => {
      if (err || !result) {
        vscode.window.showErrorMessage('Clipboard is invalid XML');
      } else {
        const output = JSON.stringify(result, null, 2);
        setText(output);
      }
    };
    parseString(input, callback);
  }
}
