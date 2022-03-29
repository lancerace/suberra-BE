module.exports = {
   type: "postgres",
   port: process.env.DB_PORT,
   host: process.env.DB_HOST,
   username: process.env.DB_USER,
   password: process.env.DB_PASS,
   database: process.env.DB_NAME,
   synchronize: true,
   logging: false,
   ssl: { rejectUnauthorized: false },
   entities: [
      "src/entities/**/*.ts"
   ],
   migrations: [
      "src/migration/**/*.ts"
   ],
   subscribers: [
      "src/subscriber/**/*.ts"
   ]
}

