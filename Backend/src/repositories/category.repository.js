const Category = require('../models/category.model');

class CategoryRepository {
  create(data) {
    return Category.create(data);
  }

  findById(id) {
    return Category.findById(id);
  }

  findBySlug(slug) {
    return Category.findOne({ slug });
  }

  findByName(name) {
    return Category.findOne({
      name: { $regex: `^${this.#escapeRegex(name)}$`, $options: 'i' }
    });
  }

  list(filter = {}, options = {}) {
    const query = Category.find(filter).sort({
      sortOrder: 1,
      name: 1,
      createdAt: -1
    });

    if (options.skip !== undefined) {
      query.skip(options.skip);
    }

    if (options.limit !== undefined) {
      query.limit(options.limit);
    }

    return query;
  }

  count(filter = {}) {
    return Category.countDocuments(filter);
  }

  updateById(id, update) {
    return Category.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true
    });
  }

  deleteById(id) {
    return Category.findByIdAndDelete(id);
  }

  #escapeRegex(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

module.exports = new CategoryRepository();