/*-------------------------------------------------------------------------
EBNF Visualizer
Copyright (c) 2005 Stefan Schoergenhumer, Markus Dopler
supported by Hanspeter Moessenboeck, University of Linz

This program is free software; you can redistribute it and/or modify it 
under the terms of the GNU General Public License as published by the 
Free Software Foundation; either version 2, or (at your option) any 
later version.

This program is distributed in the hope that it will be useful, but 
WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License 
for more details.

You should have received a copy of the GNU General Public License along 
with this program; if not, write to the Free Software Foundation, Inc., 
59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
-------------------------------------------------------------------------*/

using System;
using System.IO;
using System.Drawing;
using System.Collections;
using System.Windows.Forms;
using System.Drawing.Imaging;

public class EbnfForm : System.Windows.Forms.Form	{
	
	private MainMenu mainMenu 				= new MainMenu();
	
	private MenuItem menuItemFile 			= new MenuItem();
	private MenuItem menuItemRules			= new MenuItem();
	private MenuItem menuItemHelp			= new MenuItem();
	
	private MenuItem menuItemLoad			= new MenuItem();
	private MenuItem menuItemSave 			= new MenuItem();
	private MenuItem menuItemCopy 			= new MenuItem();
	private MenuItem menuItemSettings       = new MenuItem();
	private MenuItem menuItemExit 			= new MenuItem();
	private MenuItem menuItemHelpLink		= new MenuItem();
	private MenuItem menuItemAbout 			= new MenuItem();

	private Label labelEbnf					= new Label();
	private static TextBox textBoxOutput	= new TextBox();
	private static Bitmap DrawArea			= new Bitmap(1,1,System.Drawing.Imaging.PixelFormat.Format24bppRgb);  // make a persistent drawing area
	
	private Symbol currentSymbol			= null;

	public static Graphics BitmapGraphics {
		get {
			return Graphics.FromImage(DrawArea);
		}
	}
		

	public static Bitmap Drawarea {
		set {
			DrawArea=value;
			InitializeDrawArea();
		}
	}
	
	public EbnfForm()	{
		InitializeComponent();
	}

	///////////////////////////////////////////////////////////////////////////////
	//-----------Init main form and menu-------------------------------------------
	///////////////////////////////////////////////////////////////////////////////


	
	private void InitializeComponent()	{
		this.AutoScaleBaseSize = new System.Drawing.Size(5, 13); 
		this.ClientSize = new System.Drawing.Size(800, 600);
		this.StartPosition = FormStartPosition.CenterScreen;
		this.Text = "EBNF Visualizer";
		this.Name = "EBNF Visualizer";
		this.Paint += new PaintEventHandler(component_paint);
		this.BackColor=Color.White;
		this.MouseDown += new System.Windows.Forms.MouseEventHandler(this.Form_MouseDown);	
		
		menuItemFile.Text 		= "File";
		menuItemRules.Text 		= "Rules";
		menuItemHelp.Text 		= "Help";
		menuItemLoad.Text		= "Load Grammar...";
		menuItemSave.Text		= "Save as...";
		menuItemCopy.Text		= "Copy";
		menuItemSettings.Text	= "Settings...";
		menuItemExit.Text 		= "Exit";
		menuItemHelpLink.Text	= "Help...";
		menuItemAbout.Text		= "About...";
		
		menuItemSave.Enabled=false;
		menuItemCopy.Enabled=false;
		menuItemRules.Enabled=false;
		
		menuItemCopy.Shortcut=Shortcut.CtrlC;
		
		menuItemFile.MenuItems.Add(menuItemLoad);
		menuItemFile.MenuItems.Add(menuItemSave);
		menuItemFile.MenuItems.Add(menuItemCopy);
		menuItemFile.MenuItems.Add(new MenuItem("-"));
		menuItemFile.MenuItems.Add(menuItemSettings);
		menuItemFile.MenuItems.Add(new MenuItem("-"));
		menuItemFile.MenuItems.Add(menuItemExit);	
		menuItemHelp.MenuItems.Add(menuItemHelpLink);
		menuItemHelp.MenuItems.Add(new MenuItem("-"));
		menuItemHelp.MenuItems.Add(menuItemAbout);
		
		mainMenu.MenuItems.Add(menuItemFile);
		mainMenu.MenuItems.Add(menuItemRules);
		mainMenu.MenuItems.Add(menuItemHelp);

		
		textBoxOutput.ScrollBars = ScrollBars.Vertical;
		textBoxOutput.Size=new Size(ClientSize.Width,100);
		textBoxOutput.Multiline=true;
		textBoxOutput.Location=new Point(0,ClientSize.Height-100);
		this.Controls.Add(textBoxOutput);
		
		menuItemLoad.Click+= new System.EventHandler(this.menuItemLoad_Click);
		menuItemExit.Click+= new System.EventHandler(this.menuItemExit_Click);
		menuItemSettings.Click+= new System.EventHandler(this.menuItemSettings_Click);
		menuItemAbout.Click+= new System.EventHandler(this.menuItemAbout_Click);
		menuItemSave.Click+= new System.EventHandler(this.menuItemSave_Click);
		menuItemCopy.Click+= new System.EventHandler(this.menuItemCopy_Click);
		SizeChanged+= new System.EventHandler(this.size_Changed);
		menuItemHelpLink.Click+=new System.EventHandler(this.menuItemHelpLink_Click);

	    this.Menu = mainMenu;
		
	}
	///////////////////////////////////////////////////////////////////////////////
	//-----------Main Form and Menu Event Handler----------------------------------
	///////////////////////////////////////////////////////////////////////////////

