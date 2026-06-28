import { useQuery } from '@tanstack/react-query';
import { Card, Row, Col, Statistic, Table, Spin } from 'antd';
import { api } from '../api/client';
import { AnalyticsData } from '../api/client';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Dashboard() {
    const { data: analytics, isLoading, error } = useQuery({
        queryKey: ['analytics'],
        queryFn: async () => {
            const response = await api.get('/promocodes/analytics/dashboard');
            return response.data as AnalyticsData;
        },
    });

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return <div style={{ textAlign: 'center', padding: '50px', color: '#ff4d4f' }}>Ошибка загрузки аналитики: {error.message}</div>;
    }

    if (!analytics) {
        return <div>Нет данных</div>;
    }

    const { used_count } = analytics.conversionRate;
    const total_count = analytics.totalCount || 0;
    const activeCount = analytics.activeCount || 0;
    const conversionRate = total_count > 0 ? ((used_count / total_count) * 100).toFixed(1) : 0;

    // Calculate max values for charts
    const maxUsageByDay = Math.max(...analytics.usageByDay.map(item => item.usage_count || 0), 0);
    const maxTopPromocodes = Math.max(...analytics.topPromocodes.map(item => item.usage_count || 0), 0);

    const statusColumns = [
        { title: 'Статус', dataIndex: 'status', key: 'status' },
        { title: 'Количество', dataIndex: 'count', key: 'count' },
    ];


    return (
        <div>
            <h2 style={{ marginBottom: 24 }}>Дашборд аналитики</h2>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic title="Всего промокодов" value={total_count} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Использовано" value={used_count} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Конверсия" value={conversionRate} suffix="%" />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Активных" value={activeCount} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={12}>
                    <Card title="Использование по дням (последние 30 дней)">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analytics.usageByDay}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={[0, maxUsageByDay]} allowDecimals={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="usage_count" stroke="#1890ff" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Распределение по статусам">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={analytics.statusDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ status, count }) => `${status}: ${count}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {analytics.statusDistribution.map((_item, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Card title="Топ-5 промокодов">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.topPromocodes}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="promocode_code" />
                                <YAxis domain={[0, maxTopPromocodes]} allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="usage_count" fill="#1890ff" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Статистика по статусам">
                        <Table
                            dataSource={analytics.statusDistribution}
                            columns={statusColumns}
                            rowKey="status"
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}