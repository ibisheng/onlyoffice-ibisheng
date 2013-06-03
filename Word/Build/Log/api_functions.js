function GetBold()
{
    var prop = editor.PT();
    return prop.A7().a6();
}

function SetBold(flag)
{
  editor.n$(flag);
}

function GetItalic()
{
    var prop = editor.PT();
    return prop.A7().J6();
}

function SetItalic(flag)
{
  editor.q$(flag);
}

function GetUnderlined()
{
    var prop = editor.PT();
    return prop.A7().D7();
}

function SetUnderlined(flag)
{
  editor.s$(flag);
}

function GetStrikeout()
{
    var prop = editor.PT();
    return prop.A7().q7();
}

function SetStrikeout(flag)
{
    editor.r$(flag);
}

function GetFontType()
{
    var prop = editor.PT();
    return prop.A7().s6().uC();
}

function SetFontType(fontName)
{
    editor.o$(fontName);
}

function GetFontSize()
{
    var prop = editor.PT();
    return prop.A7().v6();
}

function SetFontSize(fontSize)
{
    editor.p$(fontSize);
}

function GetFontColorRed()
{
    var prop = editor.PT();
    return prop.A7().ow().N7();
}

function GetFontColorGreen()
{
    var prop = editor.PT();
    return prop.A7().ow().J7();
}

function GetFontColorBlue()
{
    var prop = editor.PT();
    return prop.A7().ow().I7();
}

function SetFontColor(red, green, blue)
{
    editor.l$(red, green, blue)
}

function GetHighlightColorRed()
{
    var prop = editor.PT();
    return prop.A7().A6().N7();
}

function GetHighlightColorGreen()
{
    var prop = editor.PT();
    return prop.A7().A6().J7();
}

function GetHighlightColorBlue()
{
    var prop = editor.PT();
    return prop.A7().A6().I7();
}

function SetHighlightColor(flag, red, green, blue)
{
    editor.E9(flag, red, green, blue)
}

function GetBackgroundColorRed()
{
    var prop = editor.PT();
    return prop.g7().l7().ow().N7();
}

function GetBackgroundColorGreen()
{
    var prop = editor.PT();
    return prop.g7().l7().ow().J7();
}

function GetBackgroundColorBlue()
{
    var prop = editor.PT();
    return  prop.g7().l7().ow().I7();
}

function SetBackgroundColor(flag, red, green, blue)
{
    editor.Q9(flag, red, green, blue)
}

function GetVerticalAlignment()
{
    var prop = editor.PT();
    return prop.A7().E7();
}

function SetVerticalAlignment(vertical_alignment)
{
    editor.m$(vertical_alignment)
}

function GetHorizontalAlignment()
{
    var prop = editor.PT();
    return prop.g7().K6();
}

function SetHorizontalAlignment(horizontal_alignment)
{
    editor.R9(horizontal_alignment)
}

function SetListType(type_id, subtype_id)
{
    editor.G9(type_id, subtype_id)
}

function AddPageBreak()
{
  editor.i9();
}

function GetIndentFirstLine()
{
    var prop = editor.PT();
    return prop.g7().aM().q6();
}

function GetIndentLeft()
{
    var prop = editor.PT();
    return prop.g7().aM().ps();
}

function GetIndentRight()
{
    var prop = editor.PT();
    return prop.g7().aM().qs();
}

function SetIndentFirstLine(first_line)
{
   editor.S9(first_line);
}

function SetIndentLeft(left)
{
   editor.T9(left);
}

function SetIndentRight(right)
{
   editor.U9(right);
}

function GetSpacingLine()
{
   var prop = editor.PT();
    return prop.g7().wC().N6();
}

function GetSpacingBefore()
{
   var prop = editor.PT();
    return prop.g7().wC().Y5();
}

function GetSpacingAfter()
{
   var prop = editor.PT();
    return prop.g7().wC().W5();
}

function GetSpacingLineRule()
{
   var prop = editor.PT();
    return prop.g7().wC().O6();
}

function SetSpacingLine(line)
{
   editor.V9(line);
}

function SetSpacingBefore(before)
{
   editor.F9(0, before);
}

function SetSpacingAfter(after)
{
   editor.F9(1, after);
}

function SetSpacingBetween(between)
{
   editor.j9(between);
}

function SetMargin(left, up, right, down)
{
    editor.H9(left, up, right, down);
}

function GetParagraphCount()
{
  return editor.j6();
}

function SelectParagraph(paragraph_number)
{
  editor.Y$(paragraph_number);
}

function HiddentSymbolsIsShown()
{
  return editor.m7()
}

function GetPageCount()
{
  return editor.S5()
}

function ParagraphPlacementPageBreakBefore()
{
    var prop = editor.PT();
    return prop.g7().dM();
}

function ParagrphPlacementKeepLinesTogether()
{
      var prop = editor.PT();
      return prop.g7().bM();
}

function InsertImageByURL(url)
{
    editor.rI(url);
}

function GetOrientation()
{
  return editor.pw();
}

function GetDocHeight()
{
  return editor.jZ();
}

function GetDocWidth()
{
  return editor.kZ();
}

function InsertTable(column, rows)
{
  editor.e$(column, rows);
}

function OpenHeading(page_number)
{
  editor.EZ(page_number)
}

function CloseHeading(page_number)
{
  editor.DZ(page_number)
}

function CloseHeaderFooter(page_number)
{
  editor.EZ(page_number)
}
