import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  CheckPolicies,
  PoliciesGuard,
  PolicyHandler,
} from '../casl/policies.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

export function UsePolicy(...policyHandlers: PolicyHandler[]) {
  return applyDecorators(
    UseGuards(JwtAuthGuard, PoliciesGuard),
    CheckPolicies(...policyHandlers),
  );
}
