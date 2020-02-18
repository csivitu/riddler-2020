const Joi = require('@hapi/joi');

const loginValidation = async (data) => {
    const schema = Joi.object({
    /*   name: Joi.string()
      .min(1)
      .required(), */
        username: Joi.string()
            .min(1)
            .required(),
        ip: Joi.string().required(),
    /*  regNo: Joi.string().required(),
    gender: Joi.string(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } })
      .required(),
    iat: Joi.number(),
    exp: Joi.number(),
    mobile: Joi.number(),
    scope: Joi.array(), */
    });
    try {
        const obj = await schema.validateAsync(data);
        return undefined;
    } catch (err) {
        return err;
    }
};

module.exports = loginValidation;
