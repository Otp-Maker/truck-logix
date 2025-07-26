import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";

export default function MapPlaceholder() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="w-5 h-5" />
          Route Visualization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center w-full bg-muted rounded-lg aspect-video">
          <p className="text-muted-foreground">Interactive Map Placeholder</p>
        </div>
      </CardContent>
    </Card>
  );
}
