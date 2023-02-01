import { Client } from "@googlemaps/google-maps-services-js";
import config from "config/config";

interface AddressResponse{
  address: string,
  coordinates: {
    lat: number,
    lng: number
  }
}

const client = new Client({})


export const getAddressData = async (address: string): Promise<null | AddressResponse> => {
  const geocodeResponse = await client.geocode({
    params:{
      key: config.GOOGLE_MAPS_API_KEY,
      address
    }
  })
  const addressData = geocodeResponse.data.results[0]
  return addressData ?{
    address: addressData?.formatted_address,
    coordinates: addressData?.geometry?.location
  } : null
}
