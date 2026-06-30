import Joi from "joi";

export const createAmenityValidator = Joi.object({
  amenityNameEn: Joi.string().trim().required(),

  amenityNameAr: Joi.string().trim().required(),

  icon: Joi.string().required(),

  status: Joi.string()
    .valid("Active", "Inactive")
    .default("Active"),
});

export const updateAmenityValidator = Joi.object({
  amenityNameEn: Joi.string(),

  amenityNameAr: Joi.string(),

  icon: Joi.string(),

  status: Joi.string().valid("Active", "Inactive"),
}).min(1);