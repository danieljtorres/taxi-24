import { TripStatus } from '@Domain/entities/trip.entity';
import {
  STATUS_LABEL_ACCEPT,
  STATUS_LABEL_COMPLETED,
  STATUS_LABEL_REQUESTED,
} from './constants';

const statusLabelMap = new Map();
statusLabelMap.set(TripStatus.REQUESTED, STATUS_LABEL_REQUESTED);
statusLabelMap.set(TripStatus.ACCEPT, STATUS_LABEL_ACCEPT);
statusLabelMap.set(TripStatus.COMPLETED, STATUS_LABEL_COMPLETED);

export const tripStatusToLabel = (status: number) => statusLabelMap.get(status);
