import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.page.html',
  styleUrls: ['./order-summary.page.scss'],
})
export class OrderSummaryPage implements OnInit {
  quantity = 0;
  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    this.getGSTDetail();
  }

  addNewProduct() {
    this.router.navigate(['product-list']);
  }

  continue() {
    this.router.navigate(['payment']);
  }
  modifyQuantity(event) {
    console.log("vnbbnvnvb")
    if (event === 'add') {
      this.quantity++;
    } else {
      if (this.quantity != 0)
        this.quantity--;
    }
  }

  getGSTDetail() {
    this.apiService.getDataService(this.apiService.getGSTdetail, 'gstDetail').subscribe((response: any) => {
      console.log("response ", response)
    })
  }

}
