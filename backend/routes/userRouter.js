const express = require("express");
const userRouter = express.Router();
const upload = require("../middleware/upload");
const { verifyToken, authorizeRole } = require("../middleware/auth");

const usercontroller = require("../controllers/usercontroller");
const favouritecontroller = require("../controllers/favouritecontroller");

userRouter.post("/register", usercontroller.register);
userRouter.post("/login", usercontroller.login);

userRouter.get("/all", usercontroller.getallusers);

/* FAVOURITES — must come before /:id */
userRouter.post("/favourite/:jobId", verifyToken, authorizeRole("user"), favouritecontroller.addFavourite);
userRouter.delete("/favourite/:jobId", verifyToken, authorizeRole("user"), favouritecontroller.removeFavourite);
userRouter.get("/favourites", verifyToken, authorizeRole("user"), favouritecontroller.getFavourites);

userRouter.get("/:id", usercontroller.getbyID);

userRouter.put(
  "/:id",
  verifyToken,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "profilePhoto", maxCount: 1 },
  ]),
  usercontroller.updateUser
);

userRouter.delete("/:id", usercontroller.deleteUser);

module.exports = userRouter;