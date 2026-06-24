import axios from 'axios';

export const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED') {
            return Promise.reject(new Error('Превышено время ожидания ответа от сервера'));
        }
        if (error.code === 'ERR_NETWORK' || !error.response) {
            return Promise.reject(new Error('Сервер недоступен. Проверьте, что бэкенд запущен на порту 3001'));
        }
        return Promise.reject(error);
    }
);

export interface Promocode {
    id: string;
    code: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    valid_until: string;
    usage_limit: number;
    usage_count: number;
    status: 'active' | 'expired' | 'disabled';
    created_at: string;
    updated_at: string;
}

export interface PromocodeListResponse {
    data: Promocode[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface AnalyticsData {
    usageByDay: { date: string; usage_count: number }[];
    topPromocodes: { promocode_code: string; usage_count: number }[];
    statusDistribution: { status: string; count: number }[];
    conversionRate: { used_count: number; total_count: number };
    totalCount: number;
    activeCount: number;
}
