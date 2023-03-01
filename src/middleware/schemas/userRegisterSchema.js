import Joi from "joi"
import { validator } from "./validator"

const userRegisterSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required(),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required()
})
export const validateUserRegister = validator(userRegisterSchema)