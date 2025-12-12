import * as cdk from "aws-cdk-lib";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import { Construct } from "constructs";

export class DockerEcrStack extends cdk.Stack {
  public readonly repo: ecr.Repository;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an ECR repo to store Docker images
    this.repo = new ecr.Repository(this, "AppRepository", {
      repositoryName: "app-repo",  // <<< CHANGE IF YOU WANT
    });

    // CodeBuild project that Docker-builds and pushes the image
    new codebuild.Project(this, "DockerBuild", {
      environment: { privileged: true }, // allows Docker builds
      buildSpec: codebuild.BuildSpec.fromObject({
        version: "0.2",
        phases: {
          build: {
            commands: [
              "cd docker",
              // Login to ECR
              `aws ecr get-login-password --region $AWS_DEFAULT_REGION | \
               docker login --username AWS --password-stdin ${this.repo.repositoryUri}`,
              // Build image
              `docker build -t ${this.repo.repositoryUri}:latest .`,
              // Push to ECR
              `docker push ${this.repo.repositoryUri}:latest`,
            ],
          },
        },
      }),
    });
  }
}
