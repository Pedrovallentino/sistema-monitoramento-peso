import * as dotenv from 'dotenv';
dotenv.config();

import buildApp from './app';

const start = async () => {
  const app = buildApp();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  try {
    // Start HTTP Server
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server listening on port ${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
