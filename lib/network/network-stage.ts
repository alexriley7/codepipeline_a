import { Stage, StageProps } from "aws-cdk-lib";
import { NetworkStack } from "./network-stack";

export class NetworkStage extends Stage {
  public readonly vpcOutput;
  public readonly albOutput;
  public readonly listenerOutput;

  constructor(scope: any, id: string, props?: StageProps) {
    super(scope, id, props);

    const net = new NetworkStack(this, "NetworkStack", props);

    this.vpcOutput = net.vpcOutput;
    this.albOutput = net.albOutput;
    this.listenerOutput = net.listenerOutput;
  }
}
