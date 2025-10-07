import React from 'react';
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import RestaurantMap from '../RestaurantMap';

const RestaurantModal = ({ restaurants, userLocation, onClose }) => {
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Dine Out Suggestions</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl font-light">&times;</button>
        </div>

        {/* Map Display */}
        <div className="mb-4">
          <RestaurantMap restaurants={restaurants} userLocation={userLocation} />
        </div>
        
        {/* Restaurant List */}
        {restaurants.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold">No Restaurants Found</h3>
            <p className="text-gray-500">We couldn't find any restaurants matching your preferences nearby.</p>
          </div>
        ) : (
          <div className="max-h-[40vh] overflow-y-auto space-y-3 pr-2">
            {restaurants.map(r => (
              <div key={r.id} className="p-3 border rounded-md transition-colors hover:bg-gray-50">
                <h3 className="font-semibold">{r.name}</h3>
                <p className="text-sm text-gray-500">{r.address}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {r.types?.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default RestaurantModal;