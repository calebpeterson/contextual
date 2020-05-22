import { spawnSync } from "child_process";
import { appendFileSync } from "fs";
import * as os from "os";
import * as path from "path";

export function getCurrentBranchName(cwd: string) {
  try {
    // git rev-parse --abbrev-ref HEAD
    const child = spawnSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
      cwd,
    });
    return child.stdout.toString().trim();
  } catch (e) {
    console.error(`Failed to get current branch name from ${cwd}`, e);
    return undefined;
  }
}

const NOTES_FILENAME = ".contextual-notes.contextual";

export const getNotesFilename = () => path.join(os.homedir(), NOTES_FILENAME);

export function appendNote(message: string) {
  appendFileSync(getNotesFilename(), os.EOL + os.EOL + message);
}

type Note = {
  fileName: string;
  lineNumber: number;
  note: string | undefined;
  currentBranchName: string | undefined;
};

export const formatNote = (data: Note): string =>
  `
Branch: ${data.currentBranchName || ""}
File:   ${data.fileName}:${data.lineNumber}
${data.note || ""}
`.trim();
