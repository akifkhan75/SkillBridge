import { useCallback, useState } from 'react';
import { pickPhoto, type PhotoSource } from '../services/pickPhoto';
import { uploadImage, type UploadPurpose } from '../services/upload';
import { friendlyError } from './useApi';

export interface Uploaded { id: string; url: string | null; localUri: string }

/** Pick (camera/gallery) -> shrink -> upload -> server verifies. Exposes busy/error for the screen. */
export function usePhotoUpload(purpose: UploadPurpose, opts: { square?: boolean; frontCamera?: boolean } = {}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [denied, setDenied] = useState(false);

  const run = useCallback(async (source: PhotoSource): Promise<Uploaded | null> => {
    setError(undefined);
    setDenied(false);
    try {
      const picked = await pickPhoto(source, opts);
      if ('cancelled' in picked) return null;
      if ('denied' in picked) {
        setDenied(true);
        setError(picked.denied);
        return null;
      }
      setBusy(true);
      const up = await uploadImage(picked.photo.uri, purpose, picked.photo.width);
      return { ...up, localUri: picked.photo.uri };
    } catch (e) {
      setError(friendlyError(e));
      return null;
    } finally {
      setBusy(false);
    }
  }, [purpose, opts.square, opts.frontCamera]);

  return { run, busy, error, denied };
}
