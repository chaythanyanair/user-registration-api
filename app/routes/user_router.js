'use strict';

const GetUserController = require('../controllers/get_user_controller');
const PostUserController = require('../controllers/post_user_controller');
const router = require('express').Router({ mergeParams: true });

router.get('/:userId', GetUserController.getUser.bind(GetUserController));
router.post('/', PostUserController.postUser.bind(PostUserController))

module.exports = router;
