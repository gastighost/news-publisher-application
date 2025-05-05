import app from "./app";
import dotenv from "dotenv";
import { env } from "./utils/validateEnv";

dotenv.config();

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
