import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Leaf, Flame, MapPin, Utensils, X } from "lucide-react";

const filterOptions = [
  {
    id: 'quick',
    label: 'Quick',
    icon: Clock,
    description: '≤15 min'
  },
  {
    id: 'vegetarian', 
    label: 'Vegetarian',
    icon: Leaf,
    description: 'Plant-based'
  },
  {
    id: 'spicy',
    label: 'Spicy',
    icon: Flame,
    description: 'Heat level'
  },
  {
    id: 'mediterranean',
    label: 'Mediterranean',
    icon: MapPin,
    description: 'Cuisine type'
  },
  {
    id: 'modern',
    label: 'Modern',
    icon: Utensils,
    description: 'Contemporary'
  }
];

const FilterBar = ({ activeFilters, onFiltersChange }) => {
  const toggleFilter = (filterId) => {
    if (activeFilters.includes(filterId)) {
      onFiltersChange(activeFilters.filter(f => f !== filterId));
    } else {
      onFiltersChange([...activeFilters, filterId]);
    }
  };

  const clearAllFilters = () => {
    onFiltersChange([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Filter Options</h3>
        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground gap-1 h-8 px-2"
          >
            <X className="h-3 w-3" />
            Clear All
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilters.includes(filter.id);
          
          return (
            <Button
              key={filter.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => toggleFilter(filter.id)}
              className={`gap-2 transition-smooth ${
                isActive 
                  ? 'bg-gradient-primary text-primary-foreground shadow-warm hover:shadow-glow border-0' 
                  : 'border-border hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{filter.label}</span>
              {isActive && (
                <Badge 
                  variant="secondary" 
                  className="ml-1 h-4 px-1 text-xs bg-primary-foreground/20 text-primary-foreground border-0"
                >
                  ✓
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
      
      {activeFilters.length > 0 && (
        <div className="text-xs text-muted-foreground">
          {activeFilters.length} filter{activeFilters.length !== 1 ? 's' : ''} applied
        </div>
      )}
    </div>
  );
};

export default FilterBar;