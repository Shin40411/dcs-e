import { ContractFormValues } from "../schema/contract-schema";
import { FieldArrayWithId, UseFieldArrayRemove, UseFormReturn } from "react-hook-form";
import { UseBooleanReturn } from "minimal-shared/hooks";
import { IContractSupplyForDetail, IImportRemainingProduct } from "src/types/contractSupplier";

export type ContractItemsTableProps = {
    idContract: number | undefined;
    contractProductDetail: IContractSupplyForDetail[] | undefined;
    methods: UseFormReturn<ContractFormValues>;
    fields: any[];
    remove: UseFieldArrayRemove;
    append: (value: any) => void;
    setPaid: (value: any) => void;
    listMutate: () => void;
    detailMutate: () => void;
};

export type ContractWareHouseTableProps = {
    remainingProductEmpty: boolean;
    remainingProductLoading: boolean;
    remainingProduct: IImportRemainingProduct[];
    onQuantityChange?: (productID: number, newQuantity: number) => void;
    onRemoveProduct?: (productID: number) => void;
};

export type ContractItemsTableContentProps = {
    idContract?: number;
    fields: FieldArrayWithId<ContractFormValues, 'products', 'id'>[];
    methods: UseFormReturn<any>;
    append: (value: any) => void;
    calcAmount: (item: { qty?: number; price?: number; vat?: number }) => number;
    items: any;
    remove: UseFieldArrayRemove;
    contractProductDetail?: IContractSupplyForDetail[];
    openDel: UseBooleanReturn;
    setProductIDSelected: (id: string) => void;
    setIndexField: (i: number) => void;
};