module.exports = {
  env: {
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  rules: {
    // I disable no-continue rule.
    // 'continue' statement is usable for me to eary return.
    // 'no-continue' rule prevent me from do eary return and make me write long codes in a if block.
    'no-continue': 'off',
  },
};
