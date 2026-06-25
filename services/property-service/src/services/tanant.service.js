import Tenant from "../models/tenant.model.js";
import { Op } from "sequelize";

class TenantService {
  async createTenant(data) {
    const {
      firstNameEn,
      firstNameAr,
      lastNameEn,
      lastNameAr,
      phoneNumber,
      email,
      joiningDate,
      location,
      propertyType,
      propertyId,
      buildingNo,
      unitNo,
      tenantPlan,
      leaseType,
      leaseStartDate,
      leaseEndDate,
      documents,
    } = data;

    // Check email already exists
    const existingTenant = await Tenant.findOne({
      where: { email },
    });

    if (existingTenant) {
      throw new Error("Email already exists");
    }

    // Validate lease dates
    if (
      leaseStartDate &&
      leaseEndDate &&
      new Date(leaseStartDate) >= new Date(leaseEndDate)
    ) {
      throw new Error(
        "Lease end date must be greater than lease start date"
      );
    }

    const tenant = await Tenant.create({
      firstNameEn,
      firstNameAr,
      lastNameEn,
      lastNameAr,
      phoneNumber,
      email,
      joiningDate,
      location,
      propertyType,
      propertyId,
      buildingNo,
      unitNo,
      tenantPlan,
      leaseType,
      leaseStartDate,
      leaseEndDate,
      documents,
    });

    return tenant;
  }

  async getAllTenants(queryParams) {
  const {
    page = 1,
    limit = 10,
    search = "",
    status
  } = queryParams;

  const offset = (page - 1) * limit;

  const where = {
    isDeleted: false,
  };

  if (search) {
    where[Op.or] = [
      { firstNameEn: { [Op.like]: `%${search}%` } },
      { lastNameEn: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { phoneNumber: { [Op.like]: `%${search}%` } },
    ];
  }

  if (status) {
    where.status = status;
  }

  const { rows, count } = await Tenant.findAndCountAll({
    where,
    limit: Number(limit),
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    total: count,
    page: Number(page),
    totalPages: Math.ceil(count / limit),
    tenants: rows,
  };
}

  async updateTenant(id, data) {

    const tenant = await Tenant.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!tenant) {
      throw new Error("Tenant not found");
    }

    // Email validation
    if (data.email) {
      const existingTenant = await Tenant.findOne({
        where: {
          email: data.email,
          id: {
            [Op.ne]: id,
          },
        },
      });

      if (existingTenant) {
        throw new Error("Email already exists");
      }
    }

    // Lease date validation
    const leaseStartDate =
      data.leaseStartDate || tenant.leaseStartDate;

    const leaseEndDate =
      data.leaseEndDate || tenant.leaseEndDate;

    if (
      leaseStartDate &&
      leaseEndDate &&
      new Date(leaseStartDate) >=
        new Date(leaseEndDate)
    ) {
      throw new Error(
        "Lease end date must be greater than lease start date"
      );
    }

    await tenant.update(data);

    return tenant;
  }

  async deleteTenant(id) {

  const tenant = await Tenant.findOne({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  await tenant.update({
    isDeleted: true,
    status: "INACTIVE",
  });

  return true;
}

}

export default new TenantService();