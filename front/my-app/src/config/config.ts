// //тут держим ссылки для гитхаб паджес
// export const STATIC_BASE = import.meta.env.VITE_STATIC_BASE ?? '/staticimages';

// export const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/v1';

// src/config/config.ts
const isGithubPages = location.hostname === 'shpac-men.github.io';

export const STATIC_BASE = isGithubPages
  ? '/FrontendElements/staticimages'
  : '/staticimages';

export const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/v1';
