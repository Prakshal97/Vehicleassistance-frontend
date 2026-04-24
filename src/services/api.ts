import axios from 'axios';

/* ✅ TYPES */

export interface MechanicLocation {
  x: number;
  y: number;
}

export interface Mechanic {
  id: string;
  name: string;
  phone: string;
  location: MechanicLocation;
  serviceType: string;
  approved: boolean;
  lat?: number;
  lng?: number;
}

export interface AddMechanicPayload {
  name: string;
  phone: string;
  serviceType: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
}

export interface BreakdownRequest {
  id: string;
  userId: string;
  mechanicId: string;
  vehicleType: string;
  problemDescription: string;
  latitude: number;
  longitude: number;
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'REJECTED';
}

export interface CreateRequestPayload {
  mechanicId: string;
  vehicleType: string;
  problemDescription: string;
  latitude: number;
  longitude: number;
}

/* ✅ AXIOS INSTANCE */

const isLocal = window.location.hostname === 'localhost';
const api = axios.create({
  baseURL: isLocal 
    ? 'http://localhost:8081' 
    : 'https://vehicle-assistance-backend-1.onrender.com',
  headers: { 'Content-Type': 'application/json' },
});

/* ✅ SERVICE */

export const mechanicService = {
  getNearby: async (lat: number, lng: number): Promise<Mechanic[]> => {
    const res = await api.get(`/mechanics/nearby?lat=${lat}&lng=${lng}`);
    return res.data;
  },

  getAll: async (): Promise<Mechanic[]> => {
    const res = await api.get('/mechanics/all');
    return res.data;
  },

  getApproved: async (): Promise<Mechanic[]> => {
    const res = await api.get('/mechanics/approved');
    return res.data;
  },

  addMechanic: async (data: AddMechanicPayload): Promise<Mechanic> => {
    const res = await api.post('/mechanics/add', data);
    return res.data;
  },

  updateMechanic: async (id: string, data: Partial<Mechanic>): Promise<Mechanic> => {
    const res = await api.put(`/mechanics/${id}`, data);
    return res.data;
  },

  deleteMechanic: async (id: string): Promise<void> => {
    await api.delete(`/mechanics/${id}`);
  },

  approveMechanic: async (id: string): Promise<Mechanic> => {
    const res = await api.post(`/mechanics/${id}/approve`);
    return res.data;
  },
};

export const breakdownService = {
  createRequest: async (data: CreateRequestPayload): Promise<BreakdownRequest> => {
    const res = await api.post('/breakdown/request', data);
    return res.data;
  },

  getMechanicRequests: async (mechanicId: string): Promise<BreakdownRequest[]> => {
    const res = await api.get(`/breakdown/mechanic/${mechanicId}`);
    return res.data;
  },

  updateRequestStatus: async (requestId: string, status: string): Promise<BreakdownRequest> => {
    const res = await api.put(`/breakdown/${requestId}/status?status=${status}`);
    return res.data;
  },
};
