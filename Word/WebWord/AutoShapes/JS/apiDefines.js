var linerule_AtLeast = 0;
var linerule_Auto    = 1;
var linerule_Exact   = 2;
var c_oAscZoomType = {
	Current :0,		
	FitWidth:1,
	FitPage :2
}

var c_oAscAsyncActionType = {
    Information : 0,
    BlockInteraction : 1
}

var c_oAscAsyncAction = {
	Open:0, // �������� ���������
	Save:1,
	LoadDocumentFonts:2, // ��������� ����� ��������� (����� ����� ��������)
    LoadDocumentImages:3, // ��������� �������� ��������� (����� ����� �������� �������)
    LoadFont:4, // ��������� ������� ������
    LoadImage:5, // ��������� ��������
	DownloadAs:6,
	Print:7,//����������� � PDF � ���������� � ������������
	UploadImage:8
}
//files type for Saving & DownloadAs
var c_oAscFileType = {
		INNER:-1,
		DOCX:0,
		DOC:1,
		ODT:2,
		RTF:3,
		TXT:4,
		HTML_ZIP:5,
		MHT:6,
		PDF:7,
		EPUB:8,
		FB2:9,
		MOBI:10
	}

// Right = 0; Left = 1; Center = 2; Justify = 3;
var c_oAscAlignType = {
		RIGHT:0,
		LEFT:1,
		CENTER:2,
		JUSTIFY:3,
		TOP:4,
		MIDDLE:5,
		BOTTOM:6
	}

// image wrap style
var c_oAscWrapStyle = {
	Inline:0,
	Flow : 1
}
	
	/*Error level & ID*/
var c_oAscError = {
		Level: {
			Critical:-1,
			NoCritical:0
		},
		ID : {
			ServerSaveComplete: 	3,
			ConvertationProgress: 	2,
			DownloadProgress: 		1,
			No: 					0,
			Unknown: 			 	-1,
			ConvertationTimeout: 	-2,
			ConvertationError: 		-3,
			DownloadError: 			-4,
			UnexpectedGuid: 		-5,
			Database: 				-6,
			FileRequest: 			-7,
			FileVKey: 				-8,
			UplImageSize: 			-9,
			UplImageExt: 			-10,
			UplImageFileCount: 		-11,
			NoSupportClipdoard:		-12
		}
	}
var c_oAscTypeSelectElement = {
	Paragraph: 0,
	Table:1,
	Image:2,
	Header:3,
	Shape:4
}	

var c_oAscTableBordersType = {
	LEFT:0,
	TOP:1,
	RIGHT:2,
	BOTTOM:3,
	VERTLINE:4,
	HORIZONTLINE:5,
	INSIDE:6,
	OUTSIDE:7,
	ALL:8
}
var c_oAscImageUploadProp = {//�� ��� �������� ��������� �������� ���������� � ����� �� ��������(�������� ie9), ����� ��������� ����� ���� �������� ����������� ��������� � cwFileUploader.ashx
	MaxFileSize:25000000, //25 mb
	SupportedFormats:[ "jpg", "jpeg", "jpe", "png", "gif", "bmp"]
}
var FONT_THUMBNAIL_HEIGHT = parseInt(7 * 96.0 / 25.4);

var c_oAscStyleImage = {
    Default :0,
    Document:1
}

var c_oAscLineDrawingRule =
{
    Left   : 0,
    Center : 1,
    Right  : 2,
    Top    : 0,
    Bottom : 2
}

var align_Right   = 0;
var align_Left    = 1;
var align_Center  = 2;
var align_Justify = 3;

var vertalign_Baseline    = 0;
var vertalign_SuperScript = 1;
var vertalign_SubScript   = 2;
var hdrftr_Header = 0x01;
var hdrftr_Footer = 0x02;

var hdrftr_Default = 0x01;
var hdrftr_Even    = 0x02;
var hdrftr_First   = 0x03;
