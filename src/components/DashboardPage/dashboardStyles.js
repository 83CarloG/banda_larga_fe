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

        .sidebar {
            width: 280px;
            height: calc(100vh - 56px - 64px); /* Adjusted for header and footer */
            background: var(--sidebar-bg);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            position: fixed;
            left: 0;
            top: 56px;
            padding: 20px 0;
            display: flex;
            flex-direction: column;
            transition: transform 0.3s ease;
            overflow-y: auto;
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

        ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        li {
            margin: 4px 0;
            padding: 0 8px;
        }

        a {
            color: var(--text-primary);
            text-decoration: none;
            font-size: 15px;
            font-weight: 500;
            padding: 12px 16px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            transition: background-color 0.2s;
        }

        a:hover {
            background-color: var(--bg-color);
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

            .sidebar {
                transform: translateX(-100%);
                z-index: 99;
                height: calc(100vh - 56px);
            }

            .sidebar.active {
                transform: translateX(0);
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

        .menu-toggle {
            display: none;
            position: fixed;
            top: 70px;
            left: 16px;
            z-index: 101;
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 8px;
            border-radius: 4px;
            cursor: pointer;
        }

        @media (max-width: 768px) {
            .menu-toggle {
                display: block;
            }
        }
    `;
}