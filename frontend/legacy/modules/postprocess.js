define(['underscore', 'modules/helper'], function (_, Helper) {
    var PostProc = {};

    PostProc.multimedia = function () {
        /*
         PDF
         */
        var pdfs = [];
        var pdfsInMMO = _.where(this.Multimedia, {ContentType: 'application/pdf'});

        // https://icecat.atlassian.net/browse/BO-408
        if (!!(this.GeneralInfo.Description.ManualPDFURL)) {
            pdfs.push({
                ContentType: "application/pdf",
                Description: this.Dictionary.pdf_url,
                URL: this.GeneralInfo.Description.ManualPDFURL
            });
        }
        if (!!(this.GeneralInfo.Description.LeafletPDFURL)) {
            pdfs.push({
                ContentType: "application/pdf",
                Description: this.Dictionary.pdf_specs,
                URL: this.GeneralInfo.Description.LeafletPDFURL
            });
        }
        this.Multimedia = this.Multimedia.concat(pdfs);

        if (pdfsInMMO) {
            for (var i = 0; i < pdfsInMMO.length; i++) {
                if (!pdfsInMMO[i].Description) {
                    switch (pdfsInMMO[i].Type) {
                        case 'leaflet':
                            pdfsInMMO[i].Description = this.Dictionary.pdf_specs;
                            break;
                        case 'manual pdf':
                            pdfsInMMO[i].Description = this.Dictionary.pdf_url;
                            break;
                        default:
                            pdfsInMMO[i].Description = this.Dictionary.pdf_url;
                    }
                }
            }
        }
        /*
         PDF
         */


        /*
         Multimedia array mapping
         */
        var forGallery = [],
            tours = [],
            videos = [];

        if (this.Multimedia.length) {
            var self = this;
            _.each(this.Multimedia, function (element) {

                var protocol = (self.protocol != undefined) ? self.protocol + ':' : window.location.protocol;
                element.typeImage = Helper.typeImage.apply(element.ContentType, ["/img/", protocol]);
 
                if (self.fullIcecat) element = Helper.signUrls.call(self, element);

                if (element.IsVideo) {
                    element.defaultPreviewURL = protocol + "//live.icecat.biz/img/video_splash_mini.png";
                    forGallery.unshift(element);
                    videos.push(element);
                }

                if (element.Type == "360" && !element.IsVideo) {
                    if (!element['3DTour']) {
                        element.Flash360 = 1;
                        element.picsBatch = 0;
                    } else if (element['3DTour'] && element['3DTour'].length != 0) {
                        element.picsBatch = 1;
                        element.Flash360 = 0;
                        tours.unshift(element);
                    }
                    forGallery.push(element);
                }

                if (element.ContentType == "application/pdf") {
                    element.Description = element.Description + " (pdf)";
                    element.pdf = 1;
                }

            }, this.Multimedia);


            this.forGallery = forGallery;
            this.tours = tours;
            this.videos = videos;
            return this.Multimedia;
        }
    };


    PostProc.videos = function (data, outputSelector) {
        data.videos = [];

        _.each(data.Multimedia, function (element) {
            if(!element.IsVideo){
                return
            }
            
            element.idCont = outputSelector.slice(1) + 'currentVideo';
            if (data.fullIcecat) element = Helper.signUrls.call(data, element);

            var protocol = typeof global !== 'undefined' ? global.protocol + ':' : window.location.protocol;
            element.defaultPreviewURL = protocol + "//live.icecat.biz/img/video_splash_mini.png";
            data.videos.push(element);
        });

        return data;
    };

    PostProc.tours3d = function (data) {
        data.tours = [];

        _.each(data.Multimedia, function (element, key, list) {
            if (data.fullIcecat) element = Helper.signUrls.call(data, element);
            if(element.IsVideo){
                return
            }

            if (!element['3DTour']) {
                element.Flash360 = 1;
                element.picsBatch = 0;
            } else if (element['3DTour'] && element['3DTour'].length != 0) {
                element.picsBatch = 1;
                element.Flash360 = 0;
                data.tours.push(element);
            }

        });
        return data;
    };

    PostProc.reasonstobuy = function (data) {

        var dataToReturn = _.isString(data) ? this : data;

        if (!_.isUndefined(dataToReturn.ReasonsToBuy)) {
            dataToReturn.ReasonsToBuy = _.groupBy(dataToReturn.ReasonsToBuy, function (value, key, list) {
                return Helper.addHITweight.call(value);
            });
            _.each(dataToReturn.ReasonsToBuy.HIT, function (value, key, list) {
                if (key % 2 === 0) {
                    value.odd = "true";
                } else {
                    value.even = "true";
                }
            });
            if (dataToReturn.ReasonsToBuy.hasOwnProperty("T")) {
                delete dataToReturn.ReasonsToBuy["T"];
            }
            if (dataToReturn.ReasonsToBuy.hasOwnProperty("H")) {
                delete dataToReturn.ReasonsToBuy["H"];
            }
            if (dataToReturn.ReasonsToBuy.hasOwnProperty("I")) {
                delete dataToReturn.ReasonsToBuy["I"];
            }
            if (_.isEmpty(dataToReturn.ReasonsToBuy)) {
                dataToReturn.ReasonsToBuy = false;
            }

            if(_.isString(data)){
                dataToReturn = dataToReturn.ReasonsToBuy;
            }

            return dataToReturn;
        }
    };

    PostProc.featuresgroups = function () {
        if (!_.isUndefined(this.FeaturesGroups) && this.FeaturesGroups.length) {
            var rowsCount = 0;
            _.each(this.FeaturesGroups, function (FG, key, list) {
                if (typeof FG.Features != "undefined") {
                    _.each(FG.Features, function (Feature, key, list) {
                        Helper.ynProcess.call(Feature);
                        Feature.row = rowsCount;
                        rowsCount++;
                    });
                }
            });

            this.FeaturesGroups = _.sortBy(this.FeaturesGroups, function (FG) {
                return (parseInt(FG.SortNo, 10) * -1);
            });

            var aLeft = {};
            var aRight = {};
            var halfCount = Math.ceil(rowsCount / 2);
            if (halfCount < 2) halfCount = 2;
            for (var iterator = 0; iterator <= this.FeaturesGroups.length - 1; iterator++) {
                var featureGroupName = this.FeaturesGroups[iterator].FeatureGroup.Name.Value;
                var featureGroupOrder = this.FeaturesGroups[iterator].SortNo;
                if (typeof this.FeaturesGroups[iterator].Features != "undefined") {
                    for (var fItr = 0; fItr <= this.FeaturesGroups[iterator].Features.length - 1; fItr++) {
                        if (this.FeaturesGroups[iterator].Features[fItr].row <= halfCount) {
                            if (aLeft.hasOwnProperty(featureGroupName)) {
                                aLeft[featureGroupName].Features.push(this.FeaturesGroups[iterator].Features[fItr]);
                            } else {
                                aLeft[featureGroupName] = {
                                    FeatureGroupName: featureGroupName,
                                    Order: featureGroupOrder,
                                    Features: []
                                }
                                aLeft[featureGroupName].Features.push(this.FeaturesGroups[iterator].Features[fItr]);
                            }
                        } else {
                            if (aRight.hasOwnProperty(featureGroupName)) {
                                aRight[featureGroupName].Features.push(this.FeaturesGroups[iterator].Features[fItr]);
                            } else {
                                aRight[featureGroupName] = {
                                    FeatureGroupName: featureGroupName,
                                    Order: featureGroupOrder,
                                    Features: []
                                }
                                aRight[featureGroupName].Features.push(this.FeaturesGroups[iterator].Features[fItr]);
                            }
                        }
                    }
                }
            }

            aLeft = _.sortBy(aLeft, function (FG) {
                return (parseInt(FG.Order, 10) * -1);
            });
            aRight = _.sortBy(aRight, function (FG) {
                return (parseInt(FG.Order, 10) * -1);
            });

            this.FeaturesGroups = {
                left: aLeft,
                right: aRight
            };

            return this.FeaturesGroups;
        }
    };
    // need be fixed!
    PostProc.gallery = function () {
        var flogoHash = _.pluck(this.FeatureLogos, 'LogoPic');
        var mainImage = this.Image;
        var NotSort = [];
        var galleryLength;


        var filtredGal = _.partition(this.Gallery, function (arg1) {
            if (arg1.IsMain === "Y" && !mainImage.IsMain) {
                mainImage = arg1;
            } else {
                if (arg1.No === 0) {
                    NotSort.push(arg1);
                } else {
                    return (_.indexOf(flogoHash, arg1.Pic));
                }
            }
        });
        filtredGal[0] = _.sortBy(filtredGal[0], function (el) {
            return el.No;
        });
        filtredGal[0] = filtredGal[0].concat(NotSort);
        for (var key in mainImage) {
            if (mainImage.IsMain) {
                this.Image = mainImage;
            }
            filtredGal[0].unshift(this.Image);
            break;
        }
        this.ImgForMW = filtredGal[0].length;
        if (filtredGal[0].length) {
            filtredGal[0][0].firstImg = 1;
            filtredGal[0][filtredGal[0].length - 1].lastImg = 1;
        }
        _.each(this.forGallery, function (gal) {
            gal.ignore = true;
            filtredGal[0].unshift(gal);
        });
        this.Gallery = filtredGal[0];
        var productId = this.GeneralInfo.IcecatId;

        this.Gallery.forEach(function (element) {

            element.productId = productId;
        });
        if (!this.Image.ThumbPic && !this.Image.HighPic && !this.Image.Pic500x500 && !this.Image.HighPic) {
            this.Image = null;
            if (this.Gallery.length == 1) {
                this.Gallery = [];
            }
        }

        galleryLength = this.Gallery.length;
        while (galleryLength--) {
            if(this.Gallery[galleryLength].Flash360 === 1){
                this.Gallery.splice(galleryLength, 1)
            }
        }

        return this.Gallery;
    };

    PostProc.reviews = function () {
        if (!_.isUndefined(this.Reviews)) {
            _.each(this.Reviews, function (rev) {
                if (rev.Code == "testseek") {
                    rev.showLogo = true;
                } else {
                    rev.showLogo = false;
                }
            });
            this.Reviews = _.sortBy(this.Reviews, function (re) {
                if (re.Code == 'testseek') {
                    return -101;
                }
                return (parseInt(re.Score, 10) * -1);
            });
            return this.Reviews;
        }
    };

    return PostProc;
});