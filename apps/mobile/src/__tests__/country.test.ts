jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
import { pickCountry } from '../hooks/useCountry';

describe('pickCountry', () => {
  it('prefers the saved choice when that country is open', () => {
    expect(pickCountry(['PK', 'AE'], 'AE', 'PK')).toBe('AE');
  });
  it('falls back to the device region', () => {
    expect(pickCountry(['PK', 'AE'], null, 'ae')).toBe('AE');
  });
  it('ignores a saved or detected country that is not open', () => {
    expect(pickCountry(['PK'], 'IN', 'IN')).toBe('PK');
    expect(pickCountry(['PK'], 'XX', undefined)).toBe('PK');
  });
  it('uses the first open country if the default is closed', () => {
    expect(pickCountry(['AE', 'SA'], null, 'US')).toBe('AE');
  });
});
