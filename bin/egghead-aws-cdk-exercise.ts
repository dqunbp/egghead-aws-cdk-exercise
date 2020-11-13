#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { EggheadAwsCdkExerciseStack } from '../lib/egghead-aws-cdk-exercise-stack';

const app = new cdk.App();
new EggheadAwsCdkExerciseStack(app, 'EggheadAwsCdkExerciseStack');
