import * as cdk from "aws-cdk-lib";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as ecrAssets from "aws-cdk-lib/aws-ecr-assets";
import { Construct } from "constructs";

export class DockerEcrStack extends cdk.Stack {
  public readonly repo: ecr.Repository;
  public readonly imageUri: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Explicit ECR repo (optional, but you asked for ECR)
    this.repo = new ecr.Repository(this, "AppRepository", {
      repositoryName: "app-repo-1",
    });

    // Docker image asset (THIS triggers build + push)
    const image = new ecrAssets.DockerImageAsset(this, "AppImage", {
      directory: "../docker", // must contain Dockerfile
    });

    this.imageUri = image.imageUri;
  }
}
