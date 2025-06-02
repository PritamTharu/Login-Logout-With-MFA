require('dotenv').config()
const { CognitoIdentityClient , GetOpenIdTokenForDeveloperIdentityCommand } = require('@aws-sdk/client-cognito-identity');
const { STSClient, AssumeRoleWithWebIdentityCommand } = require("@aws-sdk/client-sts");


const cognitoIdentityClient = new CognitoIdentityClient({ region: 'ap-south-1' });
const stsClient =  new STSClient({ region: 'ap-south-1'});



const getOpenIdTokenForDeveloperIdentity = async (token) => {
    const params = {
      IdentityPoolId: process.env.IDENTITY_POOL_ID,
      Logins: {'customprovider': token }
    };
    try {
      const command = new GetOpenIdTokenForDeveloperIdentityCommand(params);
      const data = await cognitoIdentityClient.send(command);
      return data.Token; 
    } catch (error) {
      console.error('Error getting OpenID token:', error);
      throw error;
    }
};

const AssumeRoleWithWebIdentity = async (openIdToken) => {
    const params = { 
      RoleArn: 'arn:aws:iam::620743375634:role/LambdaBasicExecutionRole',
      RoleSessionName: 'appServiceRole',
      WebIdentityToken: openIdToken,
    };
    try {
      const command = new AssumeRoleWithWebIdentityCommand(params);
      const response = await stsClient.send(command);
      return response;
    } catch (error) {
      console.error('Error Assuming Role:', error);
      throw error;
    }
};




module.exports = {getOpenIdTokenForDeveloperIdentity,AssumeRoleWithWebIdentity};
  