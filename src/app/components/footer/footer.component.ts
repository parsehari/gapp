import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { Stockiest } from 'src/app/Model/stockiest.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  @Input() firstTitle: string;
  @Input() secondTitle: string;
  @Input() moreEvent: boolean = true;
  @Input() isFirstOutline: boolean = true;
  @Input() isSecondOutline: boolean = false;
  @Input() isIcon: boolean = false;
  @Output() firstEvent = new EventEmitter();
  @Output() secondEvent = new EventEmitter();
  @Input() showInfo: boolean = false;
  @Input() infoText: Stockiest;
  @Input() infoLabel: string ;
  constructor() { }

  ngOnInit() { }
  actionFirstTapped() {
    this.firstEvent.emit();
  }
  actionSecondTapped() {
    this.secondEvent.emit()
  }
 /* ngOnChanges(changes: SimpleChange) {
    for (const propName in changes) {
      if (changes.hasOwnProperty('infoText')) {
        switch (propName) {
          case 'infoText': {
            this.infoLabel = "You have selected"
          }
        }
      }
    }
  }*/

}
