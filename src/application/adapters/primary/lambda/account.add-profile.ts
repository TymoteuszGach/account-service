import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { addProfileCommand } from '@use-cases';
import { badRequestResult, createdResult } from '@adapters/primary/lambda/responses';
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

  const { profileName } = JSON.parse(event.body);

  const addProfileResult = addProfileCommand(accountRepository).execute({
    accountId,
    profileName,
  });

  return addProfileResult.match(
    (account) => createdResult(account),
    (failure) => {
      switch (failure.type) {
        case 'add-profile-to-inactive-account':
        case 'profile-name-already-exists':
        case 'account-not-found':
        case 'too-many-profiles':
          return badRequestResult;
      }
    },
  );
};
