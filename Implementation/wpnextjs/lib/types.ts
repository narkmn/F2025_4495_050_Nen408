export type User = {
  id: number;
  username: string;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  avatar?: string;
};

export type Course = {
  id: number;
  title: { rendered: string };
  link: string;
  excerpt?: { rendered: string };
  course_access_list?: number[];
  featured_media?: number;
  // For featured image extraction
  better_featured_image?: {
    source_url: string;
    media_details: {
      sizes: {
        large?: { source_url: string; width?: number; height?: number };
        full: { source_url: string };
      };
    };
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      media_details: {
        sizes: {
          large?: { source_url: string };
          full: { source_url: string };
        };
      };
    }>;
  };
  slug: string;
  price: string;
};