const Joi = require("joi");

const accidentValidation = (req, res, next) => {
  const schema = Joi.object({
    phoneNumber: Joi.string()
      .pattern(/^[0-9+]{10,15}$/)
      .required()
      .messages({
        "string.pattern.base": "Invalid phone number",
        "any.required": "Phone number is required",
      }),

    description: Joi.string()
      .min(10)
      .max(1000)
      .optional(),

    location: Joi.object({
      latitude: Joi.number()
        .min(-90)
        .max(90)
        .required(),

      longitude: Joi.number()
        .min(-180)
        .max(180)
        .required(),

      source: Joi.string()
        .valid("gps", "manual")
        .required(),
    }).required(),

    images: Joi.array()
      .items(
        Joi.object({
          url: Joi.string().uri().required(),
          public_id: Joi.string().required(),
          format: Joi.string()
            .valid("jpg", "jpeg", "png", "webp", "mp4")
            .required(),
        })
      )
      .max(5)
      .optional(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      statusCode: 400,
      message: "Validation error",
      data: error.details.map(err => err.message),
    });
  }

  next();
};

module.exports = accidentValidation;
