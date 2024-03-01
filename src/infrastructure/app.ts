#!/usr/bin/env node

import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AccountServiceStack } from './stacks';

const app = new cdk.App();
new AccountServiceStack(app, 'AccountStack');
