import { SSTConfig } from "sst";

export default {
  config(_input) {
    return {
      name: "turbofy",
      region: "us-east-1",
    };
  },
  stacks(app) {
    // Stacks serão adicionados posteriormente
  },
} satisfies SSTConfig;
