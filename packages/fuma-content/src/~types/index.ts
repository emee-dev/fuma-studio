export type QueryParams = {
  name: string;
  value: string;
  enabled: boolean;
  type: "query" | "path";
};

export type Headers = { name: string; value: string; enabled: boolean };
export type Assertions = { name: string; value: string; enabled: boolean };
export type formUrlEncoded = { name: string; value: string; enabled: boolean };
export type multipartForm = {
  name: string;
  value: string | string[];
  enabled: boolean;
  type: "text" | "file";
  contentType: string;
};

export type BodyTypes = {
  json: string;
  text: string;
  xml: string;
  formUrlEncoded: formUrlEncoded[];
  multipartForm: multipartForm[];
};

export interface BruFile {
  meta: { name: string; type: "http"; seq: `${number}` };
  http: {
    method: string;
    url: string;
    body: "json" | "formUrlEncoded" | "multipartForm" | "text" | "xml";
    auth: "basic";
  };
  // aka query
  params: QueryParams[];
  headers: Headers[];
  body: BodyTypes;
  assertions: Assertions[];
  script: {
    req: string;
    res: string;
  };
  docs: string;
}

type Auth = {
  basic?: {
    username: string;
    password: string;
  };
};

type Meta = {
  name: string;
  type: BruFile["meta"]["type"];
  authType: BruFile["http"]["auth"];
  sourcePath: string;
};

export type FumaContentObject = {
  meta: Meta;
  http: BruFile["http"];
  auth?: Auth;
  params: {
    query: Record<string, string>;
    path: Record<string, string>;
  };
  headers: Record<string, string>;
  body: BodyTypes;
  assertions: Assertions[];
  script: BruFile["script"];
  docs: string;
};