	private void size_Changed(object sender, System.EventArgs e) {
		textBoxOutput.Size=new Size(ClientSize.Width,100);
		textBoxOutput.Location=new Point(0,ClientSize.Height-100);
		this.drawGrammar();

	}
	private void menuItemLoad_Click(object sender, System.EventArgs e)	{
		OpenFileDialog ofd = new OpenFileDialog();
 		ofd.Filter = "Ebnf files (*.ebnf)|*.ebnf" ;
		ofd.FilterIndex = 1;
		ofd.RestoreDirectory = true;

		if(ofd.ShowDialog() == DialogResult.OK)	{
			this.LoadFile(ofd.FileName);
			menuItemSave.Enabled=false;
			menuItemCopy.Enabled=false;
		}
	}
	
	private void menuItemHelpLink_Click(object sender, System.EventArgs e) {
		try {
			System.Diagnostics.Process.Start("manual.html");
		} catch {
			EbnfForm.WriteLine("Help named manual.html was not found!");				
		}
    }
	
	private void menuItemSettings_Click(object sender, System.EventArgs e) {
		this.CreateMySettingsForm();
    }
	
	private void menuItemAbout_Click(object sender, System.EventArgs e) {
		this.CreateMyAboutForm();
    }
	
	private void menuItemExit_Click(object sender, System.EventArgs e) {
		this.Close();
    }
	
	private void shortload_Click(object sender, System.EventArgs e) {
		MenuItem temp=(MenuItem) sender;
		LoadGrammar(temp.Text);
    }
	
	// save drawing in bitmap DrawArea as a jpeg file
	private void menuItemSave_Click(object sender, System.EventArgs e) {
		
		ImageFormat format = ImageFormat.Gif;
		SaveFileDialog sfd = new SaveFileDialog();
		if(currentSymbol!=null)
			sfd.FileName=currentSymbol.name;
		sfd.Filter = "GIF Files(*.GIF)|*.GIF|Windows Metafile (*.EMF)|*.EMF";
		if (sfd.ShowDialog()  == DialogResult.OK) {
			if(sfd.FileName.EndsWith(".EMF")) {
			   	saveEmf(sfd.FileName);
			} else {
				DrawArea.Save(sfd.FileName, format );
			}
			EbnfForm.WriteLine("Rule " + currentSymbol.name + " saved to "+sfd.FileName+".");
		}
		sfd.Dispose();
	}
	
	private void saveEmf(String path) {
		
		FileStream fs = new FileStream(path,FileMode.Create );
    	Graphics g = CreateGraphics();
    	IntPtr hDC = g.GetHdc();
    	Metafile m = new Metafile( fs, hDC );
    	
    	g.ReleaseHdc( hDC );
    	g.Dispose();


		Graphics vg= Graphics.FromImage(m);
    	Node.drawComponent(currentSymbol, vg);
    	vg.Dispose();
    	m.Dispose();
    	fs.Close();
	}

	
	// copy current symbol picture to clipboard
	private void menuItemCopy_Click(object sender, System.EventArgs e) {
		EbnfForm.WriteLine("Rule " + currentSymbol.name + " copied to clipboard.");
		Clipboard.SetDataObject(DrawArea,true);
	}
	
	
	///////////////////////////////////////////////////////////////////////////////
	//-----------Settings menu form + eventhandler---------------------------------
	///////////////////////////////////////////////////////////////////////////////
	
	private Form form1 						= new Form();
	private Button buttonOk 				;
	private Button buttonCancel 			;
	private Button buttonChangeFont 		;
	private Button buttonApply				;
	private Button buttonLineColor			;
	private Button buttonLineMore			;
	private Button buttonLineLess			;
	private Button buttonArrowMore			;
	private Button buttonArrowLess			;
	private Button buttonHorizontalMore		;
	private Button buttonHorizontalLess		;
	private Button buttonVerticalMore		;
	private Button buttonVerticalLess		;
	private Button buttonSymbolSizeMore		;
	private Button buttonSymbolSizeLess		;
	private Button buttonRestoreDefault		;
	private Label labelFont					;
	private Label labelLineColor			;
	private Label labelGapHeight			;
	private Label labelGapWidth 			;
	private Label labelLineThickness		;
	private Label labelArrowSize			;
	private Label labelSymbolSize			;
	private FontDialog fontDialog1			;
	private ColorDialog colorDialog1		;
	private TabPage tabPageFont				;
    private TabPage tabPageLine				;
    private TabPage tabPageDimensions		;
    private TabPage tabPageOptimization		;
    private TabControl tabControl			;
    private GroupBox groupBoxTandNT			;
    private GroupBox groupBoxThickness		;
    private GroupBox groupBoxArrow			;
    private GroupBox groupBoxLineColor		;
    private GroupBox groupBoxHorizontal		;
    private GroupBox groupBoxVertical		;
    private GroupBox groupBoxSymbolSize		;
    private GroupBox groupBoxOptimization	;
    private CheckBox checkBoxOptimization	;
    
