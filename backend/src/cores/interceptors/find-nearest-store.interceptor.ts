import { CallHandler, ExecutionContext, Injectable, NestInterceptor, BadRequestException } from "@nestjs/common";
import { ModuleRef, Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { FIND_NEAREST_STORE } from "../decorators/location.decorator";
import { appConfig } from "src/configs/app.config";
import { StoresService } from "src/apis/stores/stores.service";

@Injectable()
export class FindNearestStoreInterceptor implements NestInterceptor {
    constructor(
        private readonly reflector: Reflector,
        private readonly storeService: StoresService
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const isNearestStoreRequired = this.reflector.get<boolean>(FIND_NEAREST_STORE, context.getHandler());
        if (!isNearestStoreRequired) return next.handle();

        const request = context.switchToHttp().getRequest();

        const addressShipping = request.body.shippingAddress;

        if (!addressShipping) {
            throw new BadRequestException('Missing shipping address');
        }

        const encodedAddress = encodeURIComponent(addressShipping);
        const tomtomUrl = `https://${appConfig.tomtom.url}/search/${appConfig.tomtom.version}/geocode/${encodedAddress}.json?key=${appConfig.tomtom.apiKey}`;

        try {
            const response = await fetch(tomtomUrl);
            const data = await response.json();

            if (!data || !data.results || data.results.length === 0) {
                throw new BadRequestException('Could not retrieve location from TomTom');
            }

            const { lat, lon } = data.results[0].position;
            const nearestStore = await this.storeService.getStoreNearest(lat, lon);

            request.body.storeId = nearestStore.id;

            return next.handle();

        } catch (error) {
            console.error("Error fetching location from TomTom:", error);
            throw new BadRequestException('Error retrieving location from TomTom');
        }
    }
}
