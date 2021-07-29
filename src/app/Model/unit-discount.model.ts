import { UnitDiscountInfo } from "./unit-discount-info.model";

export class UnitDiscount {
    public gskProductCode?:string;
    public disId?:string;
    public gskDisPerUnitList?:UnitDiscountInfo[];
    public gskGrpDisDtlList? :UnitDiscountInfo[]
}