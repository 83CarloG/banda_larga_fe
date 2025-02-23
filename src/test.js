// test-utils.js
const { css, classNames, cssVar } = require('./utils/styleUtils');
const { sanitize, sanitizeObject } = require('./utils/security');
const { isValidEmail, validatePassword } = require('./utils/validation');
const { EVENTS, CSS_VARS } = require('./utils/constants');

// Test styleUtils
function testMain () {
    console.log('Testing styleUtils:');
    const styles = css`
    .container {
        color: ${cssVar('primary-color', '#000')};
        padding: 20px;
    }
`;
    console.log(styles);

    const classes = classNames('btn', true && 'active', false && 'disabled');
    console.log('Classes:', classes); // Should output: "btn active"

// Test security
    console.log('\nTesting security:');
    const sanitizedStr = sanitize('<script>alert("xss")</script>');
    console.log('Sanitized string:', sanitizedStr);

    const sanitizedObj = sanitizeObject({
        name: '<b>John</b>',
        age: 30
    });
    console.log('Sanitized object:', sanitizedObj);

// Test validation
    console.log('\nTesting validation:');
    console.log('Valid email:', isValidEmail('test@example.com'));
    console.log('Password validation:', validatePassword('Password123'));

// Test constants
    console.log('\nTesting constants:');
    console.log('Login event:', EVENTS.AUTH.LOGIN);
    console.log('Primary color var:', CSS_VARS.PRIMARY);
}

module.exports = testMain;