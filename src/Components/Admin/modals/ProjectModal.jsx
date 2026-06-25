import React, { useState } from 'react';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase';
import { uploadMediaToCloudinary } from '../utils/cloudinary';
import {
  parseListInput,
  parseKeyValueInput,
  parseConfigurationsInput,
  parsePlotSizeInput,
} from '../utils/parsers';
import {
  Modal,
  FormField,
  inputClass,
  textareaClass,
  BtnPrimary,
  BtnGhost,
  ProgressBar,
} from '../components/ui';

const defaultForm = {
  id: '',
  title: '',
  location: '',
  ctaUrl: '',
  ctaLabel: 'Read More',
  status: 'running',
  projectName: '',
  developer: '',
  tagline: '',
  projectLayout: '',
  locationAddress: '',
  locationAdvantages: '',
  amenitiesInput: '',
  configurationsInput: '',
  pricingRateInput: '',
  pricingElectricityInput: '',
  pricingMaintenanceInput: '',
  pricingPrimeInput: '',
  pricingPlotSizeInput: '',
  description: '',
  size: '',
  brochure: '',
};

const buildPricingPayload = (form) => {
  const pricing = {};
  const rate = parseKeyValueInput(form.pricingRateInput, { numeric: true });
  const electricity = parseKeyValueInput(form.pricingElectricityInput, { numeric: true });
  const maintenance = parseKeyValueInput(form.pricingMaintenanceInput, { numeric: true });
  const prime = parseKeyValueInput(form.pricingPrimeInput, { numeric: false });
  const plotSizes = parsePlotSizeInput(form.pricingPlotSizeInput);

  if (Object.keys(rate).length) pricing.rate_per_sqft = rate;
  if (Object.keys(electricity).length) pricing.electricity_charge = electricity;
  if (Object.keys(maintenance).length) pricing.maintenance = maintenance;
  if (Object.keys(prime).length) pricing.prime_location_charges = prime;
  if (Object.keys(plotSizes).length) pricing.plot_size_sqft = plotSizes;

  return Object.keys(pricing).length ? pricing : undefined;
};

export const projectToForm = (project) => ({
  id: project.id || '',
  title: project.title || '',
  location: typeof project.location === 'string' ? project.location : project.location?.summary || '',
  ctaUrl: project.ctaUrl || '',
  ctaLabel: project.ctaLabel || 'Read More',
  status: project.status || 'running',
  projectName: project.project_name || '',
  developer: project.developer || '',
  tagline: project.tagline || '',
  projectLayout: project.project_layout || '',
  locationAddress: project.location?.address || '',
  locationAdvantages: (project.location?.advantages || []).join('\n'),
  amenitiesInput: (project.amenities || []).join('\n'),
  configurationsInput: Object.entries(project.configurations || {})
    .map(([type, cfg]) => `${type}: ${(cfg.sizes_sqft || []).join(', ')}`)
    .join('\n'),
  pricingRateInput: project.pricing?.rate_per_sqft
    ? Object.entries(project.pricing.rate_per_sqft).map(([k, v]) => `${k}: ${v}`).join('\n')
    : '',
  pricingElectricityInput: project.pricing?.electricity_charge
    ? Object.entries(project.pricing.electricity_charge).map(([k, v]) => `${k}: ${v}`).join('\n')
    : '',
  pricingMaintenanceInput: project.pricing?.maintenance
    ? Object.entries(project.pricing.maintenance).map(([k, v]) => `${k}: ${v}`).join('\n')
    : '',
  pricingPrimeInput: project.pricing?.prime_location_charges
    ? Object.entries(project.pricing.prime_location_charges).map(([k, v]) => `${k}: ${v}`).join('\n')
    : '',
  pricingPlotSizeInput: project.pricing?.plot_size_sqft
    ? Object.entries(project.pricing.plot_size_sqft).map(([k, v]) => `${k}: ${v.join(', ')}`).join('\n')
    : '',
  description: project.description || '',
  size: project.size || '',
  brochure: project.brochure || '',
});

