module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 50], // Enforce 50 character max for commit title
    'body-max-line-length': [2, 'always', 72], // Wrap body lines at 72 characters
    'subject-case': [0, 'always'],
    'footer-max-length': [0, 'always'],
    'footer-max-line-length': [0, 'always'],
    'body-max-length': [0, 'always'],
  },
};
