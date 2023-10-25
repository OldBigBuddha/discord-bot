import { command as niceCommand } from "./nice/index.ts";
import { command as helpCommand } from "./help/index.ts";

export const slashCommands = [niceCommand, helpCommand];
