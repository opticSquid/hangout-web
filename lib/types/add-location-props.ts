export interface AddLocationProps {
  onSubmit: (
    lat: number,
    lon: number,
    state: string,
    city: string
  ) => Promise<void>;
}
