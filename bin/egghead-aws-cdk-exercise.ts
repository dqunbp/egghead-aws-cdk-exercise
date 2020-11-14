#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { EggheadAwsCdkExerciseStack } from "../lib/egghead-aws-cdk-exercise-stack";

const envEU = { account: "005050921881", region: "eu-central-1" };

const app = new cdk.App();
new EggheadAwsCdkExerciseStack(app, "EggheadAwsCdkExerciseStack", {
  env: envEU,
});
