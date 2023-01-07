import { SetMetadata } from '@nestjs/common';

export const HAS_IDENTITY_KEY = 'has_identity';

export const HasIdentity = () => SetMetadata(HAS_IDENTITY_KEY, true);
