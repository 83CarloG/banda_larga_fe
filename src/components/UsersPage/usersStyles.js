export function getStyles() {
    return `
        :host {
            display: block;
            --primary-color: #1877f2;
            --bg-color: #f0f2f5;
            --sidebar-bg: #ffffff;
            --text-primary: #050505;
            --text-secondary: #65676b;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .container {
            display: flex;
            min-height: 100vh;
            background-color: var(--bg-color);
            padding-top: 56px;
            padding-bottom: 64px; /* Height of footer */
        }

        
        .content-wrapper {
            flex: 1;
            margin-left: 280px;
            display: flex;
            flex-direction: column;
            width: calc(100% - 280px);
            min-height: calc(100vh - 56px - 64px);
        }

        .main-content {
            flex: 1;
            padding: 24px;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
            box-sizing: border-box;
        }

      
        h2 {
            color: var(--text-primary);
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 24px 0;
        }

        @media (max-width: 768px) {
            .container {
                padding-bottom: 0;
            }

            .content-wrapper {
                margin-left: 0;
                width: 100%;
                min-height: calc(100vh - 56px);
            }

            .main-content {
                padding: 16px;
            }
        }

  
    `;
}