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

/* ✅ AXIOS INSTANCE */

const api = axios.create({
  baseURL: 'https://vehicle-assistance-backend-1.onrender.com',
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
};
