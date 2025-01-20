import { create } from "zustand";
import { ServiceWorkerActions } from "../types/service-worker-actions";
import { ServiceWorkerState } from "../types/service-worker-state";
import { immer } from "zustand/middleware/immer";

export type ServiceWorkerStore = ServiceWorkerState & ServiceWorkerActions;
const defaultWorkerState: ServiceWorkerState = {
  worker: undefined,
};
export const createServiceWorkerStore = (
  initState: ServiceWorkerState = defaultWorkerState
) =>
  create<ServiceWorkerStore>()(
    immer((set) => ({
      ...initState,
      addWorker: (newWorker: ServiceWorkerRegistration | undefined) => {
        set({ worker: newWorker });
      },
      reset: () => {
        set(initState);
      },
    }))
  );
