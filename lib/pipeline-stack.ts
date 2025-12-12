import * as cdk from "aws-cdk-lib";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";

import { DockerEcrStage } from "./docker-ecr/docker-ecr-stage";
import { NetworkStage } from "./network/network-stage";
import { AppStage } from "./app-bluegreen/app-stage";

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, "Pipeline", {
      pipelineName: "FullInfraPipeline",
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub("user/repo", "main"),
        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
    });

    pipeline.addStage(new DockerStage(this, "DockerStage"));
    pipeline.addStage(new NetworkStage(this, "NetworkStage"));
    pipeline.addStage(new AppStage(this, "AppStage"));
  }
}

