import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const registerCustomer = (data) =>
  API.post("/auth/register/customer", data);
export const registerCompany = (data) =>
  API.post("/auth/register/company", data);
export const loginUser = (data) => API.post("/auth/login/user", data);
export const loginCompany = (data) => API.post("/auth/login/company", data);
export const getProfile = () => API.get("/auth/profile");

export const createListing = (data) => API.post("/listings", data);
export const getAllListings = (params) => API.get("/listings", { params });
export const getListing = (id) => API.get(`/listings/${id}`);
export const getMyListings = () => API.get("/listings/my");
export const cancelListing = (id) => API.patch(`/listings/${id}/cancel`);

export const makeOffer = (data) => API.post("/offers", data);
export const getMyOffers = () => API.get("/offers/my");
export const acceptOffer = (id) => API.patch(`/offers/${id}/accept`);
export const rejectOffer = (id) => API.patch(`/offers/${id}/reject`);

export const schedulePickup = (data) => API.post("/pickups", data);
export const completePickup = (id, data) =>
  API.patch(`/pickups/${id}/complete`, data);
export const getMyPickups = () => API.get("/pickups");

export const getWallet = () => API.get("/wallet");
export const getImpact = () => API.get("/wallet/impact");

export const submitRating = (data) => API.post("/ratings", data);
export const getCompanyRatings = (id) => API.get(`/ratings/company/${id}`);

export const getAdminDashboard = () => API.get("/admin/dashboard");
export const getPendingCompanies = () => API.get("/admin/companies/pending");
export const verifyCompany = (id) => API.patch(`/admin/companies/${id}/verify`);
export const toggleUser = (id) => API.patch(`/admin/users/${id}/toggle`);
export const getAdminListings = () => API.get("/admin/listings");
