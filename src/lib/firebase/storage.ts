import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

export async function uploadFile(
  path: string,
  dataUrl: string
): Promise<{ url: string | null; error: Error | null }> {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadString(storageRef, dataUrl, 'data_url');
    const url = await getDownloadURL(snapshot.ref);
    return { url, error: null };
  } catch (error) {
    return { url: null, error: error as Error };
  }
}
