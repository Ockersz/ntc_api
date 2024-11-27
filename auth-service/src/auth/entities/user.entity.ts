export class User {
  userId: string; // Unique identifier (UUID or similar)
  username: string; // Username of the user
  email: string; // User's email address
  passwordHash: string; // Hashed password
  createdAt: string; // Timestamp of account creation
}
