export interface User {
  id: string
  email: string
  role: string
}

export interface LoginResponse {
  success: boolean
  message?: string
  data: {
    token: string
    user: User
  }
}

export enum UserType {
  user = 'user',
  artist = 'artist',
  host = 'host',
  admin = 'admin',
}

export interface User {
  id: string
  email: string
  role: string
  updatedAt: string
  createdAt: string
}

export interface FormSuccessResponse {
  message?: string
}

export interface FormActionState {
  error?: string
  message?: string
}

export interface UserDataTableMeta {
  viewUser: (user: User) => void
  editUser: (user: User) => void
  deleteUser: (user: User) => void
}
