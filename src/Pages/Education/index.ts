// Post type from your Redux store
export interface Post {
    id: string;
    content: string;
    author: string;
    timestamp: number;
  }
  
  // Education content type
  export interface EducationContent {
    id: string;
    title: string;
    content: string;
    content_type: string;
    created_by: string;
    image_url?: string;
  }
  
  // Human rights content type
  export interface HumanRightsContent {
    id: string;
    title: string;
    content: string;
    source: string;
  }