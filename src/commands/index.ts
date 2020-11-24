import { commands, ExtensionContext, window } from 'vscode';
import { fix } from './_fixJSON';
import { uglifyJson } from './_uglifyJson';
import { beautifyJson } from './_beautifyJson';
import { validateJson } from './_validateJson';
import { escapeJson } from './_escapeJson';
import { unescapeJson } from './_unescapeJson';
import { convertDocument, convertClipboard } from './_xmlToJson';

module.exports = function (context: ExtensionContext) {
  const decoration = window.createTextEditorDecorationType({
    color: 'pink',
    backgroundColor: 'green'
  });

  context.subscriptions.push(
    decoration,
    commands.registerTextEditorCommand('vscode-json-enhanced.fixJSON', fix({ decoration })),
    commands.registerCommand("vscode-json-enhanced.uglifyJson", uglifyJson),
    commands.registerCommand("vscode-json-enhanced.beautifyJson", beautifyJson),
    commands.registerCommand("vscode-json-enhanced.validateJson", validateJson),
    commands.registerCommand("vscode-json-enhanced.escapeJson", escapeJson),
    commands.registerCommand("vscode-json-enhanced.unescapeJson", unescapeJson),
    commands.registerCommand("vscode-json-enhanced.xml2json.document", convertDocument),
    commands.registerCommand("vscode-json-enhanced.xml2json.clipboard", convertClipboard),
  );
};
