import Joi from "joi"
import { validator } from "../validator.js"

const userRegisterSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required(),
})
export const validateUserLogin = validator(userRegisterSchema)