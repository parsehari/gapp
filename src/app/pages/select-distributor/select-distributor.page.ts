import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-distributor',
  templateUrl: './select-distributor.page.html',
  styleUrls: ['./select-distributor.page.scss'],
})
export class SelectDistributorPage implements OnInit {
 distributor:any;
  constructor(private route:Router) { }

  ngOnInit() {
  }
  selectDistributor(event){
    
  }
  goBack(){
    this.route.navigate(['/login']);
  }
}
