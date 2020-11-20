import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  require('./commands/index')(context);
}
