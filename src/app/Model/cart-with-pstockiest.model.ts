import { CartModel } from "./cart.model";
import { Stockiest } from "./stockiest.model";

export class CartWithStockiest {
    public unitCart:CartModel;
    public stockiestOne?:Stockiest;
    public stockiestTwo?:Stockiest;
    public stockiestThree?:Stockiest;
}