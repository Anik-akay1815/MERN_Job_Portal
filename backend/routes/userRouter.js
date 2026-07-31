const express = require('express');
const userRouter = express.Router();

const usercontroller=require('../controllers/usercontroller');
userRouter.post('/register',usercontroller.register);
userRouter.post('/login',usercontroller.login);

userRouter.get('/all',usercontroller.getallusers);

userRouter.get('/:id',usercontroller.getbyID);
userRouter.put('/:id',usercontroller.updateUser);
userRouter.delete('/:id',usercontroller.deleteUser);

module.exports = userRouter;