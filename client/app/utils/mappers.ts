import { User, Child } from '@/types'

type MongoDoc = {
  _id?: string
  id?: string
  name?: string
  email?: string
  role?: User['role']
  avatar?: string
  age?: number
  parentId?: string
  createdAt?: string
}

export const mapUser = (doc: MongoDoc): User => ({
  id: doc.id || doc._id || '',
  name: doc.name || '',
  email: doc.email || '',
  role: doc.role,
  avatar: doc.avatar,
  createdAt: doc.createdAt,
})

export const mapChild = (doc: MongoDoc): Child => ({
  id: doc.id || doc._id || '',
  name: doc.name || '',
  age: doc.age,
  parentId: doc.parentId?.toString?.() ?? (doc.parentId as string | undefined),
  avatar: doc.avatar,
})

export const extractMediaFileId = (mediaUrl: string): string => {
  const parts = mediaUrl.split('/')
  return parts[parts.length - 1]
}
