import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',
  '/api/webhooks/clerk',
  '/api/createProject',
  '/api/getProjectData',
  '/api/getUserProjects',
  '/api/syncData',
  '/api/getInnerDashboardData',
  '/api/generateScriptTag'
])

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};