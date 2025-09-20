import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, AlertTriangle, CheckCircle } from "lucide-react";

const AllergyBanner = ({ status, allergens = ['gluten'] }) => {
  if (status === 'checking') {
    return (
      <Alert className="border-accent/30 bg-accent/5">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-accent" />
          <div className="flex-1">
            <AlertDescription className="text-foreground font-medium">
              <span className="flex items-center gap-2">
                Nourish AI is checking your choices for allergies...
                <Badge className="bg-gradient-primary text-primary-foreground border-0 text-xs animate-pulse">
                  AI Working
                </Badge>
              </span>
            </AlertDescription>
          </div>
        </div>
      </Alert>
    );
  }

  if (status === 'clear') {
    return (
      <Alert className="border-primary/30 bg-primary/5">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <AlertDescription className="text-foreground font-medium">
              <span className="flex items-center gap-2">
                All Clear! Your meal plan is safe for your dietary restrictions.
                <Badge className="bg-primary text-primary-foreground border-0 text-xs">
                  ✅ Verified
                </Badge>
              </span>
            </AlertDescription>
          </div>
        </div>
      </Alert>
    );
  }

  if (status === 'warning') {
    return (
      <Alert className="border-destructive/30 bg-destructive/5">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <div className="flex-1">
            <AlertDescription className="text-foreground">
              <div className="space-y-2">
                <div className="font-medium">
                  ⚠ Allergy Warning Detected
                </div>
                <div className="text-sm text-muted-foreground">
                  Your meal plan contains: {allergens.map((allergen) => (
                    <Badge 
                      key={allergen}
                      variant="destructive" 
                      className="ml-1 text-xs bg-destructive text-destructive-foreground"
                    >
                      {allergen}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm">
                  Consider swapping affected meals for safer alternatives.
                </div>
              </div>
            </AlertDescription>
          </div>
          <Shield className="h-5 w-5 text-destructive" />
        </div>
      </Alert>
    );
  }

  return null;
};

export default AllergyBanner;