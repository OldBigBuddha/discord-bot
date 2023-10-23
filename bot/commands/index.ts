import {
  commandInfo as niceCommandInfo,
  runCommand as runNiceCommand,
} from "./nice/nice.ts";
import { RunCommand } from "./type.ts";

export const slashCommandsInfo = [niceCommandInfo];
export const runCommandMap = new Map<string, RunCommand>([
  [niceCommandInfo.name, runNiceCommand],
]);
