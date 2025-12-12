import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as elb from "aws-cdk-lib/aws-elasticloadbalancingv2";

export class NetworkStack extends cdk.Stack {
  public readonly vpcOutput: cdk.CfnOutput;
  public readonly albOutput: cdk.CfnOutput;
  public readonly listenerOutput: cdk.CfnOutput;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC with NAT Gateway
    const vpc = new ec2.Vpc(this, "Vpc", {
      maxAzs: 2,
      natGateways: 1,
    });

    // Public ALB
    const alb = new elb.ApplicationLoadBalancer(this, "ALB", {
      vpc,
      internetFacing: true,
    });

    const listener = alb.addListener("Listener", {
      port: 80,
      open: true,
    });

    // These outputs get passed to the next pipeline stage
    this.vpcOutput = new cdk.CfnOutput(this, "VpcId", {
      value: vpc.vpcId,
    });

    this.albOutput = new cdk.CfnOutput(this, "AlbArn", {
      value: alb.loadBalancerArn,
    });

    this.listenerOutput = new cdk.CfnOutput(this, "ListenerArn", {
      value: listener.listenerArn,
    });
  }
}
