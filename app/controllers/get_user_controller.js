'use strict';

const GetUserHelper = require('../helpers/get_user_helper');
const Controller = require('./controller');

class GetUserController extends Controller {
  constructor() {
    super();
  }

  async getUser(req, res) {
    this.request = req;
    this.response = res;
    const userId = req.params.userId
    let result = await GetUserHelper.getUserFromDb(userId);
    if (result.error) {
      return res.status(result.error.httpCode).send(result.error);
    }
    return res.status(result.data.code).send(result.data);
  }
}
module.exports = new GetUserController();
