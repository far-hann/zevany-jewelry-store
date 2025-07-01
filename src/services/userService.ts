import { AuthUser } from '../../types/AuthUser'; // Fixed import path

const mockUsers: AuthUser[] = [
  { userId: '1', email: 'admin@zevany.com', role: 'admin' },
  { userId: '2', email: 'user@zevany.com', role: 'user' },
];

export async function getUserById(userId: string): Promise<AuthUser | null> {
  return mockUsers.find(user => user.userId === userId) || null;
}
