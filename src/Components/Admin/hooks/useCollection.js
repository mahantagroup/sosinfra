import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase';

export const useCollection = (collectionName) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!collectionName) return;
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, collectionName));
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(`Error fetching ${collectionName}:`, err);
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, refresh };
};

export const useGallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'gallery'));
      setItems(snap.docs.map((d) => ({ firebaseDocId: d.id, ...d.data() })));
    } catch (err) {
      console.error('Error fetching gallery:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, refresh };
};

export const useTeam = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'team'));
      setItems(snap.docs.map((d) => ({ firebaseDocId: d.id, ...d.data() })));
    } catch (err) {
      console.error('Error fetching team:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, refresh };
};
