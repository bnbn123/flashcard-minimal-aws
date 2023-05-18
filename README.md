# Serverless Flash Cards App

To implement this project, you need to implement a simple Flash Cards application using AWS Lambda and Serverless framework. Search for all comments starting with the `Flash Cards:` in the code to find the placeholders that you need to implement.

# Functionality of the application

This application will allow creating/removing/updating/fetching Flash Cards items. Each Flash Cards item can optionally have an attachment image. Each user only has access to Flash Cards items that he/she has created.

# Flash Cards items

The application should store Flash Cards items, and each Flash Cards item contains the following fields:

- `flashCardId` (string) - a unique id for an item
- `flashCardDef` (string) - definition of the word(name)
- `createdAt` (string) - date and time when an item was created
- `name` (string) - name of a Flash Cards item (e.g. "Change a light bulb")
- `dueDate` (string) - date and time by which an item should be completed
- `done` (boolean) - true if an item was completed, false otherwise
- `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a Flash Cards item

You might also store an id of a user who created a Flash Cards item.

## Prerequisites

- <a href="https://manage.auth0.com/" target="_blank">Auth0 account</a>
- <a href="https://github.com" target="_blank">GitHub account</a>
- <a href="https://nodejs.org/en/download/package-manager/" target="_blank">NodeJS</a> version up to 12.xx
- Serverless
  - Create a <a href="https://dashboard.serverless.com/" target="_blank">Serverless account</a> user
  - Install the Serverless Framework’s CLI (up to VERSION=2.21.1). Refer to the <a href="https://www.serverless.com/framework/docs/getting-started/" target="_blank">official documentation</a> for more help.
  ```bash
  npm install -g serverless@2.21.1
  serverless --version
  ```
  - Login and configure serverless to use the AWS credentials
  ```bash
  # Login to your dashboard from the CLI. It will ask to open your browser and finish the process.
  serverless login
  # Configure serverless to use the AWS credentials to deploy the application
  # You need to have a pair of Access key (YOUR_ACCESS_KEY_ID and YOUR_SECRET_KEY) of an IAM user with Admin access permissions
  sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_KEY --profile serverless
  ```

# Functions to be implemented

To implement this project, you need to implement the following functions and configure them in the `serverless.yml` file:

- `Auth` - this function should implement a custom authorizer for API Gateway that should be added to all other functions.

- `GetFlashCards` - should return all FlashCards for a current user. A user id can be extracted from a JWT token that is sent by the frontend

It should return data that looks like this:

```json
{
  "items": [
    {
      "flashCardId": "123",
      "flashCardDef": "osdnosandousanduonsauodsanuodnsad",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "name": "milk",
      "dueDate": "2019-07-29T20:01:45.424Z",
      "done": false,
      "attachmentUrl": "http://example.com/image.png"
    },
    {
      "flashCardId": "456",
      "flashCardDef": "osdnosandousanduonsauodsanuodnsad",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "name": "Send a letter",
      "dueDate": "2019-07-29T20:01:45.424Z",
      "done": true,
      "attachmentUrl": "http://example.com/image.png"
    }
  ]
}
```

- `CreateFlashCard` - should create a new FlashCard for a current user. A shape of data send by a client application to this function can be found in the `CreateFlashCardRequest.ts` file

It receives a new FlashCard item to be created in JSON format that looks like this:

```json
{
  "createdAt": "2019-07-27T20:01:45.424Z",
  "flashCardDef": "osdnosandousanduonsauodsanuodnsad",
  "name": "Buy milk",
  "dueDate": "2019-07-29T20:01:45.424Z",
  "done": false,
  "attachmentUrl": "http://example.com/image.png"
}
```

It should return a new FlashCard item that looks like this:

```json
{
  "item": {
    "flashCardId": "123",
    "flashCardDef": "osdnosandousanduonsauodsanuodnsad",
    "createdAt": "2019-07-27T20:01:45.424Z",
    "name": "Buy milk",
    "dueDate": "2019-07-29T20:01:45.424Z",
    "done": false,
    "attachmentUrl": "http://example.com/image.png"
  }
}
```

- `UpdateFlashCard` - should update a FlashCard item created by a current user. A shape of data send by a client application to this function can be found in the `UpdateFlashCardRequest.ts` file

It receives an object that contains three fields that can be updated in a FlashCard item:

```json
{
  "name": "Buy bread",
  "flashCardDef": "osdnosandousanduonsauodsanuodnsad",
  "dueDate": "2019-07-29T20:01:45.424Z",
  "done": true
}
```

The id of an item that should be updated is passed as a URL parameter.

It should return an empty body.

- `DeleteFlashCard` - should delete a FlashCard item created by a current user. Expects an id of a FlashCard item to remove.

It should return an empty body.

- `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a FlashCard item.

It should return a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

- `GetFlashCardById` - returns a flash card if any that has flashCardId that we can get from match params

It should return a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

You also need to add any necessary resources to the `resources` section of the `serverless.yml` file such as DynamoDB table and S3 bucket.

# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

This frontend should work with your serverless application once it is developed, you don't need to make any changes to the code. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application just as it was done in the course and contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

## Authentication

To implement authentication in your application, you would have to create an Auth0 application and copy "domain" and "client id" to the `config.ts` file in the `client` folder. We recommend using asymmetrically encrypted JWT tokens.

# Best practices

To complete this exercise, please follow the best practices from the 6th lesson of this course.

## Logging

The starter code comes with a configured [Winston](https://github.com/winstonjs/winston) logger that creates [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements. You can use it to write log messages like this:

```ts
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')

// You can provide additional information with every log statement
// This information can then be used to search for log statements in a log storage system
logger.info('User was authorized', {
  // Additional information stored with a log statement
  key: 'value'
})
```

# Grading the submission

Once you have finished developing your application, please set `apiId` and Auth0 parameters in the `config.ts` file in the `client` folder. A reviewer would start the React development server to run the frontend that should be configured to interact with your serverless application.

**IMPORTANT**

_Please leave your application running until a submission is reviewed. If implemented correctly it will cost almost nothing when your application is idle._

# Suggestions

To store FlashCard items, you might want to use a DynamoDB table with local secondary index(es). A create a local secondary index you need to create a DynamoDB resource like this:

```yml
FlashCardsTable:
  Type: AWS::DynamoDB::Table
  Properties:
    AttributeDefinitions:
      - AttributeName: partitionKey
        AttributeType: S
      - AttributeName: sortKey
        AttributeType: S
      - AttributeName: indexKey
        AttributeType: S
    KeySchema:
      - AttributeName: partitionKey
        KeyType: HASH
      - AttributeName: sortKey
        KeyType: RANGE
    BillingMode: PAY_PER_REQUEST
    TableName: ${self:provider.environment.FLASHCARDS_TABLE}
    LocalSecondaryIndexes:
      - IndexName: ${self:provider.environment.INDEX_NAME}
        KeySchema:
          - AttributeName: partitionKey
            KeyType: HASH
          - AttributeName: indexKey
            KeyType: RANGE
        Projection:
          ProjectionType: ALL # What attributes will be copied to an index
```

To query an index you need to use the `query()` method like:

```ts
await this.dynamoDBClient
  .query({
    TableName: 'table-name',
    IndexName: 'index-name',
    KeyConditionExpression: 'paritionKey = :paritionKey',
    ExpressionAttributeValues: {
      ':paritionKey': partitionKeyValue
    }
  })
  .promise()
```

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless FLASHCARD application.

# Deploy

## Deploy the Backend

To deploy the backend application, run the following commands:

```
cd backend
npm update --save
npm audit fix

# For the first time, create an application in your org in Serverless portal
serverless

# Next time, deploy the app and note the endpoint url in the end
serverless deploy --verbose

# If you face a permissions error, you may need to specify the user profile
sls deploy -v --aws-profile serverless

# sls is shorthand for serverless
# -v is shorthand for --verbose
```

If deployment is successful, then you can

Check the Serverless dashboard update
Check the AWS resources - API Gateway, S3, Lambda, CloudWatch logs
Verify the endpoints.
Otherwise, see the Troubleshooting tips on the page next.

# Configure the Frontend

The /client/ folder contains the frontend web application which consumes the backend API developed in this project. You don't need to make any changes to the frontend code in the /client/ folder, except for the Authentication related changes, as explained below.

### Authentication - Login to the Auth0 portal, and navigate to your Dashboard.

- Create a "Single Page Web Applications" type Auth0 application
- Go to the App settings, and setup the Allowed Callback URLs
- Setup the Allowed Web Origins for CORS options.
- Setup the application properties. We recommend using asymmetrically encrypted (RS256) JWT tokens.
- Copy "domain" and "client id" to save in the /client/src/config.ts file.
- In your backend auth handler function, fetch the Auth0 certificate programmatically.

### Edit the /client/src/config.ts file to configure your Auth0 client application and API endpoint:

```
// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
// apiId is the ID generated by the serverless deploy command
const apiId = '...'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`
export const authConfig = {
// TODO: Create an Auth0 application and copy values from it into this map
domain: '...',    // Domain from Auth0
clientId: '...',  // Client id from an Auth0 application
callbackUrl: 'http://localhost:3000/callback'  // Localhost URL that the front
}
```

# Run the Frontend

Once you've set the paramteres in the client/src/config.ts file, run the following commands:

```
cd client
npm update --save
npm audit fix --legacy-peer-deps
npm install --save-dev
npm run start
```

This should start a React development server at http://localhost:3000/s that will interact with the backend APIs.

# Screenshots:

## is in /screenshots folder and they captured:

- deployment to serverless and successful deployment of cloud formation
- home page and login
- After login, create new flash card box is in view with all flash cards below and each can be checked "Done",edited or deleted
- hover-able flash card and checkbox done when you've memorize
- Edit page where you can also add new word and definition, and images
