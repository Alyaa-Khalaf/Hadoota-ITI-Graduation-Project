import mongoose from 'mongoose'

const BUCKET_NAME = 'hadootaMedia'

let bucket = null

const getBucket = () => {
  if (!bucket) {
    if (!mongoose.connection.db) {
      throw new Error('MongoDB not connected')
    }
    const { GridFSBucket } = mongoose.mongo
    bucket = new GridFSBucket(mongoose.connection.db, { bucketName: BUCKET_NAME })
  }
  return bucket
}

const toObjectId = (fileId) => new mongoose.Types.ObjectId(fileId)

export const uploadBuffer = (buffer, filename, metadata = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = getBucket().openUploadStream(filename, { metadata })
    uploadStream.on('finish', () => resolve(uploadStream.id))
    uploadStream.on('error', reject)
    uploadStream.end(buffer)
  })
}

export const openDownloadStream = (fileId) => {
  return getBucket().openDownloadStream(toObjectId(fileId))
}

export const getFileMetadata = async (fileId) => {
  const files = await getBucket()
    .find({ _id: toObjectId(fileId) })
    .toArray()
  return files[0] || null
}

export const deleteFile = async (fileId) => {
  await getBucket().delete(toObjectId(fileId))
}
