import { Stage, StageProps } from "aws-cdk-lib";
import { AppStack } from "./app-stack";

export class AppStage extends Stage {
  constructor(scope: any, id: string, props: any) {
    super(scope, id, props);

    new AppStack(this, "AppStack", props);
  }
}
