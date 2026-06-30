import Joi from "joi";

export const createThirdPartyValidator = Joi.object({
  firstName: Joi.string().trim().required(),

  lastName: Joi.string().trim().required(),

  firstNameArabic: Joi.string().allow("", null),

  lastNameArabic: Joi.string().allow("", null),

  email: Joi.string().email().required(),

  countryCode: Joi.string().default("+974"),

  phoneNumber: Joi.string().required(),

  fullAddress: Joi.string().allow("", null),

  location: Joi.string().allow("", null),

  ownerImage: Joi.string().allow("", null),

  idProof: Joi.string().allow("", null),

  businessIdImage: Joi.string().allow("", null),

  businessImage: Joi.string().allow("", null),

  category: Joi.string()
    .valid(
      "Salon",
      "Gym",
      "Swimming",
      "Movie",
      "Badminton"
    )
    .required(),

  serviceName: Joi.string().required(),

  experience: Joi.date().optional().allow(null),

  address: Joi.string().allow("", null),

  descriptionEnglish: Joi.string().allow("", null),

  descriptionArabic: Joi.string().allow("", null),

  isFeatured: Joi.boolean().optional(),

  createdBy: Joi.string().uuid().optional(),

  updatedBy: Joi.string().uuid().optional(),
});

export const updateThirdPartyValidator = Joi.object({
  firstName: Joi.string().trim(),

  lastName: Joi.string().trim(),

  firstNameArabic: Joi.string().allow("", null),

  lastNameArabic: Joi.string().allow("", null),

  email: Joi.string().email(),

  countryCode: Joi.string(),

  phoneNumber: Joi.string(),

  fullAddress: Joi.string().allow("", null),

  location: Joi.string().allow("", null),

  ownerImage: Joi.string().allow("", null),

  idProof: Joi.string().allow("", null),

  businessIdImage: Joi.string().allow("", null),

  businessImage: Joi.string().allow("", null),

  category: Joi.string().valid(
    "Salon",
    "Gym",
    "Swimming",
    "Movie",
    "Badminton"
  ),

  serviceName: Joi.string(),

  experience: Joi.date().optional().allow(null),

  address: Joi.string().allow("", null),

  descriptionEnglish: Joi.string().allow("", null),

  descriptionArabic: Joi.string().allow("", null),

  isFeatured: Joi.boolean(),

  status: Joi.string().valid("ACTIVE", "INACTIVE"),

  updatedBy: Joi.string().uuid().optional(),
});