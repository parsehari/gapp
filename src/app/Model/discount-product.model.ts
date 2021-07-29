import { PercentDiscountInfo } from "./percent-discount-info.model";
import { PercentDiscount } from "./percent-discount.model";
import { UnitDiscountInfo } from "./unit-discount-info.model";
import { UnitDiscount } from "./unit-discount.model";

export class DiscountProduct {
    public productCode: string;
    public isDiscount: boolean;
    public isUDiscount: boolean;
    public isPDiscount: boolean;
    public isGDiscount: boolean;
    public uDiscount?: UnitDiscountInfo[];
    public pDiscount?: PercentDiscountInfo[];
    public gDiscount?: UnitDiscountInfo[];
}