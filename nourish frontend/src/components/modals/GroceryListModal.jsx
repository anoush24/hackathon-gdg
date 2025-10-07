// src/components/GroceryListModal.jsx
import React, { useState } from 'react';
import { X, ShoppingCart, Check, Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const GroceryListModal = ({ groceryData, onClose }) => {
  const [checkedItems, setCheckedItems] = useState({});

  if (!groceryData) return null;

  const { groceryList, totalItems, day, meals } = groceryData;

  const toggleItem = (category, item) => {
    const key = `${category}-${item}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    let text = `Grocery List for ${day}\n`;
    text += `Meals: ${meals.breakfast}, ${meals.lunch}, ${meals.dinner}\n\n`;
    
    Object.entries(groceryList).forEach(([category, items]) => {
      text += `${category}:\n`;
      items.forEach(item => {
        text += `  - ${item}\n`;
      });
      text += '\n';
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grocery-list-${day.toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-start z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingCart className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900">
                Grocery List for {day}
              </h2>
            </div>
            <p className="text-sm text-gray-600">
              {meals.breakfast} • {meals.lunch} • {meals.dinner}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {checkedCount} / {totalItems} items checked
            </p>
          </div>
          <Button 
            onClick={onClose} 
            variant="ghost" 
            size="sm"
            className="rounded-full p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 border-b bg-gray-50 flex gap-2">
          <Button onClick={handlePrint} variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>

        {/* Grocery List */}
        <div className="p-6 space-y-6">
          {Object.entries(groceryList).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                {category}
                <span className="text-sm font-normal text-gray-500">
                  ({items.length} items)
                </span>
              </h3>
              <div className="space-y-2">
                {items.map((item, index) => {
                  const key = `${category}-${item}`;
                  const isChecked = checkedItems[key];
                  
                  return (
                    <div
                      key={index}
                      onClick={() => toggleItem(category, item)}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-gray-200 hover:border-primary hover:bg-gray-50'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                          isChecked
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span
                        className={`text-sm ${
                          isChecked
                            ? 'text-gray-500 line-through'
                            : 'text-gray-700'
                        }`}
                      >
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <span className="font-semibold">{totalItems}</span> total items
          </div>
          <Button onClick={onClose} variant="default">
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GroceryListModal;
