import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { AppDeployStack } from "./app-deploy-stack";

interface AppDeployStageProps extends StageProps {
  imageUri: string;
}

export class AppDeployStage extends Stage {
  constructor(scope: Construct, id: string, props: AppDeployStageProps) {
    super(scope, id, props);

    new AppDeployStack(this, "AppDeployStack", {
      imageUri: props.imageUri,
      env: props.env,
    });
  }
}
