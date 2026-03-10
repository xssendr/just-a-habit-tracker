import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("ai", "routes/ai-psychologist.tsx"),
] satisfies RouteConfig;
