import { Component, OnInit, Input } from '@angular/core';
import { ActionButton } from '../../models/actionbutton';

@Component({
  selector: 'app-widget-actionbutton',
  templateUrl: './widget-actionbutton.component.html',
  styleUrls: ['./widget-actionbutton.component.scss']
})
export class WidgetActionbuttonComponent implements OnInit {
  @Input() actionButton?: ActionButton;

  constructor() { }

  ngOnInit(): void {
  }

}
