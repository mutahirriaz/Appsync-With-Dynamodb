import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as dynamodb from '@aws-cdk/aws-dynamodb'

export class AppsyncDynamodbAckendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

  const api = new appsync.GraphqlApi(this, 'appSyncApi', {
    name: 'appsyncDynamodb',
    schema: appsync.Schema.fromAsset("graphql/schema.gql"),
    authorizationConfig: {
      defaultAuthorization: {
        authorizationType: appsync.AuthorizationType.API_KEY
      }
    }
  });

  const dynamo_Table = new dynamodb.Table(this, 'table', {
    tableName: 'appsyncDynamodbTable',
    partitionKey: {
      name: 'id',
      type: dynamodb.AttributeType.STRING
    }
  })

  const datasource = api.addDynamoDbDataSource("datasource", dynamo_Table)

  datasource.createResolver({
    typeName: "Mutation",
    fieldName: "addTodo",
    requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(appsync.PrimaryKey.partition("id").auto(),appsync.Values.projecting()),
    responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()

  })

  datasource.createResolver({
    typeName: "Query",
    fieldName: "getTodo",
    requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
    responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList()
  })

  datasource.createResolver({
    typeName: "Mutation",
    fieldName: "updateTodo",
    requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(appsync.PrimaryKey.partition("id").is("id"), appsync.Values.projecting()),
    responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()

  })

  datasource.createResolver({
    typeName: "Mutation",
    fieldName: "deleteTodo",
    requestMappingTemplate: appsync.MappingTemplate.dynamoDbDeleteItem("id","id"),
    responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
  })

  }
}
