import React, { useState } from 'react';
import { View, Switch } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useApi, friendlyError } from '../../src/hooks/useApi';
import { useCountry } from '../../src/hooks/useCountry';
import { Screen } from '../../src/components/ds/Screen';
import { Text } from '../../src/components/ds/Text';
import { Button } from '../../src/components/ds/Button';
import { TextInput } from '../../src/components/ds/TextInput';
import { ChipChoice } from '../../src/components/ds/ChipChoice';
import { LoadingState } from '../../src/components/ds/EmptyState';
import { openSettings } from '../../src/services/pickPhoto';
import * as api from '../../src/services/api';

const LABELS = [{ id: 'Home', label: 'Home' }, { id: 'Work', label: 'Work' }, { id: 'Other', label: 'Other' }];

export default function AddressEditScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const theme = useTheme();
  const { country } = useCountry();
  const existing = useApi(async () => (id ? (await api.getAddresses()).find((a) => a.id === id) ?? null : null), [id]);

  if (id && existing.loading) return <Screen title="Address" back><LoadingState /></Screen>;
  return <Form key={id ?? 'new'} initial={existing.data ?? undefined} id={id} countryCode={country} />;
}

function Form({ initial, id, countryCode }: { initial?: api.Address; id?: string; countryCode: string }) {
  const theme = useTheme();
  const [label, setLabel] = useState<string[]>([initial?.label ?? 'Home']);
  const [street, setStreet] = useState(initial?.streetAddress ?? '');
  const [building, setBuilding] = useState(initial?.buildingDetail ?? '');
  const [area, setArea] = useState(initial?.area ?? '');
  const [city, setCity] = useState(initial?.city ?? '');
  const [landmark, setLandmark] = useState(initial?.landmark ?? '');
  const [isDefault, setIsDefault] = useState(initial?.isDefault ?? false);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(
    initial?.latitude != null && initial?.longitude != null ? { latitude: initial.latitude, longitude: initial.longitude } : null,
  );
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | undefined>();
  const [denied, setDenied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const streetError = submitted && !street.trim() ? 'Enter your street or house number.' : undefined;
  const cityError = submitted && !city.trim() ? 'Enter your city.' : undefined;

  const useMyLocation = async () => {
    setLocError(undefined);
    setDenied(false);
    setLocating(true);
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (!perm.granted) {
        setDenied(true);
        setLocError('Location is off. You can turn it on in Settings, or type your address below.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      // Fill what we can, but never overwrite what the person already typed.
      const [place] = await Location.reverseGeocodeAsync(pos.coords).catch(() => []);
      if (place) {
        if (!street.trim()) setStreet([place.streetNumber, place.street].filter(Boolean).join(' ') || place.name || '');
        if (!area.trim()) setArea(place.district ?? place.subregion ?? '');
        if (!city.trim()) setCity(place.city ?? place.region ?? '');
      }
    } catch {
      setLocError("We couldn't find your location. Please type your address instead.");
    } finally {
      setLocating(false);
    }
  };

  const save = async () => {
    setSubmitted(true);
    if (!street.trim() || !city.trim()) return;
    setSaving(true);
    setError(undefined);
    try {
      const body = {
        label: label[0] ?? 'Home', streetAddress: street.trim(), city: city.trim(), country: countryCode,
        area: area.trim() || undefined, buildingDetail: building.trim() || undefined, landmark: landmark.trim() || undefined,
        latitude: coords?.latitude, longitude: coords?.longitude, isDefault,
      };
      if (id) await api.updateAddress(id, body); else await api.createAddress(body);
      router.back();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!id) return;
    setSaving(true);
    try { await api.deleteAddress(id); router.back(); } catch (e) { setError(friendlyError(e)); setSaving(false); }
  };

  return (
    <Screen
      title={id ? 'Edit address' : 'New address'}
      back
      footer={<Button title="Save address" size="lg" variant="primary" loading={saving} disabled={saving} onPress={save} />}
    >
      <Button
        title={coords ? 'Location saved. Update it' : 'Use my current location'}
        variant="secondary" size="lg" loading={locating} disabled={locating} onPress={useMyLocation}
        leftIcon={<Ionicons name="navigate" size={20} color={theme.colors.primary} />}
      />
      {locError ? <Text variant="bodySmall" color={theme.colors.error} accessibilityRole="alert" style={{ marginTop: 8 }}>{locError}</Text> : null}
      {denied ? <Button title="Open Settings" variant="ghost" onPress={openSettings} /> : null}

      <Text variant="bodySmall" weight="medium" color={theme.colors.textSecondary} style={{ marginTop: 24, marginBottom: 8 }}>This is my</Text>
      <ChipChoice options={LABELS} selectedIds={label} onChange={setLabel} />

      <View style={{ gap: 16, marginTop: 24 }}>
        <TextInput label="House / street" value={street} onChangeText={setStreet} autoComplete="street-address" error={streetError} />
        <TextInput label="Flat, floor or building (optional)" value={building} onChangeText={setBuilding} />
        <TextInput label="Area or neighbourhood (optional)" value={area} onChangeText={setArea} />
        <TextInput label="City" value={city} onChangeText={setCity} autoCapitalize="words" error={cityError} />
        <TextInput label="Landmark to help find you (optional)" placeholder="e.g. opposite the mosque" value={landmark} onChangeText={setLandmark} />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 24 }}>
        <Text variant="body" weight="medium" color={theme.colors.textPrimary} style={{ flex: 1 }}>Use this address by default</Text>
        <Switch value={isDefault} onValueChange={setIsDefault} accessibilityLabel="Use this address by default" trackColor={{ true: theme.colors.primary, false: theme.colors.border }} />
      </View>

      {error ? <Text variant="bodySmall" color={theme.colors.error} accessibilityRole="alert" style={{ marginTop: 16 }}>{error}</Text> : null}
      {id ? <View style={{ marginTop: 24 }}><Button title="Delete this address" variant="danger" onPress={remove} disabled={saving} /></View> : null}
    </Screen>
  );
}
