import { PercentDiscount } from "./percent-discount.model";
import { UnitDiscount } from "./unit-discount.model";

export class Discount {
    public gskDisPerUnitPerProd : UnitDiscount [];
    public disPercentWithProdList: PercentDiscount[];
    public gskDisGrpHdrList?: any;
}