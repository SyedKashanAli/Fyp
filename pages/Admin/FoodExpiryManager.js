import useExpiryCron from '../../hooks/useExpiryCron';

export default function FoodExpiryManager() {
  useExpiryCron(); // Auto-runs expiry checks

  const handleManualCleanup = async () => {
    try {
      const res = await fetch('/api/food/cleanup', { method: 'POST' });
      const data = await res.json();
      alert(`Deleted ${data.deletedCount} expired items`);
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  };

  return (
    <div className="p-4">
      <h2>Food Expiry Management</h2>
      <button 
        onClick={handleManualCleanup}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Clean Expired Items Now
      </button>
    </div>
  );
}