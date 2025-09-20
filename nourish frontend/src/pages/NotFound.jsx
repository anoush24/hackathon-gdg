import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ChefHat } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <ChefHat className="w-24 h-24 text-primary mx-auto mb-6" />
        <h1 className="heading-hero text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Recipe Not Found</h2>
        <p className="text-warm mb-8">
          Looks like this page got lost in the kitchen! Let's get you back to your culinary journey.
        </p>
        <Button 
          asChild
          className="bg-gradient-primary text-primary-foreground border-0 shadow-warm hover:shadow-glow"
        >
          <a href="/">
            <Home className="w-4 h-4 mr-2" />
            Back to Kitchen
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;