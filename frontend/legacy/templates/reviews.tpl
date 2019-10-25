{{#if Reviews}}
<div class="-header">
	<span>{{Dictionary.reviews_head_name}}</span>
	<a href="#IcecatLive">{{Dictionary.back_to_top}}</a>
</div>

<div  tab = "reviews_tpl"  class="-icecat-table -icecat-review">
	<div class="-icecat-tableRow">
		{{#Reviews}}
		<div class="-icecat-div_table_cell">
			<div class="-icecat-left">
				{{#if showLogo}}
				<img src="{{LogoPic}}">
				{{else}}
				{{Code}}
				{{/if}}
			</div>
			<div class="-icecat-center">
				{{{Value}}}
			</div>
			<div class="-icecat-right">
				<div class="-icecat-reviews-score-cell">
					<span class="-icecat-result">
						{{Score}}%
					</span>
				</div>
			</div>
		</div>
		{{/Reviews}}
	</div>
</div>

{{/if}}

<div class="-icecat-tabs_footer">
	<a href="#IcecatLive">{{Dictionary.back_to_top}}</a>
</div>
