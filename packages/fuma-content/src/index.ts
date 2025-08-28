import { Command, Option } from "commander";
import packageJson from "../package.json";
import { join } from "path";
import { bundleBrunoCollections } from "./commands/build";

function getVersion(): string {
  return packageJson.version;
}

/**
 * Handle CLI errors gracefully
 */
function handleError(error: Error, verbose?: boolean): void {
  if (verbose) {
    console.error("Error details:", error);
  } else {
    console.error(`Error: ${error.message}`);
  }

  // Provide actionable guidance based on error type
  if (error.message.includes("ENOENT")) {
    console.error(
      "Tip: Check that the specified path exists and is accessible."
    );
  } else if (error.message.includes("EACCES")) {
    console.error("Tip: Check file permissions for the specified path.");
  }

  process.exit(1);
}

/**
 * Main CLI entry point
 */
export const run = async (): Promise<void> => {
  const program = new Command();

  // Set up program metadata
  program
    .name("fuma-content")
    .description(
      "Bundles your HTTP collections for use in Fuma Studio. Currently supports Panda, Bruno HTTP clients."
    )
    .version(getVersion(), "-v, --version", "display version number");

  program
    .command("build <collection>")
    .requiredOption("--api-key <char>", "Your Fuma Studio apikey.")
    .addOption(
      new Option("--rc, --rest-client <value>", "Your rest client.").choices([
        "panda",
        "bruno",
        "yaak",
      ])
    )
    .description("Build collection for Fuma Studio.")
    .action(
      (
        docs: string,
        options: {
          apiKey: string;
          restClient: "panda" | "bruno" | "yaak";
        }
      ) => {
        const cwd = process.cwd();
        const collectionPath = join(cwd, docs);

        if (options.restClient === "bruno") {
          console.log(options);

          const collections = bundleBrunoCollections({
            cwd,
            collectionPath,
            extensions: [".bru"],
          });

          console.dir(collections, { depth: null });
        }
      }
    );

  program
    .command("ui <path>")
    .requiredOption("--api-key <char>", "Your Fuma Studio apikey.")
    .description("Build ui for Fuma Studio.")
    .action(
      (
        uiPath: string,
        options: {
          apiKey: string;
        }
      ) => {
        const cwd = process.cwd();
        const tenantUi = join(cwd, uiPath);
      }
    );

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    console.log("\nOperation cancelled by user.");
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    console.log("\nOperation terminated.");
    process.exit(0);
  });

  try {
    program.parse();
  } catch (error) {
    const options = program.opts();
    handleError(error as Error, options.verbose);
  }
};
