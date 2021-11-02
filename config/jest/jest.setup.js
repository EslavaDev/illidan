process.env.TZ = 'UTC';
require('../../env');
require('@testing-library/jest-dom/extend-expect');

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
