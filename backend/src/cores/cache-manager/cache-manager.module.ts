import { CacheModule } from "@nestjs/cache-manager";
import { Global, Module } from "@nestjs/common";
import { CacheManagerService } from "./cache-manager.service";
import { createKeyv } from "@keyv/redis";

@Global()
@Module({
    imports: [
        CacheModule.register()
    ],
    providers: [CacheManagerService],
    exports: [CacheManagerService]
})
export class CacheManagerModule { }