// @ts-expect-error - no types
import BruToJson from "@usebruno/lang/v2/src/bruToJson";
// @ts-expect-error - no types
import JsonToBru from "@usebruno/lang/v2/src/jsonToBru";
import type { BruFile, FumaContentObject } from "../~types";

type ParseOptions = {
  sourcePath: string;
};

export class Bru {
  static parse(src: string, options: ParseOptions): FumaContentObject {
    let req = BruToJson(src) as BruFile;

    if (req.headers) {
      // @ts-expect-error - convert the bruno semantics to normal object
      req["headers"] = headersToRecord(req.headers);
    }

    if (req.params) {
      // @ts-expect-error - convert the bruno semantics to normal object
      req["params"] = queryToRecord(req.params);
    }

    let content = req as unknown as FumaContentObject;

    content.meta.sourcePath = options.sourcePath;
    content.meta.authType = req.http.auth;

    return content;
  }

  static stringify(src: BruFile): string {
    return JsonToBru(src);
  }
}

const queryToRecord = (entry: BruFile["params"]) => {
  let q = entry.filter((i) => i.type === "query");
  let path = entry.filter((i) => i.type === "path");
  let queryObj = {} as Record<string, string>;
  let pathObj = {} as Record<string, string>;

  for (const item of q) {
    if (item.enabled) {
      queryObj[item.name] = item.value;
    } else {
      queryObj[`~${item.name}`] = item.value;
    }
  }

  for (const item of path) {
    if (item.enabled) {
      pathObj[item.name] = item.value;
    } else {
      pathObj[`~${item.name}`] = item.value;
    }
  }

  return {
    query: queryObj,
    path: pathObj,
  };
};

const headersToRecord = (headers: BruFile["headers"]) => {
  let obj = {} as Record<string, string>;

  for (const item of headers) {
    if (item.enabled) {
      obj[item.name] = item.value;
    } else {
      obj[`~${item.name}`] = item.value;
    }
  }

  return obj;
};

// Note: bruno does not validate the json body, so an invalid json could be saved to file.
// Makes sure our script is fault tolerant.
const isValidJsonString = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
};
