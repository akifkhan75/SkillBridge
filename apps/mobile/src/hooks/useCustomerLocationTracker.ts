import { useEffect } from 'react';
import * as Location from 'expo-location';
import { useAppSelector, useAppDispatch } from './useRedux';
import { selectTrackingState, updateCustomerLocation, updateWorkerLocation } from '../store/trackingSlice';
import { socketService } from '../services/socket';
import { selectCurrentUser } from '../store/authSlice';

export function useCustomerLocationTracker() {
  const dispatch = useAppDispatch();
  const trackingState = useAppSelector(selectTrackingState);
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startTracking = async () => {
      // Location is only collected while a worker is actively on the way (docs 11/13/19),
      // not from the moment the customer logs in.
      if (currentUser?.type !== 'customer' || !trackingState.isTracking) {
        return;
      }

      // 1. Watch Customer's own location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 10000,
            distanceInterval: 50,
          },
          (location) => {
            dispatch(updateCustomerLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }));
          }
        );
      }

      // 2. Listen to Worker's location updates via Socket if tracking is active
      const unsubscribe = socketService.onLocationUpdate((data) => {
        if (trackingState.isTracking && trackingState.trackedWorkerId === data.workerId) {
          dispatch(updateWorkerLocation({
            latitude: data.latitude,
            longitude: data.longitude,
            heading: data.heading,
          }));
        }
      });

      return unsubscribe;
    };

    const cleanupSocket = startTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
      cleanupSocket.then(unsubscribe => {
        if (unsubscribe) unsubscribe();
      });
    };
  }, [trackingState.isTracking, trackingState.trackedWorkerId, currentUser?.type, dispatch]);
}
