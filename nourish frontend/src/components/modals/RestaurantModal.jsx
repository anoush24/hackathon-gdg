import React from 'react';
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ExternalLink, Star, Clock, Award } from 'lucide-react';
import RestaurantMap from '../RestaurantMap';

const RestaurantModal = ({ restaurants, userLocation, onClose }) => {
  
  console.log('🍽️ Modal Debug:', {
    restaurantCount: restaurants.length,
    userLocation,
    firstRestaurant: restaurants[0]
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-4">
          <div>
            <h2 className="text-2xl font-bold">Restaurants Near You</h2>
            <p className="text-sm text-gray-500">
              {restaurants.length > 0 
                ? `Top ${restaurants.length} matches based on your preferences`
                : 'Loading restaurants...'}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800 text-3xl font-light leading-none"
          >
            &times;
          </button>
        </div>

        {/* Map Display */}
        {userLocation && restaurants.length > 0 && (
          <div className="mb-6">
            <RestaurantMap restaurants={restaurants} userLocation={userLocation} />
          </div>
        )}
        
        {/* Restaurant List */}
        {restaurants.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold">No Restaurants Found</h3>
            <p className="text-gray-500">We couldn't find any restaurants nearby.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {restaurants.map((r, index) => {
              const isTopThree = index < 3;
              
              return (
                <div 
                  key={r.id || index} 
                  className={`p-4 border-2 rounded-lg transition-all ${
                    isTopThree 
                      ? 'border-orange-400 bg-orange-50/30 shadow-md' 
                      : 'border-gray-200 hover:border-orange-200'
                  }`}
                >
                  {/* Top 3 Badge */}
                  {isTopThree && (
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default" className="bg-orange-500 text-white">
                        <Award className="w-3 h-3 mr-1" />
                        Top {index + 1} Match
                      </Badge>
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{r.name}</h3>
                      <p className="text-sm text-gray-600">{r.address || r.area}</p>
                    </div>
                    {r.rating > 0 && (
                      <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded font-bold text-sm ml-2">
                        <Star className="w-3 h-3 fill-current" />
                        {r.rating}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 my-3">
                    {r.cuisines?.map((cuisine, idx) => (
                      <Badge key={`${cuisine}-${idx}`} variant="secondary" className="text-xs">
                        {cuisine}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    {r.cost_for_two && <span className="font-medium">💰 {r.cost_for_two}</span>}
                    {r.delivery_time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {r.delivery_time}
                      </span>
                    )}
                  </div>

                  {/* Order Buttons - Show for top 3 */}
                  {isTopThree ? (
                    <div className="flex gap-2">
                      <a
                        href={r.swiggy_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-center font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Order on Swiggy
                      </a>
                      
                      <a
                        href={r.zomato_search_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2.5 border-2 border-red-500 text-red-600 hover:bg-red-50 rounded-lg text-center font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Search Zomato
                      </a>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <a
                        href={r.swiggy_search_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-center text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Search Swiggy
                      </a>
                      <a
                        href={r.zomato_search_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-center text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Search Zomato
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Info */}
        {restaurants.length > 0 && (
          <div className="mt-6 pt-4 border-t text-center text-sm text-gray-500">
            <p>🎯 Results ranked by your cuisine preferences and ratings</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default RestaurantModal;
