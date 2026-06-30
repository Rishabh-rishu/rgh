import Joi from "joi";

export const createProviderValidator = Joi.object({

  propertyId: Joi.string().uuid().required(),

  helpCategoryId: Joi.string().uuid().required(),

  serviceId: Joi.string().uuid().required(),

  serviceMemberId: Joi.string().trim().required(),

  firstNameEnglish: Joi.string().trim().required(),

  firstNameArabic: Joi.string().allow("", null),

  lastNameEnglish: Joi.string().trim().required(),

  lastNameArabic: Joi.string().allow("", null),

  contactNo: Joi.string()
    .pattern(/^[0-9]{8,15}$/)
    .required(),

  email: Joi.string().email().required(),

  experience: Joi.number().integer().min(0).required(),

  designation: Joi.string().required(),

  joiningDate: Joi.date().required(),

  image: Joi.string().allow("", null),

  status: Joi.boolean()

});

export const updateProviderValidator = createProviderValidator.fork(
  [
    "propertyId",
    "helpCategoryId",
    "serviceId",
    "serviceMemberId",
    "firstNameEnglish",
    "lastNameEnglish",
    "contactNo",
    "email",
    "experience",
    "designation",
    "joiningDate",
  ],
  (schema) => schema.optional()
);