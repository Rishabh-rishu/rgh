// validators/property.validator.js

import Joi from "joi";

const gallerySchema = Joi.object({
  url: Joi.string().trim().required(),
  key: Joi.string().trim().allow("", null),
  isCover: Joi.boolean().default(false),
  order: Joi.number().integer().min(1).default(1),
});

const nearbyPlaceSchema = Joi.object({
  name: Joi.string().trim().required(),
  distance: Joi.string().trim().required(),
});

export const createPropertyValidator = Joi.object({
  title: Joi.string().trim().min(3).max(255).required(),

  description: Joi.string().trim().allow("", null),

  listingStatus: Joi.string()
    .valid("Rent", "Sale")
    .required(),

  propertyType: Joi.string()
    .valid(
      "Apartment",
      "Villa",
      "House",
      "Office",
      "Shop",
      "Warehouse",
      "Land"
    )
    .required(),

  propertyCategory: Joi.string().trim().allow("", null),

  rentPrice: Joi.when("listingStatus", {
    is: "Rent",
    then: Joi.number().positive().required(),
    otherwise: Joi.number().positive().allow(null),
  }),

  salePrice: Joi.when("listingStatus", {
    is: "Sale",
    then: Joi.number().positive().required(),
    otherwise: Joi.number().positive().allow(null),
  }),

  bedrooms: Joi.number().integer().min(0).default(0),

  bathrooms: Joi.number().integer().min(0).default(0),

  squareFeet: Joi.number().integer().positive().allow(null),

  furnishingStatus: Joi.boolean().default(false),

  parking: Joi.boolean().default(false),

  yearBuilt: Joi.number()
    .integer()
    .min(1800)
    .max(new Date().getFullYear())
    .allow(null),

  projectId: Joi.string().uuid().allow("", null),

  assignedAgentId: Joi.string().uuid().allow("", null),

  fullAddress: Joi.string().trim().allow("", null),

  city: Joi.string().trim().allow("", null),

  state: Joi.string().trim().allow("", null),

  country: Joi.string().trim().allow("", null),

  zipcode: Joi.string().trim().allow("", null),

  latitude: Joi.number().allow(null),

  longitude: Joi.number().allow(null),

  virtualTour: Joi.string().uri().allow("", null),

  gallery: Joi.array()
    .items(gallerySchema)
    .default([]),

  amenities: Joi.array()
    .items(Joi.string().uuid())
    .default([]),

  nearbyPlaces: Joi.array()
    .items(nearbyPlaceSchema)
    .default([]),

  status: Joi.string()
    .valid("Active", "Inactive")
    .default("Active"),
});

export const updatePropertyValidator = Joi.object({
  title: Joi.string().trim().min(3).max(255),

  description: Joi.string().trim().allow("", null),

  listingStatus: Joi.string().valid("Rent", "Sale"),

  propertyType: Joi.string().valid(
    "Apartment",
    "Villa",
    "House",
    "Office",
    "Shop",
    "Warehouse",
    "Land"
  ),

  propertyCategory: Joi.string().trim().allow("", null),

  rentPrice: Joi.number().positive(),

  salePrice: Joi.number().positive(),

  bedrooms: Joi.number().integer().min(0),

  bathrooms: Joi.number().integer().min(0),

  squareFeet: Joi.number().integer().positive(),

  furnishingStatus: Joi.boolean().default(false),

  parking: Joi.boolean(),

  yearBuilt: Joi.number()
    .integer()
    .min(1800)
    .max(new Date().getFullYear()),

  projectId: Joi.string().uuid().allow("", null),

  assignedAgentId: Joi.string().uuid().allow("", null),

  fullAddress: Joi.string().trim().allow("", null),

  city: Joi.string().trim().allow("", null),

  state: Joi.string().trim().allow("", null),

  country: Joi.string().trim().allow("", null),

  zipcode: Joi.string().trim().allow("", null),

  latitude: Joi.number(),

  longitude: Joi.number(),

  virtualTour: Joi.string().uri().allow("", null),

  gallery: Joi.array().items(gallerySchema),

  amenities: Joi.array().items(Joi.string().uuid()),

  nearbyPlaces: Joi.array().items(nearbyPlaceSchema),

  status: Joi.string().valid("Active", "Inactive"),
}).min(1);