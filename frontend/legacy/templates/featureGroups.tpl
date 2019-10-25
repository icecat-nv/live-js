{{#if FeaturesGroups}}
<div class="-header">
    <span>{{Dictionary.specs}}</span>
    <a href="#IcecatLive">{{Dictionary.back_to_top}}</a>
</div>
<div tab="featureGroups_tpl" class="-icecat-table">
    <div class="-icecat-col-left">
        {{#FeaturesGroups}}
        {{#left}}
        <div class="-icecat-tableRowHead -title">
            <span title="{{FeatureGroupName}}">{{FeatureGroupName}}</span>
        </div>
        {{#Features}}
        <div class="-icecat-tableRow">
            <div class="-icecat-ds_label">
                {{#if Description}}
                <div class="-icecat-tip-anchor -icecat-tip-anchor-text"><span class="-text">{{Feature.Name.Value}}</span></div>
                <div class="-icecat-tooltip-containeer"><div>{{{Description}}}</div></div>
                {{else}}
                <span class="-text">{{Feature.Name.Value}}</span>
                {{/if}}

            </div>
            <div class="-icecat-ds_data -text"> {{{PresentationValue}}} </div>
        </div>
        {{/Features}}
        {{/left}}
        {{/FeaturesGroups}}
    </div>

    <div class="-icecat-col-right">
        {{#FeaturesGroups}}
        {{#right}}
        <div class="-icecat-tableRowHead -title">
            <span title="{{FeatureGroupName}}">{{FeatureGroupName}}</span>
        </div>
        {{#Features}}
        <div class="-icecat-tableRow">
            <div class="-icecat-ds_label">
                {{#if Description}}
                <div class="-icecat-tip-anchor -icecat-tip-anchor-text"><span
                            class="-text">{{Feature.Name.Value}}</span></div>
                <div class="-icecat-tooltip-containeer"><div>{{{Description}}}</div></div>
                {{else}}
                <span class="-text">{{Feature.Name.Value}}</span>
                {{/if}}

            </div>
            <div class="-icecat-ds_data -text"> {{{PresentationValue}}} </div>
        </div>
        {{/Features}}
        {{/right}}
        {{/FeaturesGroups}}
    </div>
</div>
{{/if}}

