import * as vscode from "vscode";
import { dirname } from "path";
import {
  getCurrentBranchName,
  getNotesFilename,
  appendNote,
  formatNote,
} from "./utils";

export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(
    vscode.commands.registerCommand("contextual.takeNote", async () => {
      if (vscode.window.activeTextEditor) {
        const fileName = vscode.workspace.asRelativePath(
          vscode.window.activeTextEditor.document.fileName,
          /* includeWorkspaceFolder */ true
        );
        const selection = vscode.window.activeTextEditor.selection;
        const lineNumber = selection.active.line;

        const currentBranchName = getCurrentBranchName(
          dirname(vscode.window.activeTextEditor.document.fileName)
        );

        const note = await vscode.window.showInputBox({
          prompt: "Enter a note",
          placeHolder:
            "What's relevant about the current line of code? e.g. How or why?",
        });

        const message = formatNote({
          fileName,
          lineNumber,
          note,
          currentBranchName,
        });

        appendNote(message);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("contextual.openNotes", async () => {
      const document = await vscode.workspace.openTextDocument(
        getNotesFilename()
      );
      vscode.window.showTextDocument(document);
    })
  );
}

export function deactivate() {}
