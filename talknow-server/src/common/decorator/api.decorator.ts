import { applyDecorators, HttpStatus, Query } from "@nestjs/common";
import { ApiQuery, ApiResponse } from "@nestjs/swagger";
import { ErrorResponseDto } from "../dto/response/error-response.dto";
import { ErrorData } from "../exception/error-data";
import { FetchPageableQueryPipe } from "../pipe/fetch-pageable-query.pipe";
import { FetchQueryPipe } from "../pipe/fetch-query.pipe";

export const ApiSelectQuery = () =>
  applyDecorators(
    ApiQuery({
      name: "select",
      required: false,
      examples: {
        Default: {
          value: "",
        },
        "MongoDB - include": {
          value: {
            firstname: 1,
            lastname: 1,
          },
        },
        "MongoDB - exclude": {
          value: {
            firstname: 0,
            lastname: 0,
          },
        },
      },
    }),
  );

export const ApiSortQuery = () =>
  applyDecorators(
    ApiQuery({
      name: "sort",
      required: false,
      examples: {
        Default: {
          value: "",
        },
        MongoDB: {
          value: {
            createdAt: -1,
            firstname: 1,
          },
        },
      },
    }),
  );

export const ApiListQuery = () =>
  applyDecorators(ApiSelectQuery(), ApiSortQuery());

export const ApiPageableQuery = () =>
  applyDecorators(
    ApiQuery({
      name: "page",
      required: true,
      example: 1,
    }),
    ApiQuery({
      name: "limit",
      required: true,
      example: 20,
    }),
    ApiSelectQuery(),
    ApiSortQuery(),
  );

const getDoc = (errors: ErrorData[]) =>
  `<table><thead><tr><th>Error code</th><th>Error description</th></tr></thead><tbody>${errors
    .map(
      (e) => `<tr><td>${e.errorCode}</td><td>${e.errorDescription}</td></tr>`,
    )
    .join("")}</tbody></table>`;

export const ApiBadRequestDoc = (...errors: ErrorData[]) =>
  ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: getDoc(errors),
    type: ErrorResponseDto,
  });

export const ApiUnauthorizedDoc = (...errors: ErrorData[]) =>
  ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: getDoc(errors),
    type: ErrorResponseDto,
  });

export const ApiForbbidenDoc = (...errors: ErrorData[]) =>
  ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: getDoc(errors),
    type: ErrorResponseDto,
  });

export const ApiConflictDoc = (...errors: ErrorData[]) =>
  ApiResponse({
    status: HttpStatus.CONFLICT,
    description: getDoc(errors),
    type: ErrorResponseDto,
  });

export const ApiErrorDoc = (statusCode: HttpStatus, errors: ErrorData[]) =>
  ApiResponse({
    status: statusCode,
    description: getDoc(errors),
    type: ErrorResponseDto,
  });

export const FetchQuery = () => Query(FetchQueryPipe);
export const FetchPageableQuery = () => Query(FetchPageableQueryPipe);
