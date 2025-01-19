// Common Props
export interface ExpandableModeProps {
  isExpandedMode: boolean;
}

// Message Types
export interface MessageProps extends ExpandableModeProps {
  profile: string;
  Name: string;
  description: string;
  messageDate: string;
  messageText: string;
}

// Blog Types
export interface BlogPostData {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  imageUrl?: string;
  reactions: {
    likes: number;
    comments: number;
    shares: number;
  };
}

// Layout Types
export interface LayoutProps {
  children: React.ReactNode;
}

// Theme Types
export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Auth Types
export interface AuthContextType {
  user: UserData | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkTokenExpiration: () => boolean;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
} 