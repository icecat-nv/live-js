define([], function() {
  var Helper = {
    typeImage: function(prefix, protocol) {

      var typeImageConvertor = {
        "application/pdf": "pdfL.png",
        "video/x-flv": "movL.png",
        "application/ppt": "pptL.png",
        "application/doc": "docL.png",
        "video/mp4": "movL.png",
        "application/x-shockwave-flash": "flash360.png"
      };

      var suffix = "pdf.png";

      if (typeof typeImageConvertor[this] != "undefined") {
        suffix = typeImageConvertor[this];
      }

      return protocol + "//live.icecat.biz/img/" + suffix;
    },
    addHITweight: function() {
      var weightArr = { "HIT": 1, "HT": 2, "HI": 3, "IT": 4 };
      var HIT = "";
      if (typeof this.Title === "string" && this.Title !== "") {
        HIT = HIT + "H";
      }
      if (typeof this.HighPic === "string" && this.HighPic !== "") {
        HIT = HIT + "I";
      }
      if (typeof this.Value === "string" && this.Value !== "") {
        HIT = HIT + "T";
      }

      return HIT;
    },
    signUrls: function(obj) {
        var sign = '?' + 'login=' + encodeURIComponent(this.fullIcecat.login) + '&lang=' + this.fullIcecat.lang +
            '&timestamp=' + this.fullIcecat.timestamp + '&signature=' + encodeURIComponent(this.fullIcecat.signature);

        if (this.fullIcecat.ean_upc && this.fullIcecat.ean_upc !== undefined) {
          sign += '&ean_upc=' + this.fullIcecat.ean_upc;
        }
        if (this.fullIcecat.part_code
            && this.fullIcecat.brand
            && this.fullIcecat.part_code !== undefined
            && this.fullIcecat.brand !== undefined) {

          sign += '&part_code=' + encodeURIComponent(this.fullIcecat.part_code) + '&brand=' + encodeURIComponent(this.fullIcecat.brand);
        }

        if (obj.URL) {
          obj.URL += sign
        }
        if (obj.ThumbUrl) {
          obj.ThumbUrl += sign
        }
        if (obj.PreviewUrl) {
          obj.PreviewUrl += sign
        }
      return obj;
    },
    ynProcess: function ynProcess() {
      var signs = {
        "Y": "<div class=\"-icecat-yes\"></div>",
        "N": "<div class=\"-icecat-no\"></div>",
        "y": "<div class=\"-icecat-yes\"></div>",
        "n": "<div class=\"-icecat-no\"></div>",
      };

      if (this.RawValue === "Y" || this.RawValue === "y") {
        this.PresentationValue = signs[this.RawValue];
      }
      if (this.RawValue === "N" || this.RawValue === "n") {
        this.PresentationValue = signs[this.RawValue];
      }
    }
  };

  return Helper;
});
