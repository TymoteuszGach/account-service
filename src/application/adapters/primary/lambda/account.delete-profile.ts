import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { deleteProfileCommand } from '@use-cases';
import {
  badRequestResult,
  internalServerErrorResult,
  notFoundResult,
  okResult,
} from '@adapters/primary/lambda/responses';
import { getDynamoDbAccountRepository } from '@adapters/secondary/dynamodb/account.repository.dynamodb';

const accountRepository = getDynamoDbAccountRepository();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { profileId } = event.pathParameters ?? {};

  if (!profileId) {
    return badRequestResult;
  }

  const deleteProfileResult = deleteProfileCommand(accountRepository).execute({
    profileId,
  });

  return deleteProfileResult.match(
    (account) => okResult(account),
    (failure) => {
      switch (failure.type) {
        case 'delete-default-profile':
        case 'delete-profile-from-inactive-account':
          return badRequestResult;
        case 'account-not-found':
          return notFoundResult;
        case 'delete-non-existent-profile':
          return internalServerErrorResult;
      }
    },
  );
};
