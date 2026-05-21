const categoryRepository = require('../repositories/category.repository');
const AppError = require('../utils/appError');
const HTTP_STATUS = require('../constants/httpStatus');

class CategoryService {
  async createCategory(payload, user) {
    const name = this.#normalizeName(payload.name);
    const slug = this.#generateSlug(payload.slug || name);

    if (!name) {
      throw new AppError('Category name is required', HTTP_STATUS.BAD_REQUEST);
    }

    const existingByName = await categoryRepository.findByName(name);
    if (existingByName) {
      throw new AppError('Category name already exists', HTTP_STATUS.CONFLICT);
    }

    const existingBySlug = await categoryRepository.findBySlug(slug);
    if (existingBySlug) {
      throw new AppError('Category slug already exists', HTTP_STATUS.CONFLICT);
    }

    return categoryRepository.create({
      name,
      slug,
      description: this.#normalizeDescription(payload.description),
      color: this.#normalizeColor(payload.color),
      isActive: this.#normalizeBoolean(payload.isActive, true),
      sortOrder: this.#normalizeSortOrder(payload.sortOrder),
      createdBy: user?.id || null,
      updatedBy: user?.id || null
    });
  }

  async listCategories(query = {}) {
    const page = this.#normalizePage(query.page);
    const limit = this.#normalizeLimit(query.limit);
    const skip = (page - 1) * limit;

    const filter = {};

    if (query.search && String(query.search).trim()) {
      filter.$text = { $search: String(query.search).trim() };
    }

    if (query.isActive !== undefined) {
      filter.isActive = String(query.isActive).toLowerCase() === 'true';
    }

    const [items, total] = await Promise.all([
      categoryRepository.list(filter, { skip, limit }),
      categoryRepository.count(filter)
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1
      }
    };
  }

  async getCategoryById(categoryId) {
    const category = await categoryRepository.findById(categoryId);

    if (!category) {
      throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
    }

    return category;
  }

  async updateCategory(categoryId, payload, user) {
    const category = await categoryRepository.findById(categoryId);

    if (!category) {
      throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
    }

    const update = {
      updatedBy: user?.id || null
    };

    if (payload.name !== undefined) {
      const name = this.#normalizeName(payload.name);

      if (!name) {
        throw new AppError('Category name cannot be empty', HTTP_STATUS.BAD_REQUEST);
      }

      const existingByName = await categoryRepository.findByName(name);
      if (existingByName && String(existingByName._id) !== String(categoryId)) {
        throw new AppError('Category name already exists', HTTP_STATUS.CONFLICT);
      }

      update.name = name;

      if (payload.slug === undefined) {
        update.slug = this.#generateSlug(name);
      }
    }

    if (payload.slug !== undefined) {
      update.slug = this.#generateSlug(payload.slug);
    }

    if (update.slug) {
      const existingBySlug = await categoryRepository.findBySlug(update.slug);
      if (existingBySlug && String(existingBySlug._id) !== String(categoryId)) {
        throw new AppError('Category slug already exists', HTTP_STATUS.CONFLICT);
      }
    }

    if (payload.description !== undefined) {
      update.description = this.#normalizeDescription(payload.description);
    }

    if (payload.color !== undefined) {
      update.color = this.#normalizeColor(payload.color);
    }

    if (payload.isActive !== undefined) {
      update.isActive = this.#normalizeBoolean(payload.isActive, category.isActive);
    }

    if (payload.sortOrder !== undefined) {
      update.sortOrder = this.#normalizeSortOrder(payload.sortOrder);
    }

    return categoryRepository.updateById(categoryId, update);
  }

  async deleteCategory(categoryId) {
    const category = await categoryRepository.findById(categoryId);

    if (!category) {
      throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
    }

    await categoryRepository.deleteById(categoryId);
    return true;
  }

  #normalizeName(value) {
    return String(value || '').trim();
  }

  #normalizeDescription(value) {
    return String(value || '').trim();
  }

  #generateSlug(value) {
    const slug = String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!slug) {
      throw new AppError('Valid category slug is required', HTTP_STATUS.BAD_REQUEST);
    }

    return slug;
  }

  #normalizeColor(value) {
    const color = String(value || '').trim();

    if (!color) {
      return '#4f46e5';
    }

    const isHexColor = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color);
    if (!isHexColor) {
      throw new AppError('color must be a valid hex color', HTTP_STATUS.BAD_REQUEST);
    }

    return color;
  }

  #normalizeBoolean(value, defaultValue) {
    if (value === undefined || value === null || value === '') {
      return defaultValue;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    return String(value).toLowerCase() === 'true';
  }

  #normalizeSortOrder(value) {
    const sortOrder = Number(value);
    return Number.isNaN(sortOrder) ? 0 : sortOrder;
  }

  #normalizePage(value) {
    const page = Number(value) || 1;
    return Math.max(page, 1);
  }

  #normalizeLimit(value) {
    const limit = Number(value) || 50;
    return Math.min(Math.max(limit, 1), 100);
  }
}

module.exports = new CategoryService();