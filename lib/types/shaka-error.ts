export interface ShakaError {
  code: number;
  severity: string;
  category: string;
  data: object[];
  handled: boolean;
}
