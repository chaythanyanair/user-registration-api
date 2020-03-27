'use strict';

const PostUserHelper = require('../helpers/post_user_helper');
const Controller = require('./controller');

class PostUserController extends Controller {
  constructor() {
    super();
  }

  async postUser(req, res) {
    this.request = req;
    this.response = res;
    const user = req.body
    let result = await PostUserHelper.postUserToDb(user);
    if (result.error) {
      return res.status(result.error.httpCode).send(result.error);
    }
    return res.status(result.data.code).send(result.data);
  }
  
}
module.exports = new PostUserController();
