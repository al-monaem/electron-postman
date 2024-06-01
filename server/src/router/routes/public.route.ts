import express from "express";

const router = express.Router();

// router.route("/registerUser").post(registerUser);
// router.route("/login").post(login);

export default (): express.Router => {
  return router;
};
