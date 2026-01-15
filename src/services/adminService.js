import api from './api';

export const getAdminStats = async () => {
    const response = await api.get('/admin/stats');
    return response.data;
};

export const getAllUsers = async () => {
    const response = await api.get('/admin/users');
    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
};

export const flagUser = async (userId, reason) => {
    const response = await api.put(`/admin/users/${userId}/flag`, { reason });
    return response.data;
};

export const unflagUser = async (userId) => {
    const response = await api.put(`/admin/users/${userId}/unflag`);
    return response.data;
};

export const dismissReport = async (userId, reportId) => {
    const response = await api.delete(`/admin/users/${userId}/reports/${reportId}`);
    return response.data;
};
