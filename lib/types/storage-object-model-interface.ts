import { SessionState } from "./session-store-interface";

export type StorageObjectModel = {
  state: SessionState;
  version: number;
};
