import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";

export const FIND_NEAREST_STORE = 'FIND_NEAREST_STORE';

export const FindNearestStoreDecorator = () => SetMetadata(FIND_NEAREST_STORE, true);

export const GET_LOCATION = 'GET_LOCATION';

export const GetLocationDecorator = () => SetMetadata(GET_LOCATION, true);