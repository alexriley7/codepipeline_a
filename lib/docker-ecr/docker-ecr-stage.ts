import { Stage, StageProps } from "aws-cdk-lib";
import { DockerEcrStack } from "./docker-ecr-stack";

export class DockerEcrStage extends Stage {
  public readonly repo;

  constructor(scope: any, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack = new DockerEcrStack(this, "DockerEcrStack", props);
    this.repo = stack.repo;
  }
}
