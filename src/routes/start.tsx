import { Button } from '@/components/ui/button';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/start')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center">
                <Link to='/'>
                    <Button className="cursor-pointer text-3xl mx-auto p-8 hover:bg-zinc-800 bg-black/80 border-2 border-white">
                        START
                    </Button>
                </Link>
            </div>
        </>
    );
}
