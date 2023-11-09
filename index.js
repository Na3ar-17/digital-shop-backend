import express from "express";
import cors from "cors";
import { getMe, login, register } from "./controllers/user-controller.js";
import isAuth from "./middlewares/isAuth.js";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4444;

/*User*/
app.get("/get-me", isAuth, getMe);
app.post("/login", login);
app.post("/register", register);
/**/

/*Server*/
try {
  app.listen(PORT, () => {
    console.log(`server was started in port ${PORT}`);
  });
} catch (error) {
  console.log(`server start error: ${error}`);
}
/*Server*/
