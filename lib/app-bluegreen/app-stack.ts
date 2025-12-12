import * as cdk from "aws-cdk-lib";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import * as deploy from "aws-cdk-lib/aws-codedeploy";

interface AppStackProps extends cdk.StackProps {
  vpcId: string;
  albArn: string;
  listenerArn: string;
}

export class AppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: AppStackProps) {
    super(scope, id, props);

    // Import VPC from NetworkStack stage
    const vpc = ec2.Vpc.fromLookup(this, "ImportedVpc", {
      vpcId: props.vpcId,
    });

    // Create an ECS Cluster
    const cluster = new ecs.Cluster(this, "Cluster", { vpc });

    // Fargate service behind imported ALB
    const service = new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      "Service",
      {
        cluster,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry(
            "456582263462.dkr.ecr.us-east-1.amazonaws.com/app-repo:latest" // <<< MUST REPLACE
          ),
          containerPort: 5000,
        },
        desiredCount: 1,
        publicLoadBalancer: false, // we use imported ALB
      }
    );

    // BLUE/GREEN DEPLOYMENT ENABLED
    new deploy.EcsDeploymentGroup(this, "BlueGreen", {
      service: service.service,
      blueGreenDeploymentConfig: {
        terminationWaitTimeInMinutes: 5,
      },
    });
  }
}
