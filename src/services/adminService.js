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

export const getAllListings = async () => {
    const response = await api.get('/admin/listings');
    return response.data;
};

export const deleteListingAdmin = async (listingId) => {
    const response = await api.delete(`/admin/listings/${listingId}`);
    return response.data;
};

export const unflagListing = async (listingId) => {
    const response = await api.put(`/admin/listings/${listingId}/unflag`);
    return response.data;
};

export const dismissListingReport = async (listingId, reportId) => {
    const response = await api.delete(`/admin/listings/${listingId}/reports/${reportId}`);
    return response.data;
};