	public void CreateMySettingsForm()	{
	 	buttonOk 				= new Button();
		buttonCancel 			= new Button();
		buttonChangeFont 		= new Button();
		buttonApply				= new Button();
		buttonLineColor			= new Button();
		buttonLineMore			= new Button();
		buttonLineLess			= new Button();
		buttonArrowMore			= new Button();
		buttonArrowLess			= new Button();	
		buttonHorizontalMore	= new Button();	
		buttonHorizontalLess	= new Button();
		buttonVerticalMore		= new Button();
		buttonVerticalLess		= new Button();
		buttonSymbolSizeLess	= new Button();
		buttonSymbolSizeMore	= new Button();
		buttonRestoreDefault	= new Button();
		labelFont				= new Label();
		labelLineColor			= new Label();
		labelGapHeight			= new Label();
		labelGapWidth 			= new Label();
		labelLineThickness		= new Label();
		labelArrowSize			= new Label();
		labelSymbolSize			= new Label();
		fontDialog1				= new FontDialog();
		colorDialog1			= new ColorDialog();   	
    	tabPageFont				= new TabPage();
  		tabPageLine				= new TabPage();
    	tabPageDimensions		= new TabPage();
    	tabPageOptimization		= new TabPage();
    	tabControl 				= new TabControl();
    	groupBoxTandNT			= new GroupBox();
    	groupBoxThickness		= new GroupBox();
    	groupBoxArrow			= new GroupBox();
    	groupBoxLineColor		= new GroupBox();
     	groupBoxHorizontal		= new GroupBox();
    	groupBoxVertical		= new GroupBox();
  		groupBoxSymbolSize		= new GroupBox();
  		groupBoxOptimization	= new GroupBox();
  		checkBoxOptimization	= new CheckBox();
    	
       form1.Text 				= "Settings";
	   form1.FormBorderStyle 	= FormBorderStyle.FixedDialog;
	   form1.MaximizeBox 		= false;
	   form1.MinimizeBox 		= false;
	   form1.AcceptButton 		= buttonOk;
	   form1.CancelButton 		= buttonCancel;
	   form1.StartPosition 		= FormStartPosition.CenterScreen;
	   
	   checkBoxOptimization.Checked = Node.OptimizeGraph;

	   buttonCancel.Text 		= "Cancel";	   
	   buttonOk.Text 			= "OK";
	   buttonChangeFont.Text	= "Change font...";
	   buttonApply.Text			= "Apply";
	   buttonLineMore.Text		= ">";
	   buttonLineLess.Text		= "<";
	   buttonArrowMore.Text		= ">";
	   buttonArrowLess.Text		= "<";
	   buttonHorizontalMore.Text= ">";
	   buttonHorizontalLess.Text= "<";
	   buttonVerticalMore.Text	= ">";
	   buttonVerticalLess.Text	= "<";
	   buttonSymbolSizeMore.Text= ">";
	   buttonSymbolSizeLess.Text= "<";
	   buttonLineColor.Text		= "Change color...";
	   buttonRestoreDefault.Text= "Restore default settings";
	   labelFont.Text			= Node.CharFont.Name;
	   labelGapHeight.Text		= Convert.ToString(Node.ComponentGapHeight);
	   labelGapWidth.Text		= Convert.ToString(Node.ComponentGapWidth-26);
	   tabPageFont.Text			= "Font";
	   tabPageLine.Text			= "Line";
	   tabPageDimensions.Text	= "Dimensions";
	   tabPageOptimization.Text = "Optimizations";
	   groupBoxTandNT.Text		= "Terminal and nonterminal symbols";
	   groupBoxThickness.Text	= "Thickness";
       groupBoxArrow.Text		= "Size of Arrow";
       groupBoxLineColor.Text	= "Color";
       groupBoxHorizontal.Text	= "Horizontal";
       groupBoxVertical.Text	= "Vertical";
       groupBoxSymbolSize.Text	= "Gap between symbolline and font (vertical)";
       groupBoxOptimization.Text= "Optimization";
	   labelLineThickness.Text  = Convert.ToString(Node.LinePen.Width);
	   labelArrowSize.Text  	= Convert.ToString(Node.ArrowSize);
	   labelSymbolSize.Text		= Convert.ToString(Node.SymbolGapHeight);
	   checkBoxOptimization.Text= "Enable optimizations (reload required)";
	   
	   labelFont.Font			= Node.CharFont;
	   labelFont.ForeColor		= Node.CharColor;
	   labelFont.BackColor		= Color.White;
	   labelFont.TextAlign		= ContentAlignment.MiddleCenter;
	   
	   if(Node.LinePen.Width<=1)		buttonLineLess.Enabled 		 	= false;
	   if(Node.SymbolGapHeight<=0)		buttonSymbolSizeLess.Enabled 	= false;
	   if(Node.ArrowSize<=1)			buttonArrowLess.Enabled  	 	= false;
	   if(Node.ComponentGapHeight<=0)	buttonVerticalLess.Enabled 		= false;
	   if(Node.ComponentGapWidth<=26)	buttonHorizontalLess.Enabled	= false;
	   
	   labelLineThickness.Font		= new Font("Times",12);
	   labelLineThickness.TextAlign	= ContentAlignment.MiddleCenter;
	   
	   labelArrowSize.Font			= new Font("Times",12);
	   labelArrowSize.TextAlign		= ContentAlignment.MiddleCenter;
	   
	   labelGapHeight.Font			= new Font("Times",12);
	   labelGapHeight.TextAlign		= ContentAlignment.MiddleCenter;
	   
	   labelGapWidth.Font			= new Font("Times",12);
	   labelGapWidth.TextAlign		= ContentAlignment.MiddleCenter;
	   
	   labelSymbolSize.Font			= new Font("Times",12);
	   labelSymbolSize.TextAlign	= ContentAlignment.MiddleCenter;
	   
	   labelLineColor.BackColor=Node.LinePen.Color;
	   
	   buttonLineColor.Size 	= new Size(100,20);
	   buttonLineMore.Size		= new Size(20,20);
	   buttonLineLess.Size		= new Size(20,20);
	   buttonArrowMore.Size		= new Size(20,20);
	   buttonArrowLess.Size		= new Size(20,20);
	   buttonHorizontalMore.Size= new Size(20,20);
	   buttonHorizontalLess.Size= new Size(20,20);
	   buttonVerticalMore.Size	= new Size(20,20);
	   buttonVerticalLess.Size	= new Size(20,20);
	   buttonSymbolSizeMore.Size= new Size(20,20);
	   buttonSymbolSizeLess.Size= new Size(20,20);
	   buttonChangeFont.Size	= new Size(90,20);
	   buttonRestoreDefault.Size= new Size(150,20);
	   tabControl.Size			= new Size(form1.Size.Width-15, form1.Size.Height-150);
	   groupBoxTandNT.Size		= new Size(tabControl.Size.Width-30, groupBoxTandNT.Size.Height);
	   groupBoxThickness.Size	= new Size(100, 50);
	   groupBoxArrow.Size		= new Size(100, 50);
	   groupBoxHorizontal.Size	= new Size(100, 50);
	   groupBoxVertical.Size	= new Size(100, 50);
	   groupBoxOptimization.Size= new Size(tabControl.Size.Width-30, 50);
	   groupBoxLineColor.Size   = new Size(155, 50);
	   groupBoxSymbolSize.Size	= new Size(tabControl.Size.Width-30, 50);
	   labelLineColor.Size		= new Size(20,20);
	   labelFont.Size			= new Size(groupBoxTandNT.Size.Width-20,40);
	   checkBoxOptimization.Size= new Size(220, 20);
	   
	   groupBoxTandNT.Location			= new Point (10,10);
	   groupBoxThickness.Location		= new Point (10,10);
	   groupBoxArrow.Location			= new Point (10,groupBoxThickness.Height+10);
	   groupBoxLineColor.Location		= new Point (110,10);
	   groupBoxHorizontal.Location		= new Point (10,10);
	   groupBoxVertical.Location		= new Point (110,10);
	   groupBoxOptimization.Location	= new Point (10,10);
	   groupBoxSymbolSize.Location		= new Point (10,groupBoxVertical.Height+10);
	   labelFont.Location 				= new Point (10,20);
	   buttonOk.Location				= new Point (20, 220);
	   buttonApply.Location				= new Point (buttonOk.Left+buttonOk.Width+10, 220);
	   buttonCancel.Location 			= new Point (buttonApply.Left+buttonApply.Width+20, 220);
	   tabControl.Location				= new Point (5,5);
	   buttonChangeFont.Location		= new Point (tabControl.Right-buttonChangeFont.Size.Width-45,labelFont.Top+labelFont.Height+10);
	   buttonLineLess.Location			= new Point (10,20);
	   buttonLineMore.Location			= new Point (buttonLineLess.Right+40, buttonLineLess.Top);
	   buttonArrowLess.Location			= new Point (10,20);
	   buttonArrowMore.Location			= new Point (buttonLineLess.Right+40, buttonLineLess.Top);
	   buttonHorizontalLess.Location	= new Point (10,20);
	   buttonHorizontalMore.Location	= new Point (buttonHorizontalLess.Right+40, buttonHorizontalLess.Top);
	   buttonVerticalLess.Location		= new Point (10,20);
	   buttonVerticalMore.Location		= new Point (buttonVerticalLess.Right+40, buttonVerticalLess.Top);
	   buttonSymbolSizeLess.Location	= new Point (10,20);
	   buttonSymbolSizeMore.Location	= new Point (buttonSymbolSizeLess.Right+40, buttonSymbolSizeLess.Top);
	   buttonRestoreDefault.Location	= new Point ((tabControl.Size.Width-buttonRestoreDefault.Size.Width)/2, tabControl.Bottom+20);
	   labelLineThickness.Location		= new Point (buttonLineLess.Right,buttonLineLess.Top);
	   labelArrowSize.Location			= new Point (buttonArrowLess.Right,buttonArrowLess.Top);
	   labelGapHeight.Location			= new Point (buttonHorizontalLess.Right,buttonHorizontalLess.Top);
	   labelGapWidth.Location			= new Point (buttonVerticalLess.Right,buttonVerticalLess.Top);
	   labelSymbolSize.Location			= new Point (buttonSymbolSizeLess.Right,buttonSymbolSizeLess.Top);
	   labelLineColor.Location			= new Point (10,20);
	   buttonLineColor.Location			= new Point (labelLineColor.Right+10,20);
	   checkBoxOptimization.Location	= new Point (10,20);

	   labelLineThickness.Size			= new Size  (buttonLineMore.Left-buttonLineLess.Right,buttonLineLess.Height);
	   labelArrowSize.Size				= new Size  (buttonArrowMore.Left-buttonArrowLess.Right,buttonArrowLess.Height);
	   labelGapHeight.Size				= new Size  (buttonHorizontalMore.Left-buttonHorizontalLess.Right,buttonHorizontalLess.Height);
	   labelGapWidth.Size				= new Size  (buttonVerticalMore.Left-buttonVerticalLess.Right,buttonVerticalLess.Height);
	   labelSymbolSize.Size				= new Size  (buttonSymbolSizeMore.Left-buttonSymbolSizeLess.Right,buttonSymbolSizeLess.Height);
	   
	   groupBoxTandNT.Controls.Add(buttonChangeFont);
	   groupBoxTandNT.Controls.Add(labelFont);
	   groupBoxHorizontal.Controls.Add(labelGapWidth);
	   groupBoxVertical.Controls.Add(labelGapHeight);
	   groupBoxThickness.Controls.Add(buttonLineMore);
	   groupBoxThickness.Controls.Add(buttonLineLess);
	   groupBoxThickness.Controls.Add(labelLineThickness);
	   groupBoxLineColor.Controls.Add(buttonLineColor);
	   groupBoxLineColor.Controls.Add(labelLineColor);
	   groupBoxArrow.Controls.Add(buttonArrowMore);
	   groupBoxArrow.Controls.Add(buttonArrowLess);
	   groupBoxArrow.Controls.Add(labelArrowSize);
	   groupBoxHorizontal.Controls.Add(buttonHorizontalLess);
	   groupBoxHorizontal.Controls.Add(buttonHorizontalMore);
	   groupBoxVertical.Controls.Add(buttonVerticalLess);
	   groupBoxVertical.Controls.Add(buttonVerticalMore);
	   groupBoxSymbolSize.Controls.Add(buttonSymbolSizeMore);
	   groupBoxSymbolSize.Controls.Add(buttonSymbolSizeLess);
	   groupBoxSymbolSize.Controls.Add(labelSymbolSize);
	   groupBoxOptimization.Controls.Add(checkBoxOptimization);
	   
	   tabPageFont.Controls.Add(groupBoxTandNT);
	   tabPageLine.Controls.Add(groupBoxThickness);
	   tabPageLine.Controls.Add(groupBoxLineColor);
	   tabPageLine.Controls.Add(groupBoxArrow);
	   tabPageDimensions.Controls.Add(groupBoxSymbolSize);
	   tabPageDimensions.Controls.Add(groupBoxHorizontal);
	   tabPageDimensions.Controls.Add(groupBoxVertical);
	   tabPageOptimization.Controls.Add(groupBoxOptimization);
       
	   tabControl.Controls.Add(this.tabPageFont);
       tabControl.Controls.Add(this.tabPageLine);
       tabControl.Controls.Add(this.tabPageDimensions);
       tabControl.Controls.Add(this.tabPageOptimization);
       
       form1.Controls.Add(this.tabControl);
	   form1.Controls.Add(buttonOk);
	   form1.Controls.Add(buttonCancel);
	   form1.Controls.Add(buttonApply);
	   form1.Controls.Add(buttonRestoreDefault);
       
       
	   buttonOk.Click				+= new System.EventHandler(this.buttonOk_Click);
	   buttonChangeFont.Click		+= new System.EventHandler(this.buttonChangeFont_Click);
	   buttonApply.Click			+= new System.EventHandler(this.buttonApply_Click);
	   buttonLineColor.Click		+= new System.EventHandler(this.buttonLineColor_Click);
	   buttonLineMore.Click			+= new System.EventHandler(this.buttonLineMore_Click);
	   buttonLineLess.Click			+= new System.EventHandler(this.buttonLineLess_Click);
	   buttonArrowMore.Click		+= new System.EventHandler(this.buttonArrowMore_Click);
	   buttonArrowLess.Click		+= new System.EventHandler(this.buttonArrowLess_Click);
	   buttonHorizontalMore.Click	+= new System.EventHandler(this.buttonHorizontalMore_Click);
	   buttonHorizontalLess.Click	+= new System.EventHandler(this.buttonHorizontalLess_Click);
	   buttonVerticalMore.Click		+= new System.EventHandler(this.buttonVerticalMore_Click);
	   buttonVerticalLess.Click		+= new System.EventHandler(this.buttonVerticalLess_Click);
	   buttonSymbolSizeMore.Click	+= new System.EventHandler(this.buttonSymbolSizeMore_Click);
	   buttonSymbolSizeLess.Click	+= new System.EventHandler(this.buttonSymbolSizeLess_Click);
	   buttonCancel.Click			+= new System.EventHandler(this.buttonCancel_Click);
	   buttonRestoreDefault.Click	+= new System.EventHandler(this.buttonRestoreDefault_Click);
	   
	   form1.ShowDialog();
	}
	
