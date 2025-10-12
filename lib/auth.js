// lib/auth.js

// Simple role management using localStorage (replace with real secure JWT/session in production)
// lib/auth.js

// Simple role management using localStorage (replace with real secure JWT/session in production)
// lib/auth.js

// --- LocalStorage Keys ---
const ROLE_KEY = 'user_role';
const USERS_KEY = 'registered_users';

// --- Default Admin/Test User List (Hardcoded) ---
const getInitialUsers = () => {
  // ⚠️ KEEP ADMIN CREDENTIALS HERE
  return {
    'admin@gmail.com': { password: '1204', role: 'admin' }, // ADMIN CREDENTIALS
    'usha@gmail.com': { password: '1234', role: 'user' },     // TEST USER
  };
};

// --- User Management Functions ---

export const getStoredUsers = () => {
  if (typeof window === 'undefined') return getInitialUsers();
  
  const stored = localStorage.getItem(USERS_KEY);
  let storedUsers = {};

  if (stored) {
    try {
      storedUsers = JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing user list from localStorage", e);
    }
  }
  
  // Merge stored users with initial users, giving precedence to stored (if a user somehow overwrites the test account)
  return { ...getInitialUsers(), ...storedUsers };
};

export const registerUser = (username, password) => {
  if (typeof window === 'undefined') return { success: false, message: 'Client environment required for registration.' };

  const users = getStoredUsers();
  const lowerUsername = username.toLowerCase();
  
  // Check if username already exists
  if (users[lowerUsername]) {
    return { success: false, message: 'Username/Email already exists. Please sign in.' };
  }

  // New users default to 'user' role
  users[lowerUsername] = { password, role: 'user' };
  
  // Save the updated list back to localStorage
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { success: true, message: 'Registration successful!' };
};

export const validateCredentials = (username, password) => {
  const users = getStoredUsers();
  const lowerUsername = username.toLowerCase();
  const userRecord = users[lowerUsername]; // Look up user

  if (userRecord && userRecord.password === password) {
    return { success: true, role: userRecord.role };
  }
  return { success: false, message: 'Invalid username or password.' };
};

// --- Session Management Functions ---

export const login = (role) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ROLE_KEY, role);
  }
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ROLE_KEY);
  }
};

export const getRole = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(ROLE_KEY);
  }
  return null;
};

export const isAdmin = () => getRole() === 'admin';