const Router = require('koa-router');
const authenticateJWT = require('../utils/authenticateJWT');
const {saveArticle, getArticleById, getArticleList} = require("../controllers/articleController");

const router = Router();

router.post('/', saveArticle)

router.get('/i/:id', getArticleById )

router.get('/list', getArticleList)


module.exports = router;