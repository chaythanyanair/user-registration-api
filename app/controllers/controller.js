"use strict";

class Controller {
  constructor() {
    this.request = null;
    this.response = null;
  }

  _setValidator(validatorClass) {
    this.validator = new validatorClass(this.request);
    return;
  }

  setValidator(validatorClass) {
    this._setValidator(validatorClass);
  }
}

module.exports = Controller;
