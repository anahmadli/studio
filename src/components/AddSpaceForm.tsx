"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from './ui/card';
import { MapPin, Loader2 } from 'lucide-react';

const amenitiesList = [
  { id: 'wudu', label: 'Wudu Area (Ablution)' },
  { id: 'sisters', label: 'Separate Area for Sisters' },
  { id: 'parking', label: 'Parking Available' },
  { id: 'wheelchair', label: 'Wheelchair Accessible' },
];

const formSchema = z.object({
  name: z.string().min(3, 'Space name must be at least 3 characters.'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1.'),
  availableHours: z.string().min(3, 'Please specify available hours.'),
  street: z.string().min(3, 'Please enter a street address.'),
  city: z.string().min(2, 'Please enter a city.'),
  state: z.string().min(2, 'Please enter a state.'),
  zip: z.string().min(5, 'Please enter a valid zip code.'),
  amenities: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export default function AddSpaceForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      capacity: 1,
      availableHours: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      amenities: [],
      notes: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically send the data to your backend (e.g., Firestore)
    // You would also geocode the address to get lat/lng before saving.
    toast({
      title: 'Space Registered!',
      description: 'Your prayer space has been successfully added to the map.',
    });
    form.reset();
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Space Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., The Khan Family's Prayer Room" {...field} />
                  </FormControl>
                  <FormDescription>A welcoming name for your space.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Hours</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Dhuhr & Asr or All Day" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormItem>
              <div className="mb-4">
                <FormLabel className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </FormLabel>
                <FormDescription>
                  The address of the prayer space.
                </FormDescription>
              </div>
              <div className="space-y-4">
                 <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Anytown" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="CA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </FormItem>

            <FormField
              control={form.control}
              name="amenities"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Amenities</FormLabel>
                    <FormDescription>Select all that apply.</FormDescription>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {amenitiesList.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="amenities"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Please enter from the side door, text before arriving."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
              ) : "Register My Space"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
