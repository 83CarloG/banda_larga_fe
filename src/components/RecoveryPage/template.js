const logoImage = require('/src/assets/img/1@2x.png');

const createTemplate = () => `
    <div class="login-container">
        <div class="login-header">
            <div class="login-logo">
                <img src="${logoImage}" alt="Banda Larga" />
            </div>
        </div>
        <form id="recoveryForm">
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" required autocomplete="email" />
            </div>
            <button type="submit">Invia link di recupero</button>
        </form>
        <a id="backToLoginLink" href="#" class="recovery-link">Torna al login</a>
        <div id="message" class="error"></div>
    </div>
`;

module.exports = { createTemplate }; 