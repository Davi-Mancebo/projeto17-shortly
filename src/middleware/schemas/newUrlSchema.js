import Joi from "joi"
import { validator } from "../validator.js"

const newUrlSchema = Joi.object({
    url: Joi.string().uri().required()
});
export const validateNewUrl = validator(newUrlSchema)