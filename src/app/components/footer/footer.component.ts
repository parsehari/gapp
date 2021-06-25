import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

 @Input() firstTitle:string;
 @Input() secondTitle:string;
 @Input() moreEvent:boolean=true;
 @Input() isFirstOutline:boolean= true;
 @Input() isSecondOutline:boolean=false;
 @Output() firstEvent=new EventEmitter();
 @Output() secondEvent=new EventEmitter();
 @Input() showInfo:boolean = false;
@Input() infoText:string;
@Input() infoLabel:string;
  constructor() { }

  ngOnInit() {}
  actionFirstTapped(){
     this.firstEvent.emit();
  }
  actionSecondTapped(){
     this.secondEvent.emit()
  }

}
