/** @define {boolean} */
var ASC_DOCS_API_USE_OPEN_SOURCE_FONTS_ONLY = false;

(function(document){

	var ImageLoadStatus = {
		Loading : 0,
		Complete : 1
	}

	function CImageLoad(src) {
		this.src = src;
		this.Image = null;
		this.Status = ImageLoadStatus.Complete;
	}
    	
    function CGlobalImageLoader() {
        this.map_image_index = {};
        this.imagesPath = "";

        // loading
        this.Api = null;
        this.ThemeLoader = null;
        this.images_loading = null;

        this.bIsLoadDocumentFirst = false;

        this.bIsAsyncLoadDocumentImages = false;

        this.put_Api = function(_api) {
            this.Api = _api;

            /*if (this.Api.IsAsyncOpenDocumentImages !== undefined)
            {
                this.bIsAsyncLoadDocumentImages = this.Api.IsAsyncOpenDocumentImages();
                if (this.bIsAsyncLoadDocumentImages)
                {
                    if (undefined === this.Api.asyncImageEndLoadedBackground)
                        this.bIsAsyncLoadDocumentImages = false;
                }
            }*/
        }
        
        this.LoadDocumentImages = function(_images, isUrl) {
            // сначала заполним массив
            if (this.ThemeLoader == null)
                this.Api.asyncImagesDocumentStartLoaded();
            else
                this.ThemeLoader.asyncImagesStartLoaded();

            this.images_loading = [];

            for (var id in _images)
            {
                /*
                if (isUrl === false)
                    this.images_loading[this.images_loading.length] = _images[id];
                else
                    this.images_loading[this.images_loading.length] = _getFullImageSrc(_images[id]);
                */
                this.images_loading[this.images_loading.length] = _getFullImageSrc(_images[id]);
            }

            if (!this.bIsAsyncLoadDocumentImages)
            {
                this._LoadImages();
            }
            else
            {
                var _len = this.images_loading.length;
                for (var i = 0; i < _len; i++)
                {
                    this.LoadImageAsync(i);
                }

                this.images_loading.splice(0, _len);

                if (this.ThemeLoader == null)
                    this.Api.asyncImagesDocumentEndLoaded();
                else
                    this.ThemeLoader.asyncImagesEndLoaded();
            }
        }

        var oThis = this;
        this._LoadImages = function() {
            if (0 == this.images_loading.length)
            {
                if (this.ThemeLoader == null)
                    this.Api.asyncImagesDocumentEndLoaded();
                else
                    this.ThemeLoader.asyncImagesEndLoaded();

                return;
            }

            var _id = this.images_loading[0];
            var oImage = new CImageLoad(_id);
            oImage.Status = ImageLoadStatus.Loading;
            oImage.Image = new Image();
            oThis.map_image_index[oImage.src] = oImage;
            oImage.Image.onload = function(){
                oImage.Status = ImageLoadStatus.Complete;

                if (oThis.bIsLoadDocumentFirst === true)
                {
                    oThis.Api.OpenDocumentProgress.CurrentImage++;
                    oThis.Api.SendOpenProgress();
                }

                oThis.images_loading.shift();
                oThis._LoadImages();
            }
            oImage.Image.onerror = function(){
                oImage.Status = ImageLoadStatus.Complete;
                oImage.Image = null;

                if (oThis.bIsLoadDocumentFirst === true)
                {
                    oThis.Api.OpenDocumentProgress.CurrentImage++;
                    oThis.Api.SendOpenProgress();
                }

                oThis.images_loading.shift();
                oThis._LoadImages();
            }
            //oImage.Image.crossOrigin = 'anonymous';
            oImage.Image.src = oImage.src;
        }

        this.LoadImage = function(src, Type) {
            var _image = this.map_image_index[src];
            if (undefined != _image)
                return _image;

            this.Api.asyncImageStartLoaded();

            var oImage = new CImageLoad(src);
            oImage.Type = Type;
            oImage.Image = new Image();
            oImage.Status = ImageLoadStatus.Loading;
            oThis.map_image_index[oImage.src] = oImage;

            oImage.Image.onload = function(){
                oImage.Status = ImageLoadStatus.Complete;
                oThis.Api.asyncImageEndLoaded(oImage);
            }
            oImage.Image.onerror = function(){
                oImage.Image = null;
                oImage.Status = ImageLoadStatus.Complete;
                oThis.Api.asyncImageEndLoaded(oImage);
            }
            //oImage.Image.crossOrigin = 'anonymous';
            oImage.Image.src = oImage.src;
            return null;
        }

        this.LoadImageAsync = function(i) {
            var _id = oThis.images_loading[i];
            var oImage = new CImageLoad(_id);
            oImage.Status = ImageLoadStatus.Loading;
            oImage.Image = new Image();
            oThis.map_image_index[oImage.src] = oImage;
            oImage.Image.onload = function(){
                oImage.Status = ImageLoadStatus.Complete;
                oThis.Api.asyncImageEndLoadedBackground(oImage);
            }
            oImage.Image.onerror = function(){
                oImage.Status = ImageLoadStatus.Complete;
                oImage.Image = null;
                oThis.Api.asyncImageEndLoadedBackground(oImage);
            }
            //oImage.Image.crossOrigin = 'anonymous';
            oImage.Image.src = oImage.src;
        }
    }
		
    // exports    
    window.g_image_loader   = new CGlobalImageLoader();

})(window.document);