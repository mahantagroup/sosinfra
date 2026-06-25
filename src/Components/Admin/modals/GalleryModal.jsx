import React, { useState, useEffect } from 'react';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase';
import { uploadMediaToCloudinary } from '../utils/cloudinary';
import { Modal, FormField, inputClass, BtnPrimary, BtnGhost, ProgressBar } from '../components/ui';

const defaultForm = { id: '', type: 'achievements', title: '', location: '' };

const GalleryModal = ({ open, onClose, editingItem, onSuccess }) => {
  const [form, setForm] = useState(defaultForm);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const [firebaseDocId, setFirebaseDocId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (open && editingItem) {
      setForm({
        id: editingItem.id || '',
        type: editingItem.type || 'achievements',
        title: editingItem.title || '',
        location: editingItem.location || '',
      });
      setFirebaseDocId(editingItem.firebaseDocId);
      setPreviews(editingItem.images || []);
      setPrimaryIndex(editingItem.primaryImageIndex || 0);
      setFiles([]);
    } else if (open) {
      setForm(defaultForm);
      setFirebaseDocId(null);
      setPreviews([]);
      setFiles([]);
      setPrimaryIndex(0);
    }
  }, [open, editingItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
    setPrimaryIndex(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.id) {
      alert('Gallery item ID is required.');
      return;
    }
    if (!files.length && !editingItem) {
      alert('Please select at least one image.');
      return;
    }

    try {
      setSaving(true);
      let urls = [];
      if (files.length) {
        for (const file of files) {
          urls.push(await uploadMediaToCloudinary(file, setProgress));
        }
      }

      if (firebaseDocId) {
        const payload = { id: form.id, type: form.type, title: form.title, location: form.location };
        if (urls.length) payload.images = urls;
        payload.primaryImageIndex = primaryIndex;
        await updateDoc(doc(db, 'gallery', firebaseDocId), payload);
      } else {
        await addDoc(collection(db, 'gallery'), {
          id: form.id,
          images: urls,
          type: form.type,
          title: form.title,
          location: form.location,
          primaryImageIndex: primaryIndex,
          createdAt: new Date().toISOString(),
        });
      }

      onSuccess();
      onClose();
    } catch {
      alert('Failed to save gallery item.');
    } finally {
      setSaving(false);
      setProgress(0);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingItem ? 'Edit Gallery Item' : 'Add Gallery Item'}
      subtitle="Shown in Events Gallery on the homepage"
      wide
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Item ID" required>
          <input name="id" value={form.id} onChange={handleChange} className={inputClass} placeholder="event-001" />
        </FormField>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Type" required>
            <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
              <option value="corporate_meetings">Corporate Meetings</option>
              <option value="achievements">Achievements</option>
              <option value="anniversaries">Anniversaries</option>
              <option value="events">Events</option>
            </select>
          </FormField>
          <FormField label="Title">
            <input name="title" value={form.title} onChange={handleChange} className={inputClass} />
          </FormField>
        </div>

        <FormField label="Location">
          <input name="location" value={form.location} onChange={handleChange} className={inputClass} />
        </FormField>

        <FormField label="Images" hint={editingItem ? 'Optional — leave empty to keep existing' : 'Required'}>
          <input type="file" accept="image/*" multiple onChange={handleFiles} className={inputClass} />
        </FormField>

        {previews.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {previews.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPrimaryIndex(i)}
                className={`relative rounded-lg overflow-hidden border-2 ${primaryIndex === i ? 'border-[#4A97E4]' : 'border-slate-200'}`}
              >
                <img src={src} alt="" className="w-full h-16 object-cover" />
                {primaryIndex === i && (
                  <span className="absolute inset-0 flex items-center justify-center bg-[#4A97E4]/20 text-[10px] font-bold text-[#4A97E4]">PRIMARY</span>
                )}
              </button>
            ))}
          </div>
        )}

        {saving && progress > 0 && <ProgressBar progress={progress} label="Uploading" />}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <BtnGhost onClick={onClose}>Cancel</BtnGhost>
          <BtnPrimary type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</BtnPrimary>
        </div>
      </form>
    </Modal>
  );
};

export default GalleryModal;
