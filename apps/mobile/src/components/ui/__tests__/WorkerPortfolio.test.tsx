import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WorkerPortfolio from '../WorkerPortfolio';

describe('WorkerPortfolio', () => {
  it('renders empty state when no portfolio items are provided', () => {
    const { getByText } = render(<WorkerPortfolio portfolio={[]} />);
    expect(getByText('No portfolio items yet.')).toBeTruthy();
  });

  it('renders portfolio items correctly', () => {
    const portfolio = [
      { id: '1', title: 'Fixed Sink', description: 'desc', imageUrl: 'url1' },
      { id: '2', title: 'Fixed Toilet', description: 'desc2', imageUrl: 'url2', beforeImageUrl: 'url3' },
    ];
    const { getByText } = render(<WorkerPortfolio portfolio={portfolio} />);
    
    expect(getByText('Portfolio & Past Work')).toBeTruthy();
    expect(getByText('Fixed Sink')).toBeTruthy();
    expect(getByText('Fixed Toilet')).toBeTruthy();
  });

  it('opens modal on item press', () => {
    const portfolio = [
      { id: '1', title: 'Fixed Sink', description: 'sink description', imageUrl: 'url1' },
    ];
    const { getByText, queryByText } = render(<WorkerPortfolio portfolio={portfolio} />);
    
    // The description inside modal shouldn't be visible directly on screen? 
    // Actually, it might be found if modal is just hidden. But modal is only rendered if selectedItem is true.
    expect(queryByText('sink description')).toBeNull();

    fireEvent.press(getByText('Fixed Sink'));
    
    // Now modal is open
    expect(getByText('sink description')).toBeTruthy();
  });

  it('shows before and after labels when beforeImageUrl is present', () => {
    const portfolio = [
      { id: '2', title: 'Fixed Toilet', description: 'desc2', imageUrl: 'url2', beforeImageUrl: 'url3' },
    ];
    const { getByText, queryByText } = render(<WorkerPortfolio portfolio={portfolio} />);
    
    expect(queryByText('Before')).toBeNull();
    
    fireEvent.press(getByText('Fixed Toilet'));
    
    expect(getByText('Before')).toBeTruthy();
    expect(getByText('After')).toBeTruthy();
  });
});
