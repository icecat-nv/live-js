{{#if ReasonsToBuy}}
<div class="-header">
	<span>{{Dictionary.reasons_to_buy}}</span>
	{{#unless separateCall}}
		<a href="#IcecatLive">{{Dictionary.back_to_top}}</a>
	{{/unless}}
</div>

{{#each ReasonsToBuy.HIT}}
<div tab = "reasonsToBuy_tpl" class="-icecat-rtb_wrapper {{#odd}}-icecat-rtb_l{{/odd}}{{#even}}-icecat-rtb_n{{/even}}">
	<div class="clearfix">
		<div class="-icecat-rtb_img_wrapper clearfix">
			<div class="-icecat-rtb_img">
				{{#detectRTBImage Origin}}
				{{#if this.isOrigin}}
				<img id="bullet-{{ReasonToBuyID}}" src="{{HighPic}}" onerror="this.src='http://live.icecat.biz/img/noimage_back.png'">
				{{else}}
				<img id="bullet-{{ReasonToBuyID}}" class="-icecat-ajaxImg" src="" onerror="this.src='http://live.icecat.biz/img/noimage_back.png'">
				{{/if}}
				{{/detectRTBImage}}
			</div>
		</div>
		<div class="-title">
			<p>
				{{Title}}
			</p>
		</div>
		<div class="-text">
			<p>
				{{{Value}}}
			</p>
		</div>
	</div>
</div>
{{/each}}

{{#each ReasonsToBuy.HT}}
<div tab = "reasonsToBuy_tpl"  class="-icecat-rtb_wrapper clearfix">
	<div class="clearfix">
		<div class="-title clearfix">
			<p>
				{{Title}}
			</p>
		</div>
		<div class="-text clearfix">
			<p>
				{{{Value}}}
			</p>
		</div>
	</div>
</div>
{{/each}}

{{#each ReasonsToBuy.HI}}
<div tab = "reasonsToBuy_tpl"  class="-icecat-rtb_table clearfix">
	{{/each}}

	{{#each ReasonsToBuy.HI}}
	<div class="-icecat-rtb_table_row clearfix">
		<div class="-icecat-rtb_wrapper -icecat-rtb_table_cell clearfix">
			<div class="clearfix">
				<div class="-title clearfix">
					<p>
						{{Title}}
					</p>
				</div>
				<div class="-icecat-rtb_img clearfix">
					{{#detectRTBImage Origin}}
					{{#if isOrigin}}
					<img id="bullet-{{ReasonToBuyID}}" src="{{HighPic}}" onerror="this.src='http://live.icecat.biz/img/noimage_back.png'">
					{{else}}
					<img id="bullet-{{ReasonToBuyID}}" class="-icecat-ajaxImg clearfix" src="" onerror="this.src='http://live.icecat.biz/img/noimage_back.png'">
					{{/if}}
					{{/detectRTBImage}}
				</div>
			</div>
		</div>
	</div>
	{{/each}}

	{{#each ReasonsToBuy.HI}}
</div>
{{/each}}
{{/if}}
