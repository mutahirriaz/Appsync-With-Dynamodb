#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AppsyncDynamodbAckendStack } from '../lib/appsync-dynamodb-ackend-stack';

const app = new cdk.App();
new AppsyncDynamodbAckendStack(app, 'AppsyncDynamodbAckendStack');
