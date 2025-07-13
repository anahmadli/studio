
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
import { MapPin, Loader2, FileText, ShieldCheck, ArrowRight, User, Calendar, KeyRound } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { initiateBackgroundCheck } from '@/ai/flows/initiate-background-check';
import type { BackgroundCheckInput } from '@/lib/types';


const amenitiesList = [
  { id: 'wudu', label: 'Wudu Area (Ablution)' },
  { id: 'sisters', label: 'Separate Area for Sisters' },
  { id: 'parking', label: 'Parking Available' },
  { id: 'wheelchair', label: 'Wheelchair Accessible' },
];

const formSchema = z.object({
  // Masjid Details
  name: z.string().min(3, 'Space name must be at least 3 characters.'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1.'),
  availableHours: z.string().min(3, 'Please specify available hours.'),
  street: z.string().min(3, 'Please enter a street address.'),
  city: z.string().min(2, 'Please enter a city.'),
  state: z.string().min(2, 'Please enter a state.'),
  zip: z.string().min(5, 'Please enter a valid zip code.'),
  amenities: z.array(z.string()).optional(),
  notes: z.string().optional(),
  
  // Consent
  consent: z.boolean().refine(val => val === true, { message: "You must agree to the terms to proceed." }),

  // Background Check
  firstName: z.string().min(1, 'First name is required.'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required.'),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please use YYYY-MM-DD format."),
  ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, "Please use XXX-XX-XXXX format."),
});

type Tab = "details" | "consent" | "background";

export default function AddSpaceForm() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("details");
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{success: boolean, message: string} | null>(null);


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
      consent: false,
      firstName: '',
      middleName: '',
      lastName: '',
      dob: '',
      ssn: ''
    },
  });

  async function handleBackgroundCheck() {
    setIsChecking(true);
    setCheckResult(null);

    const backgroundCheckData: BackgroundCheckInput = {
      firstName: form.getValues('firstName'),
      middleName: form.getValues('middleName'),
      lastName: form.getValues('lastName'),
      dob: form.getValues('dob'),
      ssn: form.getValues('ssn'),
      address: form.getValues('street'),
      city: form.getValues('city'),
      state: form.getValues('state'),
      zip: form.getValues('zip'),
    }

    // Trigger validation for background check fields
    const isValid = await form.trigger(['firstName', 'lastName', 'dob', 'ssn', 'street', 'city', 'state', 'zip']);
    if (!isValid) {
        setIsChecking(false);
        toast({
            variant: "destructive",
            title: 'Validation Error',
            description: 'Please fill out all required background check fields correctly.',
        });
        return;
    }
    
    try {
      const result = await initiateBackgroundCheck(backgroundCheckData);
      setCheckResult(result);
      toast({
        title: result.success ? 'Check Initiated' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    } catch (error) {
      const result = { success: false, message: 'An unexpected client-side error occurred.' };
      setCheckResult(result);
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
    } finally {
      setIsChecking(false);
    }
  }


  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically send the data to your backend (e.g., Firestore)
    // You would also geocode the address to get lat/lng before saving.
    toast({
      title: 'Space Registered!',
      description: 'Your prayer space has been successfully added to the map.',
    });
    form.reset();
    setActiveTab("details");
    setCheckResult(null);
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Tab)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Masjid Details</TabsTrigger>
                <TabsTrigger value="consent">Consent Form</TabsTrigger>
                <TabsTrigger value="background">Background Check</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="p-6">
                <div className="space-y-8">
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
                        The address of the prayer space. This will also be used for the background check.
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
                </div>
                <div className="mt-8 flex justify-end">
                  <Button type="button" onClick={() => setActiveTab("consent")}>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="consent" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <FileText className="h-8 w-8 text-primary" />
                    <h3 className="text-xl font-semibold">Consent to Share Information</h3>
                  </div>
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <p>
                      By checking the box below, you acknowledge and agree to the following terms and conditions for listing your personal home as a prayer space on MyMasjid:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>You voluntarily consent to share the provided information (name of space, address, capacity, available hours, and amenities) publicly on the MyMasjid platform.</li>
                      <li>You understand that this information will be visible to other users of the application for the purpose of finding a prayer space.</li>
                      <li>You confirm that you have the authority to offer this space for prayer and are responsible for the safety and security of your property and any visitors.</li>
                      <li>MyMasjid is a platform for connecting individuals and is not responsible for any incidents, damages, or liabilities that may occur.</li>
                       <li>You consent to a background check as described in the next step.</li>
                    </ul>
                  </div>
                   <FormField
                      control={form.control}
                      name="consent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I have read, understood, and agree to the terms and conditions.
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                </div>
                 <div className="mt-8 flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
                     <ArrowRight className="mr-2 h-4 w-4 transform rotate-180" /> Previous
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("background")}>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="background" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                    <h3 className="text-xl font-semibold">Safety & Background Check</h3>
                  </div>
                   <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      For community safety, we require a background check. Please provide your legal information below. This is sent securely to our third-party verification service.
                    </p>
                     <p className="font-semibold text-destructive/80">Your address from the previous tab will be used for this check.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem className="md:col-span-1">
                              <FormLabel className="flex items-center gap-2"><User className="h-4 w-4"/>First Name</FormLabel>
                              <FormControl><Input placeholder="John" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="middleName"
                          render={({ field }) => (
                            <FormItem className="md:col-span-1">
                              <FormLabel>Middle Name</FormLabel>
                              <FormControl><Input placeholder="M." {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem className="md:col-span-1">
                              <FormLabel>Last Name</FormLabel>
                              <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2"><Calendar className="h-4 w-4"/>Date of Birth</FormLabel>
                            <FormControl><Input placeholder="YYYY-MM-DD" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="ssn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2"><KeyRound className="h-4 w-4"/>SSN</FormLabel>
                            <FormControl><Input placeholder="XXX-XX-XXXX" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>

                  <Button type="button" variant="outline" size="lg" className="w-full" onClick={handleBackgroundCheck} disabled={isChecking}>
                     {isChecking ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...</>
                    ) : "Initiate Background Check"}
                  </Button>
                   {checkResult && (
                      <div className={`text-center p-2 rounded-md text-sm ${checkResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {checkResult.message}
                      </div>
                  )}
                </div>
                <div className="p-6 border-t mt-6">
                  <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={form.formState.isSubmitting || !checkResult?.success}>
                    {form.formState.isSubmitting ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                    ) : "Register My Space"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
