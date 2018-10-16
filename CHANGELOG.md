# Change log
## develop
### All Editors
* 

### Document Editor
Ability to work with bookmarks
Ability to add/change hyperlinks anchored to bookmarks/headings
Add support east asian punctuation and line breaks with hieroglyphs
Add support for characters that can't be placed at the beginning/end of the line
Implement the function to continue a numbering
Implement the function to separate a numbering
Add automatic creating a numbering as user typing

### Spreadsheet Editor
* Add support comment mode
* The following functions are added: GetRows, GetCols, GetCount, GetHidden, SetHidden, GetColumnWidth, SetColumnWidth, GetRowHeight, SetRowHeight, GetWpar, SetOffset, 
GetAdress, SetLeftMargin, GetLeftMargin, SetRightMargin, GetRightMargin, SetTopMargin, GetTopMargin, SetBottomMargin, GetBottomMargin, SetPageOrientation, GetPageOrientation,
GetSelection
* The following properties are added: Rows, Cols, Count, Hidden, ColumnWidth, Width, RowHeight, Height, MergeArea, WrapText, LeftMargin, Orientation, PrintHeadings, PrintGridlines,
Selection
* Fix change active cell in selection across merge. Previously, passing through the first cell of the merge range, we fell into the merge range, even if it was not selected (through the selection of a row / column)
* Fix selection when selecting row/col/all

### Presentation Editor
* 

### Plugins
* 

### Document Builder
* 
## 5.1.1
### All Editors
* Fix error with repeated reconnection
* Add support of a block-level content controls
* Add function for receiving all content controls in the document

### Document Editor
* 

### Spreadsheet Editor
* Fix bug 37300 with enter symbol point in formula autocompleate
* Fix bug 37354 with enter symbol '_' or '\' in start formula autocompleate
* Fix bug with enter Chinese numbers in formula autocompleate

### Presentation Editor
* Fix bug in calculation of slide layout bounds

### Plugins
* 

### Document Builder
* 
