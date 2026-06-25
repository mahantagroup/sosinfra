import {
  LayoutDashboard,
  Building2,
  Newspaper,
  Images,
  Users,
  MessageSquareQuote,
} from 'lucide-react';

export const ADMIN_SECTIONS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Overview of all homepage content',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: Building2,
    homepage: 'Projects & Logo Carousel',
    collection: 'projects',
  },
  {
    id: 'blogs',
    label: 'Blogs',
    icon: Newspaper,
    homepage: 'Journal',
    collection: 'blogs',
  },
  {
    id: 'gallery',
    label: 'Gallery & Events',
    icon: Images,
    homepage: 'Events Gallery',
    collection: 'gallery',
  },
  {
    id: 'team',
    label: 'Team',
    icon: Users,
    homepage: 'About Page',
    collection: 'team',
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    icon: MessageSquareQuote,
    homepage: 'Happy Faces',
    collection: 'testimonials',
  },
];

export const getSection = (id) => ADMIN_SECTIONS.find((s) => s.id === id);
