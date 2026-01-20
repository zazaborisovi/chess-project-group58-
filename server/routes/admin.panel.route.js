const { fetchUsers , updateUser , updateProfilePicture } = require("../controllers/admin.panel.controller")
const {protect , allowedTo} = require("../middleware/protect")

const adminRouter = require("express").Router()

adminRouter.get("/users", protect , allowedTo('admin' , 'moderator') , fetchUsers )
adminRouter.post("/update-user", protect, allowedTo('admin', 'moderator'), updateUser)
adminRouter.post("/update-profile-picture", protect, allowedTo("admin" , "moderator"), upload.single("file"), updateProfilePicture)

module.exports = adminRouter