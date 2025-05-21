export type Author = {
    id: number;
    email: string;
    username: string;
    password?: string; // Password might not always be present in frontend objects
    firstName: string;
    lastName: string;
    bio: string | null;
    avatar: string | null;
    type: 'ADMIN' | 'WRITER' | 'READER'; // Based on common roles and backend usage
    registrationDate: string; // Or Date if you parse it
    lastLoginDate: string | null; // Or Date | null
    userStatus: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' | 'BLOCKED'; // Updated to include backend statuses
  };

