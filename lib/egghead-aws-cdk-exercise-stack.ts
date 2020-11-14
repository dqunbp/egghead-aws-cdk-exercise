import * as cdk from "@aws-cdk/core";
import * as apiGateway from "@aws-cdk/aws-apigateway";

import { EmailListBackend } from "./email-list-backend";

export class EggheadAwsCdkExerciseStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const emailsBackend = new EmailListBackend(this, "EmailsBackend");

    new apiGateway.LambdaRestApi(this, "Endpoint", {
      handler: emailsBackend.handler,
    });
  }
}
