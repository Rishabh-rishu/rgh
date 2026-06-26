import Property from "../models/property.model.js";
import Amenity from "../models/amenity.model.js";
import PropertyAmenity from "../models/propertyAmenity.model.js";

class PropertyService {
  async createProperty(payload) {
    const {
      amenityIds = [],
      ...propertyData
    } = payload;

    const property = await Property.create(propertyData);

    if (amenityIds.length > 0) {
      const mappings = amenityIds.map((amenityId) => ({
        propertyId: property.id,
        amenityId,
      }));

      await PropertyAmenity.bulkCreate(mappings);
    }

    return property;
  }

  async getAllProperties({
  page = 1,
  limit = 10,
  search = "",
  propertyCategory,
  listingStatus,
}) {
  const offset = (page - 1) * limit;

  const where = {
    isDeleted: false,
  };

  // Search by title
  if (search) {
    where.title = {
      [Op.like]: `%${search}%`,
    };
  }

  // Filter by category
  if (propertyCategory) {
    where.propertyCategory = propertyCategory;
  }

  // Filter by listing type
  if (listingStatus) {
    where.listingStatus = listingStatus;
  }

  const { count, rows } = await Property.findAndCountAll({
    where,
    include: [
      {
        model: Amenity,
        as: "amenities",
        attributes: ["id", "category", "amenityNameEn","amenityNameAr"],
        through: {
          attributes: [],
        },
      },
    ],
    limit: Number(limit),
    offset,
    distinct: true,
    order: [["createdAt", "DESC"]],
  });

  return {
    total: count,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(count / limit),
    properties: rows,
  };
}

//   async getPropertyById(id) {
//     return await Property.findOne({
//       where: {
//         id,
//         isDeleted: false,
//       },
//       include: [
//         {
//           model: Amenity,
//           as: "amenities",
//           through: { attributes: [] },
//         },
//       ],
//     });
//   }




//   async updateProperty(id, payload) {
//     const {
//       amenityIds,
//       ...propertyData
//     } = payload;

//     const property = await Property.findOne({
//       where: {
//         id,
//         isDeleted: false,
//       },
//     });

//     if (!property) {
//       throw new Error("Property not found");
//     }

//     await property.update(propertyData);

//     if (amenityIds) {
//       await PropertyAmenity.destroy({
//         where: {
//           propertyId: id,
//         },
//       });

//       const mappings = amenityIds.map((amenityId) => ({
//         propertyId: id,
//         amenityId,
//       }));

//       await PropertyAmenity.bulkCreate(mappings);
//     }

//     return property;
//   }

//   async deleteProperty(id) {
//     const property = await Property.findOne({
//       where: {
//         id,
//         isDeleted: false,
//       },
//     });

//     if (!property) {
//       throw new Error("Property not found");
//     }

//     await property.update({
//       isDeleted: true,
//     });

//     return true;
//   }

}

export default new PropertyService();