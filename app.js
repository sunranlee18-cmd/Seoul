document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. Sticky Header Scroll Effect
    const header = document.getElementById('appHeader');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Count-up Animation for Hero Metrics
    const countElements = document.querySelectorAll('.count');
    const animateCount = (el) => {
        const target = parseFloat(el.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        const isFloat = target % 1 !== 0;

        const updateValue = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime >= duration) {
                el.textContent = isFloat ? target.toFixed(1) : Math.round(target).toLocaleString();
                return;
            }

            const progress = elapsedTime / duration;
            // Ease-out quad formula
            const easeProgress = progress * (2 - progress);
            const currentValue = easeProgress * target;

            el.textContent = isFloat ? currentValue.toFixed(1) : Math.round(currentValue).toLocaleString();
            requestAnimationFrame(updateValue);
        };

        requestAnimationFrame(updateValue);
    };

    // Trigger Count Up on Load
    countElements.forEach(el => animateCount(el));

    // 4. Interactive Tabs for 5 Global Agencies
    const tabButtons = document.querySelectorAll('.agency-tab-btn');
    const contents = document.querySelectorAll('.agency-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from buttons
            tabButtons.forEach(b => b.classList.remove('active'));
            // Add active to current button
            btn.classList.add('active');

            const targetAgency = btn.getAttribute('data-agency');

            // Fade out current active content and show target content
            contents.forEach(content => {
                if (content.classList.contains('active')) {
                    content.style.opacity = '0';
                    content.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        content.classList.remove('active');
                        
                        const nextContent = document.getElementById(`content-${targetAgency}`);
                        nextContent.classList.add('active');
                        // Micro-delay to trigger CSS transition
                        setTimeout(() => {
                            nextContent.style.opacity = '1';
                            nextContent.style.transform = 'translateY(0)';
                        }, 50);
                    }, 400); // Match CSS transition duration
                }
            });
        });
    });

    // 5. Interactive Chart.js setup for Trend Visualization
    const ctx = document.getElementById('ghgTrendsChart').getContext('2d');
    
    // Datasets
    const chartDataSets = {
        co2: {
            labels: ['1958', '1965', '1975', '1985', '1995', '2005', '2015', '2020', '2024', '2025'],
            data: [315.3, 320.0, 331.1, 346.1, 360.8, 379.8, 400.8, 414.2, 422.8, 425.3],
            label: '이산화탄소 농도 (CO₂ - ppm)',
            color: '#00f2fe',
            gradientStart: 'rgba(0, 242, 254, 0.25)',
            title: '이산화탄소(CO₂) 농도 장기 변화 (NOAA / Copernicus)',
            subtitle: '하와이 마우나 로아 관측소에서 기록한 최초의 연속 실측 곡선 및 2025 역사상 첫 425 ppm 돌파 (시즌 최고 430 ppm 초과)',
            legendText: 'CO₂ 농도 (ppm)'
        },
        ch4: {
            labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
            data: [1834, 1843, 1850, 1858, 1866, 1879, 1890, 1893, 1895, 1896, 1897],
            label: '메탄 농도 (CH₄ - ppb)',
            color: '#00e676',
            gradientStart: 'rgba(0, 230, 118, 0.25)',
            title: '메탄(CH₄) 농도 최근 추이 (Copernicus CAMS)',
            subtitle: '지구 온난화 유발 지수 28배에 달하는 초강력 온실가스 메탄, 80만 년 최고 농도인 1897 ppb 기록',
            legendText: 'CH₄ 농도 (ppb)'
        },
        aggi: {
            labels: ['1990', '1995', '2000', '2005', '2010', '2015', '2020', '2021', '2022', '2023', '2024'],
            data: [1.00, 1.08, 1.14, 1.21, 1.29, 1.37, 1.47, 1.49, 1.51, 1.52, 1.54],
            label: '연간 온실가스 지수 (AGGI)',
            color: '#ffb347',
            gradientStart: 'rgba(255, 179, 71, 0.25)',
            title: 'NOAA 연간 온실가스 지수 (AGGI) 변화',
            subtitle: '1990년 대기 복사강제력 세기를 1.00 기준으로 설계하여, 온실가스가 축적하는 지구 직접 열 가중치가 54% 늘어났음을 경고',
            legendText: 'AGGI 복사강제력 Index'
        }
    };

    // Create Gradient Helper
    const getGradient = (color, startOpacity) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, 380);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        return gradient;
    };

    // Chart Configuration
    let activeChartKey = 'co2';
    const activeData = chartDataSets[activeChartKey];

    const chartConfig = {
        type: 'line',
        data: {
            labels: activeData.labels,
            datasets: [{
                label: activeData.label,
                data: activeData.data,
                borderColor: activeData.color,
                borderWidth: 3,
                pointBackgroundColor: activeData.color,
                pointBorderColor: 'rgba(255,255,255,0.8)',
                pointBorderWidth: 1.5,
                pointRadius: 5,
                pointHoverRadius: 8,
                backgroundColor: getGradient(activeData.gradientStart, 0.25),
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // We use our custom header HTML legend
                },
                tooltip: {
                    backgroundColor: 'rgba(11, 15, 25, 0.95)',
                    titleFont: {
                        family: 'Outfit',
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        family: 'Noto Sans KR',
                        size: 13
                    },
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label = label.split(' (')[0] + ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toLocaleString();
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.04)',
                        borderColor: 'transparent'
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            family: 'Outfit',
                            size: 12
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.04)',
                        borderColor: 'transparent'
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            family: 'Outfit',
                            size: 12
                        }
                    }
                }
            }
        }
    };

    // Instantiate Chart
    let trendsChart = new Chart(ctx, chartConfig);

    // Dynamic Chart Toggles
    const chartBtns = document.querySelectorAll('.chart-btn');
    const chartTitle = document.getElementById('chartTitle');
    const chartSubtitle = document.getElementById('chartSubtitle');
    const legendText = document.getElementById('legendText');
    const legendDot = document.querySelector('.legend-dot');

    chartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            chartBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const chartKey = btn.getAttribute('data-chart');
            const datasetInfo = chartDataSets[chartKey];

            // Update Titles & Legend HTML
            chartTitle.textContent = datasetInfo.title;
            chartSubtitle.textContent = datasetInfo.subtitle;
            legendText.textContent = datasetInfo.legendText;
            legendDot.style.backgroundColor = datasetInfo.color;
            legendDot.style.boxShadow = `0 0 8px ${datasetInfo.color}`;

            // Update Chart Data & Styling
            trendsChart.data.labels = datasetInfo.labels;
            trendsChart.data.datasets[0].label = datasetInfo.label;
            trendsChart.data.datasets[0].data = datasetInfo.data;
            trendsChart.data.datasets[0].borderColor = datasetInfo.color;
            trendsChart.data.datasets[0].pointBackgroundColor = datasetInfo.color;
            trendsChart.data.datasets[0].backgroundColor = getGradient(datasetInfo.gradientStart, 0.25);

            // Re-render
            trendsChart.update();
        });
    });

    // 6. Smooth Scroll Behavior for Active Navigation Highlights
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 120)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
});