    // change the color of the line
	private void buttonLineColor_Click(object sender, System.EventArgs e) {
    	colorDialog1.Color		= Node.LinePen.Color;

    	if(colorDialog1.ShowDialog() != DialogResult.Cancel )   {
       		labelLineColor.BackColor	= colorDialog1.Color ;
    	}
    }
    
    // increase the size of the line
    private void buttonLineMore_Click(object sender, System.EventArgs e) {
   		Node.LinePen.Width+=2;
    	labelLineThickness.Text  = Convert.ToString(Node.LinePen.Width);
    	buttonLineLess.Enabled 	= true;
    }
    
    // decrease the size of the line
    private void buttonLineLess_Click(object sender, System.EventArgs e) {
    	if(Node.LinePen.Width-2>0)
    		Node.LinePen.Width-=2;
    	if(Node.LinePen.Width==1)
    		buttonLineLess.Enabled = false;
    	labelLineThickness.Text  = Convert.ToString(Node.LinePen.Width);	    		
    }
 	
    // increase the horizontal dimension
    private void buttonHorizontalMore_Click(object sender, System.EventArgs e) {
   		Node.ComponentGapWidth+=2;
    	labelGapWidth.Text  = Convert.ToString(Node.ComponentGapWidth-26);
    	buttonHorizontalLess.Enabled 	= true;
    }
    
