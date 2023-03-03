import Joi from "joi";
import db, { SESSIONS, USERS } from "../database/database.js";
import dayjs from "dayjs";
import { validateUserRegister } from "../middleware/schemas/userRegisterSchema.js";
import { validateUserLogin } from "../middleware/schemas/userLoginSchema.js";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";

export const signUp = async (req, res) => {
  try {
    const { name, email, password, error} = await validateUserRegister(req.body);
    if (error) return res.sendStatus(422).send(error);
    const emailExist = await db.query(
      "SELECT id FROM users WHERE 'email' = $1",
      [email]
    );
    const hashPassword = await bcrypt.hash(password, 8);

    if(emailExist.rows.length > 0) return res.sendStatus(409)

    await db.query(
      'INSERT INTO "users" (name, email, password, createdAt) VALUES ($1, $2, $3, $4)',
      [name, email, hashPassword, Date.now()]
    )
    return res.sendStatus(201)
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
export const signIn = async (req, res) => {
 try{
    const { email, password, error } = validateUserLogin(req.body)
    const token = uuid()
    if(error) res.sendStatus(422).send(error)
    const userExist = await db.query(
      USERS + " WHERE email = $1",
      [email]
    )
    if(userExist.rows.length > 0){
      const comparation = await bcrypt.compare(
        password,
        userExist.rows[0].password
      );
      if(comparation){
        const loggedIn = await db.query(
            SESSIONS + " WHERE userId = $1",
            [userExist.rows[0].id]
          )
        if(loggedIn.rows.length > 0){
          await db.query(
            "DELETE FROM sessions WHERE userId = $1",
            [userExist.rows[0].id]
            )
        }
        await db.query(
          'INSERT INTO sessions (userId, token, createdAt) VALUES ($1, $2, $3)',
          [userExist.rows[0].id, token, Date.now()]
          )
        return res.sendStatus(201).send(token)
      }
      return res.sendStatus(401)
    }else return res.sendStatus(401)
  } catch (error) {
    console.log("erro");
    return res.status(500).send(error.message);
  }
};
