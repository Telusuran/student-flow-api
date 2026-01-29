import { NavLink } from 'react-router-dom';
import { signOut, useSession } from '../lib/auth-client';

interface LayoutProps {
    children: React.ReactNode;
    onLogout: () => void;
}

export default function Layout({ children, onLogout }: LayoutProps) {
    const { data: session } = useSession();

    const handleLogout = async () => {
        await signOut();
        onLogout();
    };

    const navItems = [
        { to: '/', label: 'Dashboard', icon: '📊' },
        { to: '/users', label: 'Users', icon: '👥' },
        { to: '/projects', label: 'Projects', icon: '📁' },
    ];

    return (
        <div className="min-h-screen bg-neutral-bg flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-display font-bold text-primary">Student Flow</h1>
                    <p className="text-sm text-text-muted">CMS Admin</p>
                </div>

                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {navItems.map(item => (
                            <li key={item.to}>
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                            ? 'bg-primary/10 text-primary font-medium'
                                            : 'text-text-muted hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                            {session?.user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-main truncate">{session?.user?.name}</p>
                            <p className="text-xs text-text-muted truncate">{session?.user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                {children}
            </main>
        </div>
    );
}
