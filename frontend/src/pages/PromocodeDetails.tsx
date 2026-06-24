import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Descriptions, Tag, Spin, Button, Space, Popconfirm, message } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import dayjs from 'dayjs';

export default function PromocodeDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: promocode, isLoading, error } = useQuery({
        queryKey: ['promocode', id],
        queryFn: async () => {
            const response = await api.get(`/promocodes/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            if (!id) {
                throw new Error('ID промокода не найден');
            }
            await api.delete(`/promocodes/${id}`);
        },
        onSuccess: () => {
            message.success('Промокод удалён');
            queryClient.invalidateQueries({ queryKey: ['promocodes'] });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
            navigate('/promocodes');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Ошибка при удалении промокода';
            message.error(errorMessage);
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
        return <div style={{ textAlign: 'center', padding: '50px', color: '#ff4d4f' }}>Ошибка загрузки промокода: {error.message}</div>;
    }

    if (!promocode) {
        return <div>Промокод не найден</div>;
    }

    const statusColor = promocode.status === 'active' ? 'green' : promocode.status === 'expired' ? 'red' : 'default';
    const statusLabel = promocode.status === 'active' ? 'Активен' : promocode.status === 'expired' ? 'Истёк' : 'Отключён';
    const discountTypeLabel = promocode.discount_type === 'percentage' ? 'Процент' : 'Фиксированная сумма';

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/promocodes')}>
                    Назад
                </Button>
                <Button type="primary" onClick={() => navigate(`/promocodes/${id}/edit`)}>
                    Редактировать
                </Button>
                <Popconfirm
                    title="Удаление промокода"
                    description="Вы уверены, что хотите удалить этот промокод?"
                    onConfirm={() => {
                        console.log('Delete confirmed, id:', id);
                        deleteMutation.mutate();
                    }}
                    okText="Да"
                    cancelText="Нет"
                >
                    <Button danger icon={<DeleteOutlined />} loading={deleteMutation.isPending}>
                        Удалить
                    </Button>
                </Popconfirm>
            </Space>

            <Card title={`Промокод: ${promocode.code}`}>
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="ID">{promocode.id}</Descriptions.Item>
                    <Descriptions.Item label="Код">{promocode.code}</Descriptions.Item>
                    <Descriptions.Item label="Тип скидки">{discountTypeLabel}</Descriptions.Item>
                    <Descriptions.Item label="Значение скидки">
                        {promocode.discount_type === 'percentage' ? `${promocode.discount_value}%` : `${promocode.discount_value} ₽`}
                    </Descriptions.Item>
                    <Descriptions.Item label="Действует до">{dayjs(promocode.valid_until).format('DD.MM.YYYY HH:mm')}</Descriptions.Item>
                    <Descriptions.Item label="Лимит использований">{promocode.usage_limit}</Descriptions.Item>
                    <Descriptions.Item label="Использовано">{promocode.usage_count}</Descriptions.Item>
                    <Descriptions.Item label="Статус">
                        <Tag color={statusColor}>{statusLabel}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Создан">{dayjs(promocode.created_at).format('DD.MM.YYYY HH:mm')}</Descriptions.Item>
                    <Descriptions.Item label="Обновлён">{dayjs(promocode.updated_at).format('DD.MM.YYYY HH:mm')}</Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    );
}