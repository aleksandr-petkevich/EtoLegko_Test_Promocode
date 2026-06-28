import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Form, Input, InputNumber, Select, Button, message, Spin, Space, DatePicker } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import dayjs from 'dayjs';

const { Option } = Select;

export default function ManualUsageForm() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [form] = Form.useForm();

    const { data: promocodesData, isLoading: isLoadingPromocodes } = useQuery({
        queryKey: ['promocodes'],
        queryFn: async () => {
            const response = await api.get('/promocodes?limit=1000&status=active');
            return response.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            await api.post('/usage', data);
        },
        onSuccess: () => {
            message.success('Запись о применении промокода добавлена');
            queryClient.invalidateQueries({ queryKey: ['promocodes'] });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
            queryClient.invalidateQueries({ queryKey: ['usages'] });
            form.resetFields();
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Ошибка при добавлении записи';
            message.error(errorMessage);
        },
    });

    const onSubmit = (data: any) => {
        const formattedData = {
            ...data,
            used_at: data.used_at ? dayjs(data.used_at).format('YYYY-MM-DDTHH:mm:ss') : dayjs().format('YYYY-MM-DDTHH:mm:ss'),
        };
        createMutation.mutate(formattedData);
    };

    if (isLoadingPromocodes) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/promocodes')}>
                    Назад
                </Button>
            </Space>

            <Card title="Добавить применение промокода">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onSubmit}
                    initialValues={{
                        usage_count: 1,
                        used_at: dayjs(),
                    }}
                >
                    <Form.Item
                        label="Промокод"
                        name="promocode_id"
                        rules={[{ required: true, message: 'Выберите промокод' }]}
                    >
                        <Select placeholder="Выберите промокод" showSearch optionFilterProp="children">
                            {promocodesData?.data?.map((promocode: any) => (
                                <Option key={promocode.id} value={promocode.id}>
                                    {promocode.code} (скидка: {promocode.discount_value}{promocode.discount_type === 'percentage' ? '%' : '₽'})
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Дата применения"
                        name="used_at"
                        rules={[{ required: true, message: 'Укажите дату' }]}
                    >
                        <DatePicker
                            format="YYYY-MM-DD"
                            style={{ width: '100%' }}
                            placeholder="Выберите дату"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Количество применений"
                        name="usage_count"
                        rules={[{ required: true, message: 'Укажите количество' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="ID пользователя (опционально)"
                        name="user_id"
                    >
                        <Input placeholder="Например: user_12345" />
                    </Form.Item>

                    <Form.Item
                        label="Комментарий (опционально)"
                        name="comment"
                    >
                        <Input.TextArea rows={3} placeholder="Дополнительная информация" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={createMutation.isPending}
                            block
                            style={{ whiteSpace: 'normal', height: 'auto', minHeight: 40 }}
                        >
                            Добавить запись
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}