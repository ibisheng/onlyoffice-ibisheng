function GetSelectedCellInfo()
{
  return Asc.editor.asc_getCellInfo(true);
}
function getText()
{
    return GetSelectedCellInfo().asc_getText()
}
function getName()
{
    return GetSelectedCellInfo().asc_getName()
}
function getHAlign()
{
  return GetSelectedCellInfo().asc_getHorAlign()
}
function getVAlign()
{
  return GetSelectedCellInfo().asc_getVertAlign()
}
function getMerge()
{
  return GetSelectedCellInfo().asc_getFlags().asc_getMerge()
}
function getShrinkToFit()
{
  return GetSelectedCellInfo().asc_getFlags().asc_getShrinkToFit()
}
function getWrapText()
{
  return GetSelectedCellInfo().asc_getFlags().asc_getWrapText()
}
function getFontName()
{
  return GetSelectedCellInfo().asc_getFont().asc_getName()
}
function getFontSize()
{
  return GetSelectedCellInfo().asc_getFont().asc_getSize()
}
function getBold()
{
  return GetSelectedCellInfo().asc_getFont().asc_getBold()
}
function getItalic()
{
  return GetSelectedCellInfo().asc_getFont().asc_getItalic()
}
function getUnderline()
{
  return GetSelectedCellInfo().asc_getFont().asc_getUnderline()
}
function getStrikeout()
{
  return GetSelectedCellInfo().asc_getFont().getStrikeout()
}
function getSubscript()
{
  return GetSelectedCellInfo().asc_getFont().asc_getSubscript()
}
function getSuperscript()
{
  return GetSelectedCellInfo().asc_getFont().asc_getSuperscript()
}
function getFontColor()
{
  return GetSelectedCellInfo().asc_getFont().asc_getColor()
}
function getFillColor()
{
  return GetSelectedCellInfo().asc_getFill().asc_getColor()
}
function getLeftBorder()
{
  return GetSelectedCellInfo().asc_getBorders().asc_getLeft() 
}
function getRightBorder()
{
  return GetSelectedCellInfo().asc_getBorders().asc_getRight()
}
function getTopBorder()
{
  return GetSelectedCellInfo().asc_getBorders().asc_getTop()
}
function getBottomBorder()
{
  return GetSelectedCellInfo().asc_getBorders().asc_getBottom()
}
function getDiagDownBorder()
{
  return GetSelectedCellInfo().asc_getBorders().asc_getDiagDown()
}
function getDiagUpBorder()
{
  return GetSelectedCellInfo().asc_getBorders().asc_getDiagUp()
}
function getBorderWidth()
{
  return asc_getWidth()
}
function getBorderStyle()
{
  return asc_getStyle()
}
function getBorderColor()
{
  return asc_getColor()
}
function getFormula()
{
  return GetSelectedCellInfo().asc_getFormula()
}
function getInnerText()
{
  return GetSelectedCellInfo().asc_getInnerText()
}
function getNumFormat()
{
  return GetSelectedCellInfo().asc_getNumFormat()
}