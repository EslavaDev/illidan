require('../../env');
require('@testing-library/jest-dom/extend-expect');

const path = require('path');

// eslint-disable-next-line import/no-dynamic-require
const { jest: { setupBeforeTest } = {} } =
  require(path.resolve(process.cwd(), 'illidan.config')) || {};

global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

global.requestAnimationFrame =
  global.requestAnimationFrame ||
  function (callback) {
    setTimeout(callback, 0);
  };

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}

  observe() {
    return null;
  }

  disconnect() {
    return null;
  }

  unobserve() {
    return null;
  }
};

if (setupBeforeTest) {
  // eslint-disable-next-line import/no-dynamic-require
  require(setupBeforeTest);
}
