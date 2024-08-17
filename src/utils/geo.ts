import * as geolib from 'geolib';
import { KM_DIVISOR } from './constants';

export const getDistance = (pointOne: number[], pointTwo: number[]): number => {
  const [latitude, longitude] = pointOne;
  const [alLatitude, alLongitude] = pointTwo;

  const distanceInKm =
    geolib.getDistance(
      { latitude, longitude },
      { latitude: alLatitude, longitude: alLongitude },
    ) / KM_DIVISOR;

  return distanceInKm;
};
