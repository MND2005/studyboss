
'use client';
import Link from 'next/link';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { List } from 'lucide-react';

export function MarksCard() {
    return (
        <Card className="p-4 bg-black/40 border-accent shadow-lg h-full flex flex-col justify-between">
            <div>
                <h2 className="text-white">Marks Progress</h2>
                <p className="text-muted-foreground my-4">Track and analyze your exam and assignment scores over time.</p>
            </div>
            <Link href="/marks" passHref>
                <Button variant="secondary" className="w-full mt-4">
                    <List className="mr-2 h-4 w-4"/> View Full Mark Analysis
                </Button>
            </Link>
        </Card>
    );
}
