import { EventEmitter } from '@stencil/core';
export declare class VirualScrollWebComponent {
    list: Array<any>;
    selector: string;
    bottomOffset: number;
    virtualRatio: number;
    changed: string[];
    el: HTMLElement;
    private contentEl;
    private position;
    private parentScroll;
    private parentScrollHeight;
    private vscrollOffsetTop;
    private elementOffsetTop;
    toBottom: EventEmitter<number>;
    update: EventEmitter<Array<any>>;
    private infinateOn;
    private infinateFinally;
    private totalHeight;
    private first;
    private last;
    private listDimensions;
    private initRender;
    private toNextUpdateDimensions;
    private scrollEventDispatch;
    watchHandler(newValue: Array<any>, oldValue: Array<any>): void;
    componentDidLoad(): void;
    unwatch(): void;
    private _listener;
    componentDidUnload(): void;
    componentWillLoad(): void;
    private _setDefParams;
    updateVirtual(update?: boolean): void;
    setInfinateOn(): void;
    setInfinateFinally(): void;
    clear(): void;
    scrollToNode(index: number, speed: number, offset?: number): void;
    private _scrollToIndex;
    private _scrollTo;
    private _setDimensions;
    private _addNewDimensionToEnd;
    private _deleteDimension;
    refresh(): void;
    forceUpdateComponent(): void;
    private _testDimensions;
    componentDidUpdate(): void;
    __didUpdate(upd: any): void;
    render(): JSX.Element;
}
