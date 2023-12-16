import fs from "fs/promises";
import path from "path";

import { SlashCommand } from "../type";

const SRC_ROOT = path.join(process.cwd(), "src");
const COMMANDS_ROOT_DIR_PATH = path.join(SRC_ROOT, "bot", "commands");

async function loadCommands(): Promise<Map<string, SlashCommand>> {
  const commands = new Map<string, SlashCommand>();

  const commandDirPaths = (await fs.readdir(COMMANDS_ROOT_DIR_PATH, { withFileTypes: true }))
    .filter((dirent) => {
      return dirent.isDirectory();
    })
    .map((dir) => {
      return dir.name;
    });

  for (const commandDirPath of commandDirPaths) {
    const indexPath = path.join(COMMANDS_ROOT_DIR_PATH, commandDirPath, "index.ts");

    try {
      const module = await import(indexPath);

      // TOD: type guard
      const command = module.command as SlashCommand;
      commands.set(command.metadata.name, command);
      console.debug(`Command loaded: ${command.metadata.name}`);
    } catch (error) {
      console.error(`Error: couldn't load ${indexPath}`);
      console.error(error);
    }
  }

  return commands;
}

export const slashCommandMap = await loadCommands();
