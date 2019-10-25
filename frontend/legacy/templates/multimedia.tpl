<div tab = "multimedia_tpl" class="-icecat-table -manuals-container">
	{{#Multimedia}}
	{{#if pdf}}
	<div class="-icecat-div_table_cell">
		<div class="-icecat-tableRow">
			<div class="-icecat-ds_label">
				<a href="{{URL}}" target="_blank"><img src="{{typeImage}}"></a>
			</div>

			<div class="-icecat-ds_data -text">
				<a href="{{URL}}" target="_blank">{{Description}}</a>
			</div>
		</div>
	</div>
	{{/if}}
	{{/Multimedia}}
</div>
