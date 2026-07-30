import serverlessExpress from "@codegenie/serverless-express";
import connectDB from "./config/database.js";
import app from "./app.js";

let serverlessHandler;

async function setup() {
  await connectDB();
  serverlessHandler = serverlessExpress({ app });
  return serverlessHandler;
}

export const handler = async (event, context) => {
  // Reuse MongoDB connections across warm invocations
  context.callbackWaitsForEmptyEventLoop = false;

  const h = serverlessHandler || (await setup());
  return h(event, context);
};