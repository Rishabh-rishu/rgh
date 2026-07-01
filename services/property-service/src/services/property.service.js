import { Op } from "sequelize";
import Property from "../models/property.model.js";
import Amenity from "../models/amenity.model.js";

class PropertyService {
  /**
   * Create Property
   */
  async createProperty(payload) {

    const property = await Property.create(payload);

    return property;
  }

  /**
   * Get All Properties
   */
  async getAllProperties({
    page = 1,
    limit = 10,
    search = "",
    propertyType,
    propertyCategory,
    listingStatus,
    city,
    state,
    status,
    minPrice,
    maxPrice,
  }) {
    page = Number(page);
    limit = Number(limit);

    const offset = (page - 1) * limit;

    const where = {};

    if (search) {
      where[Op.or] = [
        {
          title: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          propertyCode: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    if (propertyType) {
      where.propertyType = propertyType;
    }

    if (propertyCategory) {
      where.propertyCategory = propertyCategory;
    }

    if (listingStatus) {
      where.listingStatus = listingStatus;
    }

    if (city) {
      where.city = city;
    }

    if (state) {
      where.state = state;
    }

    if (status) {
      where.status = status;
    }

    if (minPrice || maxPrice) {
      if (listingStatus === "Rent") {
        where.rentPrice = {};

        if (minPrice)
          where.rentPrice[Op.gte] = minPrice;

        if (maxPrice)
          where.rentPrice[Op.lte] = maxPrice;
      } else {
        where.salePrice = {};

        if (minPrice)
          where.salePrice[Op.gte] = minPrice;

        if (maxPrice)
          where.salePrice[Op.lte] = maxPrice;
      }
    }

    const { count, rows } = await Property.findAndCountAll({
      where,
      limit,
      offset,
      distinct: true,
      order: [["createdAt", "DESC"]],
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      properties: rows,
    };
  }

  /**
   * Get Property By Id
   */
  async getPropertyById(id) {
    const property = await Property.findByPk(id);
    const amenityData = await Amenity.findAll({
      where: {
        id: {
          [Op.in]: property.amenities || [],
        },
      },
      attributes: [
        "id",
        "amenityNameEn",
        "amenityNameAr",
        "icon",
        "status",
      ],
    });

    const response = {
      ...property.toJSON(),
      amenities: amenityData,
    };


    if (!property) {
      throw new Error("Property not found.");
    }

    return property;
  }

  /**
   * Update Property
   */
  async updateProperty(id, payload) {
    const { amenities = null, ...propertyData } = payload;

    const property = await Property.findByPk(id);

    if (!property) {
      throw new Error("Property not found.");
    }

    await property.update(propertyData);

    if (amenities) {
      await PropertyAmenity.destroy({
        where: {
          propertyId: id,
        },
      });

      if (amenities.length) {
        const mappings = amenities.map((amenityId) => ({
          propertyId: id,
          amenityId,
        }));

        await PropertyAmenity.bulkCreate(mappings);
      }
    }

    return await this.getPropertyById(id);
  }

  /**
   * Update Property Status
   */
  async updatePropertyStatus(id, status) {
    const property = await Property.findByPk(id);

    if (!property) {
      throw new Error("Property not found.");
    }

    await property.update({ status });

    return property;
  }

  /**
   * Delete Property
   */
  async deleteProperty(id) {
    const property = await Property.findByPk(id);

    if (!property) {
      throw new Error("Property not found.");
    }

    await property.destroy();

    return true;
  }
}

export default new PropertyService();