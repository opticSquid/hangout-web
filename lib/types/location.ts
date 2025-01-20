export interface Location {
  type: "Point";
  crs: {
    type: "name";
    properties: {
      name: "EPSG:4326";
    };
  };
  coordinates: number[];
}
