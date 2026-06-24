import { createClient } from '@clickhouse/client';

const client = createClient({
    url: 'http://localhost:8123',
    username: 'default',
    password: '',
    database: 'promocode_analytics',
});

async function seed() {
    const now = new Date();
    const promocodes = [
        { id: '6a3c2e37f7792fa025c7efb0', code: 'SUMMER2024' },
        { id: '6a3c2e43f7792fa025c7efb2', code: 'WELCOME50' },
        { id: '6a3c2e53f7792fa025c7efb4', code: 'NEWYEAR2025' },
    ];

    const usageRecords: any[] = [];

    // Generate usage records for the last 30 days
    for (let i = 0; i < 30; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        date.setHours(10 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60), 0);

        // Each day has 1-5 usages
        const usagesPerDay = Math.floor(Math.random() * 5) + 1;
        for (let j = 0; j < usagesPerDay; j++) {
            const promocode = promocodes[Math.floor(Math.random() * promocodes.length)];
            const orderAmount = Math.floor(Math.random() * 5000) + 500;
            const discountApplied = promocode.code === 'WELCOME50' ? 500 : Math.floor(orderAmount * 0.15);

            usageRecords.push({
                id: `${date.getTime()}-${j}-${promocode.id}`,
                promocode_id: promocode.id,
                promocode_code: promocode.code,
                used_at: date.toISOString().slice(0, 19).replace('T', ' '),
                order_amount: orderAmount,
                discount_applied: discountApplied,
            });
        }
    }

    console.log(`Inserting ${usageRecords.length} usage records...`);

    await client.insert({
        table: 'promocode_usage',
        values: usageRecords,
        format: 'JSONEachRow',
    });

    console.log('Usage data seeded successfully!');

    // Also update usage_count in promocodes table
    for (const promocode of promocodes) {
        const count = usageRecords.filter(r => r.promocode_id === promocode.id).length;
        console.log(`${promocode.code}: ${count} usages`);
    }

    await client.close();
}

seed().catch(console.error);