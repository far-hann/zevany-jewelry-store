// This file ensures all imports use relative paths for better build compatibility

// Re-export from services with relative paths
export { verifyToken } from '../services/authService';
export { getUserById } from '../services/userService';

// Re-export types with relative paths
export type { AuthUser } from '../../types/AuthUser';
export type { Product } from '../../types/Product';

// Other common exports can be added here
