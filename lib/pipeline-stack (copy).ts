import * as cdk from "aws-cdk-lib";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";

import { DockerEcrStage } from "./docker-ecr/docker-ecr-stage";

import { AppDeployStage } from "./app-deploy/app-deploy-stage";

import { SecretValue } from "aws-cdk-lib";


import { Construct } from "constructs";

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, "Pipeline", {
      pipelineName: "FullInfraPipeline",
      synth: new ShellStep("Synth", {

        input: CodePipelineSource.connection("alexriley7/codepipeline_a", "main",
          
          {

          //authentication: SecretValue.secretsManager("github-token3"),
          connectionArn:
              "arn:aws:codeconnections:us-east-1:456582263462:connection/f057400e-c5b1-4801-ac26-ddcfdd5f4a30",

        }),

        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
    });


    // working code didnt have dockerEcrStage as a variable here

    const dockerEcrStage = new DockerEcrStage(this, "DockerEcrStage");

    pipeline.addStage(dockerEcrStage);
    
    pipeline.addStage(
      new AppDeployStage(this, "AppDeployStage", {
        imageUri: dockerEcrStage.imageUri,
        env: {
          account: this.account,
          region: this.region,
        },
      })
    );

    console.log("Account:", this.account);
    console.log("Region:", this.region);
  }
}



