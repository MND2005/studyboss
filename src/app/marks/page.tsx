
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MarksPage() {
    return (
        <AppLayout>
            <div className="flex items-center justify-center py-10">
                <Card className="w-full max-w-lg text-center bg-card/80 backdrop-blur-sm border shadow-lg">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Construction className="w-8 h-8"/>
                        </div>
                        <CardTitle className="text-3xl font-bold">Under Construction</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-8">
                            This feature is being forged by our master smiths. Check back later for updates!
                        </p>
                        <Link href="/" passHref>
                            <Button variant="secondary">
                                <ArrowLeft className="mr-2 h-4 w-4"/> Back to Dashboard
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
