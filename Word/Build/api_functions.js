function GetBold()
{
    var prop = editor.get_TextProps();
    return prop.get_TextPr().get_Bold();
}

function SetBold(flag)
{
  editor.put_TextPrBold(flag);
}

function GetItalic()
{
    var prop = editor.get_TextProps();
    return prop.get_TextPr().get_Italic();
}

function SetItalic(flag)
{
  editor.put_TextPrItalic(flag);
}

function GetUnderlined()
{
    var prop = editor.get_TextProps();
    return prop.get_TextPr().get_Underline();
}

function SetUnderlined(flag)
{
  editor.put_TextPrUnderline(flag);
}

function GetStrikeout()
{
    var prop = editor.get_TextProps();
    return prop.get_TextPr().get_Strikeout();
}

function SetStrikeout(flag)
{
    editor.put_TextPrStrikeout(flag);
}

function GetFontType()
{
    var prop = editor.get_TextProps();
    return prop.get_TextPr().get_FontFamily().get_Name();
}

function SetFontType(fontName)
{
    editor.put_TextPrFontName(fontName);
}

function GetFontSize()
{
    var prop = editor.get_TextProps();
    return prop.get_TextPr().get_FontSize();
}

function SetFontSize(fontSize)
{
    editor.put_TextPrFontSize(fontSize);
}

function GetFontColorRed()
{
    var prop = editor.get_TextProps();
    return prop.get_TextPr().get_Color().get_r();
}

function GetFontColorGreen()
{
    var prop = editor.get_TextProps();
    return prop.get_TextPr().get_Color().get_g();
}

function GetFontColorBlue()
{
    var prop = editor.get_TextProps();
    return prop.get_TextPr().get_Color().get_b();
}

function SetFontColor(red, green, blue)
{
    editor.put_TextColor(red, green, blue)
}

function GetHighlightColorRed()
{
    var prop = editor.get_TextProps();
    return prop.get_TextPr().get_HighLight().get_r();
}

function GetHighlightColorGreen()
{
    var prop = editor.get_TextProps();
    return prop.get_TextPr().get_HighLight().get_g();
}

function GetHighlightColorBlue()
{
    var prop = editor.get_TextProps();
    return prop.get_TextPr().get_HighLight().get_b();
}

function SetHighlightColor(flag, red, green, blue)
{
    editor.put_LineHighLight(flag, red, green, blue)
}

function GetBackgroundColorRed()
{
    var prop = editor.get_TextProps();
    return prop.get_ParaPr().get_Shd().get_Color().get_r();
}

function GetBackgroundColorGreen()
{
    var prop = editor.get_TextProps();
    return prop.get_ParaPr().get_Shd().get_Color().get_g();
}

function GetBackgroundColorBlue()
{
    var prop = editor.get_TextProps();
    return  prop.get_ParaPr().get_Shd().get_Color().get_b();
}

function SetBackgroundColor(flag, red, green, blue)
{
    editor.put_ParagraphShade(flag, red, green, blue)
}

function GetVerticalAlignment()
{
    var prop = editor.get_TextProps();
    return prop.get_TextPr().get_VertAlign();
}

function SetVerticalAlignment(vertical_alignment)
{
    editor.put_TextPrBaseline(vertical_alignment)
}

function GetHorizontalAlignment()
{
    var prop = editor.get_TextProps();
    return prop.get_ParaPr().get_Jc();
}

function SetHorizontalAlignment(horizontal_alignment)
{
    editor.put_PrAlign(horizontal_alignment)
}

function SetListType(type_id, subtype_id)
{
    editor.put_ListType(type_id, subtype_id)
}

function AddPageBreak()
{
  editor.put_AddPageBreak();
}

function GetIndentFirstLine()
{
    var prop = editor.get_TextProps();
    return prop.get_ParaPr().get_Ind().get_FirstLine();
}

function GetIndentLeft()
{
    var prop = editor.get_TextProps();
    return prop.get_ParaPr().get_Ind().get_Left();
}

function GetIndentRight()
{
    var prop = editor.get_TextProps();
    return prop.get_ParaPr().get_Ind().get_Right();
}

function SetIndentFirstLine(first_line)
{
   editor.put_PrFirstLineIndent(first_line);
}

function SetIndentLeft(left)
{
   editor.put_PrIndent(left);
}

function SetIndentRight(right)
{
   editor.put_PrIndentRight(right);
}

function GetSpacingLine()
{
   var prop = editor.get_TextProps();
    return prop.get_ParaPr().get_Spacing().get_Line();
}

function GetSpacingBefore()
{
   var prop = editor.get_TextProps();
    return prop.get_ParaPr().get_Spacing().get_Before();
}

function GetSpacingAfter()
{
   var prop = editor.get_TextProps();
    return prop.get_ParaPr().get_Spacing().get_After();
}

function GetSpacingLineRule()
{
   var prop = editor.get_TextProps();
    return prop.get_ParaPr().get_Spacing().get_LineRule();
}

function SetSpacingLine(line)
{
   editor.put_PrLineSpacing(line);
}

function SetSpacingBefore(before)
{
   editor.put_LineSpacingBeforeAfter(0, before);
}

function SetSpacingAfter(after)
{
   editor.put_LineSpacingBeforeAfter(1, after);
}

function SetSpacingBetween(between)
{
   editor.put_AddSpaceBetweenPrg(between);
}

function SetMargin(left, up, right, down)
{
    editor.put_Margins(left, up, right, down);
}

function GetParagraphCount()
{
  return editor.get_ContentCount();
}

function SelectParagraph(paragraph_number)
{
  editor.select_Element(paragraph_number);
}

function HiddentSymbolsIsShown()
{
  return editor.get_ShowParaMarks()
}

function GetPageCount()
{
  return editor.getCountPages()
}

function ParagraphPlacementPageBreakBefore()
{
    var prop = editor.get_TextProps();
    return prop.get_ParaPr().get_PageBreakBefore();
}

function ParagrphPlacementKeepLinesTogether()
{
      var prop = editor.get_TextProps();
      return prop.get_ParaPr().get_KeepLines();
}

function InsertImageByURL(url)
{
    editor.AddImageUrl(url);
}

function GetOrientation()
{
  return editor.get_DocumentOrientation();
}

function GetDocHeight()
{
  return editor.GetDocHeightPx();
}

function GetDocWidth()
{
  return editor.GetDocWidthPx();
}

function InsertTable(column, rows)
{
  editor.put_Table(column, rows);
}

function OpenHeading(page_number)
{
  editor.GoToHeader(page_number)
}

function CloseHeading(page_number)
{
  editor.GoToFooter(page_number)
}

function CloseHeaderFooter(page_number)
{
  editor.GoToHeader(page_number)
}
