
'use client';

import { Card } from './ui/card';
import { Button } from './ui/button';
import Link from 'next/link';
import { Settings, FlaskConical, Calculator, Terminal } from 'lucide-react';

const links = [
    { name: 'Physics - Majen Jecob', url: 'https://mjphysics.lk/dashboard', icon: <Settings/> },
    { name: 'Chemistry - Ujith Hemachandra', url: 'https://apluseducation.lk/profile', icon: <FlaskConical/> },
    { name: 'Combined Maths - Mandapa Pandithage', url: 'https://www.mandapapandithage.lk/dashboard', icon: <Calculator/> },
    { name: 'All Subjects - AI', url: 'https://gemini.google.com/', icon: <Terminal/> },
];

export function ExternalLinksCard() {
    return (
        <Card className="p-4 bg-black/40 border-accent shadow-lg h-full">
            <h2>External Study Sites</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {links.map(link => (
                    <Link key={link.name} href={link.url} target="_blank" passHref>
                        <Button variant="secondary" className="w-full justify-start text-base py-6">
                            <span className="mr-3 w-5 text-center">{link.icon}</span> {link.name}
                        </Button>
                    </Link>
                ))}
            </div>
        </Card>
    );
}
