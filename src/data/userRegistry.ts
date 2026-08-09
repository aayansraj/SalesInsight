export interface UserAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Plaintext for demo database validation
  role: 'Data Analyst' | 'Executive' | 'Regional Manager' | 'Administrator';
  createdAt: string;
}

const STORAGE_KEY = 'salesinsight_registered_users';

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr-1',
    name: 'Alex Mercer',
    email: 'analyst@salesinsight.com',
    passwordHash: 'analyst123',
    role: 'Data Analyst',
    createdAt: '2024-01-15',
  },
  {
    id: 'usr-2',
    name: 'Sarah Jenkins',
    email: 'executive@salesinsight.com',
    passwordHash: 'executive123',
    role: 'Executive',
    createdAt: '2024-01-10',
  },
  {
    id: 'usr-3',
    name: 'Marcus Vance',
    email: 'regional.manager@salesinsight.com',
    passwordHash: 'manager123',
    role: 'Regional Manager',
    createdAt: '2024-02-01',
  },
  {
    id: 'usr-4',
    name: 'Aayan Raj',
    email: 'admin@salesinsight.com',
    passwordHash: 'admin123',
    role: 'Administrator',
    createdAt: '2024-01-01',
  },
];

// Helper to get registered users from localStorage or initial list
export const getRegisteredUsers = (): UserAccount[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading user database:', e);
  }
  // Save initial list
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USER_ACCOUNTS));
  return INITIAL_USER_ACCOUNTS;
};

// Validate login credentials strictly
export const validateCredentials = (
  email: string,
  pass: string
): { success: boolean; user?: UserAccount; message?: string } => {
  const users = getRegisteredUsers();
  const normalizedEmail = email.toLowerCase().trim();

  const foundUser = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!foundUser) {
    return {
      success: false,
      message: 'Account not found in user database! Please register or use a saved account.',
    };
  }

  if (foundUser.passwordHash !== pass) {
    return {
      success: false,
      message: 'Incorrect password! Please check your credentials.',
    };
  }

  return { success: true, user: foundUser };
};

// Register a new user account into the database
export const registerNewUserAccount = (
  name: string,
  email: string,
  pass: string,
  role: 'Data Analyst' | 'Executive' | 'Regional Manager' | 'Administrator'
): { success: boolean; user?: UserAccount; message?: string } => {
  const users = getRegisteredUsers();
  const normalizedEmail = email.toLowerCase().trim();

  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return {
      success: false,
      message: 'An account with this email address already exists in the database!',
    };
  }

  const newUser: UserAccount = {
    id: `usr-${Date.now()}`,
    name,
    email: normalizedEmail,
    passwordHash: pass,
    role,
    createdAt: new Date().toISOString().split('T')[0],
  };

  const updatedUsers = [...users, newUser];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
  } catch (e) {
    console.error('Failed to update user registry:', e);
  }

  return {
    success: true,
    user: newUser,
    message: 'User account registered successfully in database!',
  };
};
