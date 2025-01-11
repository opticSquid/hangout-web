export interface OS {
  name: string;
  version?: string;
}
export interface ScreenDimensions {
  height: number;
  width: number;
}
export interface DeviceInfo {
  os: OS;
  screen: ScreenDimensions;
}
