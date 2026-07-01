import ServiceProvider from "../models/serviceProvider.model";

class ServiceProviderService {

  async createProvider(data) {

    const member = await ServiceProvider.findOne({
      where: {
        serviceMemberId: data.serviceMemberId,
      },
    });

    if (member) {
      throw new Error("Service Member ID already exists");
    }

    const email = await ServiceProvider.findOne({
      where: {
        email: data.email,
      },
    });

    if (email) {
      throw new Error("Email already exists");
    }

    return await ServiceProvider.create(data);
  }

  async getAllProviders(query) {

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await ServiceProvider.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  }

  async getProviderById(id) {

    const provider = await ServiceProvider.findByPk(id);

    if (!provider) {
      throw new Error("Service Provider not found");
    }

    return provider;
  }

  async updateProvider(id, data) {

    const provider = await ServiceProvider.findByPk(id);

    if (!provider) {
      throw new Error("Service Provider not found");
    }

    await provider.update(data);

    return provider;
  }

  async deleteProvider(id) {

    const provider = await ServiceProvider.findByPk(id);

    if (!provider) {
      throw new Error("Service Provider not found");
    }

    await provider.destroy();

    return true;
  }
}

export default new ServiceProviderService();