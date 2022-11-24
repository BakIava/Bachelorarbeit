import { ApplicationRef, Component, ComponentFactoryResolver, ComponentRef, Directive, ElementRef, EmbeddedViewRef, HostListener, Injector, Input, OnInit } from '@angular/core';
import { ToolTipComponent } from '../tool-tip.component';


@Directive({
  selector: '[tooltip]',
})
export class ToolTipDirectiveComponent implements OnInit {
  @Input() tooltip: any;

  private componentRef: ComponentRef<any> | null = null;
  clicked = false;

  private checkIfPossibleToShowInformation(): boolean {
    const state = this.tooltip.q.find((v: { state: any; }) => v.state === this.tooltip.state);
    if (this.tooltip.state.match(/1|2/g)?.length === 6) {
      // debugger;
      if (this.tooltip.state.charAt(this.tooltip.field) !== '1' || !state.actionValue.find((a: { action: { row: number; col: number; }; }) => a.action.row * 3 + a.action.col === this.tooltip.field)) return false;
    } else if (this.tooltip.state.charAt(this.tooltip.field) !== '0') return false;


    return true;
  }

  private setTooltipComponentProperties() {
    if (this.componentRef !== null) {
      this.componentRef.instance.tooltip = this.tooltip;
      const { left, right, bottom } =
        this.elementRef.nativeElement.getBoundingClientRect();
      this.componentRef.instance.left = (right - left) / 2 + left;
      this.componentRef.instance.top = bottom;
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.setTooltipComponentProperties();
  }

  @HostListener('click')
  onClick(): void {
    if (!this.tooltip.editMode) this.clicked = !this.clicked;
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.checkIfPossibleToShowInformation()) return;
    if (this.componentRef === null && !this.tooltip.editMode) {
      const componentFactory =
        this.componentFactoryResolver.resolveComponentFactory(
          ToolTipComponent);
      this.componentRef = componentFactory.create(this.injector);
      this.appRef.attachView(this.componentRef.hostView);
      const domElem =
        (this.componentRef.hostView as EmbeddedViewRef<any>)
          .rootNodes[0] as HTMLElement;
      document.body.appendChild(domElem);
      this.setTooltipComponentProperties();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (!this.clicked) this.destroy();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy(): void {
    if (this.componentRef !== null) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  constructor(
    private elementRef: ElementRef,
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector) {
  }

  ngOnInit(): void {
  }

}
