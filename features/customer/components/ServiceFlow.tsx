
import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectCustomerFlow } from '../../../store/customerFlowSlice';
import { ServiceSelectionView } from './ServiceSelectionView';
import { MatchingResultsView } from './MatchingResultsView';
import { CategoryBrowserView } from './CategoryBrowserView';
import { WorkerProfileView } from './WorkerProfileView';

export const ServiceFlow: React.FC = () => {
  const { customerFlowState } = useAppSelector(selectCustomerFlow);

  switch (customerFlowState) {
    case 'SHOWING_MATCHES':
      return <MatchingResultsView />;
    case 'BROWSING_CATEGORIES':
      return <CategoryBrowserView />;
    case 'VIEWING_WORKER_PROFILE':
      return <WorkerProfileView />;
    case 'SELECTING_SERVICE':
    default:
      return <ServiceSelectionView />;
  }
};
