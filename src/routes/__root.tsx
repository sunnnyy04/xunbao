import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
    component: () => (
        <>
            <video
                autoPlay
                muted
                loop
                className="fixed inset-0 w-full h-full object-cover z-0"
                aria-hidden="true"
            >
                <source
                    src="https://x2onawsk55.ufs.sh/f/eZ86CwF4BrGdEs7rm7tErLCMcJpyi5jgHfwA1bsV9kRKon7Q"
                    type="video/mp4"
                />
            </video>
            <img src="/background.png" className="fixed inset-0 w-full h-full object-cover z-[-1]"/>

            <div className="relative z-10 w-full h-full">
                <Outlet />
            </div>

            <TanStackRouterDevtools position="bottom-right" />
        </>
    ),
})
