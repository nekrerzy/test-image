const express = require('express')
const app = express()
const port = 3000
const faker = require('faker');

const {POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB} = process.env
const db = require("knex")({
  client: "pg",
  connection: {
    host: POSTGRES_HOST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB
  }
});

app.set("db", db);

app.get("/seed", (req, res, next) => {
  const db = req.app.get('db');
  db.schema.hasTable("users").then((exists) => {
    if (!exists) {
      db.schema
        .createTable("users", (table) => {
          table.increments("id").primary();
          table.string("name");
          table.string("email");
        })
        .then(() => {
          const recordsLength = Array.from(Array(25).keys());
          const records = recordsLength.map(rec => ({
            name: faker.name.findName(),
            email: faker.internet.email()
          }));
          db("users")
            .insert(records)
            .then(() => {
              res.send("Seeded data");
            });
        });
    } else {
      res.send("Table exists - Seeded data");
    }
  });
});

app.get('/users', async (req, res) => {
  const db = req.app.get('db');
  const users = await db.select().table('users')
  res.json({ count: users.length, users });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})