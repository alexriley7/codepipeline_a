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
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ------------------------------
    // CDK PIPELINE (self-mutating)
    // ------------------------------
    const pipeline = new CodePipeline(this, "Pipeline", {
      pipelineName: "FullInfraPipeline",

      // Synth = install deps + compile + synth CF templates
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub(
          "alexriley7/codepipeline_a", // <<< REPLACE
          "main"
        ),
        commands: [
          "npm ci",
          "npm run build",
          "npx cdk synth",
        ],
      }),
    });

    // ------------------------------
    // 1️⃣ Docker Build & Push stage
    // ------------------------------
    const dockerStage = new DockerEcrStage(this, "DockerStage", {
      env: props?.env,
    });
    pipeline.addStage(dockerStage);

    // ------------------------------
    // 2️⃣ Network Stage (VPC + ALB)
    // ------------------------------
    const networkStage = new NetworkStage(this, "NetworkStage", {
      env: props?.env,
    });
    pipeline.addStage(networkStage);

    // ------------------------------
    // 3️⃣ ECS Blue/Green Deployment
    // ------------------------------
    const appStage = new AppStage(this, "AppStage", {
      env: props?.env,

      // Pass CloudFormation outputs from network stack
      vpcId: networkStage.vpcOutput,
      albArn: networkStage.albOutput,
      listenerArn: networkStage.listenerOutput,
    });

    pipeline.addStage(appStage);
  }
}
