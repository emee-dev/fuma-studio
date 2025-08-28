import path from "path";
import fs from "fs";

type BundleOptions = {
  cwd: string;
  collectionPath: string;
  extensions: string[];
};

type EntryFolder = {
  type: "folder";
  children: Entry[];
  name: string;
  relativePath: string;
  absolutePath: string;
};

type EntryFile = {
  type: "file";
  content: string;
  name: string;
  relativePath: string;
  absolutePath: string;
};

type Entry = EntryFile | EntryFolder;

type BrunoCollection = Entry[];

export const bundleBrunoCollections = (
  args: BundleOptions
): BrunoCollection => {
  const collection: BrunoCollection = [];

  const toRelativePath = (fullPath: string): string => {
    const collectionFullPath = path.resolve(args.cwd, args.collectionPath);
    return path.relative(collectionFullPath, fullPath);
  };

  const normalizePath = (inputPath: string): string => {
    return inputPath.replace(/\\/g, "/");
  };

  const processPath = (entryPath: string): Entry | null => {
    const fullPath = path.resolve(args.cwd, entryPath);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const stats = fs.statSync(fullPath);
    const name = path.basename(entryPath);

    if (stats.isDirectory()) {
      const children: Entry[] = [];
      const items = fs.readdirSync(fullPath);

      for (const item of items) {
        const childPath = path.join(entryPath, item);
        const childEntry = processPath(childPath);
        if (childEntry) {
          children.push(childEntry);
        }
      }

      return {
        type: "folder",
        children,
        name,
        relativePath: `./${normalizePath(toRelativePath(entryPath))}`,
        absolutePath: normalizePath(entryPath),
      };
    } else if (stats.isFile()) {
      const ext = path.extname(name);
      if (args.extensions.includes(ext)) {
        return {
          type: "file",
          content: fs.readFileSync(fullPath, "utf8"),
          name,
          relativePath: `./${normalizePath(toRelativePath(entryPath))}`,
          absolutePath: normalizePath(entryPath),
        };
      }
    }

    return null;
  };

  const rootEntry = processPath(args.collectionPath);
  if (rootEntry) {
    if (rootEntry.type === "folder") {
      collection.push(...rootEntry.children);
    } else {
      collection.push(rootEntry);
    }
  }

  return collection;
};
