const categoryService = require('../services/category.service');
const asyncHandler = require('../utils/asyncHandler');
const HTTP_STATUS = require('../constants/httpStatus');

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body, req.user);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Category created successfully',
    data: category
  });
});

const listCategories = asyncHandler(async (req, res) => {
  const data = await categoryService.listCategories(req.query);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Categories fetched successfully',
    data
  });
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Category fetched successfully',
    data: category
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body, req.user);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Category updated successfully',
    data: category
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);

  res.status(HTTP_STATUS.NO_CONTENT).send();
});

module.exports = {
  createCategory,
  listCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};