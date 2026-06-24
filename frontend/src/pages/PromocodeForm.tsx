import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Form, Input, InputNumber, Select, Button, message, Spin, Space } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const { Option } = Select;

const promocodeSchema = z.object({
    code: z.string().min(1, 'Код обязателен').max(50, 'Код слишком длинный'),
    discount_type: z.enum(['percentage', 'fixed']),
    discount_value: z.number().min(0, 'Значение должно быть положительным'),
    valid_until: z.string().min(1, 'Дата обязательна'),
    usage_limit: z.number().min(1, 'Лимит должен быть не менее 1'),
    status: z.enum(['active', 'expired', 'disabled']),
});

type PromocodeFormData = z.infer<typeof promocodeSchema>;

export default function PromocodeForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = !!id;

    const { data: promocode, isLoading: isLoadingPromocode, error: promocodeError } = useQuery({
        queryKey: ['promocode', id],
        queryFn: async () => {
            if (!id || id === 'undefined') {
                throw new Error('ID промокода не найден');
            }
            const response = await api.get(`/promocodes/${id}`);
            return response.data;
        },
        enabled: isEdit && !!id && id !== 'undefined',
    });

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<PromocodeFormData>({
        resolver: zodResolver(promocodeSchema),
        defaultValues: {
            code: '',
            discount_type: 'percentage',
            discount_value: 0,
            valid_until: '',
            usage_limit: 1,
            status: 'active',
        },
    });

    useEffect(() => {
        if (promocode) {
            reset({
                code: promocode.code,
                discount_type: promocode.discount_type,
                discount_value: promocode.discount_value,
                valid_until: promocode.valid_until,
                usage_limit: promocode.usage_limit,
                status: promocode.status,
            });
        }
    }, [promocode, reset]);

    const createMutation = useMutation({
        mutationFn: async (data: PromocodeFormData) => {
            await api.post('/promocodes', data);
        },
        onSuccess: () => {
            message.success('Промокод создан');
            queryClient.invalidateQueries({ queryKey: ['promocodes'] });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
            navigate('/promocodes');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Ошибка при создании';
            message.error(errorMessage);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (data: PromocodeFormData) => {
            await api.put(`/promocodes/${id}`, data);
        },
        onSuccess: () => {
            message.success('Промокод обновлён');
            queryClient.invalidateQueries({ queryKey: ['promocodes'] });
            queryClient.invalidateQueries({ queryKey: ['promocode', id] });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
            navigate('/promocodes');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Ошибка при обновлении';
            message.error(errorMessage);
        },
    });

    const onSubmit = (data: PromocodeFormData) => {
        if (isEdit) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
    };

    if (isEdit && isLoadingPromocode) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (promocodeError) {
        return <div style={{ textAlign: 'center', padding: '50px', color: '#ff4d4f' }}>Ошибка загрузки данных промокода: {promocodeError.message}</div>;
    }

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/promocodes')}>
                    Назад
                </Button>
            </Space>

            <Card title={isEdit ? 'Редактировать промокод' : 'Создать промокод'}>
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    <Form.Item label="Код промокода" validateStatus={errors.code ? 'error' : ''} help={errors.code?.message}>
                        <Controller
                            name="code"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} placeholder="Например: SUMMER2024" />
                            )}
                        />
                    </Form.Item>

                    <Form.Item label="Тип скидки" validateStatus={errors.discount_type ? 'error' : ''} help={errors.discount_type?.message}>
                        <Controller
                            name="discount_type"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} placeholder="Выберите тип">
                                    <Option value="percentage">Процент (%)</Option>
                                    <Option value="fixed">Фиксированная сумма (₽)</Option>
                                </Select>
                            )}
                        />
                    </Form.Item>

                    <Form.Item label="Значение скидки" validateStatus={errors.discount_value ? 'error' : ''} help={errors.discount_value?.message}>
                        <Controller
                            name="discount_value"
                            control={control}
                            render={({ field }) => (
                                <InputNumber {...field} min={0} style={{ width: '100%' }} />
                            )}
                        />
                    </Form.Item>

                    <Form.Item label="Действует до" validateStatus={errors.valid_until ? 'error' : ''} help={errors.valid_until?.message}>
                        <Controller
                            name="valid_until"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} type="datetime-local" />
                            )}
                        />
                    </Form.Item>

                    <Form.Item label="Лимит использований" validateStatus={errors.usage_limit ? 'error' : ''} help={errors.usage_limit?.message}>
                        <Controller
                            name="usage_limit"
                            control={control}
                            render={({ field }) => (
                                <InputNumber {...field} min={1} style={{ width: '100%' }} />
                            )}
                        />
                    </Form.Item>

                    <Form.Item label="Статус" validateStatus={errors.status ? 'error' : ''} help={errors.status?.message}>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} placeholder="Выберите статус">
                                    <Option value="active">Активен</Option>
                                    <Option value="expired">Истёк</Option>
                                    <Option value="disabled">Отключён</Option>
                                </Select>
                            )}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isSubmitting || createMutation.isPending || updateMutation.isPending}>
                            {isEdit ? 'Сохранить' : 'Создать'}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}