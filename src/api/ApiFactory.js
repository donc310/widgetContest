import StatesApi from "./StatesApi";
import LevelsAPi from "./LevelsApi";

const endpoints = {
states: StatesApi,
levels:LevelsAPi
};
export const ApiFactory = {
get: name => endpoints[name]
};