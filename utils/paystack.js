const axios = require('./axios');
const { paystack } = require('../config');

const resolveAccountNumber = async (account_number, bank_code) => {
  try {
    const isValid = await axios.get(
      `/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`
    );
    return isValid.data;
  } catch (err) {
    return {
      status: false,
      message: err.toString(),
    };
  }
};

const getSubAccount = async (id) => {
  try {
    const subAccount = await axios.get(`/subaccount/${id}`);
    return subAccount.data;
  } catch (err) {
    return {
      status: false,
      message: 'failed to fetch subaccount',
      server_message: err.toString(),
    };
  }
};

const createSubAccount = async (store_name, account_number, bank_code) => {
  try {
    const subAccountCreated = await axios.post('/subaccount', {
      business_name: store_name,
      bank_code,
      account_number,
      percentage_charge: paystack.commission_rate,
    });
    return {
      status: true,
      data: {
        id: subAccountCreated.data.data.subaccount_code,
      },
    };
  } catch (err) {
    return {
      status: false,
      message: 'subaccount failed to get created',
      server_message: err.toString(),
    };
  }
};

const updateSubAccount = async (id, store_name, account_number, bank_code) => {
  try {
    const subAccountCreated = await axios.put(`/subaccount/${id}`, {
      business_name: store_name,
      bank_code,
      account_number,
      percentage_charge: paystack.commission_rate,
    });
    return {
      status: true,
      data: {
        id: subAccountCreated.data.data.subaccount_code,
      },
    };
  } catch (err) {
    return {
      status: false,
      message: 'subaccount failed to get updated',
      server_message: err.toString(),
    };
  }
};

module.exports = {
  resolveAccountNumber,
  getSubAccount,
  createSubAccount,
  updateSubAccount,
};
