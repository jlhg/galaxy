define(["utils/utils","mvc/ui/ui-buttons"],function(a,b){var c=Backbone.View.extend({initialize:function(b){var c=this;this.data=[],this.data2=[],this.model=b&&b.model||new Backbone.Model({id:a.uid(),cls:"ui-select",error_text:"No options available",empty_text:"Nothing selected",visible:!0,wait:!1,multiple:!1,searchable:!0,optional:!1,disabled:!1,onchange:function(){},value:null,selectall:!0,pagesize:20}).set(b),this.on("change",function(){c.model.get("onchange")&&c.model.get("onchange")(c.value())}),this.listenTo(this.model,"change:data",this._changeData,this),this.listenTo(this.model,"change:disabled",this._changeDisabled,this),this.listenTo(this.model,"change:wait",this._changeWait,this),this.listenTo(this.model,"change:visible",this._changeVisible,this),this.listenTo(this.model,"change:value",this._changeValue,this),this.listenTo(this.model,"change:multiple change:searchable change:cls change:id",this.render,this),this.render()},render:function(){var a=this;this.model.get("searchable")?this._renderSearchable():this._renderClassic(),this.$el.addClass(this.model.get("cls")).attr("id",this.model.get("id")),this.$select.empty().addClass("select").attr("id",this.model.get("id")+"_select").prop("multiple",this.model.get("multiple")).on("change",function(){a.value(a._getValue()),a.trigger("change")}),this._changeData(),this._changeWait(),this._changeVisible(),this._changeDisabled()},_renderClassic:function(){var a=this;this.$el.addClass(this.model.get("multiple")?"ui-select-multiple":"ui-select").append(this.$select=$("<select/>")).append(this.$dropdown=$("<div/>")).append(this.$resize=$("<div/>").append(this.$resize_icon=$("<i/>"))),this.model.get("multiple")?(this.$dropdown.hide(),this.$resize_icon.addClass("fa fa-angle-double-right fa-rotate-45").show(),this.$resize.removeClass().addClass("icon-resize").show().off("mousedown").on("mousedown",function(b){var c=b.pageY,d=a.$select.height();a.minHeight=a.minHeight||d,$("#dd-helper").show().on("mousemove",function(b){a.$select.height(Math.max(d+(b.pageY-c),a.minHeight))}).on("mouseup mouseleave",function(){$("#dd-helper").hide().off()})})):(this.$dropdown.show(),this.$resize.hide(),this.$resize_icon.hide())},_renderSearchable:function(){var a=this;this.$el.append(this.$select=$("<div/>")).append(this.$dropdown=$("<div/>")),this.$dropdown.hide(),this.model.get("multiple")||this.$dropdown.show().on("click",function(){a.$select.select2&&a.$select.select2("open")}),this.all_button=null,this.model.get("multiple")&&this.model.get("selectall")&&(this.all_button=new b.ButtonCheck({onclick:function(){var b=[];0!==a.all_button.value()&&_.each(a.model.get("data"),function(a){b.push(a.value)}),a.value(b),a.trigger("change")}}),this.$el.prepend(this.all_button.$el))},_match:function(a,b){return!a||""==a||String(b).toUpperCase().indexOf(a.toUpperCase())>=0},_changeData:function(){var a=this;this.data=[],!this.model.get("multiple")&&this.model.get("optional")&&this.data.push({value:"__null__",label:a.model.get("empty_text")}),_.each(this.model.get("data"),function(b){a.data.push(b)}),0==this.length()&&this.data.push({value:"__null__",label:this.model.get("error_text")}),this.model.get("searchable")?(this.data2=[],_.each(this.data,function(b,c){a.data2.push({order:c,id:b.value,text:b.label,tags:b.tags})}),this.$select.data("select2")&&this.$select.select2("destroy"),this.$select.select2({data:a.data2,closeOnSelect:!this.model.get("multiple"),multiple:this.model.get("multiple"),query:function(b){var c=a.model.get("pagesize"),d=_.filter(a.data2,function(c){var d=!1;return _.each(c.tags,function(c){d=d||a._match(b.term,c)}),d||a._match(b.term,c.text)});b.callback({results:d.slice((b.page-1)*c,b.page*c),more:d.length>=b.page*c})}}),this.$(".select2-container .select2-search input").off("blur")):(this.$select.find("option").remove(),_.each(this.data,function(b){a.$select.append($("<option/>").attr("value",b.value).html(_.escape(b.label)))})),this.model.set("disabled",0==this.length()),this._changeValue()},_changeDisabled:function(){this.model.get("searchable")?this.$select.select2(this.model.get("disabled")?"disable":"enable"):this.$select.prop("disabled",this.model.get("disabled"))},_changeWait:function(){this.$dropdown.removeClass().addClass("icon-dropdown fa").addClass(this.model.get("wait")?"fa-spinner fa-spin":"fa-caret-down")},_changeVisible:function(){this.$el[this.model.get("visible")?"show":"hide"](),this.$select[this.model.get("visible")?"show":"hide"]()},_changeValue:function(){if(this._setValue(this.model.get("value")),this.model.get("multiple")){if(this.all_button){var a=this._getValue();this.all_button.value($.isArray(a)?a.length:0,this.length())}}else null!==this._getValue()||this.model.get("optional")||this._setValue(this.first())},value:function(a){return void 0!==a&&this.model.set("value",a),this._getValue()},first:function(){return this.data.length>0?this.data[0].value:null},exists:function(a){return _.findWhere(this.data,{value:a})},text:function(){var a=this._getValue(),b=this.exists($.isArray(a)?a[0]:a);return b?b.label:""},show:function(){this.model.set("visible",!0)},hide:function(){this.model.set("visible",!1)},wait:function(){this.model.set("wait",!0)},unwait:function(){this.model.set("wait",!1)},disabled:function(){return this.model.get("disabled")},enable:function(){this.model.set("disabled",!1)},disable:function(){this.model.set("disabled",!0)},add:function(a,b){_.each(this.model.get("data"),function(b){b.keep&&!_.findWhere(a,{value:b.value})&&a.push(b)}),b&&a&&a.sort(b),this.model.set("data",a)},update:function(a){this.model.set("data",a)},setOnChange:function(a){this.model.set("onchange",a)},length:function(){return $.isArray(this.model.get("data"))?this.model.get("data").length:0},_setValue:function(a){var b=this;if((null===a||void 0===a)&&(a="__null__"),this.model.get("multiple")?a=$.isArray(a)?a:[a]:$.isArray(a)&&(a=a.length>0?a[0]:"__null__"),this.model.get("searchable")){if($.isArray(a))val=[],_.each(a,function(a){var c=_.findWhere(b.data2,{id:a});c&&val.push(c)}),a=val;else{var c=_.findWhere(this.data2,{id:a});a=c}this.$select.select2("data",a)}else this.$select.val(a)},_getValue:function(){var b=null;if(this.model.get("searchable")){var c=this.$select.select2("data");c&&($.isArray(c)?(b=[],c.sort(function(a,b){return a.order-b.order}),_.each(c,function(a){b.push(a.id)})):b=c.id)}else b=this.$select.val();return a.isEmpty(b)?null:b}});return{View:c}});
//# sourceMappingURL=../../../maps/mvc/ui/ui-select-default.js.map