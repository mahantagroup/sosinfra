import React, { useState } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { Plus, Building2 } from 'lucide-react';
import { db } from '../../Firebase/Firebase';
import { useCollection } from '../hooks/useCollection';
import { extractProjectLocation } from '../utils/parsers';
import ProjectModal from '../modals/ProjectModal';
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

const ProjectsSection = () => {
  const { items, loading, refresh } = useCollection('projects');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setEditing(project);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project? It will be removed from the homepage.')) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
      refresh();
    } catch {
      alert('Failed to delete project.');
    }
  };

  return (
    <div>
      <SectionHeader
        title="Projects"
        subtitle="Manage running and completed developments shown on the homepage."
        homepage="Projects & Logo Carousel"
        action={
          <BtnPrimary onClick={openAdd}>
            <Plus size={16} /> Add Project
          </BtnPrimary>
        }
      />

      {loading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No projects yet"
          description="Add your first project to showcase it on the homepage."
          action={<BtnPrimary onClick={openAdd}><Plus size={16} /> Add Project</BtnPrimary>}
        />
      ) : (
        <ul className="admin-list">
          {items.map((project) => (
            <ListRow
              key={project.id}
              image={project.logo || project.image }
              title={project.title}
              id={project.projectId}
              meta={extractProjectLocation(project)}
              badges={
                <Badge variant={project.status === 'completed' ? 'completed' : 'running'}>
                  {project.status === 'completed' ? 'Completed' : 'Running'}
                </Badge>
              }
              actions={
                <>
                  <BtnGhost onClick={() => openEdit(project)}>Edit</BtnGhost>
                  <BtnDanger onClick={() => handleDelete(project.id)}>Delete</BtnDanger>
                </>
              }
            />
          ))}
        </ul>
      )}

      <ProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editingProject={editing}
        onSuccess={refresh}
      />
    </div>
  );
};

export default ProjectsSection;
