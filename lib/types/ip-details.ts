export interface IpApiResponse {
  status: "success" | "fail"; // You might want to add other possible status values
  lat: number;
  lon: number;
}
