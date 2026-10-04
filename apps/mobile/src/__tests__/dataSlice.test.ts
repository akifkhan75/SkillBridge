import dataReducer, { addJobRequest, updateJobRequest } from '../store/dataSlice';

describe('dataSlice', () => {
  const initialState = {
    users: [],
    workers: [],
    jobRequests: [],
    servicePackages: [],
    subscriptionPlans: [],
    isLoading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(dataReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addJobRequest', () => {
    const actual = dataReducer(initialState, addJobRequest({ id: '1', title: 'Job' } as any));
    expect(actual.jobRequests.length).toEqual(1);
    expect(actual.jobRequests[0].title).toEqual('Job');
  });

  it('should handle updateJobRequest', () => {
    const state = {
      ...initialState,
      jobRequests: [{ id: '1', title: 'Old Job' } as any]
    };
    const actual = dataReducer(state, updateJobRequest({ id: '1', title: 'New Job' } as any));
    expect(actual.jobRequests[0].title).toEqual('New Job');
  });
});
