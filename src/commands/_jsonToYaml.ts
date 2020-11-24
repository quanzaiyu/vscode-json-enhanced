import * as vscode from 'vscode';
import * as YAML from 'yaml';
import * as path from 'path';

type FileContentConverter = (context: string) => string;
type NewFileExtname = '.yml' | '.json';
type FileFilter = ([filePath, fileType]: [string, vscode.FileType]) => boolean;
type DirectoryFilesConverter = {
	fileContentConverter: FileContentConverter;
	fileFilter: FileFilter;
	newFileExtname: NewFileExtname;
	/** uri supposedly representing the folder */
	uri: vscode.Uri
};

export async function onRightclickJson(oldUri: vscode.Uri) {
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
		const yaml = getYamlFromJson(json);

		await changeFile(oldUri, newUri, yaml);
	} catch (error) {
		showError(error.message);
	}
}

export async function onRightClickYaml(oldUri: vscode.Uri) {
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
		const json = getJsonFromYaml(yaml);

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

export function getJsonFromYaml(yaml: string): string {
	try {
		const json = YAML.parse(yaml, { });
		return JSON.stringify(json, undefined, 2);
	} catch (error) {
		console.error(error);
		throw new Error('Failed to parse JSON. Please make sure it has a valid format and try again.');
	}
}

function getActiveTextEditorUri() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		throw new Error('Failed to get active text editor');
	}
	return editor.document.uri;
}

export function getYamlFromJson(json: string): string {
  const indent =
    vscode.workspace.getConfiguration('vscode-json-enhanced').get<number>('indentationSpaces') ||
    vscode.workspace.getConfiguration("editor").get<number>("tabSize");

	try {
		return YAML.stringify(JSON.parse(json), { indent });
	} catch (error) {
		console.error(error);
		throw new Error('Failed to parse YAML. Please make sure it has a valid format and try again.');
	}
}

export async function convertJsonFilestoYaml(uri: vscode.Uri) {
	const fileContentConverter: FileContentConverter = getYamlFromJson;
	const newFileExtname: NewFileExtname = '.yml';
	const fileFilter: FileFilter = ([filePath, fileType]) => fileType === vscode.FileType.File && filePath.endsWith('.json');

	await directoryFilesConverter({ uri, newFileExtname, fileFilter, fileContentConverter });
}


async function directoryFilesConverter({ newFileExtname, uri, fileFilter, fileContentConverter }: DirectoryFilesConverter) {
	const { fsPath, scheme } = uri;

	if (scheme !== 'file') {
		return vscode.window.showErrorMessage('Unexpected file scheme');
	}

	const stat = await vscode.workspace.fs.stat(uri);
	const isDirectory = stat.type === vscode.FileType.Directory;

	if (!isDirectory) {
		return vscode.window.showInformationMessage('The selection was not recognised as a directory');
	}

	const directoryFiles = await vscode.workspace.fs.readDirectory(uri);

	const getFileUri = ([filePath]: [string, vscode.FileType]) => vscode.Uri.file(path.join(fsPath, filePath));

	const files = directoryFiles
		.filter(fileFilter)
		.map(getFileUri);

	if (files.length === 0) {
		return vscode.window.showInformationMessage(`No convertable files found in the selected directory`);
	}

	const fileConverter = getFileConverter(newFileExtname, fileContentConverter);
	const promises = files.map(fileConverter);
	await Promise.all(promises);
}


function getFileConverter(newFileExtname: '.json' | '.yml', fileContentConverter: FileContentConverter) {
	return async (fileUri: vscode.Uri) => {
		const fileContent = await vscode.workspace.fs.readFile(fileUri);
		const filePath = path.extname(fileUri.fsPath);

		const newFilePath = fileUri.fsPath.replace(filePath, newFileExtname);
		const newFileUri = vscode.Uri.file(newFilePath);

		const fileString = Buffer.from(fileContent).toString();
		const convertedFile = fileContentConverter(fileString);

		await changeFile(fileUri, newFileUri, convertedFile);
	};
}


async function changeFile(oldUri: vscode.Uri, newUri: vscode.Uri, newText: string) {
	try {
		await vscode.workspace.fs.writeFile(oldUri, Buffer.from(newText));
		await vscode.workspace.fs.rename(oldUri, newUri);
	} catch (error) {
		showError(error.message);
	}
}

export function showError(message?: string) {
	const defaultMessage = 'Something went wrong, please validate your file and try again or create an issue if the problem persist';
	if (!message) {
		message = defaultMessage;
	}
	vscode.window.showErrorMessage(message);
}
