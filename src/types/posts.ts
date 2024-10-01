interface User {
  first_name: string;
  last_name: string;
  user_name: string;
  photo: string; // URL to profile picture
}

// Type for comments (if needed)
export interface Comment {
  _id: string;
  user: User;
  text: string;
  createdAt: string;
  photo: string; // URL to profile picture
}

// Main Post interface
export interface Post {
  _id: string; // MongoDB generates a string ID
  user: User;
  content: string;
  mediaType: "image" | "video" | null; // Enum for mediaType
  mediaUrl: string; // URL to media (image/video)
  isPublic: boolean; // Privacy setting
  likes: User[]; // Array of user IDs (for simplicity, represented as strings)
  // comments: Comment[]; // Array of comments
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  isLiked: boolean;
}

export interface Message {
  _id: string;
  sender: User;
  receiver: User;
  text: string;
  files: string[]; 
  read: boolean;
  createdAt: string; // Date string in ISO format
  updatedAt: string; // Date string in ISO format
}
