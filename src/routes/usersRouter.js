const Router = require('koa-router');
const userController = require('../controllers/userController');
// const authenticateSession = require('../utils/authenticateSession');

const router = new Router();

// 获取所有用户
router.get('/', userController.getUsers);

// 创建新用户
router.post('/', userController.createUser);

router.post('/updateUser', userController.updateUser);

router.get('/info', userController.getOneUser);

// 自定义条件查询接口
router.get('/search', userController.searchUsers);

// 根据用户id获取用户信息
router.get('/:id', userController.getUserById);

// 根据用户uid获取用户信息
router.get('/uid/:uid', userController.getUserByUid);

// 根据用户username获取用户信息
router.get('/username/:username', userController.getUserByUsername);

// 删除用户（软删除）
router.delete('/:id', userController.deleteUser);

module.exports = router;
