import { ServerRoute } from '@hapi/hapi';
import userRoutes from './user.routes';

const routes: ServerRoute[] = [...userRoutes];

export default routes;
