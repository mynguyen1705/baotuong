declare const process: {
  env: Record<string, string | undefined>;
  cwd(): string;
};

declare module 'node:fs/promises' {
  function readFile(path: string, encoding: BufferEncoding | string): Promise<string>;
  function writeFile(path: string, data: string, encoding?: BufferEncoding | string): Promise<void>;
  function mkdir(
    path: string,
    options?: { recursive?: boolean }
  ): Promise<string | undefined>;
  function mkdtemp(prefix: string): Promise<string>;
  function rm(
    path: string,
    options?: { recursive?: boolean; force?: boolean }
  ): Promise<void>;

  const fsPromises: {
    readFile: typeof readFile;
    writeFile: typeof writeFile;
    mkdir: typeof mkdir;
    mkdtemp: typeof mkdtemp;
    rm: typeof rm;
  };
  export default fsPromises;
}

declare module 'node:path' {
  function resolve(...paths: string[]): string;
  function join(...paths: string[]): string;
  function dirname(p: string): string;

  const pathModule: {
    resolve: typeof resolve;
    join: typeof join;
    dirname: typeof dirname;
  };
  export default pathModule;
}

declare module 'node:os' {
  function tmpdir(): string;

  const osModule: {
    tmpdir: typeof tmpdir;
  };
  export default osModule;
}

declare module 'node:crypto' {
  interface Hmac {
    update(data: string): Hmac;
    digest(encoding: 'hex' | 'base64'): string;
  }
  function createHmac(algorithm: string, key: string): Hmac;
  function randomBytes(size: number): { toString(encoding: 'hex' | 'base64'): string };

  const cryptoModule: {
    createHmac: typeof createHmac;
    randomBytes: typeof randomBytes;
  };
  export default cryptoModule;
}

declare module 'http' {
  export interface IncomingMessage {
    originalUrl?: string;
    url?: string;
    method?: string;
    headers?: Record<string, string | string[] | undefined>;
    on?(event: 'data', listener: (chunk: { toString(): string } | string) => void): this;
    on?(event: 'end', listener: () => void): this;
    on?(event: 'error', listener: (err: Error) => void): this;
  }

  export interface ServerResponse {
    statusCode: number;
    setHeader(name: string, value: string): void;
    end(data?: string): void;
  }
}

declare module 'node:http' {
  export { IncomingMessage, ServerResponse } from 'http';
}

declare module 'node:child_process' {
  export function exec(
    command: string,
    options: { env?: Record<string, string | undefined> },
    callback?: (error: Error | null, stdout: string, stderr: string) => void
  ): void;
}
