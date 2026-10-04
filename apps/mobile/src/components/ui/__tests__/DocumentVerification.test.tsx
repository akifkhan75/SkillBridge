import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import DocumentVerification from '../DocumentVerification';

describe('DocumentVerification', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders initial state correctly', () => {
    const { getByText } = render(<DocumentVerification />);
    expect(getByText('Identity & License Verification')).toBeTruthy();
    expect(getByText('Tap to upload documents')).toBeTruthy();
  });

  it('shows loading state on upload and then success state', async () => {
    const onUploadSuccess = jest.fn();
    const { getByText, queryByText } = render(<DocumentVerification onUploadSuccess={onUploadSuccess} />);
    
    // Initial state
    expect(queryByText('Running OCR Scan...')).toBeNull();
    
    // Press upload
    fireEvent.press(getByText('Tap to upload documents'));
    
    // Loading state
    expect(getByText('Running OCR Scan...')).toBeTruthy();
    
    // Fast forward timer by 2500ms
    act(() => {
      jest.advanceTimersByTime(2500);
    });
    
    // Success state
    expect(getByText('Documents Verified')).toBeTruthy();
    expect(queryByText('Running OCR Scan...')).toBeNull();
    expect(onUploadSuccess).toHaveBeenCalled();
  });
});
