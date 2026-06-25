import React, { useState, useEffect } from 'react';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase';
import { uploadMediaToCloudinary } from '../utils/cloudinary';
import { Modal, FormField, inputClass, textareaClass, BtnPrimary, BtnGhost, ProgressBar } from '../components/ui';

const defaultForm = { title: '', author: '', category: '', date: '', excerpt: '', ctaUrl: '' };

const BlogModal = ({ open, onClose, editingBlog, onSuccess }) => {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (open && editingBlog) {
      setForm({
        title: editingBlog.title || '',
        author: editingBlog.author || '',
        category: editingBlog.category || '',
        date: editingBlog.date || '',
        excerpt: editingBlog.excerpt || '',
        ctaUrl: editingBlog.ctaUrl || '',
      });
      setPreview(editingBlog.image || '');
      setFile(null);
    } else if (open) {
      setForm(defaultForm);
      setPreview('');
      setFile(null);
    }
  }, [open, editingBlog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.excerpt) {
      alert('Title, author and excerpt are required.');
      return;
    }

    try {
      setSaving(true);
      let imageUrl = null;
      if (file) imageUrl = await uploadMediaToCloudinary(file, setProgress);

      const payload = { ...form };
      if (imageUrl) payload.image = imageUrl;

      if (editingBlog) {
        await updateDoc(doc(db, 'blogs', editingBlog.id), payload);
      } else {
        await addDoc(collection(db, 'blogs'), {
          ...payload,
          image: imageUrl || null,
          createdAt: new Date().toISOString(),
        });
      }

      onSuccess();
      onClose();
    } catch {
      alert('Failed to save blog.');
    } finally {
      setSaving(false);
      setProgress(0);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingBlog ? 'Edit Article' : 'Publish Article'}
      subtitle="Appears in the Journal section on the homepage"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Title" required>
          <input name="title" value={form.title} onChange={handleChange} className={inputClass} />
        </FormField>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Author" required>
            <input name="author" value={form.author} onChange={handleChange} className={inputClass} />
          </FormField>
          <FormField label="Category">
            <input name="category" value={form.category} onChange={handleChange} className={inputClass} placeholder="Investment" />
          </FormField>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Date">
            <input type="date" name="date" value={form.date} onChange={handleChange} className={inputClass} />
          </FormField>
          <FormField label="External URL">
            <input name="ctaUrl" value={form.ctaUrl} onChange={handleChange} className={inputClass} placeholder="https://" />
          </FormField>
        </div>

        <FormField label="Excerpt" required>
          <textarea name="excerpt" value={form.excerpt} onChange={handleChange} className={textareaClass} rows={4} />
        </FormField>

        <FormField label="Cover Image" hint={editingBlog ? 'Leave empty to keep existing' : 'Optional'}>
          <input type="file" accept="image/*" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
          }} className={inputClass} />
        </FormField>

        {preview && <img src={preview} alt="" className="h-32 rounded-xl object-cover border border-slate-100" />}

        {saving && progress > 0 && <ProgressBar progress={progress} label="Uploading" />}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <BtnGhost onClick={onClose}>Cancel</BtnGhost>
          <BtnPrimary type="submit" disabled={saving}>{saving ? 'Publishing...' : 'Publish'}</BtnPrimary>
        </div>
      </form>
    </Modal>
  );
};

export default BlogModal;
