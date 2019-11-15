class $ {
  constructor() {
    this.taskList = [];
    this.fetchCache = {};
  }

  setState(func) {
    this.taskList.push({ type: 'setState', func });
    return this;
  }

  dispatch(func) {
    this.taskList.push({ type: 'dispatch', func });
    return this;
  }

  fetch(opinion) {
    this.fetchCache.fetch = opinion;
    return this;
  }

  send(func) {
    this.fetchCache.send = func;
    return this;
  }

  route(opinion) {
    this.fetchCache.route = opinion;
    return this;
  }

  handle(func) {
    this.fetchCache.handle = func;
    if (!(this.fetchCache.fetch && this.fetchCache.route)) throw new Error('必须提供完整的请求流！');
    this.taskList.push({ type: 'fetchCombine', ...this.fetchCache });
    this.fetchCache = {};
    return this;
  }
}

module.exports = $;