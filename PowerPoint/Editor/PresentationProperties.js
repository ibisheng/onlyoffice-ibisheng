var nPrColPrBW  = 0;//черно-белая печать
var nPrColPrClr = 1;//цветная печать
var nPrColPrGray = 2;//печать в оттенках серого

function CPresentationProperties() {

    this.colorsMRU = [];//последние использованные цвета в презентации
    this.printingProperties = {

        colorMode : nPrColPrClr,
        frameSlides: false,//печатаь ли рамку каждого слайда
        hiddenSlides: false,//печатаь ли скрытые слайды
        printWhat: 0, //TODO
        scaleToFitPaper : false

    };

    this.showProperties = {

        loop : false,
        showAnimation : true,
        showNarration : false,
        useTimings : false,

        browse : {
            isBrowse : false,
            showScrollBar : false
        },

        customShowLst : [],
        customShow : {},
        kiosk : {
            isKiosk : false,
            restart : 0//в милисекундах
        },

        penColor : new CRGBColor(255, 0, 0),

        presenterMode : false,
        slideAll : true,

        slideRange : {
            start: 0,
            end : 1
        }

    };

}