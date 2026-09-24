import { useState, useEffect } from 'react';
import { Query, onSnapshot } from 'firebase/firestore';
import { DEFAULT_STREAMS } from '@/data/defaultStreams';

export function useCollection<T = any>(queryRef: Query | null | undefined) {
  const [data, setData] = useState<T[] | null>(DEFAULT_STREAMS as unknown as T[]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!queryRef) {
      setData(DEFAULT_STREAMS as unknown as T[]);
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      queryRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as T[];
          setData(items);
        } else {
          // If Firestore is empty, provide default stream collection
          setData(DEFAULT_STREAMS as unknown as T[]);
        }
        setIsLoading(false);
      },
      (err) => {
        console.warn('Firestore query fallback to default streams:', err.message);
        setError(err);
        setData(DEFAULT_STREAMS as unknown as T[]);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [queryRef]);

  return { data, isLoading, error };
}
