const { ACTIVE } = require('../enums/companyStatus');

const TOTAL_COMPANY_STEPS_REGISTER = 5;

const isCompletedCompany = ({ stages, status, typeOrigin }) =>
  (status === ACTIVE && stages.length > TOTAL_COMPANY_STEPS_REGISTER) ||
  typeOrigin === 'SalesForce';

module.exports = { isCompletedCompany };
