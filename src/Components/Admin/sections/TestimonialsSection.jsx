import React, { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Plus, MessageSquareQuote } from 'lucide-react';
import { db } from '../../Firebase/Firebase';
import { useCollection } from '../hooks/useCollection';
import {
  SectionHeader,
  LoadingSpinner,
  EmptyState,
  BtnPrimary,
  BtnGhost,
  BtnDanger,
  ListRow,
  Modal,
  FormField,
  inputClass,
} from '../components/ui';

const TestimonialForm = ({ open, onClose, editing, onSuccess }) => {
  const [videoId, setVideoId] = useState('');
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (open && editing) {
      setVideoId(editing.videoId || '');
      setTitle(editing.title || '');
    } else if (open) {
      setVideoId('');
      setTitle('');
    }
  }, [open, editing]);

  const extractId = (input) => {
    const trimmed = input.trim();
    if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
      const match = trimmed.match(/(?:embed\/|v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      return match ? match[1] : trimmed;
    }
    return trimmed;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = extractId(videoId);
    if (!id) {
      alert('YouTube video ID or URL is required.');
      return;
    }

    try {
      setSaving(true);
      const payload = { videoId: id, title: title || 'Client Story' };
      if (editing) {
        await updateDoc(doc(db, 'testimonials', editing.id), payload);
      } else {
        await addDoc(collection(db, 'testimonials'), {
          ...payload,
          createdAt: new Date().toISOString(),
        });
      }
      onSuccess();
      onClose();
    } catch {
      alert('Failed to save testimonial.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Testimonial' : 'Add Testimonial'}
      subtitle="YouTube videos shown in Our Happy Faces section"
    >
      <form onSubmit={handleSubmit}>
        <FormField label="YouTube URL or Video ID" required hint="e.g. dtYuw2SlOtw or full embed URL">
          <input value={videoId} onChange={(e) => setVideoId(e.target.value)} className={inputClass} placeholder="https://www.youtube.com/embed/..." />
        </FormField>
        <FormField label="Title">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Client Story" />
        </FormField>
        <div className="d-flex justify-content-end gap-2 pt-3 mt-3" style={{ borderTop: '1px solid var(--admin-border)' }}>
          <BtnGhost onClick={onClose}>Cancel</BtnGhost>
          <BtnPrimary type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</BtnPrimary>
        </div>
      </form>
    </Modal>
  );
};

const TestimonialsSection = () => {
  const { items, loading, refresh } = useCollection('testimonials');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      refresh();
    } catch {
      alert('Failed to delete.');
    }
  };

  return (
    <div>
      <SectionHeader
       
        homepage="Happy Faces"
        action={
          <BtnPrimary onClick={() => { setEditing(null); setModalOpen(true); }}>
            <Plus size={16} /> Add Video
          </BtnPrimary>
        }
      />

      {loading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <EmptyState
          icon={MessageSquareQuote}
          title="No testimonials"
          description="Add YouTube videos to populate the Happy Faces carousel. Default videos are used until you add some."
          action={
            <BtnPrimary onClick={() => { setEditing(null); setModalOpen(true); }}>
              <Plus size={16} /> Add Video
            </BtnPrimary>
          }
        />
      ) : (
        <ul className="admin-list">
          {items.map((item) => (
            <ListRow
              key={item.id}
              image={`https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`}
              title={item.title || 'Client Story'}
              meta={`Video ID: ${item.videoId}`}
              actions={
                <>
                  <BtnGhost onClick={() => { setEditing(item); setModalOpen(true); }}>Edit</BtnGhost>
                  <BtnDanger onClick={() => handleDelete(item.id)}>Delete</BtnDanger>
                </>
              }
            />
          ))}
        </ul>
      )}

      <TestimonialForm open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} onSuccess={refresh} />
    </div>
  );
};

export default TestimonialsSection;