    // decrease the horizonal dimension
    private void buttonHorizontalLess_Click(object sender, System.EventArgs e) {
    	if(Node.ComponentGapWidth-2>=0)
    		Node.ComponentGapWidth-=2;
    	if(Node.ComponentGapWidth<27)
    		buttonHorizontalLess.Enabled = false;
    	labelGapWidth.Text  = Convert.ToString(Node.ComponentGapWidth-26);	    		
    }

    // increase the gap between the symbolline and the font	
    private void buttonSymbolSizeMore_Click(object sender, System.EventArgs e) {
   		Node.SymbolGapHeight+=1;
    	labelSymbolSize.Text  = Convert.ToString(Node.SymbolGapHeight);
    	buttonSymbolSizeLess.Enabled 	= true;
    }
    
    // decrease the gap between the symbolline and the font	    
    private void buttonSymbolSizeLess_Click(object sender, System.EventArgs e) {
    	if(Node.SymbolGapHeight-1>=0)
    		Node.SymbolGapHeight-=1;
    	if(Node.SymbolGapHeight<=0)
    		buttonSymbolSizeLess.Enabled = false;
    	labelSymbolSize.Text  = Convert.ToString(Node.SymbolGapHeight);	    		
    }

    // increase the vertical dimension    
   	private void buttonVerticalMore_Click(object sender, System.EventArgs e) {
   		Node.ComponentGapHeight+=2;
    	labelGapHeight.Text  = Convert.ToString(Node.ComponentGapHeight);
    	buttonVerticalLess.Enabled 	= true;
    }
    
