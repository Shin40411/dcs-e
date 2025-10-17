import { z as zod } from 'zod';

export const ContractPaymentSchema = zod.object({

});

export type ContractReceiptSchemaType = Zod.infer<typeof ContractPaymentSchema>;