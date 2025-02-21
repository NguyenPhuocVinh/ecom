import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Logger } from "@nestjs/common";
import { Cache } from "cache-manager";
import { PagingDto } from "src/common/dto/page-result.dto";
import { appConfig } from "src/configs/app.config";

export class CacheManagerService {
    private readonly logger = new Logger(CacheManagerService.name);
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    async generateCacheKeyForFindAll(
        routerName: string,
        functionName: string,
        queryParams: any,
        locale?: string,
        options?: Object,
    ) {
        try {
            const key = `${appConfig.appName
                }:${routerName}:${functionName}-${locale}-${encodeURIComponent(
                    JSON.stringify(queryParams),
                )}-${encodeURIComponent(JSON.stringify(options))}`;
            return key.toString();
        } catch (error) {
            console.log('error', error);
        }
    }

    async getCache(key: string) {
        try {
            const data = await this.cacheManager.get(key);
            return data;
        } catch (error) {
            console.log('error', error);
        }
    }

    async setCache(key: string, data: any) {
        try {
            await this.cacheManager.set(key, data, 60000 * 60 * 24 * 1);
        } catch (error) {
            console.log('error', error);
        }
    }
}