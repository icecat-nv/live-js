{{#if videos}}
    <section id="video-section">
        {{#if Dictionary}}
            <div id="videoTab" class="-header">
                <span>{{Dictionary.video}}</span>
                <a href="#IcecatLive">{{Dictionary.back_to_top}}</a>
            </div>
        {{/if}}

        <div class="content-wrapper">
            {{#each videos}}
                {{#if @first}}
                    <div data-link="{{URL}}" data-src="{{PreviewUrl}}" id="currentVideoWrapper">
                        <div id="{{idCont}}"></div>
                    </div>
                {{/if}}
            {{/each}}


            {{#count videos}}
                {{#if one}}
                {{else}}
                    <div class="video-previews-wrapper">
                        <ul class="slick-previews video-previews slick-slider"
                            data-slick='{"slidesToShow": {{countItemsForSlider videos}}, "slidesToScroll": 1}'>
                            {{#each videos}}
                                <li class="slick-preview video-preview" title="{{Description}}"
                                    data-link="{{URL}}" data-src="{{PreviewUrl}}"
                                    style="background-image: url({{PreviewUrl}})">
                                </li>
                            {{/each}}
                        </ul>
                    </div>
                {{/if}}
            {{/count}}
        </div>
    </section>
{{/if}}

