const { Op } = require('sequelize');

function toPlain(value) {
  if (Array.isArray(value)) return value.map(toPlain);
  if (value && typeof value.toJSON === 'function') return value.toJSON();
  return value;
}

function mapWhere(where = {}) {
  return Object.entries(where).reduce((mapped, [key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      if (Object.prototype.hasOwnProperty.call(value, 'gt')) {
        mapped[key] = { [Op.gt]: value.gt };
        return mapped;
      }
      if (Object.prototype.hasOwnProperty.call(value, 'gte')) {
        mapped[key] = { [Op.gte]: value.gte };
        return mapped;
      }
      if (Object.prototype.hasOwnProperty.call(value, 'lt')) {
        mapped[key] = { [Op.lt]: value.lt };
        return mapped;
      }
      if (Object.prototype.hasOwnProperty.call(value, 'lte')) {
        mapped[key] = { [Op.lte]: value.lte };
        return mapped;
      }
    }
    mapped[key] = value;
    return mapped;
  }, {});
}

function mapOrder(orderBy) {
  if (!orderBy) return undefined;
  return Object.entries(orderBy).map(([field, direction]) => [field, String(direction).toUpperCase()]);
}

function mapInclude(model, include = {}) {
  return Object.entries(include)
    .filter(([alias]) => alias !== '_count' && model.associations[alias])
    .map(([alias, nested]) => {
      const association = model.associations[alias];
      const child = { association };

      if (nested && typeof nested === 'object') {
        if (nested.where) child.where = mapWhere(nested.where);
        if (nested.orderBy) child.order = mapOrder(nested.orderBy);
        if (nested.take) child.limit = nested.take;
        if (nested.orderBy || nested.take) child.separate = true;
        if (nested.include) child.include = mapInclude(association.target, nested.include);
      }

      return child;
    });
}

function addCounts(value, include = {}) {
  if (!include._count || !include._count.select) return value;

  const addCount = (row) => {
    if (!row) return row;
    row._count = Object.keys(include._count.select).reduce((counts, key) => {
      counts[key] = Array.isArray(row[key]) ? row[key].length : 0;
      return counts;
    }, {});
    return row;
  };

  if (Array.isArray(value)) return value.map(addCount);
  return addCount(value);
}

function mapOptions(model, options = {}) {
  const mapped = {};
  if (options.where) mapped.where = mapWhere(options.where);
  if (options.orderBy) mapped.order = mapOrder(options.orderBy);
  if (options.take) mapped.limit = options.take;
  if (options.include) mapped.include = mapInclude(model, options.include);
  return mapped;
}

function flattenUniqueWhere(where = {}) {
  const entries = Object.entries(where);
  if (entries.length === 1) {
    const [, value] = entries[0];
    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      return value;
    }
  }
  return where;
}

async function updateInstance(model, where, data) {
  const instance = await model.findOne({ where: mapWhere(where) });
  if (!instance) return null;

  const increments = {};
  const nextData = {};
  Object.entries(data).forEach(([key, value]) => {
    if (value && typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, 'increment')) {
      increments[key] = value.increment;
    } else {
      nextData[key] = value;
    }
  });

  if (Object.keys(nextData).length) {
    instance.set(nextData);
  }
  if (Object.keys(increments).length) {
    await instance.increment(increments);
    await instance.reload();
  } else {
    await instance.save();
  }

  return toPlain(instance);
}

function createModelAdapter(model) {
  return {
    async findMany(options = {}) {
      const rows = await model.findAll(mapOptions(model, options));
      return addCounts(toPlain(rows), options.include);
    },

    async findUnique(options = {}) {
      const row = await model.findOne(mapOptions(model, options));
      return addCounts(toPlain(row), options.include);
    },

    async findFirst(options = {}) {
      const row = await model.findOne(mapOptions(model, options));
      return toPlain(row);
    },

    async create({ data }) {
      const row = await model.create(data);
      return toPlain(row);
    },

    async update({ where, data }) {
      return updateInstance(model, where, data);
    },

    async delete({ where }) {
      const row = await model.findOne({ where: mapWhere(where) });
      if (!row) return null;
      await row.destroy();
      return toPlain(row);
    },

    async deleteMany({ where }) {
      return model.destroy({ where: mapWhere(where) });
    },

    async upsert({ where, update = {}, create }) {
      const flattenedWhere = flattenUniqueWhere(where);
      const existing = await model.findOne({ where: mapWhere(flattenedWhere) });
      if (existing) {
        if (Object.keys(update).length) {
          existing.set(update);
          await existing.save();
        }
        return toPlain(existing);
      }
      const row = await model.create({ ...flattenedWhere, ...create });
      return toPlain(row);
    },
  };
}

function createSequelizeModelClient(models) {
  return Object.entries(models).reduce((client, [name, model]) => {
    if (name === 'sequelize' || typeof model.findAll !== 'function') return client;
    const clientName = name.charAt(0).toLowerCase() + name.slice(1);
    client[clientName] = createModelAdapter(model);
    return client;
  }, {});
}

module.exports = {
  createSequelizeModelClient,
};
