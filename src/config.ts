import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USER,
      port: parseInt(process.env.DATABASE_PORT, 10),
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN_TIME,
    },
  };
});
