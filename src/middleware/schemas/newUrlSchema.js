import Joi from "joi"
import { validator } from "../validator"

const newUrlSchema = Joi.object({
    url: Joi.string().uri().required().empty('')
});
export const validateNewUrl = validator(newUrlSchema)