import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";

export class EmailListBackend extends cdk.Construct {
  public readonly handler: lambda.Function;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    const emailsTable = new dynamodb.Table(this, "EmailsTable", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
    });

    emailsTable.addGlobalSecondaryIndex({
      indexName: "EmailIndex",
      partitionKey: { name: "email", type: dynamodb.AttributeType.STRING },
    });

    this.handler = new lambda.Function(this, "EmailsHandler", {
      code: lambda.Code.fromAsset("lambda"),
      handler: "emailsHandler.handler",
      runtime: lambda.Runtime.NODEJS_12_X,
      environment: {
        TABLE_NAME: emailsTable.tableName,
      },
    });

    emailsTable.grantReadWriteData(this.handler);
  }
}
