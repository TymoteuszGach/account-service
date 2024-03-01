import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { suspendAccountCommand } from '@use-cases';
import { badRequestResult, notFoundResult, okResult } from '@adapters/primary/lambda/responses';
import { getDynamoDbAccountRepository } from '@adapters/secondary/dynamodb/account.repository.dynamodb';

const accountRepository = getDynamoDbAccountRepository();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { accountId } = event.pathParameters ?? {};
  if (!accountId) {
    return badRequestResult;
  }

  const suspendAccountResult = suspendAccountCommand(accountRepository).execute({
    accountId,
  });

  return suspendAccountResult.match(
    (account) => okResult(account),
    (failure) => {
      switch (failure.type) {
        case 'account-not-found':
          return notFoundResult;
        case 'suspend-already-suspended-account':
          return badRequestResult;
      }
    },
  );
};
