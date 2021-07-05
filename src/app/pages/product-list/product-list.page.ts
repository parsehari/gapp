import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Product } from 'src/app/Model/product.model';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {
  productList:Product[];
  quantity=0;
  constructor(private menu : MenuController,private route :Router,
    private apiService:ApiService,
    private commonService:CommonService,
    ) { }

  ngOnInit() {
    this.menu.enable(true);
    this.commonService.showLoader()
    this.apiService.setDistributorHeader();
    this.apiService.getDataService(this.apiService.getProductURL).subscribe(
      (response)=>{
        console.log("response :",response);
        this.productList = response.gskProdList;
        this.commonService.hideLoader();
        this.productList.map((ele)=>{
          ele.quantity = 0;
        })
      },
      (error)=>{
        this.commonService.hideLoader()
        this.commonService.showToast(error)
      }
    )
  }

  searchInputValueChange(event){
  console.log("change",event);
  }
  addToCart(){
    var cartData = this.productList.filter((ele)=>{
      if(ele.quantity > 0){
        return true;
      }else{
        return false;
      }
    })
    if(cartData.length == 0){
      this.commonService.presentOneButtonAlert('GSK','Please select product.','OK');
    }else{
      var cartJson = {
        "Gsk_CartList":cartData
      }
      this.commonService.showLoader();
      this.apiService.postDataService(this.apiService.saveCartURL,cartJson).subscribe(
        (response)=>{
          console.log("save cart data :", response);
          this.commonService.hideLoader();
          this.route.navigate(['/cart']);
        },
        (error)=>{
          this.commonService.showToast(error);
          this.commonService.hideLoader()
          console.log("error :",error);
        }
      )
    }
  }
  buyNow(){
    this.route.navigate(['/select-distributor']);
  }

  modifyQuantity(event,productCode){
   this.productList.map((ele)=>{
     if(ele.productCode === productCode){
      if(event === 'add'){
        ele.quantity ++ ;
      }else{
        if(ele.quantity != 0) 
         ele.quantity -- ;
        }
      }
    })
  }
  
  getImageURL(imageSource){
    return this.commonService.getImageURLFromBase64(imageSource);
  }
  
}
