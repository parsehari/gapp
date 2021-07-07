import { PercentDiscount } from "./percent-discount.model";
import { UnitDiscount } from "./unit-discount.model";

export class Discount {
    public gskDisPerUnitPerProdList : UnitDiscount [];
    public gskDisPercentList: PercentDiscount[];
    public gskDisGrpHdrList: any;
}