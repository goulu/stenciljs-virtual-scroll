/*
logic of this component base on

Component can work in two "scroll states"
1. Inner scroll container. scroll event listen inner html element 'vscroll'
2. External scroll component. scroll event listen on inner html element, he most set in component attributes
External scroll container must heip if ypu are using some additional content on page,
and it must scrolled with scroll component.

*/

import { Component, Prop, State, Element, PropDidChange, PropWillChange, Event, EventEmitter, Method } from '@stencil/core';

@Component({
  tag: 'virtual-scroll',
  styleUrl: 'virtual-scroll.scss'
})
export class VirualScrollWebComponent {

  //list og imported values
  @Prop() list: Array<any> = [];

  //class selector
  @Prop() selector: string = '';

  //offset bottom event
  @Prop() bottomOffset: number = 0;
  
  //reserve of the bootom rows
  @Prop() VirtualOffsetEnd = 3;

  //change detection strategy
  @State() changed: string[] = [];

  //root html
  @Element() el: HTMLElement;

  //position of scroll
  private position: number = 0;

  //scrolled html element 
  private parentScroll: any;

  //virtual items list
  //private virtual: Array<any> = [];

  //virtual list translateY
  private topPadding: number = 0;

  //full height of component
  private totalHeight: number = 0;

  //first and last viewed rows
  private first: any;
  private last: any;

  //scroll event listener
  private scrollEventSubscriber: any;

  //list items dimensions
  private listDimensions: Array<any> = [];

  //bottom event
  @Event() toBottom: EventEmitter<number>;

  //update event
  @Event() update: EventEmitter<Array<any>>;

  //state to enable bottom infinate event
  private infinateOn: boolean = true;

  //state to common disable bottom infinate event
  private infinateFinally: boolean = false;

  //bool state to detect init render
  private initRender: boolean = false;

  //offset of scroll
  private vscrollOffsetTop: number = 0;

  //offset of contentpage
  private contentOffsetTop: number = 0;
  

  //change list event
  @PropDidChange('list')
  dataDidChangeHandler() {
    this.list.map((m, i) => {
      if (!m.index) {
        m.index = i;
      }
    })
    this.updateVirtual(true);
    //recalculation dimesions of list items
    this._setDimensions();
  }

  //life cicle methods
  componentDidLoad() {
    if (this.selector.length > 0) {
      this.parentScroll = document.querySelector('.' + this.selector);
    }
    else {
      this.parentScroll = this.el.querySelector('.vscroll');
    }

    this.init();
  }

  //dispatch listener of scroll on unload
  unwatch() {
    if (this.parentScroll)
      this.parentScroll.removeEventListener('click');
  }

  //life cicle methods
  componentDidUnload() {
    this.unwatch();
  }

  //life cicle methods
  componentWillLoad() {
  }

  //init/reinit
  private init() {

    this._setDefParams();

    let content = this.parentScroll;
    this.contentOffsetTop = (content) ? content['offsetTop'] : 0;

    let vscroll = this.el.querySelector('.vscroll');
    this.vscrollOffsetTop = (vscroll) ? vscroll['offsetTop'] : 0;

    this.scrollEventSubscriber = this.parentScroll.addEventListener('scroll', (e) => {
      this.position = this.parentScroll['scrollTop'] - this.vscrollOffsetTop;

      this.updateVirtual();
    });
  }

  private _setDefParams() {
    this.first = null;
    this.last = null;
    this.topPadding = 0;
    this.listDimensions = [];
    this.totalHeight = 0;
    this.position = 0;
  }

  //update virtual list items
  updateVirtual(update: boolean = false) {

    let findex = (this.first) ? this.first.rindex : 0;
    let lindex = (this.last) ? this.last.rindex : 0;

    //get first and last viewed nodes by position
    this.first = this.listDimensions.filter(f => this.position >= f.start && this.position < f.end)[0];
    this.last = this.listDimensions.filter(f => this.position + this.parentScroll.clientHeight >= f.start && this.position + this.parentScroll.clientHeight < f.end)[0];
    //if last node by position is null, take last of list
    if (!this.last) {
      this.last = this.listDimensions[this.listDimensions.length - 1];
    }

    //if first/last exist, set topPadding(content transformY).
    //virtual list set ...
    if (this.first && this.last) {
      this.topPadding = this.first.start;
      let v = this.list.slice(this.first.rindex, this.last.rindex + this.VirtualOffsetEnd);

      if ((findex != this.first.rindex || lindex != this.last.rindex) || update) {

        //this.virtual = v;
        this.update.emit(v);

        //change detection
        this.changed = [...this.changed, ''];
      }
    }
    else {
      let v = this.list.slice(0, 20);
      //this.virtual = v;
      this.update.emit(v);

      //change detection
      this.changed = [...this.changed, ''];
    }

    //bottom event
    if (this.last && this.last.rindex >= this.list.length - 1 - this.bottomOffset) {
      if (this.infinateOn && !this.infinateFinally && this.list.length > 0) {
        this.infinateOn = false;
        this.toBottom.emit(this.position);
      }
    }

  }

