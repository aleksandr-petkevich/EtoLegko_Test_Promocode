import { useQuery } from '@tanstack/react-query';
import { Card, Table, Spin, Space, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export default function UsageHistory() {
    const navigate = useNavigate();

    const { data: usagesData, isLoading, error } = useQuery({
        queryKey: ['usages'],
        queryFn: async () => {
            const response = await api.get('/usage?limit=1000');
            return response.data;
        },
    });

    const columns = [
        {
            title: 'Промокод',
            dataIndex: 'promocode_code',
            key: 'promocode_code',
        },
        {
            title: 'Дата и время применения',
            dataIndex: 'used_at',
            key: 'used_at',
            render: (date: string) => new Date(date).toLocaleString('ru-RU'),
        },
        {
            title: 'Количество',
            dataIndex: 'usage_count',
            key: 'usage_count',
        },
        {
            title: 'ID пользователя',
            dataIndex: 'user_id',
            key: 'user_id',
            render: (userId: string) => userId || '-',
        },
        {
            title: 'Комментарий',
            dataIndex: 'comment',
            key: 'comment',
            render: (comment: string) => comment || '-',
        },
    ];

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return <div style={{ textAlign: 'center', padding: '50px', color: '#ff4d4f' }}>Ошибка загрузки истории: {error.message}</div>;
    }

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/promocodes')}>
                    Назад
                </Button>
            </Space>

            <Card title="История применений промокодов">
                <Table
                    dataSource={usagesData?.data || []}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 20 }}
                    size="middle"
                />
            </Card>
        </div>
    );
}