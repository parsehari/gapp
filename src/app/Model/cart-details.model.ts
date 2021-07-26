import { CartWithStockiest } from "./cart-with-pstockiest.model";
import { CartModel } from "./cart.model";
import { PreferredDistributorModel } from "./pdistributor.model";
import { Stockiest } from "./stockiest.model";

export class CartDetails {
    public distributor : any;
    public cart:CartModel[]=[];
    public fromView:string;
    public fromEvent:string;
    public isAddProduct = false;
    public fromCart = false;
}