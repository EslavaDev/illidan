const UAParser = require('ua-parser-js');

const parseUserAgent = (userAgent) => {
  const UserAgentInstance = new UAParser(userAgent);

  return {
    UAInstance: UserAgentInstance,
    browser: UserAgentInstance.getBrowser(),
    cpu: UserAgentInstance.getCPU(),
    device: UserAgentInstance.getDevice(),
    engine: UserAgentInstance.getEngine(),
    os: UserAgentInstance.getOS(),
    ua: UserAgentInstance.getUA(),
  };
};

module.exports = { parseUserAgent };
