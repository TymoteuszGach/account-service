import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { enrollAccountCommand } from '@use-cases';
import {
  badRequestResult,
  createdResult,
  internalServerErrorResult,
} from '@adapters/primary/lambda/responses';
import { getDynamoDbAccountRepository } from '@adapters/secondary/dynamodb/account.repository.dynamodb';

const accountRepository = getDynamoDbAccountRepository();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return badRequestResult;
  }

  const { email } = JSON.parse(event.body);

  const enrollAccountResult = enrollAccountCommand(accountRepository).execute({
    email,
  });

  return enrollAccountResult.match(
    (account) => createdResult(account),
    (failure) => {
      switch (failure.type) {
        case 'email-not-valid':
          return badRequestResult;
        case 'account-already-exists':
          return internalServerErrorResult;
      }
    },
  );
};
