import { command as diceCommand } from "./dice/index.ts";
import { command as niceCommand } from "./nice/index.ts";
import { command as helpCommand } from "./help/index.ts";

export const slashCommands = [
  diceCommand,
  niceCommand,
  helpCommand,
];
