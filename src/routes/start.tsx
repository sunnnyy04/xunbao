import { Button } from '@/components/ui/button';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/start')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <>
        </>
    );
}
