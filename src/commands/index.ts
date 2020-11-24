import { commands, ExtensionContext, window } from 'vscode';
import { fix } from './_fixJSON';
import { uglifyJson } from './_uglifyJson';
import { beautifyJson } from './_beautifyJson';
import { validateJson } from './_validateJson';
import { escapeJson } from './_escapeJson';
import { unescapeJson } from './_unescapeJson';
import { convertDocument, convertClipboard } from './_convertToJson';

module.exports = function (context: ExtensionContext) {
  const decoration = window.createTextEditorDecorationType({
    color: 'pink',
    backgroundColor: 'green'
  });
  context.subscriptions.push(decoration);

  context.subscriptions.push(commands.registerTextEditorCommand('vscode-json-enhanced.fixJSON', fix({ decoration })));

  context.subscriptions.push(commands.registerCommand("vscode-json-enhanced.uglifyJson", uglifyJson));
  context.subscriptions.push(commands.registerCommand("vscode-json-enhanced.beautifyJson", beautifyJson));
  context.subscriptions.push(commands.registerCommand("vscode-json-enhanced.validateJson", validateJson));
  context.subscriptions.push(commands.registerCommand("vscode-json-enhanced.escapeJson", escapeJson));
  context.subscriptions.push(commands.registerCommand("vscode-json-enhanced.unescapeJson", unescapeJson));

  context.subscriptions.push(commands.registerCommand("vscode-json-enhanced.xml2json.document", convertDocument));
  context.subscriptions.push(commands.registerCommand("vscode-json-enhanced.xml2json.clipboard", convertClipboard));
};
