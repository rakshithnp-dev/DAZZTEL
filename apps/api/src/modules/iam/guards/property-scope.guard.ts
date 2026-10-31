import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class PropertyScopeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { user, params, query, body } = request;

    // Platform admins have global multi-property access
    if (user?.role === 'PLATFORM_ADMIN') {
      return true;
    }

    const targetPropertyId = params?.propertyId || query?.propertyId || body?.propertyId;
    if (!targetPropertyId) {
      // Endpoint is not property-specific
      return true;
    }

    if (!user) {
      // Public endpoint with property filter
      return true;
    }

    if (user.propertyId && user.propertyId !== targetPropertyId) {
      throw new ForbiddenException(
        `Cross-property boundary violation: User assigned to property ${user.propertyId} cannot access property ${targetPropertyId}`
      );
    }

    return true;
  }
}
