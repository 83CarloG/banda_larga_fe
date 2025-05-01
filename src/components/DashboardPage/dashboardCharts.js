// components/DashboardPage/dashboardCharts.js
"use strict";

const { createLoadingIndicator } = require('./dashboardTemplate');

/**
 * Creates a dashboard charts component
 *
 * @param {Object} config - Configuration object
 * @param {Object} config.chartData - Chart data object
 * @param {boolean} config.isLoading - Loading state
 * @returns {Object} Component API
 */
const DashboardCharts = (config = {}) => {
    const {
        chartData = {
            userActivity: [],
            centerDistribution: []
        },
        isLoading = false
    } = config;

    // Create container element
    const container = document.createElement('div');
    container.className = 'charts-container';

    // Function to create a chart card
    const createChartCard = (title, id, type) => {
        const card = document.createElement('div');
        card.className = 'chart-card';

        card.innerHTML = `
            <div class="chart-card-header">
                <h3 class="chart-card-title">${title}</h3>
            </div>
            <div id="${id}" class="chart-container"></div>
        `;

        return { card, chartContainer: card.querySelector('.chart-container') };
    };

    // Render bar chart
    const renderBarChart = (container, data) => {
        if (!data || !data.length) return;

        // Calculate chart dimensions and scales
        const width = container.clientWidth;
        const height = container.clientHeight;
        const padding = { top: 20, right: 20, bottom: 40, left: 40 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        // Calculate max value for scaling
        const maxValue = Math.max(...data.map(d => d.count));

        // Create SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);

        // Create chart group with padding
        const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        chartGroup.setAttribute('transform', `translate(${padding.left}, ${padding.top})`);
        svg.appendChild(chartGroup);

        // Calculate bar width
        const barWidth = chartWidth / data.length - 10;

        // Create bars
        data.forEach((d, i) => {
            const barHeight = (d.count / maxValue) * chartHeight;
            const x = i * (barWidth + 10);
            const y = chartHeight - barHeight;

            // Create bar rectangle
            const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            bar.setAttribute('x', x);
            bar.setAttribute('y', y);
            bar.setAttribute('width', barWidth);
            bar.setAttribute('height', barHeight);
            bar.setAttribute('fill', '#3b82f6');
            bar.setAttribute('rx', '4');

            // Create hover effect
            bar.addEventListener('mouseenter', () => {
                bar.setAttribute('fill', '#2563eb');
            });
            bar.addEventListener('mouseleave', () => {
                bar.setAttribute('fill', '#3b82f6');
            });

            chartGroup.appendChild(bar);

            // Add label
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', x + barWidth / 2);
            label.setAttribute('y', chartHeight + 20);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('fill', '#64748b');
            label.setAttribute('font-size', '12px');
            label.textContent = d.month;
            chartGroup.appendChild(label);

            // Add value label
            const valueLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            valueLabel.setAttribute('x', x + barWidth / 2);
            valueLabel.setAttribute('y', y - 10);
            valueLabel.setAttribute('text-anchor', 'middle');
            valueLabel.setAttribute('fill', '#64748b');
            valueLabel.setAttribute('font-size', '12px');
            valueLabel.textContent = d.count;
            chartGroup.appendChild(valueLabel);
        });

        // Add x-axis
        const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        xAxis.setAttribute('x1', 0);
        xAxis.setAttribute('y1', chartHeight);
        xAxis.setAttribute('x2', chartWidth);
        xAxis.setAttribute('y2', chartHeight);
        xAxis.setAttribute('stroke', '#e2e8f0');
        xAxis.setAttribute('stroke-width', '1');
        chartGroup.appendChild(xAxis);

        container.appendChild(svg);
    };

    // Render pie chart
    const renderPieChart = (container, data) => {
        if (!data || !data.length) return;

        // Calculate chart dimensions
        const width = container.clientWidth;
        const height = container.clientHeight;
        const radius = Math.min(width, height) / 2 - 40;

        // Create SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);

        // Create chart group centered in the SVG
        const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        chartGroup.setAttribute('transform', `translate(${width / 2}, ${height / 2})`);
        svg.appendChild(chartGroup);

        // Calculate total value for percentages
        const total = data.reduce((sum, d) => sum + d.value, 0);

        // Define pie chart colors
        const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

        // Calculate pie slices
        let startAngle = 0;
        data.forEach((d, i) => {
            const percentage = d.value / total;
            const endAngle = startAngle + percentage * 2 * Math.PI;

            // Calculate path for pie slice
            const x1 = radius * Math.sin(startAngle);
            const y1 = -radius * Math.cos(startAngle);
            const x2 = radius * Math.sin(endAngle);
            const y2 = -radius * Math.cos(endAngle);

            // Create path for slice
            const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
            const pathData = [
                `M 0 0`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
            ].join(' ');

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', pathData);
            path.setAttribute('fill', colors[i % colors.length]);

            // Hover effects
            path.addEventListener('mouseenter', () => {
                path.setAttribute('transform', `scale(1.05)`);
            });
            path.addEventListener('mouseleave', () => {
                path.setAttribute('transform', `scale(1)`);
            });

            chartGroup.appendChild(path);

            // Calculate position for label
            const labelAngle = startAngle + (endAngle - startAngle) / 2;
            const labelRadius = radius * 0.7;
            const labelX = labelRadius * Math.sin(labelAngle);
            const labelY = -labelRadius * Math.cos(labelAngle);

            // Add percentage label
            const percentLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            percentLabel.setAttribute('x', labelX);
            percentLabel.setAttribute('y', labelY);
            percentLabel.setAttribute('text-anchor', 'middle');
            percentLabel.setAttribute('fill', 'white');
            percentLabel.setAttribute('font-size', '12px');
            percentLabel.setAttribute('font-weight', 'bold');
            percentLabel.textContent = `${Math.round(percentage * 100)}%`;
            chartGroup.appendChild(percentLabel);

            startAngle = endAngle;
        });

        // Add legend
        const legendGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        legendGroup.setAttribute('transform', `translate(${width / 2 - 80}, ${height - 30})`);

        data.forEach((d, i) => {
            // Legend color rectangle
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', i * 80);
            rect.setAttribute('y', 0);
            rect.setAttribute('width', 12);
            rect.setAttribute('height', 12);
            rect.setAttribute('fill', colors[i % colors.length]);
            legendGroup.appendChild(rect);

            // Legend text
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', i * 80 + 16);
            text.setAttribute('y', 10);
            text.setAttribute('fill', '#64748b');
            text.setAttribute('font-size', '12px');
            text.textContent = d.name;
            legendGroup.appendChild(text);
        });

        svg.appendChild(legendGroup);
        container.appendChild(svg);
    };

    // Render charts
    const render = () => {
        container.innerHTML = '';

        if (isLoading) {
            container.innerHTML = createLoadingIndicator('Loading charts...');
            return;
        }

        // Activity chart
        const { card: activityCard, chartContainer: activityChartContainer } = createChartCard(
            'Attività degli utenti (Ultimi 6 msesi)',
            'activity-chart',
            'bar'
        );
        container.appendChild(activityCard);

        // Center distribution chart
        const { card: distributionCard, chartContainer: distributionChartContainer } = createChartCard(
            'Distribuzione ospiti',
            'distribution-chart',
            'pie'
        );
        container.appendChild(distributionCard);

        // Render charts after DOM has been updated
        setTimeout(() => {
            renderBarChart(activityChartContainer, chartData.userActivity);
            renderPieChart(distributionChartContainer, chartData.centerDistribution);
        }, 0);
    };

    // Initial render
    render();

    // Public API
    return {
        getElement: () => container,

        update: (newChartData) => {
            Object.assign(chartData, newChartData);
            render();
        },

        setLoading: (loading) => {
            isLoading = loading;
            render();
        }
    };
};

module.exports = DashboardCharts;