    // decrease the vertical dimension    
    private void buttonVerticalLess_Click(object sender, System.EventArgs e) {
    	if(Node.ComponentGapHeight-2>=0)
    		Node.ComponentGapHeight-=2;
    	if(Node.ComponentGapHeight<1)
    		buttonVerticalLess.Enabled = false;
    	labelGapHeight.Text  = Convert.ToString(Node.ComponentGapHeight);	    		
    }    

    // increase the arrowsize
    private void buttonArrowMore_Click(object sender, System.EventArgs e) {
   		Node.ArrowSize+=1;
    	labelArrowSize.Text = Convert.ToString(Node.ArrowSize);
    	buttonArrowLess.Enabled 	= true;
    }
    
    // decrease the arrowsize
    private void buttonArrowLess_Click(object sender, System.EventArgs e) {
    	if(Node.ArrowSize-1>0)
    		Node.ArrowSize-=1;
    	if(Node.ArrowSize==1)
    		buttonArrowLess.Enabled = false;
    	labelArrowSize.Text  = Convert.ToString(Node.ArrowSize);	    		
    }

    // change the font of t and nt symbols
	private void buttonChangeFont_Click(object sender, System.EventArgs e) {
		fontDialog1.ShowColor 	= true;
    	fontDialog1.Font 		= labelFont.Font;
    	fontDialog1.Color		= labelFont.ForeColor;

    	if(fontDialog1.ShowDialog() != DialogResult.Cancel )   {
       		labelFont.Font 		= fontDialog1.Font ;
       		labelFont.ForeColor = fontDialog1.Color;
       		labelFont.Text		= fontDialog1.Font.Name;
    	}
    }	

    // use the default settings
	private void buttonRestoreDefault_Click(object sender, System.EventArgs e) {
    	Node.restoreDefaultSettings();
    	labelFont.Text				= Node.CharFont.Name;
    	labelFont.Font				= Node.CharFont;
	    labelFont.ForeColor			= Node.CharColor;
	    labelLineColor.BackColor	= Node.LinePen.Color;
	    labelGapHeight.Text			= Convert.ToString(Node.ComponentGapHeight);
	   	labelGapWidth.Text			= Convert.ToString(Node.ComponentGapWidth-26);
	   	labelLineThickness.Text  	= Convert.ToString(Node.LinePen.Width);
	   	labelArrowSize.Text  		= Convert.ToString(Node.ArrowSize);
	   	labelSymbolSize.Text		= Convert.ToString(Node.SymbolGapHeight);
	   	checkBoxOptimization.Checked= true;
	    
	    if(Node.LinePen.Width<=1)		buttonLineLess.Enabled 		 	= false; else buttonLineLess.Enabled		= true;
	    if(Node.SymbolGapHeight<=0)		buttonSymbolSizeLess.Enabled 	= false; else buttonSymbolSizeLess.Enabled	= true;
	    if(Node.ArrowSize<=1)			buttonArrowLess.Enabled  	 	= false; else buttonArrowLess.Enabled		= true;
	    if(Node.ComponentGapHeight<=0)	buttonVerticalLess.Enabled 		= false; else buttonVerticalLess.Enabled	= true;
	    if(Node.ComponentGapWidth<=26)	buttonHorizontalLess.Enabled	= false; else buttonHorizontalLess.Enabled	= true;
		this.drawGrammar();    
    }    
    
