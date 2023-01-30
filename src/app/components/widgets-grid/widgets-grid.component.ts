import { Component, AfterViewInit , ViewChild, ElementRef, OnInit, Renderer2, HostListener } from '@angular/core';
import { ActionButton } from '../../models/actionbutton';
import { ActionButtons } from '../../actionbuttons-mock';
import { ResizedEvent } from 'angular-resize-event';

@Component({
  selector: 'app-widgets-grid',
  templateUrl: './widgets-grid.component.html',
  styleUrls: ['./widgets-grid.component.scss']
})
export class WidgetsGridComponent implements OnInit, AfterViewInit {

  @ViewChild('widgetsWrapper', {static: false}) wrapperElement!: ElementRef;

  constructor(private renderer: Renderer2) { }

  actionButtons: ActionButton[] = ActionButtons;

  columns: number= 5;
  rows: number = 3;
  widgetSpacing: number = 10;
  borderRadius: number = 10;

  buttonSize: number = 0;
  widgetSpacingPoints: number = 0;
  borderRadiusPoints: number = 0;

  wrapperWidth: number = 0;
  wrapperHeight: number = 0;
  wrapperPaddingX: number = 0;
  wrapperPaddingY: number = 0;

  countTotalWidgets(): number {
    return this.rows * this.columns;
  }

  onResized(event: ResizedEvent) {
    this.calculateButtonSize();
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.calculateButtonSize();
  }

  calculateButtonSize(): void {
    if (this.wrapperElement == null || this.wrapperElement == undefined) return;
    const wrapperStyle = window.getComputedStyle(this.wrapperElement.nativeElement, null);
    this.wrapperPaddingX = parseInt(wrapperStyle.getPropertyValue('padding-left')) +
                            parseInt(wrapperStyle.getPropertyValue('padding-right'));
    this.wrapperPaddingY = parseInt(wrapperStyle.getPropertyValue('padding-top')) +
                            parseInt(wrapperStyle.getPropertyValue('padding-bottom'));
    this.wrapperWidth = (this.wrapperElement?.nativeElement.offsetWidth ?? 0) - this.wrapperPaddingX;
    this.wrapperHeight = (this.wrapperElement?.nativeElement.offsetHeight ?? 0) - this.wrapperPaddingY;
    let buttonSizeX = this.wrapperWidth / this.columns;
    let buttonSizeY = this.wrapperHeight / this.rows;
    this.buttonSize = Math.min(buttonSizeX, buttonSizeY);


    this.widgetSpacingPoints = ((this.widgetSpacing / 100) * this.buttonSize) * 72 / 96;
    this.borderRadiusPoints = ((this.borderRadius / 100) * this.buttonSize) * 72 / 96;
  }

  getWidgetStyle(index: number) {
    const row = Math.trunc(index / this.columns);
    const column = Math.trunc(index % this.columns);
    const widget = this.actionButtons.find(x => x.Position_Y == row && x.Position_X == column);

    const width = this.buttonSize * (widget?.ColSpan ?? 1);
    const height = this.buttonSize * (widget?.RowSpan ?? 1);

    const xOffset = (this.wrapperWidth / 2) - ((this.columns * this.buttonSize) / 2); // Offset to center items horizontally
    const yOffset = (this.wrapperHeight / 2) - ((this.rows * this.buttonSize) / 2); // Offset to center items vertically

    const x = xOffset + (column * this.buttonSize);
    const y = yOffset + (row * this.buttonSize);

    return {
      'width' : width + 'px',
      'height' : height + 'px',
      'position' : 'absolute',
      'top' : y + "px",
      'left' : x + "px",
      'z-index' : (widget == null || widget == undefined) ? -1 : 1,
    }
  }

  getWidgetContentStyle(index: number) {
    const row = Math.trunc(index / this.columns);
    const column = Math.trunc(index % this.columns);
    const widget = this.actionButtons.find(x => x.Position_Y == row && x.Position_X == column);

    if (widget == null || widget == undefined) return {};

    const width = this.buttonSize * (widget?.ColSpan ?? 1);
    const height = this.buttonSize * (widget?.RowSpan ?? 1);

    return {
      'background-color': widget?.BackgroundColorHex ?? '#252525',
      'margin' : this.widgetSpacingPoints + "pt",
      'border-radius' : this.borderRadiusPoints + "pt",
      'box-shadow' : widget != null ? `0 9px 0 ${this.adjustColor(widget!.BackgroundColorHex, - 40)},0px 9px 20px rgba(0, 0, 0, .7)` : "",
      'border' : widget != null ? `1px solid ${this.adjustColor(widget!.BackgroundColorHex, - 50)}` : ""
    }
  }

  getActionButtonFromIndex(index: number): ActionButton | undefined {
    const row = Math.trunc(index / this.columns);
    const column = Math.trunc(index % this.columns);
    return this.actionButtons.find(x => x.Position_Y == row && x.Position_X == column);
  }

  getActionButtonFromRowCol(row: number, column: number): ActionButton | undefined {
    return this.actionButtons.find(x => x.Position_Y == row && x.Position_X == column);
  }

  onMouseDown(event: Event, widgetIndex: number): void {
    console.log("down");
    this.setClass(event.currentTarget, 'active', true);
  }

  onMouseUp(event: Event, widgetIndex: number): void {
    console.log("up");
    this.setClass(event.currentTarget, 'active', false);
  }

  setClass(target: any, className: string, value: boolean): void {
    const hasClass = target.classList.contains(className);
    if (value == true && !hasClass) {
      this.renderer.addClass(target, className);
    } else if (value == false && hasClass) {
      this.renderer.removeClass(target, className);
    }
  }

  touchStart(): void {
    console.log("Test");
  }

  adjustColor(color: string, amount: number) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  }

}
