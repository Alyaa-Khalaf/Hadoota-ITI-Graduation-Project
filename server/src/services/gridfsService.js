import mongoose from 'mongoose'
import { GridFSBucket, ObjectId } from 'mongodb'

const BUCKET_NAME = 'hadootaMedia'

let bucket = null

const getBucket = () => {
  if (!bucket) {
    if (!mongoose.connection.db) {
      throw new Error('MongoDB not connected')
    }
    bucket = new GridFSBucket(mongoose.connection.db, { bucketName: BUCKET_NAME })
  }
  return bucket
}

export const uploadBuffer = (buffer, filename, metadata = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = getBucket().openUploadStream(filename, { metadata })
    uploadStream.on('finish', () => resolve(uploadStream.id))
    uploadStream.on('error', reject)
    uploadStream.end(buffer)
  })
}

export const openDownloadStream = (fileId) => {
  return getBucket().openDownloadStream(new ObjectId(fileId))
}

export const getFileMetadata = async (fileId) => {
  const files = await getBucket()
    .find({ _id: new ObjectId(fileId) })
    .toArray()
  return files[0] || null
}

export const deleteFile = async (fileId) => {
  await getBucket().delete(new ObjectId(fileId))
}
