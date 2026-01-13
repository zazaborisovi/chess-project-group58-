const cloudinary = require('./cloudinary.config')

const options = {
  folder: "profile_pictures",
  overwrite: true,
  resource_type: "image",
  quality: "auto",
  format: "webp",
  transformation: [
    { width: 500, height: 500, crop: "fit", gravity: "center" }
  ]
}

const uploadImage = async (fileBuffer , publicId) => {
  try {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({...options , public_id: publicId}, (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      stream.end(fileBuffer)
    })
  } catch (err) {
    return { message: "Error uploading image", error: err.message }
  }
}

const deleteImage = async (publicId) => {
  try {
    const res = await cloudinary.uploader.destroy(publicId)
    return res
  } catch (err) {
    return { message: "Error deleting image", error: err.message }
  }
}

module.exports = {uploadImage, deleteImage};