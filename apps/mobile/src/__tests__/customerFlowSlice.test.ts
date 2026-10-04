import customerFlowReducer, {
  setCustomerPage,
  setCustomerFlowState,
  resetCustomerFlow,
  setTopCategory,
  setSubCategory,
  setViewWorkerProfile,
  backToPreviousCustomerView,
  backToCategorySelection,
  backFromSubCategoryToTop,
  setSearchTerm,
  setFilterSkill,
  setServiceFormVisibility,
} from '../store/customerFlowSlice';
import { ICategoryDefinition, ISubCategory, JobCategory } from '@skillbridge/shared';

describe('customerFlowSlice', () => {
  const initialState = {
    page: 'SERVICE_FLOW' as const,
    customerFlowState: 'SELECTING_SERVICE' as const,
    currentJobRequestDetails: null,
    matchedWorkersList: [],
    viewingWorkerProfileId: null,
    selectedTopCategory: null,
    selectedSubCategory: null,
    searchTerm: '',
    filterSkill: 'all' as const,
    isServiceFormVisible: false,
  };

  const mockCategory: ICategoryDefinition = {
    id: 'cat1',
    nameEnum: JobCategory.PLUMBING,
    iconName: 'water',
    color: '#000',
    textColor: '#FFF',
    descriptionKey: 'plumb',
    subCategories: [],
  };

  const mockSubCategory: ISubCategory = {
    id: 'sub1',
    name: 'Leak Repair',
  };

  it('should handle initial state', () => {
    expect(customerFlowReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setCustomerPage', () => {
    const nextState = customerFlowReducer(initialState, setCustomerPage('BOOKINGS'));
    expect(nextState.page).toBe('BOOKINGS');
    expect(nextState.customerFlowState).toBe('SELECTING_SERVICE');
  });

  it('should handle setCustomerFlowState', () => {
    expect(
      customerFlowReducer(initialState, setCustomerFlowState('SHOWING_MATCHES')).customerFlowState
    ).toBe('SHOWING_MATCHES');
  });

  it('should handle resetCustomerFlow', () => {
    const state = { ...initialState, isServiceFormVisible: true, selectedTopCategory: mockCategory };
    const nextState = customerFlowReducer(state, resetCustomerFlow());
    expect(nextState.isServiceFormVisible).toBe(false);
    expect(nextState.selectedTopCategory).toBeNull();
  });

  it('should handle setTopCategory', () => {
    const nextState = customerFlowReducer(initialState, setTopCategory(mockCategory));
    expect(nextState.selectedTopCategory).toEqual(mockCategory);
    expect(nextState.customerFlowState).toBe('BROWSING_CATEGORIES');
  });

  it('should handle setSubCategory', () => {
    const nextState = customerFlowReducer(initialState, setSubCategory(mockSubCategory));
    expect(nextState.selectedSubCategory).toEqual(mockSubCategory);
  });

  it('should handle setViewWorkerProfile', () => {
    const nextState = customerFlowReducer(initialState, setViewWorkerProfile('worker123'));
    expect(nextState.viewingWorkerProfileId).toBe('worker123');
    expect(nextState.customerFlowState).toBe('VIEWING_WORKER_PROFILE');
  });

  it('should handle backToCategorySelection', () => {
    const state = { ...initialState, selectedTopCategory: mockCategory, viewingWorkerProfileId: '123' };
    const nextState = customerFlowReducer(state, backToCategorySelection());
    expect(nextState.customerFlowState).toBe('SELECTING_SERVICE');
    expect(nextState.selectedTopCategory).toBeNull();
    expect(nextState.viewingWorkerProfileId).toBeNull();
  });

  it('should handle backFromSubCategoryToTop', () => {
    const state = { ...initialState, selectedSubCategory: mockSubCategory, searchTerm: 'leak' };
    const nextState = customerFlowReducer(state, backFromSubCategoryToTop());
    expect(nextState.selectedSubCategory).toBeNull();
    expect(nextState.searchTerm).toBe('');
    expect(nextState.filterSkill).toBe('all');
  });

  it('should handle setSearchTerm', () => {
    expect(customerFlowReducer(initialState, setSearchTerm('pipe')).searchTerm).toBe('pipe');
  });

  it('should handle setFilterSkill', () => {
    expect(customerFlowReducer(initialState, setFilterSkill(JobCategory.PLUMBING)).filterSkill).toBe(JobCategory.PLUMBING);
  });

  it('should handle setServiceFormVisibility', () => {
    expect(customerFlowReducer(initialState, setServiceFormVisibility(true)).isServiceFormVisible).toBe(true);
  });
});
