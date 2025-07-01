
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";
import Link from "next/link";

export default function MarksPage() {
    return (
        <AppLayout>
            <div className="flex items-center justify-center py-10">
                <Card className="w-full max-w-lg text-center bg-black/40 border-accent shadow-lg">
                    <CardHeader>
                        <div className="mx-auto bg-primary/20 text-primary rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Construction className="w-8 h-8"/>
                        </div>
                        <CardTitle className="text-3xl font-bold text-primary-foreground">Under Construction</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-8">
                            This feature is being forged by our master smiths. Check back later for updates!
                        </p>
                        <Link href="/" passHref>
                            <Button variant="secondary">
                                <i className="fas fa-arrow-left mr-2"></i> Back to Dashboard
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
