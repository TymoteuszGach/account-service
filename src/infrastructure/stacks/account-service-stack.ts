import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class AccountServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new NodejsFunction(this, 'EnrollAccountLambda', {
      entry: './src/application/adapters/primary/lambda/account.enroll.ts',
    });
  }
}