    // accept the settings and close the settingsform
	private void buttonOk_Click(object sender, System.EventArgs e) {
		Node.CharFont  = labelFont.Font;
		Node.CharColor = labelFont.ForeColor;
		Node.ComponentGapHeight = Convert.ToInt16(labelGapHeight.Text);
		Node.ComponentGapWidth  = Convert.ToInt16(labelGapWidth.Text)+26;
		Node.LinePen.Width		= Convert.ToInt16(labelLineThickness.Text);
		Node.LinePen.Color		= labelLineColor.BackColor;
		Node.OptimizeGraph		= checkBoxOptimization.Checked;
		this.drawGrammar();
		form1.Close();
		form1.Dispose();
		form1=new Form();
    }
    
    // discard the settings and close the form
    private void buttonCancel_Click(object sender, System.EventArgs e) {
		this.drawGrammar();
    	form1.Close();
		form1.Dispose();
		form1=new Form();
    }
	
    // accept the settings but the settingsform isn't closed
	private void buttonApply_Click(object sender, System.EventArgs e) {
		Node.CharFont  = labelFont.Font;
		Node.CharColor = labelFont.ForeColor;
		Node.ComponentGapHeight = Convert.ToInt16(labelGapHeight.Text);
		Node.ComponentGapWidth  = Convert.ToInt16(labelGapWidth.Text)+26;
		Node.LinePen.Width		= Convert.ToInt16(labelLineThickness.Text);
		Node.LinePen.Color		= labelLineColor.BackColor;
		Node.OptimizeGraph		= checkBoxOptimization.Checked;
		this.drawGrammar();
    }
	
	///////////////////////////////////////////////////////////////////////////////
	//-----------About menu form + eventhandler------------------------------------
	///////////////////////////////////////////////////////////////////////////////
	
    private Form about 					= new Form();
    private GroupBox gp					= new GroupBox();
    private Label info					= new Label();
	private Button aboutOk	 			= new Button();	
	
	public void CreateMyAboutForm()	{
	   about.Text 				= "About";
	   about.FormBorderStyle 	= FormBorderStyle.FixedDialog;
	   about.MaximizeBox 		= false;
	   about.MinimizeBox 		= false;
	   about.AcceptButton 		= aboutOk;
	   about.StartPosition 		= FormStartPosition.CenterScreen;
	   about.Size				= new Size(250,250);
	   aboutOk.Text 			= "OK";
	   aboutOk.Location			= new Point (about.Width/2-aboutOk.Width/2-3, about.Height-70);
	   
	   gp.Size					= new Size(about.Width-37,about.Height-100);
	   gp.Location				= new Point (15,10);
	   
	   info.Text 				= "EBNF Visualizer 1.1\n\nCopyright (c) 2005 Stefan Schoergenhumer, Markus Dopler \n\nSupported by Hanspeter Moessenboeck, University of Linz\n\nThis program is licensed under GPL. For further information see license.txt.";
	   info.Location			= new Point(5,10);
	   info.Size				= new Size(gp.Width-10,gp.Height-20);
	   
	   gp.Controls.Add(info);
	   about.Controls.Add(aboutOk);
	   about.Controls.Add(gp);
	   aboutOk.Click+= new System.EventHandler(aboutOK_Click);
	   about.ShowDialog();
	}	
	private void aboutOK_Click(object sender, System.EventArgs e) {
		about.Close();
    }

	///////////////////////////////////////////////////////////////////////////////
	//-----------Methods for initialising and organising the draw area-------------
	///////////////////////////////////////////////////////////////////////////////
	
	private void component_paint(object sender,PaintEventArgs e) {
		Node.drawComponent(currentSymbol);
		Graphics xGraph;
		xGraph = e.Graphics;
		xGraph.DrawImage(DrawArea,0,0,DrawArea.Width,DrawArea.Height);
	}
	
	private void drawGrammar()	{
		InitializeDrawArea();
		Node.calcDrawing();
		this.Refresh();
	}

	private static void InitializeDrawArea(){
		Graphics xGraph;
		xGraph = Graphics.FromImage(DrawArea);
		xGraph.Clear(Color.White);	// clear the drawing area to background color
	}
	
	private void SetCurrentSymbol(object sender, System.EventArgs e) {
		rulehistory.Clear();
		foreach(MenuItem mi in menuItemRules.MenuItems)	{
			mi.Checked=false;
		}
		MenuItem temp=(MenuItem) sender;
		temp.Checked=true;
		menuItemSave.Enabled=true;
		menuItemCopy.Enabled=true;
		currentSymbol=Symbol.Find(temp.Text);
		rulehistory.Push(currentSymbol);
		this.drawGrammar();
		EbnfForm.WriteLine("Switched to rule: "+currentSymbol.name+".");
    }
	
