#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { PipelineStack } from "../lib/pipeline-stack";

const app = new cdk.App();

// This stack creates the CI/CD pipeline.
// Replace ACCOUNT and REGION with your AWS account.
new PipelineStack(app, "PipelineStack", {
  env: {
    account: "456582263462",  // <<< REPLACE
    region: "us-east-1",       // <<< REPLACE
  },
});
