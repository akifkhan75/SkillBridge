import { useEffect } from 'react';
import * as Location from 'expo-location';
import { useAppSelector, useAppDispatch } from './useRedux';
import { selectTrackingState, updateWorkerLocation } from '../store/trackingSlice';
import { socketService } from '../services/socket';
import { selectCurrentUser } from '../store/authSlice';

export function useWorkerLocationTracker() {
  const dispatch = useAppDispatch();
  const trackingState = useAppSelector(selectTrackingState);
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startTracking = async () => {
      // Only start tracking if the user is a worker, isTracking is true, and we have a customer to track to
      if (currentUser?.type !== 'worker' || !trackingState.isTracking || !trackingState.trackedWorkerId /* using trackedWorkerId as customerId for now, need to clarify */) {
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location) => {
          const coords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            heading: location.coords.heading || undefined,
          };

          // Update local state (optional for worker, but good for UI)
          dispatch(updateWorkerLocation(coords));

          // Emit to customer via socket
          if (trackingState.trackedWorkerId) {
            // Note: in worker flow, trackedWorkerId would be the customerId they are navigating to
            socketService.sendLocation(trackingState.trackedWorkerId, coords.latitude, coords.longitude, coords.heading);
          }
        }
      );
    };

    startTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [trackingState.isTracking, trackingState.trackedWorkerId, currentUser?.type, dispatch]);
}
