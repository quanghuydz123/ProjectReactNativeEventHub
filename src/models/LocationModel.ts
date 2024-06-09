export interface LocationModel   {
    items: Item[]
  }
  
  export interface Item {
    title: string
    id: string
    language: string
    politicalView: string
    resultType: string
    houseNumberType: string
    estimatedPointAddress: boolean
    localityType: string
    administrativeAreaType: string
    address: Address
    distance: number
    highlights: Highlights
    streetInfo: StreetInfo[]
  }
  
  export interface Address {
    label: string
    countryCode: string
    countryName: string
    stateCode: string
    state: string
    countyCode: string
    county: string
    city: string
    district: string
    subdistrict: string
    street: string
    streets: string[]
    block: string
    subblock: string
    postalCode: string
    houseNumber: string
    building: string
    unit: string
  }
  
  export interface Highlights {
    title: Title[]
    address: Address2
  }
  
  export interface Title {
    start: number
    end: number
  }
  
  export interface Address2 {
    label: Label[]
    country: Country[]
    countryCode: CountryCode[]
    state: State[]
    stateCode: StateCode[]
    county: County[]
    countyCode: CountyCode[]
    city: City[]
    district: District[]
    subdistrict: Subdistrict[]
    block: Block[]
    subblock: Subblock[]
    street: Street[]
    streets: Street2[][]
    postalCode: PostalCode[]
    houseNumber: HouseNumber[]
    building: Building[]
  }
  
  export interface Label {
    start: number
    end: number
  }
  
  export interface Country {
    start: number
    end: number
  }
  
  export interface CountryCode {
    start: number
    end: number
  }
  
  export interface State {
    start: number
    end: number
  }
  
  export interface StateCode {
    start: number
    end: number
  }
  
  export interface County {
    start: number
    end: number
  }
  
  export interface CountyCode {
    start: number
    end: number
  }
  
  export interface City {
    start: number
    end: number
  }
  
  export interface District {
    start: number
    end: number
  }
  
  export interface Subdistrict {
    start: number
    end: number
  }
  
  export interface Block {
    start: number
    end: number
  }
  
  export interface Subblock {
    start: number
    end: number
  }
  
  export interface Street {
    start: number
    end: number
  }
  
  export interface Street2 {
    start: number
    end: number
  }
  
  export interface PostalCode {
    start: number
    end: number
  }
  
  export interface HouseNumber {
    start: number
    end: number
  }
  
  export interface Building {
    start: number
    end: number
  }
  
  export interface StreetInfo {
    baseName: string
    streetType: string
    streetTypePrecedes: boolean
    streetTypeAttached: boolean
    prefix: string
    suffix: string
    direction: string
    language: string
  }
  