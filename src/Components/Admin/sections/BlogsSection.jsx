import React, { useState } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { Plus, Newspaper } from 'lucide-react';
import { db } from '../../Firebase/Firebase';
import { useCollection } from '../hooks/useCollection';
import BlogModal from '../modals/BlogModal';
import {
  SectionHeader,
  LoadingSpinner,
  EmptyState,
  BtnPrimary,
  BtnGhost,
  BtnDanger,
  ListRow,
} from '../components/ui';

const BlogsSection = () => {
  const { items, loading, refresh } = useCollection('blogs');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await deleteDoc(doc(db, 'blogs', id));
      refresh();
    } catch {
      alert('Failed to delete blog.');
    }
  };

  return (
    <div>
      <SectionHeader
        title="Blog Publisher"
        subtitle="Publish insights that appear in the Journal section."
        homepage="Journal"
        action={
          <BtnPrimary onClick={() => { setEditing(null); setModalOpen(true); }}>
            <Plus size={16} /> Add Article
          </BtnPrimary>
        }
      />

      {loading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="No blog posts"
          description="Publish your first article for the homepage."
          action={
            <BtnPrimary onClick={() => { setEditing(null); setModalOpen(true); }}>
              <Plus size={16} /> Add Article
            </BtnPrimary>
          }
        />
      ) : (
        <ul className="admin-list">
          {items.map((blog) => (
            <ListRow
              key={blog.id}
              image={blog.image || '/images/blog/blog-1.jpg'}
              title={blog.title}
              meta={`${blog.author || 'SOS'} · ${blog.category || 'General'}`}
              actions={
                <>
                  <BtnGhost onClick={() => { setEditing(blog); setModalOpen(true); }}>Edit</BtnGhost>
                  <BtnDanger onClick={() => handleDelete(blog.id)}>Delete</BtnDanger>
                </>
              }
            />
          ))}
        </ul>
      )}

      <BlogModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editingBlog={editing}
        onSuccess={refresh}
      />
    </div>
  );
};

export default BlogsSection;
