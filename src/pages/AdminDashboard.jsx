import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getAdminStats, getAllUsers, deleteUser, unflagUser, dismissReport } from '../services/adminService';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';

const AdminDashboard = () => {
    const { user } = useAuth();
    const { success, error: showError } = useToast();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');

    // Modal State
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        variant: 'danger' // danger, warning, or default (which is blue)
    });

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/');
        }
    }, [user, navigate]);

    const loadData = async () => {
        try {
            const statsData = await getAdminStats();
            const usersData = await getAllUsers();
            setStats(statsData);
            setUsers(usersData);
        } catch (err) {
            console.error('Error loading admin data:', err);
            showError('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const closeModal = () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

    const showConfirm = (title, message, action, variant = 'danger') => {
        setModalConfig({
            isOpen: true,
            title,
            message,
            onConfirm: async () => {
                await action();
                closeModal();
            },
            variant
        });
    };

    const handleDeleteUser = (userId) => {
        showConfirm(
            'Delete User?',
            'Are you sure you want to delete this user? This will remove all their listings and data permanently.',
            async () => {
                try {
                    await deleteUser(userId);
                    success('User removed successfully');
                    loadData();
                } catch (err) {
                    console.error('Error deleting user:', err);
                    showError('Failed to remove user');
                }
            },
            'danger'
        );
    };

    const handleUnflagUser = (userId) => {
        showConfirm(
            'Remove Flag?',
            'Are you sure you want to restore this user to good standing?',
            async () => {
                try {
                    await unflagUser(userId);
                    success('User flag removed');
                    loadData();
                } catch (err) {
                    console.error('Error unflagging user:', err);
                    showError('Failed to remove flag');
                }
            },
            'default'
        );
    };

    const handleDismissReport = (userId, reportId) => {
        showConfirm(
            'Dismiss Report?',
            'This report will be deleted and the user will not be penalized. Continue?',
            async () => {
                try {
                    await dismissReport(userId, reportId);
                    success('Report dismissed');
                    loadData();
                } catch (err) {
                    console.error('Error dismissing report:', err);
                    showError('Failed to dismiss report');
                }
            },
            'warning'
        );
    };


    const allReports = React.useMemo(() => {
        return users.flatMap(u =>
            (u.reports || []).map(r => ({
                ...r,
                reportedUser: u,
                key: `${u._id}-${r._id || r.createdAt}`
            }))
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [users]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="mt-1 text-sm text-gray-500">Platform Moderation Center</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full uppercase font-medium tracking-wide">
                        {user?.role} Mode
                    </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats?.totalUsers}</dd>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Listings</dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats?.totalListings}</dd>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-500 truncate">Flagged Users</dt>
                            <dd className="mt-1 text-3xl font-semibold text-red-600">{stats?.flaggedUsers}</dd>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`${activeTab === 'users'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Users & Moderation
                        </button>
                        <button
                            onClick={() => setActiveTab('reports')}
                            className={`${activeTab === 'reports'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                        >
                            Recent Reports
                            {allReports.length > 0 && (
                                <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2.5 rounded-full text-xs font-semibold">
                                    {allReports.length}
                                </span>
                            )}
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'users' ? (
                    /* Users Table */
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">User Management</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Review flagged users and manage accounts.</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((u) => (
                                        <tr key={u._id} className={u.isFlagged ? "bg-red-50" : ""}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img className="h-10 w-10 rounded-full" src={u.photoUrl} alt="" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{u.name}</div>
                                                        <div className="text-sm text-gray-500">{u.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {u.isFlagged || (u.reports && u.reports.length > 0) ? (
                                                    <div className="flex flex-col space-y-1">
                                                        {u.isFlagged && (
                                                            <div className="flex items-center space-x-1">
                                                                <span className="px-2 w-fit inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                                    Admin Flagged: {u.flagReason}
                                                                </span>
                                                                <button
                                                                    onClick={() => handleUnflagUser(u._id)}
                                                                    className="text-gray-400 hover:text-green-600"
                                                                    title="Remove Flag"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        )}
                                                        {u.reports && u.reports.length > 0 && (
                                                            <div className="mt-1">
                                                                <span className="px-2 inline-flex text-xs leading-5 font-bold rounded-full bg-orange-100 text-orange-800 mb-1">
                                                                    {u.reports.length} Community Reports
                                                                </span>
                                                                <div className="text-xs text-gray-500 max-w-xs whitespace-normal bg-orange-50 p-2 rounded">
                                                                    <p className="font-semibold text-orange-900 border-b border-orange-200 mb-1 pb-1">
                                                                        Latest:
                                                                    </p>
                                                                    &quot;{u.reports[u.reports.length - 1].reason}&quot;
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(u._id.getTimestamp ? u._id.getTimestamp() : Date.now()).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {u.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleDeleteUser(u._id)}
                                                        className="text-red-600 hover:text-red-900 ml-4 font-bold"
                                                    >
                                                        Ban User
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* Reports List View */
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Incident Reports</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Timeline of all reported incidents.</p>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {allReports.length === 0 ? (
                                <li className="px-6 py-12 text-center text-gray-500">
                                    No reports found. The community is safe! 🛡️
                                </li>
                            ) : (
                                allReports.map((report) => (
                                    <li key={report.key} className="px-6 py-5 hover:bg-gray-50 transition duration-150 ease-in-out">
                                        <div className="flex justify-between items-start space-x-4">

                                            {/* Left: Report Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-500">
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                        </svg>
                                                    </span>
                                                    <h4 className="text-sm font-bold text-gray-900">
                                                        Report against <span className="text-blue-600">{report.reportedUser.name}</span>
                                                        <span className="text-gray-400 font-normal mx-2">•</span>
                                                        <span className="text-gray-500 font-normal text-xs">{new Date(report.createdAt).toLocaleString()}</span>
                                                    </h4>
                                                </div>
                                                <div className="ml-10">
                                                    <p className="text-sm text-gray-900 bg-red-50 p-3 rounded-lg border border-red-100 inline-block max-w-2xl">
                                                        &quot;{report.reason}&quot;
                                                    </p>
                                                    <p className="mt-2 text-xs text-gray-500">
                                                        Reported User ID: <span className="font-mono bg-gray-100 px-1">{report.reportedUser._id}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right: Actions */}
                                            <div className="flex-shrink-0 flex flex-col items-end space-y-2">
                                                <button
                                                    onClick={() => handleDismissReport(report.reportedUser._id, report._id)}
                                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    Dismiss
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(report.reportedUser._id)}
                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                >
                                                    Ban User
                                                </button>
                                            </div>

                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
                variant={modalConfig.variant}
            />
        </div>
    );
};

export default AdminDashboard;
