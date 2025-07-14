const recoveryPageStyles = `
.login-container { 
    max-width: 400px; 
    margin: 80px auto; 
    padding: 32px; 
    background: #fff; 
    border-radius: 12px; 
    box-shadow: 0 8px 16px rgba(0,0,0,0.1); 
    font-family: var(--font-family, 'Poppins', sans-serif);
}
.login-header {
    text-align: center;
    margin-bottom: 32px;
}
.login-logo {
    margin-bottom: 8px;
}
.login-logo img {
    max-width: 100%;
    height: auto;
}
.login-title {
    font-size: 20px;
    font-weight: var(--font-weight-medium, 500);
    color: var(--text-color, #1e293b);
    margin-bottom: 8px;
}
.login-subtitle {
    font-size: 14px;
    color: var(--text-secondary, ##D36D48);
}
.form-group {
    margin-bottom: 20px;
}
.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: var(--font-weight-medium, 500);
    font-size: 14px;
}
.form-group input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-sizing: border-box;
    font-family: var(--font-family, 'Poppins', sans-serif);
    font-size: 14px;
    transition: border-color 0.2s, box-shadow 0.2s;
}
.form-group input:focus {
    outline: none;
    border-color: var(--primary-color, #1877f2);
    box-shadow: 0 0 0 3px rgba(24, 119, 242, 0.2);
}
button {
    width: 100%;
    padding: 12px;
    background: var(--primary-color, #1877f2);
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-family: var(--font-family, 'Poppins', sans-serif);
    font-weight: var(--font-weight-medium, 500);
    font-size: 16px;
    transition: background 0.2s;
}
button:hover {
    background: #0d6efd;
}
button:disabled {
    background: #cccccc;
    cursor: not-allowed;
}
.recovery-link {
    display: block;
    text-align: center;
    margin-top: 16px;
    color: var(--primary-color, #1877f2);
    text-decoration: none;
    font-size: 14px;
    font-weight: var(--font-weight-medium, 500);
}
.recovery-link:hover {
    text-decoration: underline;
}
.error {
    color: #dc3545;
    margin-top: 20px;
    text-align: center;
    display: none;
    padding: 12px;
    background: #fff5f5;
    border-radius: 8px;
    border-left: 4px solid #dc3545;
    font-size: 14px;
}
`;

module.exports = recoveryPageStyles; 