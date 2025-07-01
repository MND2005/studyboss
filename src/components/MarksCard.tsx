
'use client';
import Link from 'next/link';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { List, ArrowRight } from 'lucide-react';

export function MarksCard() {
    return (
        <Card className="p-6 bg-card/80 backdrop-blur-sm h-full flex flex-col justify-between">
            <div>
                <h2 className="text-xl font-semibold">Marks Progress</h2>
                <p className="text-muted-foreground my-4">Track and analyze your exam and assignment scores over time.</p>
            </div>
            <Link href="/marks" passHref>
                <Button variant="secondary" className="w-full mt-4 justify-between group">
                    View Full Mark Analysis
                    <ArrowRight className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform"/> 
                </Button>
            </Link>
        </Card>
    );
}
