import { IContractDetails } from "src/types/contract";
import { ContractFormValues } from "../schema/contract-schema";
import { FieldArrayWithId, UseFieldArrayRemove, UseFormReturn } from "react-hook-form";
import { UseBooleanReturn } from "minimal-shared/hooks";
import { ContractWareHouseSchemaType } from "../schema/contract-warehouse";

export type ContractItemsTableProps = {
    idContract: number | undefined;
    contractProductDetail: IContractDetails | undefined;
    methods: UseFormReturn<ContractFormValues>;
    fields: any[];
    remove: UseFieldArrayRemove;
    append: (value: any) => void;
    setPaid: (value: any) => void;
};

export type ContractWareHouseTableProps = {
    idContract: number | undefined;
    contractProductDetail: IContractDetails | undefined;
    methods: UseFormReturn<ContractWareHouseSchemaType>;
    fields: any[];
    remove: UseFieldArrayRemove;
    append: (value: any) => void;
    setPaid: (value: any) => void;
};

export type ContractItemsTableContentProps = {
    idContract?: number;
    fields: FieldArrayWithId<ContractFormValues, 'products', 'id'>[];
    methods: UseFormReturn<any>;
    append: (value: any) => void;
    calcAmount: (item: { qty?: number; price?: number; vat?: number }) => number;
    items: any;
    remove: UseFieldArrayRemove;
    contractProductDetail?: IContractDetails;
    openDel: UseBooleanReturn;
    setProductIDSelected: (id: string) => void;
    setIndexField: (i: number) => void;
};