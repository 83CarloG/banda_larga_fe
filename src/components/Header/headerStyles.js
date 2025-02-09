export function getHeaderStyles() {
    return `
        :host {
            display: block;
            --primary-color: #1877f2;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
        }

        .header {
            background: white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 8px 16px;
            height: 56px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            box-sizing: border-box;
            position: relative;
        }

        .logo-section {
            display: flex;
            align-items: center;
            margin-left: 280px;
        }

        .logo-placeholder {
            width: 40px;
            height: 40px;
            background-color: #e4e6eb;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #65676b;
            font-weight: bold;
        }

        .title {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            color: #ff0000;
            font-size: 24px;
            font-weight: bold;
            white-space: nowrap;
        }

        .user-section {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-right: 16px;
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px;
            border-radius: 20px;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .user-info:hover {
            background-color: #f0f2f5;
        }

        .avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #e4e6eb;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .username {
            font-size: 15px;
            font-weight: 500;
            color: #050505;
            display: block;
        }

        #logout {
            background-color: #e4e6eb;
            color: #050505;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        #logout:hover {
            background-color: #d8dadf;
        }

        @media (max-width: 768px) {
            .logo-section {
                margin-left: 0;
            }

            .username {
                display: none;
            }

            .header {
                padding: 8px 12px;
            }
        }
    `;
}