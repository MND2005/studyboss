"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wand2 } from "lucide-react";

import { generatePracticeQuestions } from "@/ai/flows/generate-practice-questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  notes: z.string().min(50, { message: "Please enter at least 50 characters of notes." }),
});

export function PracticeClient() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setQuestions([]);
    try {
      const result = await generatePracticeQuestions({ notes: values.notes });
      if (result.questions && result.questions.length > 0) {
        setQuestions(result.questions);
      } else {
        toast({
            variant: "destructive",
            title: "No Questions Generated",
            description: "The AI could not generate questions from the provided notes. Please try again with more detailed notes.",
        });
      }
    } catch (error) {
      console.error("Failed to generate questions:", error);
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Failed to generate practice questions. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">AI Practice Questions</h1>
        <p className="text-muted-foreground">
          Paste your study notes below, and our AI will generate tailored practice questions to help you prepare.
        </p>
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Your Study Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., The mitochondria is the powerhouse of the cell. It generates most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy..."
                          className="min-h-[300px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  <Wand2 className="mr-2 h-4 w-4" />
                  {isLoading ? "Generating..." : "Generate Questions"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Generated Questions</h2>
        <Card className="min-h-[500px]">
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-4/5" />
              </div>
            ) : questions.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {questions.map((q, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>Question {index + 1}</AccordionTrigger>
                    <AccordionContent className="text-base">
                      {q}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                    <Wand2 className="w-16 h-16 mb-4" />
                    <p className="font-medium">Your practice questions will appear here.</p>
                    <p className="text-sm">Enter your notes to get started.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
