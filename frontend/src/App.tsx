import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
    DashboardOutlined,
    GiftOutlined,
    EditOutlined,
    HistoryOutlined,
} from '@ant-design/icons';
import Dashboard from './pages/Dashboard';
import PromocodesList from './pages/PromocodesList';
import PromocodeDetails from './pages/PromocodeDetails';
import PromocodeForm from './pages/PromocodeForm';
import ManualUsageForm from './pages/ManualUsageForm';
import UsageHistory from './pages/UsageHistory';

const { Header, Content, Sider } = Layout;

const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: 'Дашборд' },
    { key: '/promocodes', icon: <GiftOutlined />, label: 'Промокоды' },
    { key: '/usage/new', icon: <EditOutlined />, label: 'Применить' },
    { key: '/usage/history', icon: <HistoryOutlined />, label: 'История применений' },
];

function AppContent() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={200} style={{ background: '#001529' }}>
                <div className="logo" style={{ padding: '16px', textAlign: 'center', color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>
                    Promocode Manager
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                />
            </Sider>
            <Layout>
                <Header className="header" style={{ background: '#fff', padding: '0 24px', boxShadow: '0 1px 4px rgba(0,21,41,.08)' }}>
                    <div style={{ fontSize: '18px', fontWeight: 500 }}>Управление промокодами</div>
                </Header>
                <Content style={{ margin: '16px', background: '#f5f5f5' }}>
                    <div className="content-wrapper" style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/promocodes" element={<PromocodesList />} />
                            <Route path="/promocodes/new" element={<PromocodeForm />} />
                            <Route path="/promocodes/:id" element={<PromocodeDetails />} />
                            <Route path="/promocodes/:id/edit" element={<PromocodeForm />} />
                            <Route path="/usage/new" element={<ManualUsageForm />} />
                            <Route path="/usage/history" element={<UsageHistory />} />
                        </Routes>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;