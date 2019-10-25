{{#if DemoAccount}}
<b>{{Dictionary.demo_msg_part1}} ("{{shopname}}"= {{Dictionary.demo_msg_part2}} ). <a href="https://icecat.biz/registration/">{{Dictionary.demo_msg_part3}}</a></b>
{{/if}}

{{#if fullIcecat}}
<input type="hidden" id="liveIcecatFull"
	   data-timestamp="{{{fullIcecat.timestamp}}}"
	   data-signature="{{{fullIcecat.signature}}}"
	   data-login="{{{fullIcecat.login}}}"
	   data-lang="{{{fullIcecat.lang}}}"
	   data-brand="{{{fullIcecat.brand}}}"
	   data-part-code="{{{fullIcecat.part_code}}}"
	   data-ean-upc="{{{fullIcecat.ean_upc}}}"
>
{{/if}}

<div class="-bp-container">
    <img>
	<span>{{GeneralInfo.Title}}</span>
</div>
<div class="-icecat-product_wrapper">
	<div id="tooltip-containeer">
		<div id="tooltip-top">
			<div class="-icecat-left"></div>
			<div class="-icecat-center"></div>
			<div class="-icecat-right"></div>
		</div>
		<div id="tooltip-left-border">
			<div id="tooltip-right-border">
				<div id="content"></div>
			</div>
		</div>
		<div id="tooltip-bottom">
			<div class="-icecat-left"></div>
			<div class="-icecat-center"></div>
			<div class="-icecat-right"></div>
		</div>
	</div>
	<div class="-icecat-left_side">
		<div id="liveMainImage" class="-icecat-product_img {{#if Image}}-icecat-ajax-loader{{else}}-icecat-no-image{{/if}}">
			{{#if Image.IsMain}}
			{{#if Image.Pic500x500}}
			<img id="img-medium-{{GeneralInfo.IcecatId}}-{{Image.ID}}" class="-icecat-ajaxImg" src="">
			{{else if Image.LowPic}}
			<img id="img-low-{{GeneralInfo.IcecatId}}-{{Image.ID}}" class="-icecat-ajaxImg" src="">
			{{else if Image.HighPic}}
			<img id="img-high-{{GeneralInfo.IcecatId}}-{{Image.ID}}" class="-icecat-ajaxImg" src="">
			{{/if}}
			{{else}}
			{{#if Image.Pic500x500}}
			<img id="img-medium-{{GeneralInfo.IcecatId}}" class="-icecat-ajaxImg" src="">
			{{else if Image.LowPic}}
			<img id="img-low-{{GeneralInfo.IcecatId}}" class="-icecat-ajaxImg" src="">
			{{else if Image.HighPic}}
			<img id="img-high-{{GeneralInfo.IcecatId}}" class="-icecat-ajaxImg" src="">
			{{/if}}
			{{/if}}
		</div>
	</div>
	<div class="-icecat-right_side">
		{{#if Gallery}}
		<div class="-icecat-slide_wrapper_bar">
			<div class="-icecat-slide_images">
				<div class="-icecat-prevButt -icecat-prev -icecat-none-select"></div>
				<div class="-icecat-all_imgs">
					{{#Gallery}}
					<div class="-icecat-mini_img" data="{{@index}}"
							{{#each this}}
						 data-{{@key}}="{{this}}"
							{{/each}}>
                        <a href="{{#if_equals Type '360'}}#flashTab{{else}}{{#if IsVideo}}#videoTab{{else}}#{{/if}}{{/if_equals}}" class="{{#if_equals Type '360'}}-icecat-flash360{{/if_equals}}{{#if IsVideo}}-icecat-video{{/if}}">
							<img id="img-thumb-{{productId}}-{{ID}}"
								 class="{{#if Flash360}}{{else}}{{#if IsVideo}}{{else}}-icecat-ajaxImg{{/if}}{{/if}}"
								 src="{{#if Flash360}}{{PreviewURL}}{{/if}}{{#if picsBatch}}{{3DTour.0.Link400}}{{/if}}{{#if IsVideo}}{{#if PreviewUrl}}{{PreviewUrl}}{{else}}{{defaultPreviewURL}}{{/if}}{{/if}}">
						</a>
					</div>
					{{/Gallery}}
				</div>
				<div class="-icecat-nextButt -icecat-next -icecat-none-select"></div>
			</div>
		</div>
		{{/if}}
		{{#if FeatureLogos}}
		<div class="-icecat-download_bar">
			{{#FeatureLogos}}
			<div class="-icecat-feature-logo">
				{{#if Description}}
				<div class="-icecat-tip-anchor">
					<div><img src="{{LogoPic}}"></div>
				</div>
				<div class="-icecat-tooltip-containeer"><div>{{{Description.Value}}}</div></div>
				{{else}}
				<div><img src="{{LogoPic}}"></div>
				{{/if}}
			</div>
			{{/FeatureLogos}}
		</div>
		{{/if}}
	</div>

</div>
	<div class="-essential-container">
		<div class="-icecat-info">
			{{#if GeneralInfo.Brand}}
			<div class="-icecat-info_product">
				<span class="-title">{{Dictionary.supplier_name}}:</span>
				<span class="-text">{{GeneralInfo.Brand}}</span>
			</div>
			{{/if}}
			{{#if GeneralInfo.ProductFamily.Value}}
			<div class="-icecat-info_product">
				<span class="-title">{{Dictionary.product_family}}:</span>
				<span class="-text">{{GeneralInfo.ProductFamily.Value}}</span>
			</div>
			{{/if}}
			{{#if GeneralInfo.ProductSeries.Value}}
			<div class="-icecat-info_product">
				<span class="-title">{{Dictionary.product_series}}:</span>
				<span class="-text">{{GeneralInfo.ProductSeries.Value}}</span>
			</div>
			{{/if}}
			{{#if GeneralInfo.ProductName}}
			<div class="-icecat-info_product">
				<span class="-title">{{Dictionary.model_name}}:</span>
				<span class="-text">{{GeneralInfo.ProductName}}</span>
			</div>
			{{/if}}
		</div>
		<div class="-icecat-info">
			{{#if GeneralInfo.BrandPartCode}}
			<div class="-icecat-info_product">
				<span class="-title">{{Dictionary.prod_code}}:</span>
				<span class="-text">{{GeneralInfo.BrandPartCode}}</span>
			</div>
			{{/if}}
			{{#if GeneralInfo.GTIN}}
			<div class="-icecat-info_product -icecat-ean">
				<span class="-title">{{Dictionary.ean_code}}:</span>
				<span class="-text">
						{{#ean GeneralInfo.GTIN}}
					{{this}}
					{{/ean}}
					</span>
			</div>
			{{/if}}
		</div>
	</div>

	<div class="-icecat-text">
		<p>
			{{{GeneralInfo.Description.LongDesc}}}
		</p>
	</div>

