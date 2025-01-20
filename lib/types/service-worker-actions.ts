export type ServiceWorkerActions = {
  addWorker: (newWorker: ServiceWorkerRegistration | undefined) => void;
  reset: () => void;
};
