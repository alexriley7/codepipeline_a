import { Stage, StageProps } from "aws-cdk-lib";
import { DockerEcrStack } from "./docker-ecr-stack";
import { Construct } from "constructs";
import { Repository } from "aws-cdk-lib/aws-ecr";

export class DockerEcrStage extends Stage {

  public readonly repo: Repository;

  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack = new DockerEcrStack(this, "DockerEcrStack", props);
    
    this.repo = stack.repo;
  }
}
