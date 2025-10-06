// Create a new file: RestaurantModal.jsx

import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RestaurantModal = ({ restaurants, onClose }) => {
  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg p-6">
          <h2 className="text-xl font-bold mb-4">No Restaurants Found</h2>
          <p className="text-gray-600 mb-4">We couldn't find any restaurants matching your criteria nearby.</p>
          <button onClick={onClose} className="w-full bg-gray-200 text-gray-800 py-2 rounded">Close</button>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Nearby Restaurants</h2>
          <button onClick={onClose} className="text-2xl font-light">&times;</button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto space-y-3">
          {restaurants.map(r => (
            <div key={r.id} className="p-3 border rounded-md">
              <h3 className="font-semibold">{r.name}</h3>
              <p className="text-sm text-gray-500">{r.address}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {r.types?.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default RestaurantModal;