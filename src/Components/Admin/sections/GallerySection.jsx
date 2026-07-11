import React, { useState } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { Plus, Images } from 'lucide-react';
import { db } from '../../Firebase/Firebase';
import { useGallery } from '../hooks/useCollection';
import GalleryModal from '../modals/GalleryModal';
import {
  SectionHeader,
  LoadingSpinner,
  EmptyState,
  Badge,
  BtnPrimary,
  BtnGhost,
  BtnDanger,
  ListRow,
} from '../components/ui';

const GallerySection = () => {
  const { items, loading, refresh } = useGallery();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleDelete = async (firebaseDocId) => {
    if (!window.confirm('Delete this gallery item?')) return;
    try {
      await deleteDoc(doc(db, 'gallery', firebaseDocId));
      refresh();
    } catch {
      alert('Failed to delete.');
    }
  };

  const getImage = (item) =>
    (item.images && item.images[item.primaryImageIndex || 0]) || item.image || (item.images && item.images[0]);

  return (
    <div>
      <SectionHeader
       
        homepage="Events Gallery"
        action={
          <BtnPrimary onClick={() => { setEditing(null); setModalOpen(true); }}>
            <Plus size={16} /> Add Item
          </BtnPrimary>
        }
      />

      {loading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Images}
          title="No gallery items"
          description="Add images to populate the Events Gallery section."
          action={
            <BtnPrimary onClick={() => { setEditing(null); setModalOpen(true); }}>
              <Plus size={16} /> Add Item
            </BtnPrimary>
          }
        />
      ) : (
        <ul className="admin-list">
          {items.map((item) => (
            <ListRow
              key={item.firebaseDocId}
              image={getImage(item)}
              title={item.title || 'Gallery Item'}
              meta={`${(item.type || '').replace(/_/g, ' ')}${item.location ? ` · ${item.location}` : ''}`}
              badges={<Badge>{item.id}</Badge>}
              actions={
                <>
                  <BtnGhost onClick={() => { setEditing(item); setModalOpen(true); }}>Edit</BtnGhost>
                  <BtnDanger onClick={() => handleDelete(item.firebaseDocId)}>Delete</BtnDanger>
                </>
              }
            />
          ))}
        </ul>
      )}

      <GalleryModal open={modalOpen} onClose={() => setModalOpen(false)} editingItem={editing} onSuccess={refresh} />
    </div>
  );
};

export default GallerySection;
