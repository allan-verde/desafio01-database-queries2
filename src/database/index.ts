import { createConnection, getConnectionOptions } from 'typeorm';

export default async () => {
  const defaultOptions = await getConnectionOptions();

  return await createConnection(
    Object.assign(
      defaultOptions,
      { host: process.env.NODE_ENV === "test" ? "localhost" : "database" }
    )
  )
};
