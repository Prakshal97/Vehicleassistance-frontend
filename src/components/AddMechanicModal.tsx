import { useState } from "react";
import { mechanicService, type AddMechanicPayload } from "@/services/api";

export default function AddMechanicModal({ onClose, onSuccess }: any) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceType, setServiceType] = useState("General");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    // ✅ CORRECT PAYLOAD (GeoJSON)
    const newMechanic: AddMechanicPayload = {
      name,
      phone,
      serviceType,
      location: {
        type: "Point",
        coordinates: [72.87, 19.07], // [lng, lat]
      },
    };

    try {
      await mechanicService.addMechanic(newMechanic);

      onSuccess(); // refresh list
      onClose();   // close modal

    } catch (err) {
      console.error(err);
      alert("Error adding mechanic");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="fixed inset-0 z-[100000] bg-black/50 backdrop-blur-sm grid place-items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-[300px]"
      >
        <h2 className="text-lg font-bold mb-4">Add Mechanic</h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-2 p-2 border"
          required
        />

        <input
          placeholder="Phone (91xxxxxxxxxx)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-2 p-2 border"
          required
        />

        <input
          placeholder="Service Type"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          className="w-full mb-3 p-2 border"
        />

        <button
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {loading ? "Adding..." : "Add Mechanic"}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-2 text-sm"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}