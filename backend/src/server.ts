import dotenv from "dotenv";
import { env } from "./utils/validateEnv";

dotenv.config();

import app from "./app";


const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
