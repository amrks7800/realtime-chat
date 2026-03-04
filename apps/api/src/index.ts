import { createServerExpress } from "./server";
import { connectDB } from "./lib/db";

const port = process.env.PORT || 8080;

const startServer = async () => {
  await connectDB();
  const server = createServerExpress();

  server.listen(port, () => {
    console.log(`api running on ${port}`);
  });
};

startServer();
