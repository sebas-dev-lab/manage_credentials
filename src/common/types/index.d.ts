// src/common/types/index.d.ts

import { userAuthContext } from '../interfaces/permissions.interface';

// to make the file a module and avoid the TypeScript error
export {};
declare const Buffer;
declare const process_on: any;

declare global {
  namespace Express {
    export interface Request {
      headers: {
        apiKey?: string;
      };
      authContext?: {
        user: userAuthContext;
      };
    }
  }
}

declare module '*.json' {
  const value: any;
  export default value;
}
