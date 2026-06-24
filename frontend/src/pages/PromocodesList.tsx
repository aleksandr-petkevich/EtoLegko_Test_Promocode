import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Space, Tag, Input, Select, Modal, message, Popconfirm, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

const { Search } = Input;

export default function PromocodesList() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState({ page: 1, limit: 10, code: '', status: '', discount_type: '' });
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const { data, isLoading, error } = useQuery({
        queryKey: ['promocodes', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append('page', String(filters.page));
            params.append('limit', String(filters.limit));
            if (filters.code) params.append('code', filters.code);
            if (filters.status) params.append('status', filters.status);
            if (filters.discount_type) params.append('discount_type', filters.discount_type);
            const response = await api.get(`/promocodes?${params.toString()}`);
            return response.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/promocodes/${id}`);
        },
        onSuccess: () => {
            message.success('Промокод удалён');
            queryClient.invalidateQueries({ queryKey: ['promocodes'] });
            setDeleteModalVisible(false);
        },
        onError: () => {
            message.error('Ошибка при удалении');
        },
    });

    const handleDelete = (id: string) => {
        setSelectedId(id);
        setDeleteModalVisible(true);
    };

    const confirmDelete = () => {
        if (selectedId) {
            deleteMutation.mutate(selectedId);
        }
    };

    const columns = [
        { title: 'Код', dataIndex: 'code', key: 'code', sorter: true },
        { title: 'Тип скидки', dataIndex: 'discount_type', key: 'discount_type' },
        { title: 'Значение', dataIndex: 'discount_value', key: 'discount_value' },
        { title: 'Лимит', dataIndex: 'usage_limit', key: 'usage_limit' },
        { title: 'Использовано', dataIndex: 'usage_count', key: 'usage_count' },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const color = status === 'active' ? 'green' : status === 'expired' ? 'red' : 'default';
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    <Button type="link" icon={<EyeOutlined />} onClick={() => navigate(`/promocodes/${record.id}`)} />
                    <Button type="link" icon={<EditOutlined />} onClick={() => navigate(`/promocodes/${record.id}/edit`)} />
                    <Popconfirm title="Удалить промокод?" onConfirm={() => handleDelete(record.id)}>
                        <Button type="link" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    if (error) {
        return <div style={{ textAlign: 'center', padding: '50px', color: '#ff4d4f' }}>Ошибка загрузки списка промокодов: {error.message}</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2>Список промокодов</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/promocodes/new')}>
                    Создать
                </Button>
            </div>

            <Card style={{ marginBottom: 16 }}>
                <Space wrap>
                    <Search
                        placeholder="Поиск по коду"
                        style={{ width: 200 }}
                        onSearch={(value) => setFilters({ ...filters, code: value, page: 1 })}
                        allowClear
                    />
                    <Select
                        placeholder="Статус"
                        style={{ width: 150 }}
                        allowClear
                        onChange={(value) => setFilters({ ...filters, status: value || '', page: 1 })}
                        options={[
                            { value: 'active', label: 'Активен' },
                            { value: 'expired', label: 'Истёк' },
                            { value: 'disabled', label: 'Отключён' },
                        ]}
                    />
                    <Select
                        placeholder="Тип скидки"
                        style={{ width: 150 }}
                        allowClear
                        onChange={(value) => setFilters({ ...filters, discount_type: value || '', page: 1 })}
                        options={[
                            { value: 'percentage', label: 'Процент' },
                            { value: 'fixed', label: 'Фиксированная сумма' },
                        ]}
                    />
                </Space>
            </Card>

            <Table
                columns={columns}
                dataSource={data?.data || []}
                rowKey="id"
                loading={isLoading}
                pagination={{
                    current: filters.page,
                    pageSize: filters.limit,
                    total: data?.total || 0,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Всего: ${total}`,
                    onChange: (page, pageSize) => setFilters({ ...filters, page, limit: pageSize }),
                }}
            />

            <Modal
                title="Подтверждение удаления"
                open={deleteModalVisible}
                onOk={confirmDelete}
                onCancel={() => setDeleteModalVisible(false)}
                confirmLoading={deleteMutation.isPending}
            >
                <p>Вы уверены, что хотите удалить этот промокод?</p>
            </Modal>
        </div>
    );
}