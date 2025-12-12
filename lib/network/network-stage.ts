import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from './network-stack';

export class NetworkStage extends cdk.Stage {
  public readonly vpcOutput;
  public readonly albOutput;
  public readonly listenerOutput;

  constructor(scope: cdk.App, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    // Pass 'scope' as the first argument, not 'this'
    const net = new NetworkStack(scope, "NetworkStack", props);

    this.vpcOutput = net.vpcOutput;
    this.albOutput = net.albOutput;
    this.listenerOutput = net.listenerOutput;
  }
}
