import { Author } from "./author"

export type Post = {
    id: number;
    title: string;
    subtitle: string | null; 
    titleImage: string | null;
    authorId: number;
    date: string; 
    updatedDate: string | null; 
    content: string;
    category: string;
    commentsEnabled: boolean;
    lastUpdate: string | null; 
    approved: boolean;
    author: Author;
  };