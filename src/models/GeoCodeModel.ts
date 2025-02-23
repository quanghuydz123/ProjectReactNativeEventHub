export interface GeoCodeModel {
    title: string
    id: string
    resultType: string
    address: Address
    position: Position
    mapView: MapView
    scoring: Scoring
  }
  
  export interface Address {
    label: string
    countryCode: string
    countryName: string
    county: string
    city: string
    district: string
    street: string
    postalCode: string
  }
  
  export interface Position {
    lat: number
    lng: number
  }
  
  export interface MapView {
    west: number
    south: number
    east: number
    north: number
  }
  
  export interface Scoring {
    queryScore: number
    fieldScore: FieldScore
  }
  
  export interface FieldScore {
    streets: number[]
  }
  