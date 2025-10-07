import React from 'react';
import { Loader2 } from "lucide-react";

const LoadingState = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingState;