import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { badRequestResult, notFoundResult, okResult } from '@adapters/primary/lambda/responses';
import { changeEmailCommand } from '@use-cases';
import { getDynamoDbAccountRepository } from '@adapters/secondary/dynamodb/account.repository.dynamodb';

const accountRepository = getDynamoDbAccountRepository();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { id: accountId } = event.pathParameters ?? {};
  if (!accountId) {
    return badRequestResult;
  }

  if (!event.body) {
    return badRequestResult;
  }

  const { email } = JSON.parse(event.body);

  const changeEmailResult = changeEmailCommand(accountRepository).execute({
    accountId,
    newEmail: email,
  });

  return changeEmailResult.match(
    (account) => okResult(account),
    (failure) => {
      switch (failure.type) {
        case 'change-email-for-inactive-account':
        case 'email-not-valid':
          return badRequestResult;
        case 'account-not-found':
          return notFoundResult;
      }
    },
  );
};
