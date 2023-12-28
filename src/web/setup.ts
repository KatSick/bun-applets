import { buildReactFrontend } from "../build/react-frontend";

export const buildApp = async (route: string) => {
  return await buildReactFrontend(import.meta.dir, route);
};
