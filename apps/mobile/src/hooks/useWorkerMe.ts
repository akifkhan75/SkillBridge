import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { useApi } from './useApi';
import * as api from '../services/api';

/** The signed-in worker's own profile, refreshed whenever the screen comes into focus. */
export function useWorkerMe() {
  const state = useApi(api.getWorkerMe);
  useFocusEffect(useCallback(() => { state.reload(); }, [state.reload]));
  return state;
}
