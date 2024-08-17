import * as geolib from 'geolib';
import { KM_DIVISOR } from './constants';
import { Location } from '@Domain/entities/trip.entity';

export const getDistance = (pointOne: Location, pointTwo: Location): number => {
  const { latitude, longitude } = pointOne;
  const { latitude: alLatitude, longitude: alLongitude } = pointTwo;

  const distanceInKm =
    geolib.getDistance(
      { latitude, longitude },
      { latitude: alLatitude, longitude: alLongitude },
    ) / KM_DIVISOR;

  return distanceInKm;
};
