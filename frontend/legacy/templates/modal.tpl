<div id="modal_window" class="-icecat-modal_window -icecat-none-select" style="display: none;">
    <div class="-icecat-modal_slide_wrapper" >

        <div class="-icecat-prev_button -icecat-none-select"></div>
        <div class="-icecat-next_button -icecat-none-select"></div>

        <div class="-icecat-close"></div>
        <div id="zoomWrapper" class="-icecat-full_size_img" data="0">
            <img class="" src="">
            <div class="-icecat-loader -icecat-hidden"></div>
        </div>
        <div class="-icecat-slide_content">
            <div id ="zoomPanel" class="-icecat-nav_details">
                <a id="zoomIn" data-zoom-in="{{Dictionary.zoom_panel_in}}" class="-icecat-zoomInDeactivate" href="javascript:void(0);"></a>
                <a id="zoomOut" data-zoom-out="{{Dictionary.zoom_panel_out}}" class="-icecat-zoomOutDeactivate" href="javascript:void(0);"></a>
                <a id="initialState" data-zoom-init="{{Dictionary.zoom_panel_init}}" class="-icecat-initialStateDeactivate" href="javascript:void(0);"></a>
            </div>

        </div>

        <div class="-icecat-product_wrapper light-box">
            {{#if Gallery}}
                <div class="-icecat-slide_wrapper_bar">
                    <div class="-icecat-slide_images">
                        <div class="-icecat-prevButt -icecat-prev -icecat-none-select"></div>
                        <div class="-icecat-all_imgs">
                            {{#Gallery}}
                                {{#if Flash360}}{{else}}{{#if IsVideo}}{{else}}{{#if picsBatch}}{{else}}
                                <div class="-modal-gallery-cont" data="{{@index}}"
                                    {{#each this}}
                                     data-{{@key}}="{{this}}"
                                    {{/each}}>
                                    <a href="{{#if_equals Type '360'}}#flashTab{{else}}{{#if IsVideo}}#videoTab{{else}}#{{/if}}{{/if_equals}}">
                                        <img class="-icecat-ajaxImg" id="img-thumb-{{productId}}-{{ID}}"
                                             src="{{LowPic}}">
                                    </a>
                                </div>
                                {{/if}}{{/if}}{{/if}}
                            {{/Gallery}}
                        </div>
                        <div class="-icecat-nextButt -icecat-next -icecat-none-select -next-gallery-modal"></div>
                    </div>
                </div>
            {{/if}}
        </div>

    </div>
</div>
