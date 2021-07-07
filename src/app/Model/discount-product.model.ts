import { PercentDiscount } from "./percent-discount.model";
import { UnitDiscountInfo } from "./unit-discount-info.model";
import { UnitDiscount } from "./unit-discount.model";

export class DiscountProduct {
    public productCode:string;
    public isDiscount:boolean;
    public isPercentDiscount:boolean;
    public uDiscount?:UnitDiscountInfo[];
    public pDiscount?:PercentDiscount;
}