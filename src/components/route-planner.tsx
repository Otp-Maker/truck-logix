"use client";

import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { optimizeRouteAction } from "@/lib/actions";
import { RouteSchema } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MapPlaceholder from "./map-placeholder";
import { Clock, Fuel, Bed, MapPin, Route, Gauge, Loader2 } from "lucide-react";
import type { OptimizeRouteOutput } from "@/ai/flows/route-optimization";

const initialState: {
  data: OptimizeRouteOutput | null;
  error: string | null;
} = {
  data: null,
  error: null,
};

function RouteResults({ data }: { data: OptimizeRouteOutput }) {
  return (
    <div className="grid gap-6 mt-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Route className="w-5 h-5 text-primary"/> Route Summary</CardTitle>
          <CardDescription>Estimated trip details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4" /> Est. Travel Time</span>
            <span className="font-semibold">{data.estimatedTravelTime}</span>
          </div>
           <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground"><Gauge className="w-4 h-4" /> Est. Fuel Consumption</span>
            <span className="font-semibold">{data.estimatedFuelConsumption}</span>
          </div>
          <p className="p-3 text-sm rounded-md bg-muted">{data.optimizedRoute}</p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Fuel className="w-5 h-5 text-accent" /> Fuel Stops</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.fuelStops.map((stop, index) => (
                <li key={index} className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" /> {stop}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bed className="w-5 h-5 text-accent" /> Rest Stops</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.restBreakStops.map((stop, index) => (
                <li key={index} className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" /> {stop}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

       <div className="md:col-span-2">
         <MapPlaceholder />
       </div>
    </div>
  )
}

export default function RoutePlanner() {
  const { toast } = useToast();
  const [state, formAction] = useFormState(optimizeRouteAction, initialState);

  const form = useForm<z.infer<typeof RouteSchema>>({
    resolver: zodResolver(RouteSchema),
    defaultValues: {
      currentLocation: "",
      pickupLocation: "",
      dropoffLocation: "",
      currentCycleHoursUsed: 0,
    },
  });

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      });
    }
  }, [state.error, toast]);

  return (
    <div>
      <Form {...form}>
        <form
          action={formAction}
          className="space-y-8"
          onSubmit={form.handleSubmit(() => formAction(new FormData(form.control.formRef.current!)))}
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FormField
              control={form.control}
              name="currentLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Dallas, TX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pickupLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pickup Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Chicago, IL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dropoffLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dropoff Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Los Angeles, CA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentCycleHoursUsed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cycle Hours Used</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={event => field.onChange(+event.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={form.formState.isSubmitting}>
             {form.formState.isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Optimize Route
          </Button>
        </form>
      </Form>

      {state.data && <RouteResults data={state.data} />}
    </div>
  );
}
