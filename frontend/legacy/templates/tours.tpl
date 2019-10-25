{{#if tours}}
    <section id="tours-section">
        {{#if Dictionary}}
            <div id="flashTab" class="-header">
                <span>{{Dictionary.flash360}}</span>
                <a href="#IcecatLive">{{Dictionary.back_to_top}}</a>
            </div>
        {{/if}}
        
        <div class="content-wrapper">

            {{!-- form the current (main) tour. --}}
            {{#each tours}}
                {{#if @first}}
                    <div class="current-tour-wrapper">
                        {{#if Flash360}}
                            <div id="tour-current" class="tour-row">
                                <object data="{{URL}}" type="application/x-shockwave-flash" class="tour-item flash">
                                    <param name="allowFullScreen" value="true"/>
                                    <param name="wmode" value="direct"/>
                                    <param name="allowScriptAccess" value="always"/>
                                    <param name="scale" value="exactfit"/>
                                    <param name="menu" value="false"/>
                                    <param name="movie" value="{{URL}}"/>
                                </object>
                            </div>
                        {{/if}}
                        {{#if picsBatch}}
                            <div id="tour-current" class="tour-row">
                                <div class="tour-item" data-picsbatch="{{toJson 3DTour}}"></div>
                            </div>
                        {{/if}}
                    </div>
                {{/if}}
            {{/each}}

            {{!-- form the slider of the previews --}}
            {{#count tours}}
                {{#if one}}
                {{else}}
                    <ul class="slick-previews tours-previews slick-slider"
                        data-slick='{"slidesToShow": {{countItemsForSlider tours}}, "slidesToScroll": 1}'>
                        {{#each tours}}
                            <li class="slick-preview tour-preview"
                                title="{{Description}}"
                                data-id="{{ID}}"
                                data-slick-index="{{@index}}"
                                style="background-image: url({{#if PreviewURL}}{{PreviewURL}}{{else}}{{3DTour.0.Link400}}{{/if}})">
                                {{#if Flash360}}
                                    <object data="{{URL}}" id="{{ID}}" hidden type="application/x-shockwave-flash"
                                            class="tour-item flash">
                                        <param name="allowFullScreen" value="true"/>
                                        <param name="wmode" value="direct"/>
                                        <param name="allowScriptAccess" value="always"/>
                                        <param name="scale" value="default"/>
                                        <param name="menu" value="false"/>
                                        <param name="movie" value="{{URL}}"/>
                                    </object>
                                {{/if}}
                                {{#if picsBatch}}
                                    <div class="tour-item" hidden id="{{ID}}" data-picsbatch="{{toJson 3DTour}}"></div>
                                {{/if}}
                            </li>
                        {{/each}}
                    </ul>
                {{/if}}
            {{/count}}
        </div>
    </section>
{{/if}}

