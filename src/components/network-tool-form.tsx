"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

// Define schema
const formSchema = z.object({
  ip: z.string({ message: "Please enter a valid IP address" }),
});

interface ReportFormProps {
  onScan: (ip: string) => void; // Callback function
  isLoading: boolean;
}

export function NetworkReportForm({ onScan, isLoading }: ReportFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { ip: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onScan(values.ip);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 w-full">
        <FormField
          control={form.control}
          name="ip"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input placeholder="IP address" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Scanning..." : "Scan"}
        </Button>
      </form>
    </Form>
  );
}