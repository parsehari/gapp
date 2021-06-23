import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preferred-distributor',
  templateUrl: './preferred-distributor.page.html',
  styleUrls: ['./preferred-distributor.page.scss'],
})
export class PreferredDistributorPage implements OnInit {
 // bgColor='#B8DEFD'
  bgColor='white'

  constructor(private route:Router) { }
  
  ngOnInit() {
  }
  goBack(){

  }
  searchInputValueChange(event){

  }
  onPress(event) {
   if(this.bgColor === '#B8DEFD'){
      this.bgColor = 'white';
   }else{
      this.bgColor = '#B8DEFD'
   }
  }

  goToDetail(){
     this.route.navigate(['\distributor-details']);
  }
}
