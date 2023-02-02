import {Client, LatLng, DistanceMatrixRequest, TravelMode} from "@googlemaps/google-maps-services-js";
import config from "config/config";

export interface Coordinates {
  lat: number,
  lng: number
}

export interface AddressResponse {
  address: string,
  coordinates: Coordinates | LatLng
}

const client = new Client({})


export const getAddressData = async (address: string): Promise<null | AddressResponse> => {
  const geocodeResponse = await client.geocode({
    params: {
      key: config.GOOGLE_MAPS_API_KEY,
      address
    }
  })
  const addressData = geocodeResponse.data.results[0]
  return addressData ? {
    address: addressData?.formatted_address,
    coordinates: addressData?.geometry?.location
  } : null
}


export const getDistance = async (origin: LatLng, destination: LatLng): Promise<null | {
  text: string,
  value: number
}> => {
  let distance = null
  try {
    const {data} = await client.distancematrix({
      params: {
        key: config.GOOGLE_MAPS_API_KEY,
        origins: [origin],
        destinations: [destination],
        travelMode: TravelMode.driving,
      }
    } as DistanceMatrixRequest)
    const result = data.rows[0]?.elements[0]?.distance
    if(result){
      distance = result
    }
  } catch (error) {
    console.warn(`'cant get distance for`, origin, destination, error);
  }
  return distance
}
