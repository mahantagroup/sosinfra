import React, { useState } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { Plus, Users } from 'lucide-react';
import { db } from '../../Firebase/Firebase';
import { useTeam } from '../hooks/useCollection';
import TeamModal from '../modals/TeamModal';
import {
  SectionHeader,
  LoadingSpinner,
  EmptyState,
  BtnPrimary,
  BtnGhost,
  BtnDanger,
  ListRow,
} from '../components/ui';

const TeamSection = () => {
  const { items, loading, refresh } = useTeam();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleDelete = async (firebaseDocId) => {
    if (!window.confirm('Delete this team member?')) return;
    try {
      await deleteDoc(doc(db, 'team', firebaseDocId));
      refresh();
    } catch {
      alert('Failed to delete.');
    }
  };

  return (
    <div>
      <SectionHeader
        title="Team"
        subtitle="Manage team members shown on the About page."
        homepage="About Page"
        action={
          <BtnPrimary onClick={() => { setEditing(null); setModalOpen(true); }}>
            <Plus size={16} /> Add Member
          </BtnPrimary>
        }
      />

      {loading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No team members"
          description="Add your first team member."
          action={
            <BtnPrimary onClick={() => { setEditing(null); setModalOpen(true); }}>
              <Plus size={16} /> Add Member
            </BtnPrimary>
          }
        />
      ) : (
        <ul className="admin-list">
          {items.map((member) => (
            <ListRow
              key={member.firebaseDocId}
              image={member.image || '/images/agents/agent-1.jpg'}
              title={member.name}
              id={member.id}
              meta={member.role}
              actions={
                <>
                  <BtnGhost onClick={() => { setEditing(member); setModalOpen(true); }}>Edit</BtnGhost>
                  <BtnDanger onClick={() => handleDelete(member.firebaseDocId)}>Delete</BtnDanger>
                </>
              }
            />
          ))}
        </ul>
      )}

      <TeamModal open={modalOpen} onClose={() => setModalOpen(false)} editingMember={editing} onSuccess={refresh} />
    </div>
  );
};

export default TeamSection;
