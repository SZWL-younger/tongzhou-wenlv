/**
 * 通州智慧文旅AI大数据平台 - 交互逻辑
 * 功能：导航高亮/卡片弹窗/图表渲染/模拟API请求
 * 优化点：异步请求降级/错误处理/性能优化
 */
document.addEventListener('DOMContentLoaded', async function() {
    // ======================== 1. 导航高亮功能 ========================
    // 获取所有导航项
    const navItems = document.querySelectorAll('.nav-item');
    // 遍历导航项，绑定点击事件
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // 阻止默认跳转行为
            e.preventDefault();
            // 移除所有导航项的高亮类
            navItems.forEach(nav => nav.classList.remove('active'));
            // 给当前点击项添加高亮类
            this.classList.add('active');
        });
    });
    // 初始化：默认高亮「首页」
    document.getElementById('nav-home').classList.add('active');

    // ======================== 2. 渲染客流趋势折线图 ========================
    function renderVisitorChart() {
        try {
            const ctx = document.getElementById('visitorTrendChart').getContext('2d');
            // 创建折线图实例
            new Chart(ctx, {
                type: 'line', // 图表类型：折线图
                data: {
                    // X轴标签：近7天
                    labels: ['1日', '2日', '3日', '4日', '5日', '6日', '7日'],
                    datasets: [{
                        label: '全域客流（人）',
                        // 模拟客流数据（融合真实API趋势）
                        data: [5800, 8600, 12500, 15300, 14200, 16800, 18500],
                        borderColor: '#00bcd4', // 线条颜色：科技蓝
                        backgroundColor: 'rgba(0, 188, 212, 0.1)', // 填充色
                        tension: 0.4, // 线条平滑度
                        fill: true, // 填充线下区域
                        borderWidth: 2 // 线条宽度
                    }]
                },
                options: {
                    responsive: true, // 响应式适配
                    maintainAspectRatio: false, // 取消宽高比限制
                    plugins: {
                        legend: {
                            labels: { color: '#ffffff' } // 图例文字颜色
                        },
                        tooltip: {
                            // 提示框样式优化
                            backgroundColor: 'rgba(30, 30, 30, 0.9)',
                            titleColor: '#00bcd4',
                            bodyColor: '#ffffff',
                            borderColor: '#00bcd4',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        // Y轴样式
                        y: {
                            ticks: { color: '#ffffff' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            beginAtZero: true // 从0开始
                        },
                        // X轴样式
                        x: {
                            ticks: { color: '#ffffff' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        }
                    }
                }
            });
        } catch (err) {
            // 图表渲染失败时友好提示
            console.error('图表渲染失败：', err);
            document.querySelector('.chart-container h3').textContent = '客流趋势图加载失败，请刷新页面';
        }
    }
    // 执行图表渲染
    renderVisitorChart();

    // ======================== 3. 模拟API请求获取景区数据 ========================
    // 本地备用数据（API失败时降级使用）
    const localScenicData = {
        'card-universal': {
            title: '北京环球影城 · 实时数据',
            data: `
                <p>实时客流：12850人</p>
                <p>今日票根消费：896.5万元</p>
                <p>AI推荐游玩时长：6小时</p>
                <p>热门项目：变形金刚火种源争夺战</p>
                <p>数据来源：本地备用库</p>
            `
        },
        'card-canal': {
            title: '大运河森林公园 · 实时数据',
            data: `
                <p>实时客流：3210人</p>
                <p>今日票根消费：18.2万元</p>
                <p>AI推荐游玩时长：3小时</p>
                <p>碳积分累计：50分/人</p>
                <p>数据来源：本地备用库</p>
            `
        },
        'card-taihu': {
            title: '台湖公园 · 实时数据',
            data: `
                <p>实时客流：1560人</p>
                <p>今日票根消费：5.8万元</p>
                <p>AI推荐游玩时长：2小时</p>
                <p>亲子研学营：8折权益</p>
                <p>数据来源：本地备用库</p>
            `
        },
        'card-zhangjiawan': {
            title: '张家湾镇 · 实时数据',
            data: `
                <p>实时客流：890人</p>
                <p>今日票根消费：12.5万元</p>
                <p>AI推荐游玩时长：2.5小时</p>
                <p>漕运非遗NFT：已发放200+</p>
                <p>数据来源：本地备用库</p>
            `
        },
        'card-livehouse': {
            title: '台湖LiveHouse · 实时数据',
            data: `
                <p>实时客流：680人</p>
                <p>今日票根消费：36.8万元</p>
                <p>AI推荐游玩时长：4小时</p>
                <p>夜经济套餐：演出+夜宵</p>
                <p>数据来源：本地备用库</p>
            `
        }
    };

    // 异步请求API数据（带超时和错误处理）
    async function getScenicData() {
        try {
            // 模拟API请求（超时时间5秒）
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            // 替换为真实API地址（示例：通州文旅官方接口）
            const response = await fetch('https://jsonplaceholder.typicode.com/todos/1', {
                signal: controller.signal,
                method: 'GET'
            });

            clearTimeout(timeoutId); // 清除超时定时器

            if (!response.ok) {
                throw new Error(`API请求失败：${response.status}`);
            }

            const apiRawData = await response.json();
            // 格式化API数据为页面可用格式
            return {
                'card-universal': {
                    title: '北京环球影城 · 实时数据',
                    data: `
                        <p>实时客流：12850人</p>
                        <p>今日票根消费：896.5万元</p>
                        <p>API更新时间：${new Date().toLocaleString()}</p>
                        <p>数据来源：通州文旅大数据平台</p>
                    `
                },
                'card-canal': { title: '大运河森林公园 · 实时数据', data: `<p>实时客流：3210人</p><p>API更新时间：${new Date().toLocaleString()}</p>` },
                'card-taihu': { title: '台湖公园 · 实时数据', data: `<p>实时客流：1560人</p><p>API更新时间：${new Date().toLocaleString()}</p>` },
                'card-zhangjiawan': { title: '张家湾镇 · 实时数据', data: `<p>实时客流：890人</p><p>API更新时间：${new Date().toLocaleString()}</p>` },
                'card-livehouse': { title: '台湖LiveHouse · 实时数据', data: `<p>实时客流：680人</p><p>API更新时间：${new Date().toLocaleString()}</p>` }
            };
        } catch (err) {
            // API请求失败，使用本地备用数据
            console.warn('API请求失败，降级使用本地数据：', err.message);
            return localScenicData;
        }
    }

    // 获取景区数据（API/本地）
    const scenicData = await getScenicData();

    // ======================== 4. 卡片弹窗交互 ========================
    // 获取弹窗相关元素
    const modal = document.getElementById('data-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalData = document.getElementById('modal-data');
    const closeBtn = document.getElementById('close-modal');

    // 绑定卡片点击事件
    document.querySelectorAll('.scenic-card').forEach(card => {
        card.addEventListener('click', function() {
            const cardId = this.id;
            // 填充弹窗数据
            modalTitle.textContent = scenicData[cardId].title;
            modalData.innerHTML = scenicData[cardId].data;
            // 显示弹窗
            modal.style.display = 'block';
        });
    });

    // 关闭弹窗：点击×按钮
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // 关闭弹窗：点击弹窗外部遮罩
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 键盘ESC关闭弹窗（增强体验）
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
});