import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { DockerEcrStack } from "./docker-ecr-stack";

export class DockerEcrStage extends Stage {

  // public readonly imageUri: string;

  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    //const stack = new DockerEcrStack(this, "DockerEcrStack", props);

    //this.imageUri = stack.imageUri;

    new DockerEcrStack(this, "DockerEcrStack", {
        env: props?.env,
  });
    }
}
