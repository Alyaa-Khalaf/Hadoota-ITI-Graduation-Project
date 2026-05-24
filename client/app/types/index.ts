export interface User {
  id: string
  name: string
  email: string
  role: 'parent' | 'child' | 'admin'
  createdAt: Date
}

export interface Story {
  id: string
  title: string
  content: string
  author: string
  category: string
  createdAt: Date
  updatedAt: Date
}

export interface Child {
  id: string
  name: string
  age: number
  parentId: string
  createdAt: Date
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
