import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.scss'],
})
export class TrackOrderComponent implements OnInit {
  @Input() isPayment = true;
  @Input() isOrderdetails = false;

  @Input() gskOrderDate: any;
  @Input() createdOn: any;
  @Input() payGatewayTrxnDt: any;
  @Input() deliveryDate: any;

  constructor() {
  }

  ngOnInit() {

   
  }


}
