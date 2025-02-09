export function getFooterStyles() {
    return `
        :host {
            display: block;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .footer {
            background: white;
            padding: 16px;
            border-top: 1px solid #dddfe2;
            color: #65676b;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 98;
        }

        .footer-content {
            display: flex;
            justify-content: space-around;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 280px 0 0;
        }

        .contact-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            color: #1c1e21;
        }

        .contact-item svg {
            flex-shrink: 0;
        }

        @media (max-width: 1024px) {
            .footer-content {
                flex-direction: column;
                gap: 12px;
                padding: 0;
            }
        }

        @media (max-width: 768px) {
            .footer {
                position: static;
                margin-top: auto;
            }
        }
    `;
}