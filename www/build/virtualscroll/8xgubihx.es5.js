/*! Built with http://stenciljs.com */
virtualscroll.loadComponents(function(t,i,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function t(){this.list=[],this.selector="",this.bottomOffset=0,this.virtualRatio=3,this.changed=[],this.position=0,this.parentScrollHeight=0,this.vscrollOffsetTop=0,this.contentOffsetTop=0,this.infinateOn=!0,this.infinateFinally=!1,this.totalHeight=0,this.listDimensions=[],this.initRender=!1}return t.prototype.dataDidChangeHandler=function(t){this.list.map(function(t,i){t.index||(t.index=i)}),this.updateVirtual(!0),this._setDimensions()},t.prototype.componentDidLoad=function(){var t=this;this._setDefParams(),this.selector.length>0?this.parentScroll=document.querySelector("."+this.selector):this.parentScroll=this.el.querySelector(".vscroll"),this.parentScrollHeight=this.parentScroll.offsetHeight,this.contentOffsetTop=this.parentScroll?this.parentScroll.offsetTop:0,this.contentEl=this.el.querySelector(".vscroll-content");var i=this.el.querySelector(".vscroll");this.vscrollOffsetTop=i?i.offsetTop:0,this.parentScroll.addEventListener("scroll",function(i){t.position=t.parentScroll.scrollTop-t.vscrollOffsetTop,t.updateVirtual()},!1)},t.prototype.unwatch=function(){this.parentScroll&&this.parentScroll.removeEventListener("scroll",this._listener)},t.prototype._listener=function(){this.position=this.parentScroll.scrollTop-this.vscrollOffsetTop,this.updateVirtual()},t.prototype.componentDidUnload=function(){this.unwatch()},t.prototype.componentWillLoad=function(){},t.prototype._setDefParams=function(){this.first=null,this.last=null,this.listDimensions=[],this.totalHeight=0,this.position=0,this.infinateOn=!0,this.infinateFinally=!1},t.prototype.updateVirtual=function(t){var i=this;void 0===t&&(t=!1);var e=this.first?this.first.rindex:0,s=this.last?this.last.rindex:0;if(this.first=this.listDimensions.filter(function(t){return i.position>=t.start&&i.position<t.end})[0],this.last=this.listDimensions.filter(function(t){return i.position+i.parentScroll.clientHeight>=t.start&&i.position+i.parentScroll.clientHeight<t.end})[0],this.last||(this.last=this.listDimensions[this.listDimensions.length-1]),this.first&&this.last){var n=this.last.rindex+this.virtualRatio>=this.list.length?this.list.length:this.last.rindex+this.virtualRatio,o=this.first.rindex-this.virtualRatio<0?0:this.first.rindex-this.virtualRatio;n==this.list.length&&this.totalHeight-this.position-this.parentScrollHeight<0&&(o=e-this.virtualRatio<0?0:e-this.virtualRatio,this.first=this.listDimensions[e]);var l=this.list.slice(o,n);(e!=this.first.rindex||s!=this.last.rindex||t)&&(requestAnimationFrame(function(){var e=i.listDimensions[o];e&&(i.contentEl.style.transform="translateY("+e.start+"px)",i.contentEl.style.webkitTransform="translateY("+e.start+"px)"),i.update.emit(l),t&&(i.changed=i.changed.concat([""]))}),this.changed=this.changed.concat([""]))}else{var r=this.list.slice(0,20);this.update.emit(r),this.changed=this.changed.concat([""])}this.last&&this.last.rindex>=this.list.length-1-this.bottomOffset&&this.infinateOn&&!this.infinateFinally&&this.list.length>0&&(this.infinateOn=!1,this.toBottom.emit(this.position))},t.prototype.setInfinateOn=function(){this.infinateOn=!0},t.prototype.setInfinateFinally=function(){this.infinateFinally=!0},t.prototype.clear=function(){var t=this;requestAnimationFrame(function(){t.list=[],t._setDefParams(),t.contentEl.style.transform="translateY(0px)",t.contentEl.style.webkitTransform="translateY(0px)",t.changed=t.changed.concat([""])})},t.prototype.scrollToNode=function(t,i,e){if(void 0===e&&(e=0),this.parentScroll)if(t<=this.listDimensions.length-1){var s=this.listDimensions[t];this._scrollTo(s.start+e,i)}else this._scrollToIndex(t)},t.prototype._scrollToIndex=function(t){var i=this;setTimeout(function(){i.parentScroll.scrollTop=i.parentScroll.scrollTop+100,i.first&&i.first.rindex===t||i._scrollToIndex(t)},10)},t.prototype._scrollTo=function(t,i){var e=this;if(!(i<=0)){var s=(t-this.parentScroll.scrollTop)/i*10;setTimeout(function(){e.parentScroll.scrollTop=e.parentScroll.scrollTop+s,e.parentScroll.scrollTop!==t&&e._scrollTo(t,i-10)},10)}},t.prototype._setDimensions=function(){var t=this.totalHeight,i=this.el.querySelectorAll(".virtual-slot .virtual-item");if(i.length>0)for(var e=0;e<=i.length-1;e++){var s=i[e],n=s.id;this.listDimensions[n]||(this._addNewDimension(s.offsetHeight,n),this.totalHeight=this.listDimensions[this.listDimensions.length-1].end)}return this.totalHeight!=t},t.prototype._addNewDimension=function(t,i){var e=this.listDimensions.length>0?this.listDimensions[this.listDimensions.length-1].end:0;this.listDimensions.push({height:t,start:e,end:e+t,rindex:parseInt(i)})},t.prototype._testDimensions=function(){var t=this,i=this.el.querySelector(".virtual-slot").childNodes,e=this.first&&this.first.rindex>0?this.first.rindex:0;this.list.map(function(s,n){t.listDimensions[n]&&i[n-e]&&i[n-e].offsetHeight!=t.listDimensions[n].height&&console.warn("One or more nodes change height after calculation dimensions. Check scroll",n)})},t.prototype.componentDidUpdate=function(){var t=this._setDimensions();this.initRender?(t&&(this.changed=this.changed.concat([""])),this._testDimensions()):(this.initRender=!0,this.updateVirtual())},t.prototype.render=function(){return i("div",{class:"vscroll "+(this.selector.length>0?"external ":"inner ")+(this.infinateFinally?"infinate-finally":"")},i("div",{class:"vscroll-back",style:{height:this.totalHeight+"px"}}),i("div",{class:"vscroll-content "+(this.selector.length>0?"external":"inner")},i("slot",{name:"virtual"})),i("slot",{name:"loader"}))},Object.defineProperty(t,"is",{get:function(){return"virtual-scroll"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{bottomOffset:{type:Number},changed:{state:!0},clear:{method:!0},el:{elementRef:!0},list:{type:"Any",watchCallbacks:["dataDidChangeHandler"]},scrollToNode:{method:!0},selector:{type:String},setInfinateFinally:{method:!0},setInfinateOn:{method:!0},virtualRatio:{type:Number}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"events",{get:function(){return[{name:"toBottom",method:"toBottom",bubbles:!0,cancelable:!0,composed:!0},{name:"update",method:"update",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return".vscroll.inner{overflow-y:auto;height:100%}.vscroll.external{overflow-y:hidden}.vscroll{overflow-x:hidden;position:relative;display:block}.vscroll .vscroll-back{width:1px;opacity:0}.vscroll .vscroll-content{top:0;left:0;width:100%;position:absolute}.vscroll .vscroll-content.inner{height:100%}.infinate-finally div[slot=loader]{visibility:hidden}virual-scroll{height:100%;display:block}"},enumerable:!0,configurable:!0}),t}();t.VirtualScroll=s},"8xgubihx");