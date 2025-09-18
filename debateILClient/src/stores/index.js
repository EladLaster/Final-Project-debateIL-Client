// Export all stores and API functions from a single entry point
export { authStore, login, register, getUserById } from "./authStore";
export {
  usersStore,
  getDebates,
  getDebate,
  getArgumentsForDebate,
  getDebateStats,
  createDebate,
  registerForDebate,
} from "./usersStore";
