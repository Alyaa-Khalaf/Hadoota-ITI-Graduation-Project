export interface User {
  id: string
  name: string
  email: string
  role?: 'parent' | 'child' | 'admin'
  avatar?: string
  createdAt?: string
}

export interface AuthPayload {
  user: User
  accessToken: string
  refreshToken?: string
}

export interface StoryChoice {
  text: string
  nextSceneIndex: number
}

export interface StoryScene {
  sceneIndex: number
  text: string
  imageUrl: string
  audioUrl: string
  choices: StoryChoice[]
}

export interface GeneratedStory {
  id: string
  title: string
  topic: string
  character: string
  childId: string
  status: 'generating' | 'ready' | 'failed'
  content: string
  scenes: StoryScene[]
  createdAt?: string
  updatedAt?: string
}

export interface Child {
  id: string
  name: string
  age?: number
  parentId?: string
  avatar?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}