const ProjectModal = ({ open, onClose, editingProject, onSuccess }) => {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [brochureFile, setBrochureFile] = useState(null);
  const [brochureName, setBrochureName] = useState('');

  React.useEffect(() => {
    if (open && editingProject) {
      setForm(projectToForm(editingProject));
      setImagePreview(editingProject.image || '');
      setLogoPreview(editingProject.logo || '');
      setImageFile(null);
      setLogoFile(null);
      setBrochureFile(null);
      setBrochureName(editingProject.brochure ? 'Current Brochure PDF' : '');
    } else if (open) {
      setForm(defaultForm);
      setImagePreview('');
      setLogoPreview('');
      setImageFile(null);
      setLogoFile(null);
      setBrochureFile(null);
      setBrochureName('');
    }
  }, [open, editingProject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.location) {
      alert('Title and location are required.');
      return;
    }

    try {
      setSaving(true);
      let imageUrl = null;
      let logoUrl = null;
      let brochureUrl = null;
      if (imageFile) imageUrl = await uploadMediaToCloudinary(imageFile, setProgress);
      if (logoFile) logoUrl = await uploadMediaToCloudinary(logoFile);
      if (brochureFile) brochureUrl = await uploadMediaToCloudinary(brochureFile, setProgress);

      const locationPayload = { summary: form.location };
      if (form.locationAddress) locationPayload.address = form.locationAddress;
      const advantages = parseListInput(form.locationAdvantages);
      if (advantages.length) locationPayload.advantages = advantages;

      const amenities = parseListInput(form.amenitiesInput);
      const configurations = parseConfigurationsInput(form.configurationsInput);
      const pricing = buildPricingPayload(form);

      const payload = {
        title: form.title,
        project_name: form.projectName || form.title,
        developer: form.developer || '',
        tagline: form.tagline || '',
        project_layout: form.projectLayout || '',
        status: form.status,
        location: locationPayload,
        ctaUrl: form.ctaUrl,
        ctaLabel: form.ctaLabel || 'Read More',
        description: form.description || '',
        size: form.size || '',
      };

      if (imageUrl) payload.image = imageUrl;
      if (logoUrl) payload.logo = logoUrl;
      if (brochureUrl) payload.brochure = brochureUrl;
      if (amenities.length) payload.amenities = amenities;
      if (Object.keys(configurations).length) payload.configurations = configurations;
      if (pricing) payload.pricing = pricing;

      if (editingProject) {
        await updateDoc(doc(db, 'projects', editingProject.id), payload);
      } else {
        await addDoc(collection(db, 'projects'), {
          ...payload,
          createdAt: new Date().toISOString(),
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save project.');
    } finally {
      setSaving(false);
      setProgress(0);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      wide
      title={editingProject ? 'Edit Project' : 'Add Project'}
      subtitle="Appears in Running Projects and the logo carousel on the homepage"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Status" required>
            <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
            </select>
          </FormField>
          <FormField label="Project Name / Code">
            <input name="projectName" value={form.projectName} onChange={handleChange} className={inputClass} placeholder="RUDRAAKSH Aaagan" />
          </FormField>
        </div>

        <FormField label="Title" required>
          <input name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="Project title" />
        </FormField>

        <FormField label="Location Summary" required hint="Shown on homepage project cards">
          <input name="location" value={form.location} onChange={handleChange} className={inputClass} placeholder="Located at Sanwer Tehsil" />
        </FormField>

        <FormField label="Description">
          <textarea name="description" value={form.description} onChange={handleChange} className={textareaClass} rows={3} />
        </FormField>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Developer">
            <input name="developer" value={form.developer} onChange={handleChange} className={inputClass} />
          </FormField>
          <FormField label="Size Label">
            <input name="size" value={form.size} onChange={handleChange} className={inputClass} placeholder="e.g. 50 Acres" />
          </FormField>
        </div>

        <FormField label="Tagline">
          <textarea name="tagline" value={form.tagline} onChange={handleChange} className={textareaClass} rows={2} />
        </FormField>

        <FormField label="Amenities" hint="One per line">
          <textarea name="amenitiesInput" value={form.amenitiesInput} onChange={handleChange} className={textareaClass} rows={3} />
        </FormField>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Cover Image">
            <input type="file" accept="image/*" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); }
            }} className={inputClass} />
          </FormField>
          <FormField label="Logo" hint="Shown in logo carousel">
            <input type="file" accept="image/*" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) { setLogoFile(f); setLogoPreview(URL.createObjectURL(f)); }
            }} className={inputClass} />
          </FormField>
        </div>

        <FormField label="Project Brochure (PDF)" hint="Used for download option on project page">
          <input type="file" accept="application/pdf" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) { setBrochureFile(f); setBrochureName(f.name); }
          }} className={inputClass} />
          {brochureName && <div className="text-sm text-green-600 mt-1 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Selected: {brochureName}
          </div>}
        </FormField>

        {(imagePreview || logoPreview) && (
          <div className="flex gap-4">
            {imagePreview && <img src={imagePreview} alt="" className="h-20 rounded-lg object-cover border border-slate-100" />}
            {logoPreview && <img src={logoPreview} alt="" className="h-20 rounded-lg object-contain border border-slate-100 bg-slate-50 p-2" />}
          </div>
        )}

        {saving && progress > 0 && <ProgressBar progress={progress} label="Uploading" />}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <BtnGhost onClick={onClose}>Cancel</BtnGhost>
          <BtnPrimary type="submit" disabled={saving}>
            {saving ? 'Saving...' : editingProject ? 'Save Changes' : 'Add Project'}
          </BtnPrimary>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectModal;
