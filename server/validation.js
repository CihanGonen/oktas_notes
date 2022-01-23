const Joi = require("joi");

createUserValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

changePasswordValidation = (data) => {
  const schema = Joi.object({
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

module.exports = { createUserValidation, changePasswordValidation };
