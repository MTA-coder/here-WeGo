export interface AddressDto {
  label: string;
  countryCode: string;
  countryName: string;
}

export interface PositionDto {
  lat: number;
  lng: number;
}

export interface MapViewDto {
  west: number;
  south: number;
  east: number;
  north: number;
}

export interface HereWeGoDto {
  title: string;
  id: string;
  language: string;
  resultType: string;
  administrativeAreaType: string;
  address: AddressDto;
  position: PositionDto;
  distance: number;
  mapView: MapViewDto;
}