	///////////////////////////////////////////////////////////////////////////////
	//-----------Load functionality - Loading Grammar, creating short paths--------
	///////////////////////////////////////////////////////////////////////////////

	private bool short_path_existing=false;
	private void LoadFile(String path)	{
		if(!short_path_existing)	{
			MenuItem line=new MenuItem("-");
			menuItemFile.MenuItems.Add(6,line);
			short_path_existing=true;
		}
		
		bool existing=false;
		foreach(MenuItem mi in menuItemFile.MenuItems)	{
			if(mi.Text==path)	existing=true;
			mi.Checked=false;
		}
		if(!existing){
			MenuItem grammar=new MenuItem(path);
			menuItemFile.MenuItems.Add(6,grammar);
			grammar.Click+=new System.EventHandler(this.shortload_Click);
		}
		LoadGrammar(path);
	}
	 
	private void LoadGrammar(String path) {
		//put shortcut in menu to top position
		foreach(MenuItem mi in menuItemFile.MenuItems)	{
			mi.Checked=false;
			if(mi.Text==path)	{
				mi.Index=6;
				mi.Checked=true;
				break;
			}
		}
		
		// Clear the existing nodes and symbols
		Symbol.nonterminals=new ArrayList();
		Symbol.terminals=new ArrayList();
		Node.nodes=new ArrayList();
		currentSymbol=null;
		menuItemRules.MenuItems.Clear();
		rulehistory.Clear();
		
		Scanner.Init(path);
		Parser.Parse();
		Node.Optimize();

		int i;
		bool insert;
		foreach (Symbol s in Symbol.nonterminals) {
			MenuItem m=new MenuItem(s.name);
			i=0;
			insert=false;
			foreach (MenuItem mi in menuItemRules.MenuItems)	{
				if(m.Text.CompareTo(mi.Text)>0) {
					i++;
				} else {
					menuItemRules.MenuItems.Add(i,m);
					insert=true;
					break;
				}
			}
			if(i>0 && !insert) menuItemRules.MenuItems.Add(i,m);
			if(menuItemRules.MenuItems.Count==0)	{
				menuItemRules.MenuItems.Add(m);
			}
			m.Click+= new System.EventHandler(this.SetCurrentSymbol);
		}
		menuItemRules.Enabled=true;
		this.drawGrammar();
		EbnfForm.WriteLine("New grammar loaded from file " +path+".");
	}
	
	///////////////////////////////////////////////////////////////////////////////
	//-----------Mousecontrol + Nonterminalsearch for cruise on click--------------
	///////////////////////////////////////////////////////////////////////////////
	
	private static Stack rulehistory = new Stack();
	
	private void Form_MouseDown(object sender, System.Windows.Forms.MouseEventArgs e) {
            // Update the mouse path with the mouse information
            if(currentSymbol==null) return;
            Node nt=null;
            
            if(e.Button==MouseButtons.Left) nt=FindNT(currentSymbol.graph.l,new PointF(e.X, e.Y));
            if(e.Button==MouseButtons.Right && rulehistory.Count>1) {
            	rulehistory.Pop();
            	Symbol s=(Symbol) rulehistory.Peek();
            	SwitchToRule(s);
            }
            
            
	}
	private void SwitchToRule(Symbol s) {
		currentSymbol=s;			
		drawGrammar();
		EbnfForm.WriteLine("Switched to rule: "+s.name+".");
		foreach(MenuItem mi in menuItemRules.MenuItems)	{			
			mi.Checked=false;	
			if(mi.Text==s.name) mi.Checked=true;
		}
	}
	
	private Node FindNT(Node n,PointF p)	{
		bool samelevel=true;
			
		while(n!=null && samelevel)	{
			if(n.typ==Node.nt)	{
				if(p.X >= n.posBegin.X && p.X <= n.posEnd.X && p.Y >= n.posBegin.Y && p.Y <= n.posEnd.Y) {
					SwitchToRule(n.sym);
					rulehistory.Push(n.sym);
				}
			}
			
			else if(n.typ==Node.opt|| n.typ==Node.iter || n.typ==Node.rerun)	{		
				Node i=FindNT(n.sub,p);
				if(i!=null) return i;
				if(n.typ==Node.rerun && n.itergraph!=null) FindNT(n.itergraph,p);

			}			
			else if(n.typ==Node.alt)	{			
				Node a=n;
				while(a!=null)	{
					Node i=FindNT(a.sub,p);
					if(i!=null) return i;				
					
					a=a.down;
				}

			}
			if(n.up) {
				samelevel=false;
			}	
			n=n.next;
		}
		return null;		
	}

	///////////////////////////////////////////////////////////////////////////////
	//-----------Utils-------------------------------------------------------------
	///////////////////////////////////////////////////////////////////////////////
	
	public static void WriteLine(String s) {
		textBoxOutput.AppendText(DateTime.Now.ToString().Substring(11) + ": " +s+"\r\n");
	}

	///////////////////////////////////////////////////////////////////////////////
	//-----------Main-------------------------------------------------------------
	///////////////////////////////////////////////////////////////////////////////
	
	public static void Main(string[] arg)	{
		if (arg.Length==1) {
			if(arg[0]=="-trace")	{
				Node.trace=true;
			} else {
				Console.WriteLine("Optional parameter:\n" +
				                  "-trace		...print graph");
			}
		}
		Application.Run(new EbnfForm());
	}
}
