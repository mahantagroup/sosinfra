import React, { useState } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { Home, Search } from 'lucide-react';
import { db } from '../../Firebase';
import { useCollection } from '../hooks/useCollection';
import {
  SectionHeader,
  LoadingSpinner,
  EmptyState,
  Badge,
  BtnDanger,
  ListRow,
  inputClass,
} from '../components/ui';

const PropertiesSection = () => {
  const { items, loading, refresh } = useCollection('properties');
  const [search, setSearch] = useState('');

  const filtered = items.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.location?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property from the homepage listings?')) return;
    try {
      await deleteDoc(doc(db, 'properties', id));
      refresh();
    } catch {
      alert('Failed to delete property.');
    }
  };

  return (
    <div>
      <SectionHeader
        title="Properties"
        subtitle="View and remove listings shown in Featured Properties. Adding properties is disabled."
        homepage="Featured Properties"
      />

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by title or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} pl-11`}
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Home}
          title="No properties found"
          description={search ? 'Try a different search term.' : 'Properties appear here when added to Firebase.'}
        />
      ) : (
        <ul className="space-y-3">
          {filtered.map((property) => (
            <ListRow
              key={property.id}
              image={property.images?.[0] || property.image || '/images/home/house-1.jpg'}
              title={property.title}
              meta={`${property.location || 'No location'} · ${property.price || 'Contact for price'}`}
              badges={
                <>
                  {property.featured && <Badge variant="featured">Featured</Badge>}
                  <Badge variant={property.forSale ? 'sale' : 'rent'}>
                    {property.forSale ? 'For Sale' : 'For Lease'}
                  </Badge>
                </>
              }
              actions={<BtnDanger onClick={() => handleDelete(property.id)}>Delete</BtnDanger>}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default PropertiesSection;
