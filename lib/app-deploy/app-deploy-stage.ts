import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { AppDeployStack_2 } from "./app-deploy-stack";

//interface AppDeployStageProps extends StageProps {
//  imageUri: string;
//}

export class AppDeployStage_2 extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new AppDeployStack_2(this, "AppDeployStack_2", {
      //imageUri: props.imageUri,
      env: props?.env,
    });
  }
}
