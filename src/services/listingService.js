import api from './api';

// Get all listings
export const getListings = async (params = {}) => {
  const { data } = await api.get('/listings', { params });
  return data;
};

// Get single listing by ID
export const getListingById = async (id) => {
  const { data } = await api.get(`/listings/${id}`);
  return data;
};

// Create new listing
export const createListing = async (listingData) => {
  const { data } = await api.post('/listings', listingData);
  return data;
};

// Update listing
export const updateListing = async (id, listingData) => {
  const { data } = await api.put(`/listings/${id}`, listingData);
  return data;
};

// Delete listing
export const deleteListing = async (id) => {
  const { data } = await api.delete(`/listings/${id}`);
  return data;
};

// Express interest in a listing
export const expressInterest = async (id, message) => {
  const { data } = await api.post(`/listings/${id}/interest`, { message });
  return data;
};

// Get user's listings
export const getUserListings = async (userId) => {
  const { data } = await api.get(`/listings/user/${userId}`);
  return data;
};

// Get listings where user expressed interest
export const getInterestedListings = async (userId) => {
  const { data } = await api.get(`/listings/interested/${userId}`);
  return data;
};

// Accept a fixer for a listing
export const acceptFixer = async (listingId, fixerId) => {
  const { data } = await api.post(`/listings/${listingId}/accept/${fixerId}`);
  return data;
};

// Mark listing as fixed with optional rating
export const markListingFixed = async (listingId, rating = null, fixerId = null) => {
  const { data } = await api.post(`/listings/${listingId}/mark-fixed`, { rating, fixerId });
  return data;
};
