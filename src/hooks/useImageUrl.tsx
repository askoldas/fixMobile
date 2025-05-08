import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";

export function useImageUrl(path: string | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!path) return;

    const storage = getStorage();
    const fileRef = ref(storage, path);

    getDownloadURL(fileRef)
      .then((url) => setUrl(url))
      .catch(() => setUrl(null));
  }, [path]);

  return url;
}
