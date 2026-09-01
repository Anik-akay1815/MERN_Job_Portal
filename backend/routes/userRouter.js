const express = require('express');
const userRouter = express.Router();
const upload = require('../middleware/upload');
const {verifyToken} = require('../middleware/auth');

const usercontroller=require('../controllers/usercontroller');
userRouter.post('/register',usercontroller.register);
userRouter.post('/login',usercontroller.login);

userRouter.get('/all',usercontroller.getallusers);

userRouter.get('/:id',usercontroller.getbyID);
userRouter.put('/:id', verifyToken,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "profilePhoto", maxCount: 1 },
  ]),usercontroller.updateUser
);
userRouter.delete('/:id',usercontroller.deleteUser);

module.exports = userRouter;