import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { activateAccountCommand } from '@use-cases';
import { badRequestResult, notFoundResult, okResult } from '@adapters/primary/lambda/responses';
import { getDynamoDbAccountRepository } from '@adapters/secondary/dynamodb/account.repository.dynamodb';

const accountRepository = getDynamoDbAccountRepository();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { accountId, profileId } = event.pathParameters ?? {};
  if (!accountId) {
    return badRequestResult;
  }

  if (!profileId) {
    return badRequestResult;
  }

  const activateAccountResult = activateAccountCommand(accountRepository).execute({
    accountId,
  });

  return activateAccountResult.match(
    (account) => okResult(account),
    (failure) => {
      switch (failure.type) {
        case 'account-not-found':
          return notFoundResult;
        case 'activate-already-active-account':
          return badRequestResult;
      }
    },
  );
};
