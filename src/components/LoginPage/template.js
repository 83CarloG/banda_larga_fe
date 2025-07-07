const logoImage = require('/src/assets/img/1@2x.png');

const createTemplate = () => `
    <div class="login-container">
        <div class="login-header">
            <div class="login-logo">
                <img src="${logoImage}" alt="Banda Larga" />
            </div>
        </div>
        <form id="loginForm">
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" required autocomplete="email" />
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" required autocomplete="current-password" />
            </div>
            <button type="submit">Login</button>
        </form>
        <a id="recoverEmailLink" href="#" class="recovery-link">Password dimenticata</a>
        <div id="error" class="error"></div>
    </div>
`;

module.exports = { createTemplate }; 