import Joi from "joi";
import db, { SESSIONS, USERS } from "../database/database.js";
import dayjs from "dayjs";
import { validateUserRegister } from "../middleware/schemas/userRegisterSchema.js";
import { validateUserLogin } from "../middleware/schemas/userLoginSchema.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export const signUp = async (req, res) => {
  const { name, email, password, error } = await validateUserRegister(req.body);

  try {
    if (error) {
      return res.sendStatus(422);
    }
    const emailExist = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const hashPassword = await bcrypt.hash(password, 8);
    console.log(email);
    if (emailExist.rows.length > 0) return res.sendStatus(409);

    await db.query(
      'INSERT INTO "users" (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashPassword]
    );
    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
export const signIn = async (req, res) => {
  try {
    const { email, password, error } = validateUserLogin(req.body);
    const token = uuid();
    if (error) res.sendStatus(422).send(error);
    const userExist = await db.query(USERS + " WHERE email = $1", [email]);
    if (userExist.rows.length > 0) {
      const comparation = await bcrypt.compare(
        password,
        userExist.rows[0].password
      );
      if (comparation) {
        const loggedIn = await db.query(
          'SELECT id FROM sessions WHERE "userId" = $1',
          [userExist.rows[0].id]
        );
        if (loggedIn.rows.length > 0) {
          console.log(loggedIn.rows);
          await db.query("DELETE FROM sessions WHERE id = $1", [
            loggedIn.rows[0].id,
          ]);
        }
        await db.query(
          'INSERT INTO sessions ("userId", "token") VALUES ($1, $2)',
          [userExist.rows[0].id, token]
        );
        return res.status(200).send({
          token: token,
        });
      }
      return res.sendStatus(401);
    } else return res.sendStatus(401);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
export const getMe = async (req, res) => {
  const user = res.locals.auth;
  try {
    const userObject = await db.query(
      `
      SELECT USERS.ID AS "id", USERS.NAME AS "name",
      SUM("visits") AS "visitCount",
      ARRAY
      (SELECT JSON_BUILD_OBJECT('id',
      links.ID,
      'shortUrl',
      links."shortUrl",
      'url',
      links.URL,
      'visitCount',
      links."visits")
                FROM links
                JOIN USERS ON links."userId" = USERS.ID
                WHERE "userId" = $1) AS "shortenedUrls"
    FROM links
    JOIN USERS ON links."userId" = USERS.ID
    WHERE "userId" = $2
    GROUP BY USERS.ID;
    `,
      [user.id, user.id]
    );
    return res.send(userObject.rows[0]);
  } catch (errr) {
    return res.status(500).send(error);
  }
};
