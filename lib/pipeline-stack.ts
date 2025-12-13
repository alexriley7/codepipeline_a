import * as cdk from "aws-cdk-lib";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";

import { DockerEcrStage } from "./docker-ecr/docker-ecr-stage";

import { SecretValue } from "aws-cdk-lib";


import { Construct } from "constructs";

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, "Pipeline", {
      pipelineName: "FullInfraPipeline",
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub("user/repo", "main", {
          authentication: SecretValue.secretsManager("github-token3"),
        }),
        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
    });

    pipeline.addStage(new DockerEcrStage(this, "DockerEcrStage"));

  }
}

