export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  verifiedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};