import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

// ECS + ALB
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsp from 'aws-cdk-lib/aws-ecs-patterns';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

// ECR
import * as ecr from 'aws-cdk-lib/aws-ecr';

// IAM
import * as iam from 'aws-cdk-lib/aws-iam';

export interface AppStackProps extends cdk.StackProps {
  vpc: ecsp.ApplicationLoadBalancedFargateServiceProps['vpc'];
  listener: elbv2.ApplicationListener;
  ecrRepositoryArn: string; // passed from DockerEcrStack
}

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    //
    // 🔶 1. Retrieve ECR Repo
    //
    const repo = ecr.Repository.fromRepositoryArn(
      this,
      "AppRepository",
      props.ecrRepositoryArn
    );

    //
    // 🔶 2. ECS Cluster
    //
    const cluster = new ecs.Cluster(this, "AppCluster", {
      vpc: props.vpc,
    });

    //
    // 🔶 3. Fargate Service using the latest ECR image
    //
    const service = new ecs.FargateService(this, "AppService", {
      cluster,
      taskDefinition: new ecs.FargateTaskDefinition(this, "TaskDef", {
        cpu: 256,
        memoryLimitMiB: 512,
      }),
      desiredCount: 1,
      assignPublicIp: true, // because we deploy in a public subnet
    });

    service.taskDefinition.addContainer("AppContainer", {
      image: ecs.ContainerImage.fromEcrRepository(repo, "latest"),
      cpu: 256,
      portMappings: [{ containerPort: 8080 }],
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: "app" }),
    });

    //
    // 🔶 4. Connect Fargate Service to listener (Rolling OR Blue/Green)
    //
    props.listener.addTargets("AppTarget", {
      port: 80,
      targets: [service],
      healthCheck: {
        path: "/",
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 2,
      },
    });

    //
    // 🔶 5. Optional: Blue/Green or CodeDeploy can be added here
    //
    // (Left simple so you can integrate CodeDeploy later)
    //

    //
    // Outputs
    //
    new cdk.CfnOutput(this, "ServiceName", {
      value: service.serviceName,
    });
  }
}
