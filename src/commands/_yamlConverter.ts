import * as vscode from 'vscode';
import { changeFile, getActiveTextEditorUri, showError, YamlUtils } from '../utils';

export async function json2Yaml(oldUri: vscode.Uri) {
	if (!oldUri) {
		oldUri = getActiveTextEditorUri();
	}

	const { path } = oldUri;
	const newFilePath = path.replace('.json', '.yml');
	const newUri = vscode.Uri.parse(newFilePath);
	try {
		const document = await vscode.workspace.openTextDocument(oldUri);

		if (document.isDirty) {
			await document.save();
		}

		const json = document.getText();
		const yaml = YamlUtils.fromJson(json);

		await changeFile(oldUri, newUri, yaml);
	} catch (error) {
		showError(error.message);
	}
}

export async function yaml2Json(oldUri: vscode.Uri) {
	if (!oldUri) {
		oldUri = getActiveTextEditorUri();
	}

	const { path } = oldUri;

	try {
		const document = await vscode.workspace.openTextDocument(oldUri);

		if (document.isDirty) {
			await document.save();
		}

		const yaml = document.getText();
		const json = YamlUtils.toJson(yaml);

		const newFilePath = path
			.replace('.yml', '.json')
			.replace('.yaml', '.json');
		const newUri = vscode.Uri.parse(newFilePath);

		await changeFile(oldUri, newUri, json);
	} catch (error) {
		showError(error.message);
		throw error;
	}
}
