const express = require('express');
const adminAnalyticsController = require('../controllers/adminAnalytics.controller');
const categoryController = require('../controllers/category.controller');
const { authMiddleware, authorize } = require('../middlewares/auth.middleware');
const validateObjectId = require('../middlewares/validateObjectId.middleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.use(authMiddleware, authorize(ROLES.ADMIN));

router.get('/analytics', adminAnalyticsController.getOverview);

router.post('/categories', categoryController.createCategory);
router.get('/categories', categoryController.listCategories);
router.get('/categories/:id', validateObjectId('id'), categoryController.getCategoryById);
router.patch('/categories/:id', validateObjectId('id'), categoryController.updateCategory);
router.delete('/categories/:id', validateObjectId('id'), categoryController.deleteCategory);

module.exports = router;