  //set infinate on status to send events
  @Method()
  setInfinateOn() {
    this.infinateOn = true;
  }

  //set infinate off status to send events
  @Method()
  setInfinateFinally() {
    this.infinateFinally = true;
  }

  //clear component data
  @Method()
  clear() {
    this.list = [];
    this._setDefParams();
    this.changed = [...this.changed, ''];
  }


  //scroll to element method at index
  @Method()
  scrollToNode(index: number, speed: number, offset: number = 0) {
    if (this.parentScroll) {
      if (index <= this.listDimensions.length - 1) {
        let dimension = this.listDimensions[index];
        this._scrollTo(dimension.start + offset, speed);
      }
      else {
        this._scrollToIndex(index);
      }
    }
  }

  // //scroll to element method
  // @Method()
  // refresh() {

  //   let missing = this.list.filter(item => this.list.indexOf(item) < 0);
  //   console.log(missing);

  //   let v = this.list.slice(this.first.rindex, this.last.rindex + this.bottomOffsetIndex);
  //   this.update.emit(v);
  //   //change detection
  //   this.changed = [...this.changed, ''];
  // }

  private _scrollToIndex(index) {
    let perTick = 100;
    setTimeout(() => {
      this.parentScroll['scrollTop'] = this.parentScroll['scrollTop'] + perTick;
      if (this.first && this.first.rindex === index) return;
      this._scrollToIndex(index);
    }, 10);
  }

  private _scrollTo(to, duration) {
    if (duration <= 0) return;
    let difference = to - this.parentScroll['scrollTop'];
    let perTick = difference / duration * 10;

    setTimeout(() => {
      this.parentScroll['scrollTop'] = this.parentScroll['scrollTop'] + perTick;
      if (this.parentScroll['scrollTop'] === to) return;
      this._scrollTo(to, duration - 10);
    }, 10);
  }

  //recalculation dimesions of list items
  private _setDimensions(): boolean {
    let oldTotal = this.totalHeight;

    let nodes = this.el.querySelectorAll('.virtual-slot .virtual-item');
    if (nodes.length > 0) {
      for (let vindex = 0; vindex <= nodes.length - 1; vindex++) {
        let node = nodes[vindex];
        let index = node['id'];
        if (!this.listDimensions[index]) {
          this._addNewDimension(node['offsetHeight'], index);
          this.totalHeight = this.listDimensions[this.listDimensions.length - 1].end;
        }
      }
    }

    return (this.totalHeight != oldTotal);
  }

  //Append new dimensions of list item
  private _addNewDimension(height: number, rindex) {
    let parentEnd = (this.listDimensions.length > 0) ? this.listDimensions[this.listDimensions.length - 1].end : 0;

    this.listDimensions.push({
      height: height,
      start: parentEnd,
      end: parentEnd + height,
      rindex: parseInt(rindex)
    });

  }

  //Append new dimensions of list item
  private _testDimensions() {
    let nodes = this.el.querySelector('.virtual-slot').childNodes;
    let offsetIndex = (this.first && this.first.rindex > 0) ? this.first.rindex : 0;
    this.list.map((m, i) => {
      if (this.listDimensions[i] && nodes[i - offsetIndex]) {
        if (nodes[i - offsetIndex]['offsetHeight'] != this.listDimensions[i].height) {
          console.warn("One or more nodes change height after calculation dimensions. Check scroll", i);
        }
      }
    });

  }

  componentDidUpdate() {

    //after component render, need to add new dimensions if virtual nodes, change height
    //if is init render need call update virtual, 
    //if is not init check update height. If height change render again!

    let isNewHeight = this._setDimensions();

    //if first render finished, recalculate virtual
    if (!this.initRender) {
      this.initRender = true;
      this.updateVirtual();
    }
    else {
      if (isNewHeight) {
        //change detection
        this.changed = [...this.changed, ''];
      }
      this._testDimensions();
    }
  }


  render() {
    return (
      <div class={"vscroll " + (this.selector.length > 0 ? 'external ' : 'inner ') + (this.infinateFinally ? 'infinate-finally' : '')}>
        <div class="vscroll-back" style={{ height: this.totalHeight + 'px' }}>

        </div>
        <div class={"vscroll-content " + (this.selector.length > 0 ? 'external' : 'inner')} style={{ transform: 'translateY(' + this.topPadding + 'px)' }}>
          <slot name="virtual" />
        </div>
        <slot name="loader" />
      </div>
    );
  }
}
