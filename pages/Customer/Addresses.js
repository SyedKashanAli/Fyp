import axios from "axios";

export const fetchAddresses = async (userId) => {
  try {
    const res = await axios.get(`/api/Customer/checkout?userId=${userId}`);
    return res.data.addresses;
  } catch (error) {
    console.error("Failed to fetch addresses", error);
    throw error;
  }
};

export const addNewAddress = async (userId, newAddress) => {
    if (!userId || !newAddress.addressLine || !newAddress.area|| !newAddress.city) {
        console.error("Invalid input: Missing required fields");
        throw new Error("Invalid input: Missing required fields");
      }
      
  try {
    const res = await axios.post("/api/Customer/address", {
      userId,
      newAddress,
    });
    return res.data.newAddress;
  } catch (error) {
    console.error("Failed to add new address", error);
    throw error;
  }
};

export const setDefaultAddress = async (userId, addressId) => {
  try {
    await axios.patch("/api/Customer/address", { userId, addressId });
  } catch (error) {
    console.error("Failed to set default address", error);
    throw error;
  }
};

// Add this at the end of the file to satisfy Next.js page requirements
export default function AddressesPage() {
  return null;
}
