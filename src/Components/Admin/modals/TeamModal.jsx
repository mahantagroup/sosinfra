import React, { useState, useEffect } from 'react';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase';
import { uploadMediaToCloudinary } from '../utils/cloudinary';
import { Modal, FormField, inputClass, BtnPrimary, BtnGhost, ProgressBar } from '../components/ui';

const TeamModal = ({ open, onClose, editingMember, onSuccess }) => {
  const [form, setForm] = useState({ id: '', name: '', role: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [firebaseDocId, setFirebaseDocId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (open && editingMember) {
      setForm({ id: editingMember.id || '', name: editingMember.name || '', role: editingMember.role || '' });
      setFirebaseDocId(editingMember.firebaseDocId);
      setPreview(editingMember.image || '');
      setFile(null);
    } else if (open) {
      setForm({ id: '', name: '', role: '' });
      setFirebaseDocId(null);
      setPreview('');
      setFile(null);
    }
  }, [open, editingMember]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.role) {
      alert('Name and role are required.');
      return;
    }

    try {
      setSaving(true);
      let imageUrl = null;
      if (file) imageUrl = await uploadMediaToCloudinary(file, setProgress);

      if (firebaseDocId) {
        const payload = { id: form.id, name: form.name, role: form.role };
        if (imageUrl) payload.image = imageUrl;
        await updateDoc(doc(db, 'team', firebaseDocId), payload);
      } else {
        if (!imageUrl) {
          alert('Please provide a photo.');
          return;
        }
        await addDoc(collection(db, 'team'), {
          id: form.id,
          name: form.name,
          role: form.role,
          image: imageUrl,
          createdAt: new Date().toISOString(),
        });
      }

      onSuccess();
      onClose();
    } catch {
      alert('Failed to save team member.');
    } finally {
      setSaving(false);
      setProgress(0);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={firebaseDocId ? 'Edit Team Member' : 'Add Team Member'}
      subtitle="Displayed on the About page"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Member ID">
          <input name="id" value={form.id} onChange={(e) => setForm((p) => ({ ...p, id: e.target.value }))} className={inputClass} />
        </FormField>
        <FormField label="Name" required>
          <input name="name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={inputClass} />
        </FormField>
        <FormField label="Role" required>
          <input name="role" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} className={inputClass} />
        </FormField>
        <FormField label="Photo" hint={firebaseDocId ? 'Leave empty to keep existing' : 'Required'}>
          <input type="file" accept="image/*" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
          }} className={inputClass} />
        </FormField>
        {preview && <img src={preview} alt="" className="h-32 rounded-xl object-cover border border-slate-100" />}
        {saving && progress > 0 && <ProgressBar progress={progress} label="Uploading" />}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <BtnGhost onClick={onClose}>Cancel</BtnGhost>
          <BtnPrimary type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</BtnPrimary>
        </div>
      </form>
    </Modal>
  );
};

export default TeamModal;
