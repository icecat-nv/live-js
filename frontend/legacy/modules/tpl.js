define([
    'underscore',
    'handlebars',
    '../templates/featureGroups.tpl',
    '../templates/mandatory.tpl',
    '../templates/multimedia.tpl',
    '../templates/featurelogos.tpl',
    '../templates/reasonsToBuy.tpl',
    '../templates/reviews.tpl',
    '../templates/modal.tpl',
    '../templates/tabsHead.tpl',
    '../templates/tours.tpl',
    '../templates/video.tpl'
], function (_, Handlebars, featureGroups, mandatory, multimedia, featurelogos, reasonsToBuy, reviews, modal, tabsHead, tours, video) {

    var autoRender = [
        {
            name: "mandatory",
            tpl: Handlebars.compile(mandatory),
            order: 0
        },
        {
            name: "multimedia",
            tpl: Handlebars.compile(multimedia),
            order: 10
        },
        {
            name: "reasonstobuy",
            tpl: Handlebars.compile(reasonsToBuy),
            order: 20
        },
        {
            name: "tours",
            tpl: Handlebars.compile(tours),
            order: 30
        },
        {
            name: "video",
            tpl: Handlebars.compile(video),
            order: 40
        },
        {
            name: "featureGroups",
            tpl: Handlebars.compile(featureGroups),
            order: 50
        },

        {
            name: "reviews",
            tpl: Handlebars.compile(reviews),
            order: 60
        },
        {
            name: "modal",
            tpl: Handlebars.compile(modal),
            order: 70
        }
    ];

    Handlebars.registerHelper("debug", function (level, optionalValue) {
        console.log("Current Context");
        console.log("====================");
        console.dir(this, {depth: level});

        if (optionalValue) {
            console.log("Value");
            console.log("====================");
            console.dir(optionalValue, {depth: level});
        }
    });

    Handlebars.registerHelper('console', function(object, options) {
        console.log('===================================');
        console.log(object);
        console.log('===================================');
    });

    Handlebars.registerHelper('toSafe', function(string, options) {
        if (string) {
            var string = Handlebars.escapeExpression(string);
            var safeString = (new Handlebars.SafeString(string)).string;
            console.log('safe string is ', safeString);
            return safeString;
        } else return '';
    });

    Handlebars.registerHelper('ean', function(context, options) {
        var eanStr = options.fn(context);
        eanStr = eanStr.trim();
        var eanArr = eanStr.split(',');
        if (eanArr.length > 1) {
            eanArr[0] = "<span>" + eanArr[0] + "<a class='-icecat-more-ean' href></a></span>";
            eanArr[1] = "<br>" + eanArr[1];
            eanStr = eanArr.join(", ");
            // above will remove first comma
            eanStr = eanStr.replace(',', ' ');
        }
        return eanStr;
    });

    Handlebars.registerHelper('detectRTBImage', function(context, options) {
        var type = context;
        if (type == 'FeatureLogo') {
            this.isOrigin = true;
        }
        return options.fn(this);
    });

    Handlebars.registerHelper('category', function(context, options) {
        var mainCat = context.Category.Name.Value;
        var virtCat = context.VirtualCategory;

        this.main = mainCat;

        if (virtCat) {
            var virtCatArr = [];
            for (var i = 0; i < virtCat.length; i++) {
                var thisValue = virtCat[i].Value;
                thisValue = thisValue.trim();
                virtCatArr.push(thisValue);
            }

            mainCat = "<span>" + mainCat + "<a class='-icecat-more-category' href></a></span>";
            mainCat = "<span class='-icecat-hoverable' title='click to toggle list view'>" + mainCat + "</span>";
            virtCatArr[0] = "<br>" + virtCatArr[0];
            virtCatArr.unshift(mainCat);
            var catStr = virtCatArr.join(", ");
            // above will remove first comma
            catStr = catStr.replace(',', ' ');
            this.virtual = virtCatArr;
            return catStr;
        }
        return options.fn(this);
    });

    Handlebars.registerHelper('if_equals', function(key, value, options) {
        // Helper of comparison
        if (key === value){
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    Handlebars.registerHelper('count', function(context, options) {
        // Helper for counting multimedia objects: videos, 3DTours and pdfs

        // Make every key false to prevent cached keys
        this.one = false;
        this.two = false;
        this.three = false;
        this.more = false;

        // Then assign value to the root object
        switch (context.length) {
            case 1:
                this.one = true;
                break;
            case 2:
                this.two = true;
                break;
            case 3:
                this.three = true;
                break;
            default:
                this.more = true;
        }
        return options.fn(this);
    });

    Handlebars.registerHelper('countItemsForSlider', function(arr) {
        var quentityItems = 3;

        if(arr.length === 2){
            quentityItems = 2;
        } else if(arr.length === 1){
            quentityItems = 0;
        }

        return quentityItems
    });

    Handlebars.registerHelper('toJson', function(obj) {
        // this helper was used for formatting data, and inserting it to the
        // 'data' attribute
        return JSON.stringify(obj);
    });

    return {
        featureGroups: Handlebars.compile(featureGroups),
        mandatory: Handlebars.compile(mandatory),
        multimedia: Handlebars.compile(multimedia),
        featurelogos: Handlebars.compile(featurelogos),
        reasonstobuy: Handlebars.compile(reasonsToBuy),
        reviews: Handlebars.compile(reviews),
        modal: Handlebars.compile(modal),
        tabsHead: Handlebars.compile(tabsHead),
        tours3d: Handlebars.compile(tours),
        videos: Handlebars.compile(video),
        autoRender: _.sortBy(autoRender, "order")
    };
});