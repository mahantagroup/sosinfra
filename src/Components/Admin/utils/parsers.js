export const parseListInput = (value = '') =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

export const parseKeyValueInput = (value = '', { numeric = true } = {}) => {
  const result = {};
  value.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || !trimmed.includes(':')) return;
    const [key, ...rest] = trimmed.split(':');
    const rawVal = rest.join(':');
    if (!key || !rawVal) return;
    const cleaned = rawVal.trim();
    if (!cleaned) return;
    let finalValue = cleaned;
    if (numeric) {
      const numericValue = Number(cleaned);
      if (!Number.isNaN(numericValue)) finalValue = numericValue;
    }
    result[key.trim()] = finalValue;
  });
  return result;
};

export const parseConfigurationsInput = (value = '') => {
  const result = {};
  value.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || !trimmed.includes(':')) return;
    const [type, ...rest] = trimmed.split(':');
    const sizesString = rest.join(':');
    if (!type || !sizesString) return;
    const sizes = sizesString
      .split(',')
      .map((size) => size.trim())
      .filter(Boolean)
      .map((size) => {
        const numericValue = Number(size);
        return Number.isNaN(numericValue) ? size : numericValue;
      });
    if (sizes.length) result[type.trim()] = { sizes_sqft: sizes };
  });
  return result;
};

export const parsePlotSizeInput = (value = '') => {
  const result = {};
  value.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || !trimmed.includes(':')) return;
    const [type, ...rest] = trimmed.split(':');
    const sizesString = rest.join(':');
    if (!type || !sizesString) return;
    const sizes = sizesString
      .split(',')
      .map((size) => size.trim())
      .filter(Boolean)
      .map((size) => {
        const numericValue = Number(size);
        return Number.isNaN(numericValue) ? size : numericValue;
      });
    if (sizes.length) result[type.trim()] = sizes;
  });
  return result;
};

export const extractProjectLocation = (project) => {
  if (!project?.location) return '';
  if (typeof project.location === 'string') return project.location;
  return project.location.summary || project.location.address || '';
};
