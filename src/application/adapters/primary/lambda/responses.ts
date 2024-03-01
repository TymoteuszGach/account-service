import { APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';

const toResult = <T = never>(statusCode: number, result: T): APIGatewayProxyResult => {
  return {
    statusCode,
    body: JSON.stringify(result),
  };
};

export const okResult = <T>(result: T): APIGatewayProxyResult => toResult(200, result);

export const createdResult = <T>(result: T): APIGatewayProxyResult => toResult(201, result);

export const internalServerErrorResult = toResult(500, 'internal server error');

export const notFoundResult = toResult(404, 'not found');

export const badRequestResult = toResult(400, 'bad request');
