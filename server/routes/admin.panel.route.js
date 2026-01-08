const { fetchUsers , updateUser } = require("../controllers/admin.panel.controller")
const {protect , allowedTo} = require("../middleware/protect")

const adminRouter = require("express").Router()

adminRouter.get("/users", protect , allowedTo('admin' , 'moderator') , fetchUsers )
adminRouter.post("/update-user", protect , allowedTo('admin' , 'moderator') , updateUser )

module.exports = adminRouter