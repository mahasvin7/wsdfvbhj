/**
 * SOUL Radiology Portal - User Authentication & Identity Management
 * Designed for general users (not doctors) with 2-card registration and username uniqueness.
 */

class AuthService {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
      }
    } catch (e) {
      console.warn('LocalStorage unavailable. Using memory storage.', e);
    }
  }

  getUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : DEFAULT_USERS;
    } catch (e) {
      return DEFAULT_USERS;
    }
  }

  saveUsers(users) {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users', e);
    }
  }

  // Live uniqueness check for username
  checkUsernameAvailability(username) {
    if (!username) return { available: false, message: 'Please enter a username.' };
    const clean = username.trim().toLowerCase();
    
    // Pattern: 3-20 characters, alphanumeric, underscores, dots
    const pattern = /^[a-zA-Z0-9._]{3,20}$/;
    if (!pattern.test(username.trim())) {
      return { 
        available: false, 
        message: 'Must be 3–20 characters, containing only letters, numbers, dots, or underscores.' 
      };
    }

    const users = this.getUsers();
    const exists = users.some(u => u.username.toLowerCase() === clean);

    if (exists) {
      return {
        available: false,
        message: `Username "@${username.trim()}" is already taken.`
      };
    }

    return {
      available: true,
      message: `✓ Username "@${username.trim()}" is available!`
    };
  }

  // Generate suggestions based on user's full name
  generateUsernameSuggestions(fullName) {
    if (!fullName || typeof fullName !== 'string') return [];
    
    const parts = fullName.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    if (parts.length === 0) return ['user_one', 'radiology_user'];

    const first = parts[0];
    const last = parts.length > 1 ? parts[parts.length - 1] : '';

    const candidates = [];
    if (last) {
      candidates.push(`${first}.${last}`);
      candidates.push(`${first}_${last}`);
      candidates.push(`${first[0]}${last}`);
      candidates.push(`${first}${last}26`);
    } else {
      candidates.push(`${first}_user`);
      candidates.push(`${first}.2026`);
      candidates.push(`${first}99`);
    }

    const users = this.getUsers();
    const existing = new Set(users.map(u => u.username.toLowerCase()));

    return candidates.filter(name => !existing.has(name.toLowerCase())).slice(0, 3);
  }

  checkEmailExists(email) {
    if (!email) return false;
    const clean = email.trim().toLowerCase();
    const users = this.getUsers();
    return users.some(u => u.email.toLowerCase() === clean);
  }

  // Login handler
  login(identifier, password) {
    if (!identifier || !identifier.trim()) {
      return { success: false, notFound: false, message: 'Please enter your username or email address.' };
    }
    if (!password) {
      return { success: false, notFound: false, message: 'Please enter your password.' };
    }

    const cleanId = identifier.trim().toLowerCase();
    const users = this.getUsers();

    // Look for user by username OR email
    const user = users.find(u => 
      u.username.toLowerCase() === cleanId || 
      u.email.toLowerCase() === cleanId
    );

    // If account doesn't exist: trigger redirect response
    if (!user) {
      return {
        success: false,
        notFound: true,
        identifier: identifier.trim(),
        message: `No account found for "${identifier.trim()}". Redirecting to Sign Up...`
      };
    }

    // Check password
    if (user.password !== password) {
      return {
        success: false,
        notFound: false,
        message: 'Incorrect password entered. Please try again.'
      };
    }

    this.setCurrentSession(user);
    return {
      success: true,
      user: user,
      message: `Welcome, ${user.name}!`
    };
  }

  // Register user from 2-card flow
  registerUser(userData) {
    const { name, dob, gender, mobile, email, username, password } = userData;

    if (!name || !dob || !gender || !mobile || !email || !username || !password) {
      return { success: false, message: 'All fields are required.' };
    }

    const availCheck = this.checkUsernameAvailability(username);
    if (!availCheck.available) {
      return { success: false, message: availCheck.message };
    }

    if (this.checkEmailExists(email)) {
      return { success: false, message: 'This email is already registered.' };
    }

    const parts = name.trim().split(/\s+/);
    const initials = parts.length > 1 
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() 
      : name.slice(0, 2).toUpperCase();

    const colors = ['#17365D', '#13836B', '#F3A536', '#122b4a', '#0f6c58'];
    const assignedColor = colors[Math.floor(Math.random() * colors.length)];

    const newUser = {
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      name: name.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      dob: dob,
      gender: gender,
      mobile: mobile.trim(),
      password: password,
      userId: 'SOUL-UID-' + Math.floor(1000 + Math.random() * 9000),
      avatarInitials: initials,
      avatarBg: assignedColor,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    const users = this.getUsers();
    users.push(newUser);
    this.saveUsers(users);

    this.setCurrentSession(newUser);

    return {
      success: true,
      user: newUser,
      message: 'Account created successfully! Welcome to SOUL Radiology.'
    };
  }

  setCurrentSession(user) {
    try {
      const safeUser = { ...user };
      delete safeUser.password;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));
    } catch (e) {
      console.error('Session persistence failed', e);
    }
  }

  getCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  logout() {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } catch (e) {
      console.error('Logout error', e);
    }
  }
}

window.soulAuth = new AuthService();
