import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CodePipeline, CodePipelineSource, ShellStep } from "aws-cdk-lib/pipelines";

import { DockerEcrStage } from "./stages/docker-ecr-stage";
import { NetworkStage } from "./network/network-stage";
import { AppStage } from "./app-bluegreen/app-stage";

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // ---------------------------
    // MAIN PIPELINE
    // ---------------------------
    const pipeline = new CodePipeline(this, "CdkPipeline", {
      pipelineName: "MyAppPipeline",
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub("YOUR_GITHUB_USER/YOUR_REPO", "main"),
        commands: [
          "npm install -g aws-cdk",
          "npm install",
          "npm run build",
          "npx cdk synth"
        ],
      }),
    });

    // ---------------------------
    // 1️⃣ DOCKER → ECR BUILD STAGE
    // ---------------------------
    const dockerStage = new DockerEcrStage(this, "DockerEcrStage");
    pipeline.addStage(dockerStage);

    // ---------------------------
    // 2️⃣ NETWORK STAGE
    // ---------------------------
    const networkStage = new NetworkStage(this, "NetworkStage");
    pipeline.addStage(networkStage);

    // ---------------------------
    // 3️⃣ APPLICATION (ECS BLUE/GREEN)
    // ---------------------------
    const appStage = new AppStage(this, "AppStage", {
      vpc: networkStage.vpc,
      cluster: networkStage.cluster,
    });

    pipeline.addStage(appStage);
  }
}
