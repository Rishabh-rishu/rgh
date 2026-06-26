import Joi from "joi";

export const createPropertyValidator = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.empty": "Title is required",
    "any.required": "Title is required",
  }),

  listingStatus: Joi.string()
    .valid("rent", "sale")
    .required()
    .messages({
      "any.only": "Listing status must be rent or sale",
      "any.required": "Listing status is required",
    }),

  projectId: Joi.string().uuid().optional(),

  rentPrice: Joi.number().min(0).required().messages({
    "number.base": "Rent price must be a number",
    "any.required": "Rent price is required",
  }),

  bed: Joi.number().integer().min(0).required().messages({
    "number.base": "Bed must be a number",
    "any.required": "Bed is required",
  }),

  bathroom: Joi.number().integer().min(0).required().messages({
    "number.base": "Bathroom must be a number",
    "any.required": "Bathroom is required",
  }),

  squareFeet: Joi.number().positive().required().messages({
    "number.base": "Square feet must be a number",
    "any.required": "Square feet is required",
  }),

  propertyType: Joi.string().trim().required().messages({
    "any.required": "Property type is required",
  }),

  propertyCategory: Joi.string().trim().required().messages({
    "any.required": "Property category is required",
  }),

  fullAddress: Joi.string().trim().required().messages({
    "any.required": "Full address is required",
  }),

  location: Joi.string().trim().required().messages({
    "any.required": "Location is required",
  }),

  parking: Joi.string()
    .valid(
      "none",
      "1_car",
      "2_car",
      "3_car",
      "covered",
      "open"
    )
    .optional(),

  furnishingStatus: Joi.string()
    .valid(
      "furnished",
      "semi_furnished",
      "unfurnished"
    )
    .optional(),

  yearBuild: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .optional(),

  locationProximity: Joi.string().allow("", null),

  propertyReference: Joi.string().trim().required().messages({
    "any.required": "Property reference is required",
  }),

  nearbyAttractions: Joi.string().allow("", null),

  description: Joi.string().allow("", null),

  locationCode: Joi.string().trim().allow("", null),

  agentId: Joi.string().uuid().optional(),

  latitude: Joi.number().min(-90).max(90).optional(),

  longitude: Joi.number().min(-180).max(180).optional(),

  contentEnglish: Joi.string().allow("", null),

  gallery: Joi.array()
    .items(Joi.string())
    .max(30)
    .optional()
    .messages({
      "array.max": "Maximum 30 images allowed",
    }),

  amenityIds: Joi.array()
    .items(Joi.string().uuid())
    .optional(),

  status: Joi.string()
    .valid("active", "inactive")
    .optional(),
});