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
using System.Collections;
using System.Drawing;

public class Symbol {
	public static ArrayList terminals = new ArrayList();
	public static ArrayList nonterminals = new ArrayList();
	
	public int      typ;         // t, nt
	public string   name;        // symbol name
	public Graph    graph;       // nt: to first node of syntax graph

	public Symbol(int typ, string name) {
		if (name.Length == 2 && name[0] == '"') {
			Console.WriteLine("empty token not allowed"); name = "???";
		}
		this.typ = typ; this.name = name;
		switch (typ) {
			case Node.t: terminals.Add(this); break;
			case Node.nt: nonterminals.Add(this); break;
		}
	}

	public static Symbol Find(string name) {
		foreach (Symbol s in terminals)
			if (s.name == name) return s;
		foreach (Symbol s in nonterminals)
			if (s.name == name) return s;
		return null;
	}
	

	public static void terminalToNt(string name)	{
		foreach (Symbol s in terminals)	{
			if (s.name == name) {
				nonterminals.Add(s);
				terminals.Remove(s);
				break;
			}
		}
	}	
}

//---------------------------------------------------------------------
// Syntax graph (class Node, class Graph)
//---------------------------------------------------------------------

public class Node {
	public static ArrayList nodes = new ArrayList();
	public static string[] nTyp =
		{"    ", "t   ", "nt  ", "eps ", "alt ", "iter", "opt ","reru"};
	
	// constants for node kinds
	public const int t     =  1;  // terminal symbol
	public const int nt    =  2;  // nonterminal symbol
	public const int eps   =  3;  // empty
	public const int alt   =  4;  // alternative: |
	public const int iter  =  5;  // iteration: { }
	public const int opt   =  6;  // option: [ ]
	public const int rerun =  7;  // the optimization of: a {a} or a {b a}
	public const int wrap  =  8;  // forces line break if found in the outer structure

	
	public int      n;			// node number
	public int      typ;		// t, nt, eps, alt, iter, opt, rerun
	public Node     next;		// to successor node
	public Node     down;		// alt: to next alternative
	public Node     sub;		// alt, iter, opt: to first node of substructure
	public bool     up;			// true: "next" leads to successor in enclosing structure
	public Symbol   sym;		// nt, t: symbol represented by this node
	public Node		itergraph;	// rerun: points to the b in "a {b a}", null if "a {a}"
	public bool     firstLevel; // true if the Node is in the first Level
	
	
	public static bool trace=false;

	
	public Node(Symbol sym) {
		this.typ = sym.typ; this.sym = sym; 
		n = nodes.Count;
		nodes.Add(this);
	}
	
	public Node(int typ, Node sub) {
		this.typ = typ; 
		n = nodes.Count;
		nodes.Add(this);
		this.sub = sub;
	}

	//only for searching nt/t nodes
	public static Node Find(string name) {
		foreach (Node n in nodes)
			if (n.sym!=null && n.sym.name == name) return n;
		return null;
	}
	
	//can change the type of node from t to nt later on
	public static void terminalToNt(string name)	{		
		foreach (Node n in nodes)	{
			if (n.sym!=null && n.sym.name == name) {
				n.typ=Node.nt;
			}
		}
	}
	
	//----------------- for printing ----------------------
	
	static int Ptr(Node p, bool up) {
		if (p == null) return 0; 
		else if (up) return -p.n;
		else return p.n;
	}
	
	
	public static void PrintNodes() {
		Console.WriteLine("Graph nodes:");
		Console.WriteLine("(S...Starting nodes)");
		Console.WriteLine("--------------------------------------------");
		Console.WriteLine("S   n type name          next  down   sub   ");
		Console.WriteLine("--------------------------------------------");

		foreach (Node p in nodes) {
			
			bool nt=false;
			foreach (Symbol s in Symbol.nonterminals)	{
				if (s.graph.l.n == p.n) {
					Console.Write("*");
					nt=true;
				}
			}
			if(!nt) Console.Write(" ");
			
			Console.Write("{0,4} {1} ", p.n, nTyp[p.typ]);			
			
			if (p.sym != null)	Console.Write("{0,12} ", p.sym.name);
			else Console.Write("             ");
			
			Console.Write("{0,5} ", Ptr(p.next, p.up));
			
			switch (p.typ) {
				case alt: case iter: case opt: case rerun:
					Console.Write("{0,5} {1,5}", Ptr(p.down, false), Ptr(p.sub, false)); break;
				case eps: 
					Console.Write("           "); break;
			}
			
			Console.WriteLine();
		}
		Console.WriteLine();
	}
	
	//----------------- for drawing ----------------------
	
	/**************default Settings**********************/
	private static bool  showBorders				= false;					// show the rectangles around the components
	
	private static int   defaultComponentArcSize	= 16;
	private static int   defaultComponentGapWidth  	= 32;
	private static int   defaultComponentGapHeight 	= 10;
	private static Font  defaultCharFont			= new Font("Times",12);
	private static int   defaultArrowSize			= 3;
	private static Pen   defaultLinePen				= new Pen(Color.Black,1);
	private static int   defaultSymbolGapHeight 	= 0;
	private static Color defaultCharColor			= Color.Black;
	
	/**********initialize variables with default settings***********/
	private static int 	 componentArcSize 	= defaultComponentArcSize;			// size of the arcs
	private static int 	 componentGapWidth 	= defaultComponentGapWidth;			// gap between subcomponent size and actual size
	private static int 	 componentGapHeight	= defaultComponentGapHeight;		// gap between subcomponent size and actual size
	private static Font  charFont			= defaultCharFont;					// font of the t and nt symbols
	private static int 	 arrowSize			= defaultArrowSize;					// size of the arrows
	private static Pen 	 linePen			= defaultLinePen;					// color and thickness of the line
	private static int 	 symbolGapHeight 	= defaultSymbolGapHeight;			// gap between the line of the symbol and the font
	private static Color charColor			= defaultCharColor;					// fontColor of the T and NT symbols
	private static int 	 fontHeight			= (int)defaultCharFont.Height;		// needed to make the gap between the symbol and and the font possible
	private static bool	 optimizeGraph		= true;								// enable optimizations?
	
	/*****************other variables needed for the drawing********/
	public Size 	size 		= new Size(0,0);			// the required size to draw the node
	public Size 	altSize 	= new Size(0,0);			// the required size to draw a construct of alts or the size of the firstcomponent in the special rerun-node (itergraph!=null) 
	public Size 	iterSize 	= new Size(0,0);			// the size of the second component in the special rerun Node (itergraph!=null)
	public PointF 	posBegin 	= new PointF(0,0);			// the point in the left above corner of the component
	public PointF	posLine 	= new PointF(0,0);			// the point of the line of the component
	public PointF 	posEnd 		= new PointF(0,0);			// the point in the left down corner of the component	
	private static Size 	symbolSize 				= new Size(1,1);			// the total size of the current Rule
	private static int 		beginningXCoordinate 	= 50;						// where the drawing starts (X)
	private static int 		beginningYCoordinate 	= 40;						// where the drawing starts (Y)
	private static Graphics g						= EbnfForm.BitmapGraphics;  // the graphics object from the EBNFForm on witch the drawing takes place
	
	public static Font CharFont {
		set {
			charFont=value;
			fontHeight=(int)charFont.Height+symbolGapHeight;
		}
		get {
			return charFont;
		}
	}
	
	public static Color CharColor {
		set {
			charColor=value;
		}
		get {
			return charColor;
		}
	}
	
	public static int ArrowSize {
		set {
			arrowSize=value;
		}
		get {
			return arrowSize;
		}
	}
	
	public static bool OptimizeGraph {
		set {
			optimizeGraph=value;
		}
		get {
			return optimizeGraph;
		}
	}
	
	public static int SymbolGapHeight {
		set {
			symbolGapHeight=value;
		}
		get {
			return symbolGapHeight;
		}
	}
	
	public static int ComponentGapHeight {
		set {
			componentGapHeight=value;
			if(componentGapHeight/2+fontHeight/2<defaultComponentArcSize)
				componentArcSize=(componentGapHeight+fontHeight)/2;
			else
				componentArcSize=defaultComponentArcSize;
			if(componentArcSize%2!=0) componentArcSize-=1;
		}
		get {
			return componentGapHeight;
		}
	}
	
	public static int ComponentGapWidth {
		set {
			componentGapWidth=value;
		}
		get {
			return componentGapWidth;
		}
	}
	
	public static Pen LinePen {
		set {
			linePen=value;
		}
		get {
			return linePen;
		}		
	}
	
	public static Size SymbolSize {
		get {
			return symbolSize;
		}
	}
	
	public static void restoreDefaultSettings() {
		componentArcSize 	= defaultComponentArcSize;			// size of the arcs
		componentGapWidth 	= defaultComponentGapWidth;			// gap between subcomponent size and actual size
		ComponentGapHeight	= defaultComponentGapHeight;		// gap between subcomponent size and actual size
		charFont			= defaultCharFont;					// font of the t and nt symbols
		arrowSize			= defaultArrowSize;					// size of the arrows
		linePen				= new Pen(Color.Black,1);			// color and thickness of the line
		symbolGapHeight 	= defaultSymbolGapHeight;			// gap between the line of the symbol and the font
		charColor			= defaultCharColor;					// fontColor of the T and NT symbols
		fontHeight			= (int)defaultCharFont.Height;		// needed to make the gap between the symbol and and the font possible
		optimizeGraph		= true;
	}
	
	public static void calcDrawing()	{
		foreach(Symbol s in Symbol.nonterminals)	{
				
			s.graph.graphSize=s.graph.l.calcSize();
			s.graph.l.setWrapSize();
			s.graph.l.calcPos(beginningYCoordinate);
			if(Node.trace) {
				PrintNodes();
				Console.WriteLine("\n\n"+s.graph.graphSize.ToString());
			}
		}
	}
	
	// calculates the size if there are wraps in the rule
	public void setWrapSize() {
		Node n=this;
		int maxH=0;
		while(n!=null) {
			n.firstLevel=true;
			if(n.typ==Node.wrap)	{
				n.size.Height=maxH;
				maxH=0;
			}
			else {
				if(n.typ==Node.iter) {
					if(maxH<n.size.Height+(fontHeight+componentGapHeight)/2)
						maxH=n.size.Height+(fontHeight+componentGapHeight)/2;
					
				}
				else if(maxH<n.size.Height || maxH<n.altSize.Height) {
					if(n.altSize.Height!=0)
						maxH=n.altSize.Height;
					else
						maxH=n.size.Height;
				}				
			}
		n=n.next;
		}
	}
	
	// calculates the size of each symbol
	public Size calcSize()	{
		Node n=this; 							//current node in the level
		Size s=new Size();						//alt,iter,opt: size of current construct
		int iterCompensation=0;
		bool samelevel=true;					//next node in same level?
		int realHeight=n.calcHeight();
		Size maxTotalSize=new Size(0,0);
		while(n!=null && samelevel)	{
			
			if(n.typ==Node.t || n.typ==Node.nt) {
				n.size.Height =fontHeight+componentGapHeight;
				n.size.Width = (int)g.MeasureString(n.sym.name,charFont).Width+fontHeight/3;
				if(!n.up && n.next!=null && n.next.typ==Node.wrap && n.next.size.Height==0) {
					if(!n.next.up && n.next.next!=null && (n.next.next.typ==Node.t || n.next.next.typ==Node.nt)) {
						s.Width+=componentGapWidth/2;
					}	
				}
				if(!n.up && n.next!=null && (n.next.typ==Node.t || n.next.typ==Node.nt)) {
					s.Width+=componentGapWidth/2;
				}
			}
			else if(n.typ==Node.eps)	{
				
				n.size.Height = fontHeight+componentGapHeight;
				n.size.Width = componentGapWidth;
			}
			else if(n.typ==Node.opt)	{		
				n.size=n.sub.calcSize();			
				n.size.Width  += componentGapWidth*2;
				n.size.Height += componentGapHeight/2;
			}			
			else if(n.typ==Node.iter)	{	
				n.size=n.sub.calcSize();
				n.size.Width  += componentGapWidth*2;
			}
			else if(n.typ==Node.wrap)	{	
				maxTotalSize.Height+=s.Height-componentGapHeight/2;
				if(maxTotalSize.Width<s.Width)
					maxTotalSize.Width=s.Width;
				s.Height=0;
				s.Width=0;
			}
			else if(n.typ==Node.rerun)	{	
				n.size=n.sub.calcSize();
				if(n.itergraph!=null) {
					n.altSize=n.size;
					if(n.size.Width<n.itergraph.calcSize().Width)
						n.size.Width=n.itergraph.calcSize().Width;
					n.size.Height+=n.itergraph.calcSize().Height;
					n.iterSize=n.itergraph.calcSize();
				}
				else
					n.size.Height += componentGapHeight/2;	
				n.size.Width  += componentGapWidth*2;
			}
			else if(n.typ==Node.alt)	{			
				Node a=n;int maxH= -componentGapHeight, maxW=0;
				while(a!=null)	{				
					a.size=a.sub.calcSize();				
					maxH += a.size.Height;
					if(a.size.Width>maxW) maxW=a.size.Width;
					a=a.down;
					
				}
				if(n.sub.typ==iter && realHeight!=0) maxH+=(fontHeight+componentGapHeight)/2;
				maxW += 2*componentGapWidth;
				maxH += componentGapHeight;
				
				n.altSize.Height=maxH;
				n.altSize.Width=maxW;			
			}
			if(n.typ==Node.iter&&realHeight!=0) {
				iterCompensation=(fontHeight+componentGapHeight)/2;
			}
			if(n.typ==Node.alt)	{
				if(s.Height<n.altSize.Height) s.Height=n.altSize.Height;
				s.Width += n.altSize.Width;
			} else {
				if(s.Height<n.size.Height) s.Height=n.size.Height;
				s.Width += n.size.Width;
			}
			if(n.typ==Node.iter) {
				if(s.Height<n.size.Height+iterCompensation) 	s.Height=n.size.Height+iterCompensation;
			}
			if(n.up) {
				samelevel=false;
			}
			n=n.next;

		}
		if(maxTotalSize.Width!=0) {
			maxTotalSize.Height+=s.Height-componentGapHeight/2;
			if(maxTotalSize.Width<s.Width)
				maxTotalSize.Width=s.Width;
			return maxTotalSize;
		}
		else
			return s;
	}
	
	// calculates the total height of all symbols wich are in the same horizontal level
	public int calcHeight()	{
		Node n=this; 							//current node in the level
		int realHeight=0;
		bool samelevel=true;					//next node in same level?
		while(n!=null && samelevel)	{
			if(n.typ==Node.nt|| n.typ==Node.t)  {
				if(realHeight<n.size.Height)
					realHeight=n.size.Height;
			}
			else if(n.typ==Node.iter) {
			 	int tmpHeight=0;
				if(realHeight<tmpHeight)
					realHeight=tmpHeight;				
			}
			else if(n.typ==Node.opt||n.typ==Node.rerun ) {
			 	int tmpHeight=n.sub.calcHeight();
				if(realHeight<tmpHeight){}
					realHeight=tmpHeight;
			}
			else if(n.typ==Node.alt ) {
				int tmpHeight=n.sub.calcHeight();
				if(realHeight<tmpHeight){}
					realHeight=tmpHeight;				
			}
			else if(n.typ==Node.eps) {
				if(realHeight<fontHeight*3/2)
					realHeight=fontHeight+componentGapHeight;
			}
			if(n.up) {
				samelevel=false;
			}
			n=n.next;
		}
		return realHeight;
	}
	
	
	// calcualtes the horizontal position of the symbols
	public void calcPos(float posBegin)	{
		Node n=this; 							//current node in the level
		int realHeight=calcHeight();
		bool samelevel=true;					//next node in same level?
		while(n!=null && samelevel)	{
			if(n.typ==Node.nt||n.typ==Node.t)  {
				n.posLine.Y=posBegin+realHeight/2;
				n.posBegin.Y=n.posLine.Y-(n.size.Height-componentGapHeight)/2;
				n.posEnd.Y=n.posLine.Y+(n.size.Height-componentGapHeight)/2;
			}
			else if(n.typ==Node.eps)	{
				n.posLine.Y=posBegin+n.size.Height/2;
				n.posBegin.Y=posBegin;
				n.posEnd.Y=posBegin+n.size.Height;
			}
			else if(n.typ==Node.opt)	{		
				n.posLine.Y=posBegin+realHeight/2;
				n.posBegin.Y=posBegin;
				n.posEnd.Y=posBegin+n.size.Height;
				n.sub.calcPos(n.posBegin.Y);
			}
			else if(n.typ==Node.rerun)	{		
				n.posLine.Y=posBegin+realHeight/2;
				n.posBegin.Y=posBegin;
				n.posEnd.Y=posBegin+n.size.Height;
				if(n.itergraph!=null) {
					n.itergraph.calcPos(posBegin+n.altSize.Height);
				}
				n.sub.calcPos(n.posBegin.Y);
			}
			else if(n.typ==Node.iter)	{
				if(realHeight==0) {
					n.posLine.Y=posBegin+realHeight/2;
					n.posBegin.Y=posBegin;
					n.posEnd.Y=posBegin+n.size.Height;
				}
				else {
					n.posLine.Y=posBegin+realHeight/2;
					n.posBegin.Y=posBegin+(fontHeight+componentGapHeight)/2;
					n.posEnd.Y=n.posBegin.Y+n.size.Height;	
				}
				n.sub.calcPos(n.posLine.Y);
			}
			else if(n.typ==Node.wrap && firstLevel) {
				n.posLine.Y=posBegin+realHeight/2;
				n.posEnd.Y=posBegin+n.size.Height;
				posBegin=posBegin+n.size.Height;
				
			}
			else if(n.typ==Node.alt)	{
				n.posLine.Y=posBegin+realHeight/2;
				n.posBegin.Y=posBegin;
				n.posEnd.Y=posBegin+n.altSize.Height;
				if(n.sub.typ==iter && n.calcHeight()!=0 &&n.altSize.Height!=0)
					posBegin+=(fontHeight+componentGapHeight)/2;
				n.sub.calcPos(posBegin);
				if(n.down!=null) {
					n.down.calcPos(posBegin+n.size.Height);
				}
				if(n.sub.typ==iter && n.calcHeight()!=0 &&n.altSize.Height!=0)
				posBegin-=(fontHeight+componentGapHeight)/2;
			}
			if(n.up) {
				samelevel=false;
			}
			n=n.next;
		}
	}
	
	public static void drawComponent(Symbol s)	{
		drawComponent(s,null);
	}
	
	// starts to draw the rule at the given symbol s
	public static void drawComponent(Symbol s, Graphics vg)	{
		if(s!=null)	{
			symbolSize=new Size(s.graph.graphSize.Width+beginningXCoordinate+componentGapWidth*2,s.graph.graphSize.Height+beginningYCoordinate+componentGapHeight*2+5);
			EbnfForm.Drawarea=new Bitmap(Node.SymbolSize.Width,Node.SymbolSize.Height,	System.Drawing.Imaging.PixelFormat.Format24bppRgb);
			
			//decide either draw on visualized bitmap or record a metafile
			if(vg!=null) {
				g=vg;
				g.FillRectangle(new SolidBrush(Color.White),0,0,symbolSize.Width,symbolSize.Height);
			}
			else g=EbnfForm.BitmapGraphics;
			PointF p=new PointF(beginningXCoordinate,beginningYCoordinate-30);
			g.DrawString(s.name,new Font("Times New Roman",14),new SolidBrush(Color.Black),p.X-20,p.Y);
			//g.DrawRectangle(new Pen(Color.Orange,2),p.X,p.Y+30,s.graph.graphSize.Width,s.graph.graphSize.Height);
			g.DrawLine(linePen ,beginningXCoordinate-componentGapWidth/4-componentArcSize/2 	, s.graph.l.posLine.Y 	, beginningXCoordinate	, s.graph.l.posLine.Y	);
			s.graph.l.drawComponents(p,s.graph.graphSize);
			
		}
	}

	
	// draws arrows for different directions
	public void drawArrow(Pen pen,float x, float y, float x1, float y1, String direction) {
		g.DrawLine(pen,x,y,x1,y1);
		PointF arrowHead	 = new PointF(x1,y1);
		PointF arrowLeft;	 
		PointF arrowRight;
		if(direction=="right") {
			arrowLeft	= new PointF(x1-arrowSize*2,y1-arrowSize);
			arrowRight  = new PointF(x1-arrowSize*2,y1+arrowSize);
			PointF[] curvePoints = {arrowHead,arrowLeft,arrowRight};
			g.FillPolygon(pen.Brush, curvePoints);
		}else if(direction=="up") {
			arrowLeft	= new PointF(x1-arrowSize,y1+arrowSize*2);
			arrowRight  = new PointF(x1+arrowSize,y1+arrowSize*2);
			PointF[] curvePoints = {arrowHead,arrowLeft,arrowRight};
			g.FillPolygon(pen.Brush, curvePoints);	
		}else if(direction=="left") {
			arrowLeft	= new PointF(x1+arrowSize*2,y1+arrowSize);
			arrowRight  = new PointF(x1+arrowSize*2,y1-arrowSize);
			PointF[] curvePoints = {arrowHead,arrowLeft,arrowRight};
			g.FillPolygon(pen.Brush, curvePoints);
		}else if(direction=="down") {
			arrowLeft	= new PointF(x1-arrowSize,y1-arrowSize*2);
			arrowRight  = new PointF(x1+arrowSize,y1-arrowSize*2);
			PointF[] curvePoints = {arrowHead,arrowLeft,arrowRight};
			g.FillPolygon(pen.Brush, curvePoints);	
		}
	}
	
	/*
	 * Draws the components from left to right.
	 * Rekursive procedure. Therefore also the drawComponentsInverse procedure is used.
	 * Each component paints itself and then they give their coordinates to its innercomponents.
	*/
	public void drawComponents(PointF p,Size s)	{
		Node n=this; 							// current node in the level
		bool samelevel=true;					// next node in same level?
		PointF p1=new Point(0,0);				// needed for calculating the X-Coordinate for the recursion				
		
		while(n!=null && samelevel)	{
			
			if(n.typ==Node.t || n.typ==Node.nt) {
				if(showBorders) g.DrawRectangle(new Pen(Color.PaleGreen,1),p.X,n.posBegin.Y-componentGapHeight/2,n.size.Width,n.size.Height);
				
				if(n.typ==Node.t) {
					// the quarter Arcs
					g.DrawArc( linePen , p.X													, n.posBegin.Y	, (n.size.Height-componentGapHeight)/2 , (n.size.Height-componentGapHeight)/2 , 180 , 90);
					g.DrawArc( linePen , p.X													, n.posLine.Y	, (n.size.Height-componentGapHeight)/2 , (n.size.Height-componentGapHeight)/2 ,  90 , 90);
					g.DrawArc( linePen , p.X+n.size.Width-(n.size.Height-componentGapHeight)/2	, n.posBegin.Y	, (n.size.Height-componentGapHeight)/2 , (n.size.Height-componentGapHeight)/2 , 270 , 90);
					g.DrawArc( linePen , p.X+n.size.Width-(n.size.Height-componentGapHeight)/2	, n.posLine.Y	, (n.size.Height-componentGapHeight)/2 , (n.size.Height-componentGapHeight)/2 ,   0 , 90);
					// the short vertical and horizontal lines between the quarter Arcs
					g.DrawLine(linePen , p.X+(n.size.Height-componentGapHeight)/4-1	, n.posBegin.Y 											, p.X+n.size.Width-(n.size.Height-componentGapHeight)/4+1	, n.posBegin.Y										);
					g.DrawLine(linePen , p.X+(n.size.Height-componentGapHeight)/4-1	, n.posEnd.Y 											, p.X+n.size.Width-(n.size.Height-componentGapHeight)/4+1	, n.posEnd.Y										);
					g.DrawLine(linePen , p.X										, n.posLine.Y+(n.size.Height-componentGapHeight)/4+1 	, p.X														, n.posLine.Y-(n.size.Height-componentGapHeight)/4-1);
					g.DrawLine(linePen , p.X+n.size.Width							, n.posLine.Y+(n.size.Height-componentGapHeight)/4+1 	, p.X+n.size.Width											, n.posLine.Y-(n.size.Height-componentGapHeight)/4-1);
				}
				else {
					n.posBegin.X=p.X;
					n.posEnd.X=p.X+n.size.Width;
					g.DrawRectangle(linePen , n.posBegin.X , n.posBegin.Y , n.size.Width , (n.size.Height-componentGapHeight));
				}
				StringFormat drawFormat  = new StringFormat();
				drawFormat.Alignment 	 = StringAlignment.Center;
				drawFormat.LineAlignment = StringAlignment.Center;
				g.DrawString(n.sym.name , charFont , new SolidBrush(charColor) , new Rectangle((int)p.X,(int)n.posBegin.Y,n.size.Width,n.size.Height-componentGapHeight-2),drawFormat);
				drawArrow(linePen , p.X , n.posLine.Y , p.X , n.posLine.Y , "right");
				p.X+=n.size.Width;
				// draw lines between t and nt nodes
				if(!n.up && n.next!=null && (n.next.typ==Node.t || n.next.typ==Node.nt)) {
					drawArrow(linePen , p.X , n.posLine.Y , p.X+componentGapWidth/2 , n.posLine.Y , "right");
					p.X+=componentGapWidth/2;
				}
				if(!n.up && n.next!=null && n.next.typ==Node.wrap && n.next.size.Height==0) {
					drawArrow(linePen , p.X , n.posLine.Y , p.X+componentGapWidth/2 , n.posLine.Y , "right");
					p.X+=componentGapWidth/2;					
				}
			}
			else if(n.typ==Node.eps) {
				if(showBorders) g.DrawRectangle(new Pen(Color.DarkKhaki,1),p.X,n.posBegin.Y,n.size.Width,n.size.Height);
				
				g.DrawLine(linePen , p.X , n.posLine.Y , p.X+n.size.Width , n.posLine.Y);

			}
			else if(n.typ==Node.opt)	{
				if(showBorders) g.DrawRectangle(new Pen(Color.DarkKhaki,1),p.X,n.posBegin.Y,n.size.Width,n.size.Height);
				
				// the two short lines at the beginning and the end
				g.DrawLine(linePen , p.X				, n.posLine.Y , p.X				+componentGapWidth	, n.posLine.Y);
				g.DrawLine(linePen , p.X +n.size.Width	, n.posLine.Y , p.X+n.size.Width-componentGapWidth	, n.posLine.Y);
				// the quarter Arcs
				g.DrawArc( linePen , p.X + componentGapWidth/4 - componentArcSize/2					 , n.posLine.Y										, componentArcSize , componentArcSize , 270 , 90);
				g.DrawArc( linePen , p.X + componentGapWidth/4 + componentArcSize/2					 , n.posEnd.Y-componentArcSize-componentGapHeight/2	, componentArcSize , componentArcSize ,  90 , 90);
				g.DrawArc( linePen , p.X - componentGapWidth/4 - componentArcSize/2	  + n.size.Width , n.posLine.Y										, componentArcSize , componentArcSize , 180 , 90);
				g.DrawArc( linePen , p.X - componentGapWidth/4 - componentArcSize*3/2 + n.size.Width , n.posEnd.Y-componentArcSize-componentGapHeight/2	, componentArcSize , componentArcSize ,   0 , 90);
				// the short vertical lines between the quarter Arcs
				g.DrawLine(linePen , p.X + componentGapWidth/4 + componentArcSize/2					, n.posLine.Y+componentArcSize/2 	, p.X + componentGapWidth/4 + componentArcSize/2					, n.posEnd.Y-componentArcSize/2-componentGapHeight/2+1);
				g.DrawLine(linePen , p.X - componentGapWidth/4 - componentArcSize/2 + n.size.Width	, n.posLine.Y+componentArcSize/2 	, p.X - componentGapWidth/4 - componentArcSize/2 + n.size.Width		, n.posEnd.Y-componentArcSize/2-componentGapHeight/2+1);
				// the the long horizontal line between the quarter Arcs					
				g.DrawLine(linePen , p.X + componentGapWidth/4 + componentArcSize					, n.posEnd.Y-componentGapHeight/2	, p.X - componentGapWidth/4 - componentArcSize	 + n.size.Width+1	, n.posEnd.Y-componentGapHeight/2 				  	  );

				p1.X=p.X+componentGapWidth;
				n.sub.drawComponents(p1,n.size);
				p.X+=n.size.Width;
			}
			else if(n.typ==Node.rerun&&n.itergraph==null)	{
				if(showBorders) g.DrawRectangle(new Pen(Color.Green,1),p.X,n.posBegin.Y,n.size.Width,n.size.Height);
				
				// the two short lines at the beginning and the end
				g.DrawLine(linePen , p.X				, n.posLine.Y , p.X					+componentGapWidth	, n.posLine.Y);
				g.DrawLine(linePen , p.X +n.size.Width	, n.posLine.Y , p.X+n.size.Width	-componentGapWidth	, n.posLine.Y);
				// the quarter Arcs
				g.DrawArc( linePen , p.X + componentGapWidth/4 +componentArcSize/2					, n.posEnd.Y-componentGapHeight/2-componentArcSize	, componentArcSize , componentArcSize ,  90 , 90);
				g.DrawArc( linePen , p.X + componentGapWidth/4 +componentArcSize/2					, n.posLine.Y										, componentArcSize , componentArcSize , 180 , 90);
				g.DrawArc( linePen , p.X - componentGapWidth/4 -componentArcSize*3/2 + n.size.Width	, n.posEnd.Y-componentGapHeight/2-componentArcSize	, componentArcSize , componentArcSize ,   0 , 90);
				g.DrawArc( linePen , p.X - componentGapWidth/4 -componentArcSize*3/2 + n.size.Width	, n.posLine.Y										, componentArcSize , componentArcSize , 270 , 90);
				// the short vertical lines between the quarter Arcs
				g.DrawLine(linePen , p.X + componentGapWidth/4 + componentArcSize/2					, n.posLine.Y+componentArcSize/2  , p.X + componentGapWidth/4 + componentArcSize/2					, n.posEnd.Y-componentGapHeight/2-componentArcSize/2+1 );
				g.DrawLine(linePen , p.X - componentGapWidth/4 - componentArcSize/2+n.size.Width 	, n.posLine.Y+componentArcSize/2  , p.X - componentGapWidth/4 - componentArcSize/2+ n.size.Width 	, n.posEnd.Y-componentGapHeight/2-componentArcSize/2+1 );
				// the the long horizontal line between the quarter Arcs					
				g.DrawLine(linePen , p.X + componentGapWidth/4 + componentArcSize-1					, n.posEnd.Y-componentGapHeight/2 , p.X - componentGapWidth/4 - componentArcSize  + n.size.Width+1	, n.posEnd.Y-componentGapHeight/2);
				
				p1.X=p.X+componentGapWidth;
				n.sub.drawComponents(p1,n.size);
				p.X+=n.size.Width;
			}
			else if(n.typ==Node.rerun&&n.itergraph!=null) {
				if(showBorders) g.DrawRectangle(new Pen(Color.Fuchsia,1),p.X,n.posBegin.Y,n.size.Width,n.size.Height);

				// the two short lines at the beginning and the end of the first component
				g.DrawLine(linePen , p.X													, n.posLine.Y , p.X + n.size.Width/2-n.altSize.Width/2-1	, n.posLine.Y);
				g.DrawLine(linePen , p.X + n.size.Width/2+n.altSize.Width/2+1				, n.posLine.Y , p.X + n.size.Width						, n.posLine.Y);
				// the quarter Arcs
				g.DrawArc( linePen , p.X + componentGapWidth/4 +componentArcSize/2					, n.itergraph.posLine.Y-componentArcSize	, componentArcSize , componentArcSize ,  90 , 90);
				g.DrawArc( linePen , p.X + componentGapWidth/4 +componentArcSize/2					, n.posLine.Y								, componentArcSize , componentArcSize , 180 , 90);
				g.DrawArc( linePen , p.X - componentGapWidth/4 -componentArcSize*3/2 + n.size.Width	, n.itergraph.posLine.Y-componentArcSize	, componentArcSize , componentArcSize ,   0 , 90);
				g.DrawArc( linePen , p.X - componentGapWidth/4 -componentArcSize*3/2 + n.size.Width	, n.posLine.Y								, componentArcSize , componentArcSize , 270 , 90);
				// the short vertical lines between the quarter Arcs
				g.DrawLine(linePen , p.X + componentGapWidth/4 + componentArcSize/2					, n.posLine.Y+componentArcSize/2 	, p.X + componentGapWidth/4 + componentArcSize/2			   , n.itergraph.posLine.Y-componentArcSize/2+1	);
				g.DrawLine(linePen , p.X - componentGapWidth/4 - componentArcSize/2+n.size.Width 	, n.posLine.Y+componentArcSize/2 	, p.X - componentGapWidth/4 - componentArcSize/2+ n.size.Width , n.itergraph.posLine.Y-componentArcSize/2+1	);
				// the two short lines at the beginning and the end of the second component					
				g.DrawLine(linePen , p.X + componentGapWidth/4 + componentArcSize	, n.itergraph.posLine.Y	, p.X + n.size.Width/2-n.iterSize.Width/2-1						, n.itergraph.posLine.Y	);
				g.DrawLine(linePen , p.X + n.size.Width/2+n.iterSize.Width/2+1		, n.itergraph.posLine.Y	, p.X - componentGapWidth/4 - componentArcSize + n.size.Width+1	, n.itergraph.posLine.Y	);
				
				n.itergraph.drawComponentsInverse(new PointF(p.X + n.size.Width/2+n.iterSize.Width/2 , n.posEnd.Y) , n.size);
				n.sub.drawComponents(			  new PointF(p.X + n.size.Width/2-n.altSize.Width /2 , n.posEnd.Y) , n.size);
				p.X+=n.size.Width;				
			}
			else if(n.typ==Node.iter)	{	
				if(showBorders) g.DrawRectangle(new Pen(Color.DarkViolet,1),p.X,n.posBegin.Y,n.size.Width,n.size.Height);
				
				// the quarter Arcs
				g.DrawArc( linePen , p.X + componentGapWidth/4 +componentArcSize/2					, n.sub.posLine.Y-componentArcSize	, componentArcSize , componentArcSize ,  90 , 90);
				g.DrawArc( linePen , p.X + componentGapWidth/4 +componentArcSize/2					, n.posLine.Y						, componentArcSize , componentArcSize , 180 , 90);
				g.DrawArc( linePen , p.X - componentGapWidth/4 -componentArcSize*3/2 + n.size.Width	, n.sub.posLine.Y-componentArcSize	, componentArcSize , componentArcSize ,   0 , 90);
				g.DrawArc( linePen , p.X - componentGapWidth/4 -componentArcSize*3/2 + n.size.Width	, n.posLine.Y						, componentArcSize , componentArcSize , 270 , 90);
				// the short vertical lines between the quarter Arcs
				g.DrawLine(linePen , p.X + componentGapWidth/4 + componentArcSize/2					, n.posLine.Y+componentArcSize/2	, p.X + componentGapWidth/4 + componentArcSize/2				, n.sub.posLine.Y-componentArcSize/2+1	);
				g.DrawLine(linePen , p.X - componentGapWidth/4 - componentArcSize/2 + n.size.Width	, n.posLine.Y+componentArcSize/2 	, p.X - componentGapWidth/4 - componentArcSize/2 + n.size.Width	, n.sub.posLine.Y-componentArcSize/2+1	);
				// the two short horizontal lines between the quater Arcs and the components
				g.DrawLine(linePen , p.X + componentGapWidth/4 + componentArcSize-1	, n.sub.posLine.Y 			, p.X + componentGapWidth										, n.sub.posLine.Y );
				g.DrawLine(linePen , p.X - componentGapWidth   + n.size.Width		, n.sub.posLine.Y			, p.X + n.size.Width-componentGapWidth/4 - componentArcSize+1	, n.sub.posLine.Y );
				// the long horizontal line in the middle
				g.DrawLine(linePen , p.X , n.posLine.Y , p.X + n.size.Width , n.posLine.Y);
	
				p1.X=p.X-componentGapWidth+n.size.Width;
				n.sub.drawComponentsInverse(p1,n.size);
				p.X+=n.size.Width;
			}
			else if(n.typ==Node.wrap && n.size.Height!=0 && n.next!=null) {
				
				// the short horizontal line after the first component
				g.DrawLine(linePen , p.X 					, n.posLine.Y		, p.X + componentGapWidth/4+1				, n.posLine.Y		);
				// the short horizontal line at the beginning of the second component
				g.DrawLine(linePen , beginningXCoordinate  	, n.next.posLine.Y	, beginningXCoordinate-componentGapWidth/4	, n.next.posLine.Y	);				
				// the quarter Arcs
				g.DrawArc( linePen , p.X + componentGapWidth/4-componentArcSize/2					, n.posLine.Y						, componentArcSize , componentArcSize ,  270 , 90);
				g.DrawArc( linePen , p.X + componentGapWidth/4-componentArcSize/2					, n.posEnd.Y-componentArcSize		, componentArcSize , componentArcSize ,    0 , 90);
				g.DrawArc( linePen , beginningXCoordinate-componentGapWidth/4-componentArcSize/2	, n.posEnd.Y						, componentArcSize , componentArcSize ,  180 , 90);
				g.DrawArc( linePen , beginningXCoordinate-componentGapWidth/4-componentArcSize/2	, n.next.posLine.Y-componentArcSize	, componentArcSize , componentArcSize ,   90 , 90);
				// the short vertical lines between the quarter Arcs
				g.DrawLine(linePen , p.X + componentGapWidth/4+componentArcSize/2					, n.posLine.Y+componentArcSize/2	, p.X + componentGapWidth/4+componentArcSize/2					, n.posEnd.Y-componentArcSize/2			+1	);
				g.DrawLine(linePen , beginningXCoordinate-componentGapWidth/4-componentArcSize/2	, n.posEnd.Y+componentArcSize/2		, beginningXCoordinate-componentGapWidth/4-componentArcSize/2	, n.next.posLine.Y-componentArcSize/2	+1	);
				// the long horizontal line in the middle oft the two components
				g.DrawLine(linePen , p.X + componentGapWidth/4+1 									, n.posEnd.Y 						, beginningXCoordinate-componentGapWidth/4 						, n.posEnd.Y								);
	
				p.X=beginningXCoordinate;
			}
			else if(n.typ==Node.alt)	{			
				if(showBorders) g.DrawRectangle(new Pen(Color.Red,1),p.X,n.posBegin.Y,n.altSize.Width,n.altSize.Height);
				
				// the two short lines at the beginning and the end of the altcomponent
				g.DrawLine(	linePen , p.X				 		, n.posLine.Y , p.X					+componentArcSize*3/2		, n.posLine.Y	);
				g.DrawLine(	linePen , p.X+n.altSize.Width		, n.posLine.Y , p.X+n.altSize.Width -+componentArcSize*3/2		, n.posLine.Y	);
				Node a=n;
				bool first=true;
				while(a!=null)	{				
					// the horizontal lines at the beginning and the end
					g.DrawLine( linePen , p.X +componentArcSize*3/2 						, a.sub.posLine.Y , p.X	+(n.altSize.Width-a.size.Width)/2					, a.sub.posLine.Y);
					g.DrawLine( linePen , p.X -componentArcSize*3/2	+ n.altSize.Width+1		, a.sub.posLine.Y , p.X	+(n.altSize.Width-a.size.Width)/2 + a.size.Width	, a.sub.posLine.Y);
					// the first alternative draws different arcs
					if(first) {
						g.DrawArc ( linePen , p.X   									, n.posLine.Y							, componentArcSize , componentArcSize , 270 , 90);
						g.DrawArc ( linePen , p.X  +n.altSize.Width-componentArcSize 	, n.posLine.Y							, componentArcSize , componentArcSize , 180 , 90);
						first=false;
					}
					// else draw other arcs and vertical lines
					else {
						g.DrawArc ( linePen , p.X  + componentArcSize   					, a.sub.posLine.Y-componentArcSize		, componentArcSize 			, componentArcSize , 90 , 90);
						g.DrawLine( linePen , p.X  + componentArcSize   					, n.posLine.Y +componentArcSize/2		, p.X  + componentArcSize 						, a.posLine.Y-componentArcSize/2+1);
						g.DrawArc ( linePen , p.X  - componentArcSize*2 + n.altSize.Width 	, a.sub.posLine.Y - componentArcSize	, componentArcSize 			, componentArcSize , 0 , 90);
						g.DrawLine( linePen , p.X  - componentArcSize + n.altSize.Width  	, n.posLine.Y +componentArcSize/2		, p.X  - componentArcSize + n.altSize.Width 	, a.posLine.Y-componentArcSize/2+1);
					}
					a.sub.drawComponents(new PointF(p.X+(n.altSize.Width-a.size.Width)/2 , a.posEnd.Y) , a.size);
					a=a.down;
				}
				p.X+=n.altSize.Width;
			}

			if(n.up)
				samelevel=false;
			if(n.next==null && firstLevel) {
				g.DrawLine( linePen , p.X   							, n.posLine.Y , p.X+componentGapWidth/4 		  , n.posLine.Y			 );
				drawArrow(	linePen , p.X+componentGapWidth/4+arrowSize , n.posLine.Y , p.X+componentGapWidth/4+arrowSize , n.posLine.Y , "right");
			}
			n=n.next;
		}
	}
	
	/*
	 * Draw the components from right to left.
	 * Needed if for example in an iter-node.
	 */
	public void drawComponentsInverse(PointF p,Size s)	{
		Node n=this; 							//current node in the level
		bool samelevel=true;					//next node in same level?
		PointF p1=new Point(0,0);				

				
		while(n!=null && samelevel)	{
			p.X-=n.size.Width;
			if(n.typ==Node.t || n.typ==Node.nt) {
				if(showBorders) g.DrawRectangle(new Pen(Color.PaleGreen,1),p.X,n.posBegin.Y-componentGapHeight/2,n.size.Width,n.size.Height);
				if(n.typ==Node.t) {
					// the quarter Arcs
					g.DrawArc( linePen , p.X													, n.posBegin.Y	, (n.size.Height-componentGapHeight)/2 , (n.size.Height-componentGapHeight)/2 , 180 , 90);
					g.DrawArc( linePen , p.X													, n.posLine.Y	, (n.size.Height-componentGapHeight)/2 , (n.size.Height-componentGapHeight)/2 ,  90 , 90);
					g.DrawArc( linePen , p.X+n.size.Width-(n.size.Height-componentGapHeight)/2	, n.posBegin.Y	, (n.size.Height-componentGapHeight)/2 , (n.size.Height-componentGapHeight)/2 , 270 , 90);
					g.DrawArc( linePen , p.X+n.size.Width-(n.size.Height-componentGapHeight)/2	, n.posLine.Y	, (n.size.Height-componentGapHeight)/2 , (n.size.Height-componentGapHeight)/2 ,   0 , 90);
					// the short vertical and horizontal lines between the quarter Arcs
					g.DrawLine(linePen , p.X+(n.size.Height-componentGapHeight)/4-1	, n.posBegin.Y 											, p.X+n.size.Width-(n.size.Height-componentGapHeight)/4+1	, n.posBegin.Y										);
					g.DrawLine(linePen , p.X+(n.size.Height-componentGapHeight)/4-1	, n.posEnd.Y 											, p.X+n.size.Width-(n.size.Height-componentGapHeight)/4+1	, n.posEnd.Y										);
					g.DrawLine(linePen , p.X										, n.posLine.Y+(n.size.Height-componentGapHeight)/4+1 	, p.X														, n.posLine.Y-(n.size.Height-componentGapHeight)/4-1);
					g.DrawLine(linePen , p.X+n.size.Width							, n.posLine.Y+(n.size.Height-componentGapHeight)/4+1 	, p.X+n.size.Width											, n.posLine.Y-(n.size.Height-componentGapHeight)/4-1);
				}
				else {
					n.posBegin.X=p.X;
					n.posEnd.X=p.X+n.size.Width;
					g.DrawRectangle(linePen , n.posBegin.X,n.posBegin.Y , n.size.Width , (n.size.Height-componentGapHeight));
				}
				StringFormat drawFormat  = new StringFormat();
				drawFormat.Alignment 	 = StringAlignment.Center;
				drawFormat.LineAlignment = StringAlignment.Center;
				g.DrawString(n.sym.name , charFont , new SolidBrush(charColor) , new Rectangle((int)p.X,(int)n.posBegin.Y,n.size.Width,n.size.Height-componentGapHeight-2),drawFormat);
				drawArrow(linePen , p.X+n.size.Width , n.posLine.Y , p.X+n.size.Width , n.posLine.Y , "left");
				
				if(!n.up && n.next!=null && (n.next.typ==Node.t || n.next.typ==Node.nt)) {
					drawArrow(linePen , p.X , n.posLine.Y , p.X-componentGapWidth/2 , n.posLine.Y , "left");
					p.X-=componentGapWidth/2;
				}
				if(!n.up && n.next!=null && n.next.typ==Node.wrap && n.next.size.Height==0) {
					if(!n.next.up && n.next.next!=null && (n.next.next.typ==Node.t || n.next.next.typ==Node.nt)) {
						drawArrow(linePen , p.X , n.posLine.Y , p.X-componentGapWidth/2 , n.posLine.Y , "left");
						p.X-=componentGapWidth/2;
					}
				}
			}
			else if(n.typ==Node.eps)	{
				if(showBorders) g.DrawRectangle(new Pen(Color.DarkKhaki,1),p.X,n.posBegin.Y,n.size.Width,n.size.Height);
				
				g.DrawLine(linePen , p.X , n.posLine.Y , p.X + n.size.Width , n.posLine.Y);

			}
			else if(n.typ==Node.opt)	{
				if(showBorders) g.DrawRectangle(new Pen(Color.DarkKhaki,1),p.X,n.posBegin.Y,n.size.Width,n.size.Height);

				// the two short lines at the beginning and the end
				g.DrawLine(linePen , p.X				, n.posLine.Y , p.X				+componentGapWidth	, n.posLine.Y);
				g.DrawLine(linePen , p.X +n.size.Width	, n.posLine.Y , p.X+n.size.Width-componentGapWidth	, n.posLine.Y);
				// the quarter Arcs
				g.DrawArc( linePen , p.X + componentGapWidth/4 - componentArcSize/2					 , n.posLine.Y										, componentArcSize , componentArcSize , 270 , 90);
				g.DrawArc( linePen , p.X + componentGapWidth/4 + componentArcSize/2					 , n.posEnd.Y-componentArcSize-componentGapHeight/2	, componentArcSize , componentArcSize ,  90 , 90);
				g.DrawArc( linePen , p.X - componentGapWidth/4 - componentArcSize/2	  + n.size.Width , n.posLine.Y										, componentArcSize , componentArcSize , 180 , 90);
				g.DrawArc( linePen , p.X - componentGapWidth/4 - componentArcSize*3/2 + n.size.Width , n.posEnd.Y-componentArcSize-componentGapHeight/2	, componentArcSize , componentArcSize ,   0 , 90);
				// the short vertical lines between the quarter Arcs
				g.DrawLine(linePen , p.X + componentGapWidth/4 + componentArcSize/2					, n.posLine.Y+componentArcSize/2 	, p.X + componentGapWidth/4 + componentArcSize/2					, n.posEnd.Y-componentArcSize/2-componentGapHeight/2+1);
				g.DrawLine(linePen , p.X - componentGapWidth/4 - componentArcSize/2 + n.size.Width	, n.posLine.Y+componentArcSize/2 	, p.X - componentGapWidth/4 - componentArcSize/2 + n.size.Width		, n.posEnd.Y-componentArcSize/2-componentGapHeight/2+1);
				// the the long horizontal line between the quarter Arcs					
				g.DrawLine(linePen , p.X + componentGapWidth/4 + componentArcSize					, n.posEnd.Y-componentGapHeight/2	, p.X - componentGapWidth/4 - componentArcSize	 + n.size.Width+1	, n.posEnd.Y-componentGapHeight/2 				  	  );

				p1.X=p.X+n.size.Width-componentGapWidth;
				n.sub.drawComponentsInverse(p1,n.size);
			}			
			
			else if(n.typ==Node.rerun && n.itergraph==null)	{
				if(showBorders) g.DrawRectangle(new Pen(Color.Green,1),p.X,n.posBegin.Y,n.size.Width,n.size.Height);

				// the two short lines at the beginning and the end
				g.DrawLine(linePen , p.X				, n.posLine.Y , p.X					+componentGapWidth	, n.posLine.Y);
				g.DrawLine(linePen , p.X +n.size.Width	, n.posLine.Y , p.X+n.size.Width	-componentGapWidth	, n.posLine.Y);
				// the quarter Arcs
				g.DrawArc( linePen , p.X + componentGapWidth/4 +componentArcSize/2					, n.posEnd.Y-componentGapHeight/2-componentArcSize	, componentArcSize , componentArcSize ,  90 , 90);
				g.DrawArc( linePen , p.X + componentGapWidth/4 +componentArcSize/2					, n.posLine.Y										, componentArcSize , componentArcSize , 180 , 90);
				g.DrawArc( linePen , p.X - componentGapWidth/4 -componentArcSize*3/2 + n.size.Width	, n.posEnd.Y-componentGapHeight/2-componentArcSize	, componentArcSize , componentArcSize ,   0 , 90);
				g.DrawArc( linePen , p.X - componentGapWidth/4 -componentArcSize*3/2 + n.size.Width	, n.posLine.Y										, componentArcSize , componentArcSize , 270 , 90);
				// the short vertical lines between the quarter Arcs
				g.DrawLine(linePen , p.X + componentGapWidth/4 + componentArcSize/2					, n.posLine.Y+componentArcSize/2  , p.X + componentGapWidth/4 + componentArcSize/2					, n.posEnd.Y-componentGapHeight/2-componentArcSize/2+1 );
				g.DrawLine(linePen , p.X - componentGapWidth/4 - componentArcSize/2+n.size.Width 	, n.posLine.Y+componentArcSize/2  , p.X - componentGapWidth/4 - componentArcSize/2+ n.size.Width 	, n.posEnd.Y-componentGapHeight/2-componentArcSize/2+1 );
				// the the long horizontal line between the quarter Arcs					
				g.DrawLine(linePen , p.X + componentGapWidth/4 + componentArcSize-1					, n.posEnd.Y-componentGapHeight/2 , p.X - componentGapWidth/4 - componentArcSize  + n.size.Width+1	, n.posEnd.Y-componentGapHeight/2);
				
				p1.X=p.X+n.size.Width-componentGapWidth;
				n.sub.drawComponentsInverse(p1,n.size);
			}
			else if(n.typ==Node.rerun&&n.itergraph!=null) {
				if(showBorders) g.DrawRectangle(new Pen(Color.Fuchsia,1),p.X,n.posBegin.Y,n.size.Width,n.size.Height);

				// the two short lines at the beginning and the end of the first component
				g.DrawLine(linePen , p.X													, n.posLine.Y , p.X + n.size.Width/2-n.altSize.Width/2-1, n.posLine.Y);
				g.DrawLine(linePen , p.X + n.size.Width/2+n.altSize.Width/2+1				, n.posLine.Y , p.X + n.size.Width						, n.posLine.Y);
				// the quarter Arcs
				g.DrawArc( linePen , p.X + componentGapWidth/4 +componentArcSize/2					, n.itergraph.posLine.Y-componentArcSize	, componentArcSize , componentArcSize ,  90 , 90);
				g.DrawArc( linePen , p.X + componentGapWidth/4 +componentArcSize/2					, n.posLine.Y								, componentArcSize , componentArcSize , 180 , 90);
				g.DrawArc( linePen , p.X - componentGapWidth/4 -componentArcSize*3/2 + n.size.Width	, n.itergraph.posLine.Y-componentArcSize	, componentArcSize , componentArcSize ,   0 , 90);
				g.DrawArc( linePen , p.X - componentGapWidth/4 -componentArcSize*3/2 + n.size.Width	, n.posLine.Y								, componentArcSize , componentArcSize , 270 , 90);
				// the short vertical lines between the quarter Arcs
				g.DrawLine(linePen , p.X + componentGapWidth/4 + componentArcSize/2					, n.posLine.Y+componentArcSize/2 	, p.X + componentGapWidth/4 + componentArcSize/2			   , n.itergraph.posLine.Y-componentArcSize/2+1	);
				g.DrawLine(linePen , p.X - componentGapWidth/4 - componentArcSize/2+n.size.Width 	, n.posLine.Y+componentArcSize/2 	, p.X - componentGapWidth/4 - componentArcSize/2+ n.size.Width , n.itergraph.posLine.Y-componentArcSize/2+1	);
				// the two short lines at the beginning and the end of the second component					
				g.DrawLine(linePen , p.X + componentGapWidth/4 + componentArcSize	, n.itergraph.posLine.Y	, p.X + n.size.Width/2-n.iterSize.Width/2-1						, n.itergraph.posLine.Y	);
				g.DrawLine(linePen , p.X + n.size.Width/2+n.iterSize.Width/2+1		, n.itergraph.posLine.Y	, p.X - componentGapWidth/4 - componentArcSize + n.size.Width+1	, n.itergraph.posLine.Y	);
				
				n.sub.drawComponentsInverse(new PointF(p.X+n.size.Width/2+n.altSize.Width/2  , n.posEnd.Y),n.size);
				n.itergraph.drawComponents( new PointF(p.X+n.size.Width/2-n.iterSize.Width/2 , n.posEnd.Y),n.size);
			
			}
			else if(n.typ==Node.iter)	{	
				if(showBorders) g.DrawRectangle(new Pen(Color.DarkViolet,1),p.X,n.posBegin.Y,n.size.Width,n.size.Height);
				
				// the quarter Arcs
				g.DrawArc( linePen , p.X + componentGapWidth/4 +componentArcSize/2					, n.sub.posLine.Y-componentArcSize	, componentArcSize , componentArcSize ,  90 , 90);
				g.DrawArc( linePen , p.X + componentGapWidth/4 +componentArcSize/2					, n.posLine.Y						, componentArcSize , componentArcSize , 180 , 90);
				g.DrawArc( linePen , p.X - componentGapWidth/4 -componentArcSize*3/2 + n.size.Width	, n.sub.posLine.Y-componentArcSize	, componentArcSize , componentArcSize ,   0 , 90);
				g.DrawArc( linePen , p.X - componentGapWidth/4 -componentArcSize*3/2 + n.size.Width	, n.posLine.Y						, componentArcSize , componentArcSize , 270 , 90);
				// the short vertical lines between the quarter Arcs
				g.DrawLine(linePen , p.X + componentGapWidth/4 + componentArcSize/2					, n.posLine.Y+componentArcSize/2	, p.X + componentGapWidth/4 + componentArcSize/2				, n.sub.posLine.Y-componentArcSize/2+1	);
				g.DrawLine(linePen , p.X - componentGapWidth/4 - componentArcSize/2 + n.size.Width	, n.posLine.Y+componentArcSize/2 	, p.X - componentGapWidth/4 - componentArcSize/2 + n.size.Width	, n.sub.posLine.Y-componentArcSize/2+1	);
				// the two short horizontal lines between the quater Arcs and the components
				g.DrawLine(linePen , p.X + componentGapWidth/4 + componentArcSize-1	, n.sub.posLine.Y 			, p.X + componentGapWidth										, n.sub.posLine.Y );
				g.DrawLine(linePen , p.X - componentGapWidth   + n.size.Width		, n.sub.posLine.Y			, p.X + n.size.Width-componentGapWidth/4 - componentArcSize+1	, n.sub.posLine.Y );
				// the long horizontal line in the middle
				g.DrawLine(linePen , p.X , n.posLine.Y , p.X + n.size.Width , n.posLine.Y);	
				
				p1.X=p.X+componentGapWidth;
				n.sub.drawComponents(p1,n.size);
			}
			else if(n.typ==Node.alt)	{			
				p.X-=n.altSize.Width-n.size.Width;
				if(showBorders) g.DrawRectangle(new Pen(Color.Red,1),p.X,n.posBegin.Y,n.altSize.Width,n.altSize.Height);
				
				// the two short lines at the beginning and the end of the altcomponent
				g.DrawLine(	linePen , p.X				 		, n.posLine.Y , p.X					+componentArcSize*3/2		, n.posLine.Y	);
				g.DrawLine(	linePen , p.X+n.altSize.Width		, n.posLine.Y , p.X+n.altSize.Width -componentArcSize*3/2		, n.posLine.Y	);
				p1.X=p.X+2*componentGapWidth;
				p1.Y=p1.Y+componentGapHeight;
				Node a=n;
				bool first=true;
				while(a!=null)	{				

					// the horizontal lines at the beginning and the end
					g.DrawLine( linePen , p.X +componentArcSize*3/2 					, a.sub.posLine.Y , p.X	+(n.altSize.Width-a.size.Width)/2					, a.sub.posLine.Y);
					g.DrawLine( linePen , p.X -componentArcSize*3/2	+ n.altSize.Width+1	, a.sub.posLine.Y , p.X	+(n.altSize.Width-a.size.Width)/2 + a.size.Width	, a.sub.posLine.Y);
					// if the first Alternative draw differnt Arcs
					if(first) {
						g.DrawArc ( linePen , p.X   									, n.posLine.Y							, componentArcSize , componentArcSize , 270 , 90);
						g.DrawArc ( linePen , p.X  +n.altSize.Width-componentArcSize 	, n.posLine.Y							, componentArcSize , componentArcSize , 180 , 90);
						first=false;
					}
					// else draw other Arcs and vertical lines
					else {
						g.DrawArc ( linePen , p.X  + componentArcSize   					, a.sub.posLine.Y-componentArcSize		, componentArcSize 			, componentArcSize , 90 , 90);
						g.DrawLine( linePen , p.X  + componentArcSize   					, n.posLine.Y +componentArcSize/2		, p.X  + componentArcSize 						, a.posLine.Y-componentArcSize/2+1);
						g.DrawArc ( linePen , p.X  - componentArcSize*2 + n.altSize.Width 	, a.sub.posLine.Y - componentArcSize	, componentArcSize 			, componentArcSize , 0 , 90);
						g.DrawLine( linePen , p.X  - componentArcSize + n.altSize.Width  	, n.posLine.Y +componentArcSize/2		, p.X  - componentArcSize + n.altSize.Width 	, a.posLine.Y-componentArcSize/2+1);
					}
					PointF pf=new PointF(p.X+(n.altSize.Width+a.size.Width)/2,p1.Y);
					a.sub.drawComponentsInverse(pf,a.size);
					a=a.down;
				}
			}
			if(n.up)
				samelevel=false;
			n=n.next;
		}
	}

	//----------------- for optimizing ----------------------
	
	//compare two nodes on the basis of structure and value
	public static bool Compare(Node n1, Node n2)	{
		if(n1.typ==n2.typ) {
			if(n1.typ==Node.nt || n1.typ==Node.t)	{
				if(n1.sym.name!=n2.sym.name) return false;
			}
			return true;
		}
		return false;
	}
	
	/*
	 * compare two graphs on the basis of structure and value
	 * if untilIter is set, n1 and n2 are treated in a different way:
	 * the graph n1 to the iter node is compared to the iter subnode
	 * params: n1 must be the node before iter if untilIter==true
	 * params: n2 must be the first subnode of iter if untilIter==true
	 */
	public static bool DeepCompare(Node n1, Node n2, bool untilIter)	{
		bool samelevel=true;
		Node identifier=n2;							//helps to identify the relevant iter node
		while(n1!=null && samelevel)	{
			//just compare nodes until the iter node
			if(untilIter)	{
				if(n1.typ==Node.iter && n1.sub==identifier) {
					if(n1==n2) {	//last iter node's next points to the iter
						if(Node.trace) Console.WriteLine("true: iter node reached, graphs match");
						return true;
					} else	{
						if(Node.trace) Console.WriteLine("false: iter node reached, graphs do not match");
						return false;
					}
				}			
			}
			if(n2==null) {
				if(Node.trace) Console.WriteLine("false: second enclosing substructure ended before first");
				return false;
			}			
			if(!Compare(n1,n2)) {
				if(Node.trace) Console.WriteLine("false: node not same type/content");
				return false;
			} 
			//--> t,nt,eps is ok, go to next
			
			if(n1.typ==Node.opt|| n1.typ==Node.iter || n1.typ==Node.rerun)	{		
				if(!DeepCompare(n1.sub, n2.sub,false)) {
					if(Node.trace) Console.WriteLine("false: false in subelem of iter,opt or rerun");
					return false;
				}
				if(n1.typ==Node.rerun && !DeepCompare(n1.itergraph, n2.itergraph, false))	{
				   if(Node.trace) Console.WriteLine("false: itergraph of rerun doesn't match");
				   return false;
				}
			}			
			else if(n1.typ==Node.alt)	{			
				Node a1=n1,a2=n2;
				while(a1!=null)	{
					if(a2==null) {
						if(Node.trace) Console.WriteLine("false: false in subalt, second node null");
						return false;
					}
					
					if(!DeepCompare(a1.sub,a2.sub,false)) {
						if(Node.trace) Console.WriteLine("false: false in subelem of subalt");
						return false;
					}
					a1=a1.down;
					a2=a2.down;
				}
				if(a2!=null) {
					if(Node.trace) Console.WriteLine("false: second alt has more alternatives");
					return false;
				}
			}
			if(n1.up) {
				if(!n2.up) {
					if(Node.trace) Console.WriteLine("false: second has not finished enclosing structure");
					return false;
				}
				samelevel=false;
			}	
			n1=n1.next;
			n2=n2.next;
		}
		if(n1==null && n2!=null) {
			if(Node.trace) Console.WriteLine("false: first enclosing substructure ended before second");
			return false;
		}
		return true;
	}
	
	//calls all methods which optimize the graphs
	public static void Optimize()	{
	 	foreach(Symbol s in Symbol.nonterminals)	{
			Node.RemoveWrongLinebreaks(s.graph.l,null,s);
			if(optimizeGraph) Node.RemoveRedundancy(s.graph.l,null,s); 	//remove redundant iter/opts
			if(optimizeGraph) Node.RemoveEps(s.graph.l,null,s); 		//remove eps nodes and redundant eps nodes in alternatives
			if(optimizeGraph) Node.OptimizeIter(s.graph.l,null,s);			
		}
	}
	
	
	//removes all unnecessary and wrong linebreaks (wrap-nodes) from the graph
	public static void RemoveWrongLinebreaks(Node n,Node parent, Symbol s)	{
		bool samelevel=true;
		Node i=n;
		while(i!=null && samelevel)	{
			if(i.typ==Node.wrap)	{
				//if in outer structure, just remove multiple wraps
				if(parent==null) {
					while(i.next!=null && i.next.typ==Node.wrap)	{
						i.next=i.next.next;
					}
				} //if in inner structure remove it
				else {
					//if \n is first element of substructure
					if(n==i) {
						//parent==null doesn't occur
						
						//if \n is the only subelement
						if(i.up ||i.next==null) {
							Node eps=new Node(Node.eps, null);
							parent.sub=eps;
							eps.up=i.up;
							eps.next=i.next;
							n=eps;
						} else {
							parent.sub=i.next;
							n=parent.sub;						
						}
					} else { //if within substructure
						Node j=n;
						while(j.next!=i) j=j.next;
						j.next=i.next;
						j.up=i.up;
					}
				}
			}
			else if(i.typ==Node.opt || i.typ==Node.iter || i.typ==Node.rerun)
				RemoveWrongLinebreaks(i.sub,i,s);
			
			else if(i.typ==Node.alt)	{			
				Node a=i;
				while(a!=null)	{
					
					RemoveWrongLinebreaks(a.sub,a,s);
					a=a.down;
				}
			}

			if(i.up) {
				samelevel=false;
			}	
			i=i.next;
		}
	
	}


	private static void RemoveRedundancy(Node n, Node parent, Symbol s)	{
		bool samelevel=true;		//next node in same level?
		Node begin=n;
		while(n!=null && samelevel)	{
			
			if(n.typ==Node.alt)	{
				Node a=n;
				while(a!=null)	{
					RemoveRedundancy(a.sub,a,s);
					a=a.down;
				}
			} 
			else if(n.typ==Node.iter)	{
				while((n.sub.typ==Node.iter || n.sub.typ==Node.opt) && n.sub.up)	{
					//EbnfForm.WriteLine("Rendundant "+Node.nTyp[n.sub.typ]+" Node removed (iter).");
					n.sub=n.sub.sub;
					Node i=n.sub;
					while(!i.up)	{
						i=i.next;
					}
					i.next=n;							
				}
				RemoveRedundancy(n.sub,n,s);
			
			} else if(n.typ==Node.opt)	{
				bool containsIter=false;
				while((n.sub.typ==Node.opt && (n.sub.up || n.sub.next==null)) || (n.sub.typ==Node.iter && (n.sub.up || n.sub.next==null)))	{
					//if(n.sub.typ==Node.opt || containsIter) EbnfForm.WriteLine("Rendundant "+Node.nTyp[n.sub.typ]+" Node removed (opt).");
					if(n.sub.typ==Node.iter) containsIter=true;
					n.sub=n.sub.sub;					
				}
				if(containsIter)	{
					Node iter=new Node(Node.iter,n.sub);
					iter.next=n.next;
					if(n==begin)	{
						if(parent==null)	{ 
							s.graph.l=iter;
						} else {
							parent.sub=iter;
						}
					} else {
						Node j=begin;
						while(j.next!=n)	{
							j=j.next;
						}
						j.next=iter;
					}
					n=iter;
					
					//set correct next pointer of last subelement of new iter
					Node i=iter.sub;
					while(i.next!=null && !i.up) i=i.next;
					i.next=iter;
				}			
				RemoveRedundancy(n.sub,n,s);
			}			
			if(n.up) samelevel=false;
			n=n.next;
		}
		
		
	}

	private static void RemoveEps(Node n, Node parent, Symbol s)	{
		bool samelevel=true;		//next node in same level?
		Node begin=n;
		while(n!=null && samelevel)	{
			
			if(n.typ==Node.eps)	{
				if(n==begin)	{
					if(parent==null)	{
						//if the graph only consists of an eps, let it live
						if(n.next!=null) {
							s.graph.l=n.next;
							begin=n.next;
						}
					} //else: at beginning of substructure not required (iter/opt/alt subnodes were already handled)
				} else	{
					Node i=begin;
					while(i.next!=n)	{
						i=i.next;
					}
					i.next=n.next;
					i.up=n.up;
				}
			}
			else if(n.typ==Node.iter || n.typ==Node.opt)	{
				if(n.sub.typ==Node.eps && (n.sub.next==null || n.sub.up)) {
					if(n==begin)	{
						if(parent==null)	{ //beginning of graph
							//if graph only consists of this iter/opt, then replace it with an eps node
							if(n.next==null) {
								Node eps=new Node(Node.eps, null);
								s.graph.l=eps;
								s.graph.r=eps;
							} else { //remove that node
								s.graph.l=n.next;
								begin=n.next;
								
							}
						} //else: at beginning of substructure not required (iter/opt/alt subnodes were already handled)
					} else { //within substructure
						Node i=begin;
						while(i.next!=n) {
							i=i.next;
						}
						if(n.up) i.up=true;
						i.next=n.next;
					}
				} else RemoveEps(n.sub,n,s);

			}
			else if(n.typ==Node.alt)	{
				Node a=n;
				//count number of eps
				int numOfEps=0;
				while(a!=null)	{	
					//CheckSubAlts(a);
					if(a.sub.typ==Node.eps && (a.sub.next==null || a.sub.up))	numOfEps++;
					a=a.down;
				}
				a=n;
				while(numOfEps>1)	{
					if(n!=a && a.sub.typ==Node.eps && (a.sub.next==null || a.sub.up)) {
						Node i=n;
						while(i.down!=a)	{
							i=i.down;
						}
						i.down=a.down;
						numOfEps--;
					}
					a=a.down;
				}
				RemoveSameAlts(n);
				PutEpsAtBeginningOfAlt(begin,n,parent,s);
				//optimize subcomponents
				a=n;
				while(a!=null)	{
					//if not the left eps node
					if(!(a.sub.typ==Node.eps && (a.sub.next==null || a.sub.up))) RemoveEps(a.sub,a,s);
					a=a.down;
				}
			}
			if(n.up) samelevel=false;
			n=n.next;
		}
	}
	
	
	//removes all empty iter/opt nodes in alternatives, as well as multiple eps nodes at the beginning:
	//they would bug a condition in RemoveEps
	private static void CheckSubAlts(Node alt)	{

		//remove all empty iter/opts
		//make sure, that at least one eps Node will exist
		Node eps=new Node(Node.eps,null);
		eps.next=alt.sub;
		alt.sub=eps;
		Node i=alt.sub;
		bool samelevel=true;
		while(i!=null && samelevel)	{
			//if empty iter/opt
			if((i.typ==Node.iter || i.typ==Node.opt) && i.sub.typ==Node.eps && (i.sub.next==null || i.sub.up))	{
				//case i==alt.sub not possible
				Node a=alt.sub;
				while(a.next!=i) a=a.next;
				a.next=i.next;				
			}
			if(i.up) samelevel=false;
			i=i.next;
		}
		
		i=alt.sub;
		//remove multiple eps nodes at the beginning
		if(i.typ==Node.eps) {
			while(i.next!=null && !i.next.up && i.next.typ==Node.eps) {
				i.next=i.next.next;
			}
		}
	}
	private static void RemoveSameAlts(Node alt)	{
		Node a=alt;
		while(a!=null)	{
			Node i=a.down;
			while(i!=null)	{
				if(DeepCompare(a.sub,i.sub,false))	{
					Node n=a;
					while(n.down!=i) n=n.down;
					n.down=i.down;
				}			
				i=i.down;
			}		
			a=a.down;
		}
	}
	private static void PutEpsAtBeginningOfAlt(Node n,Node alt,Node parent, Symbol s)	{
		Node a=alt;
		bool containsEps=false;
		
		
		//determine if eps is contained
		while(a!=null)	{
			//if eps node
			if(a.sub.typ==Node.eps && (a.sub.next==null || a.sub.up))	containsEps=true;		
			a=a.down;
		}
		if(containsEps)	{
			//remove eps node
			a=alt;
			while(a!=null)	{
				//if eps node
				if(a.sub.typ==Node.eps && (a.sub.next==null || a.sub.up))	{
					//remove eps only if within alternatives
					if(a!=alt)	{
						Node i=alt;
						while(i.down!=a) i=i.down;
						i.down=a.down;
					}
					break; //there can be only one eps in the alts because same nodes have already been removed
				}
				a=a.down;
			}
			//insert eps, if first alt isn't eps
			
			if(!(alt.sub.typ==Node.eps && (alt.sub.next==null || alt.sub.up))) {
				Node eps=new Node(Node.eps,null);
				eps.next=alt.next;
				eps.up=true;
				Node a1= new Node(Node.alt,eps);
				a1.down=alt;
				if(alt==n)	{
					if(parent==null)	s.graph.l=a1;
					else parent.sub=a1;			
				} else {
					Node i=n;
					while (i.next!=alt) i=i.next;
					i.next=a1;
				}
				a1.next=alt.next;
				a1.up=alt.up;
				alt.next=null;

			}
			
			
		}
		
		
	}
		
		
		

	

	
	
	//optimizes enclosing structures and recursively its substructures
	private static void OptimizeIter(Node n, Node parent, Symbol s)	{
		
		bool samelevel=true;		//next node in same level?
		Node i=n;
		
		
		while(i!=null && samelevel)	{
			if(i.typ==Node.opt) OptimizeIter(i.sub,i,s);
			else if(i.typ==Node.alt) {
				Node a=i;
				while(a!=null)	{
					OptimizeIter(a.sub,a,s);
					a=a.down;
				}			
			}
			else if(i.typ==Node.iter) {
				//first optimize the iter substructure
				OptimizeIter(i.sub,i,s);
				
				//while loop to DeepCompare from every node until the iter node
				Node j=n;
				bool matchFound=false;
				while(j!=i && !matchFound)	{
					Node k=i.sub;
					bool samelevel2=true;
					while(k!=null && samelevel2 && !matchFound)	{
						if(DeepCompare(j,k,true)) {
							//EbnfForm.WriteLine("Iter node optimized.");
							matchFound=true;
							//replace the iter node and the nodes before by the rerun node
							Node re= new Node(Node.rerun, k);
							if(j==n) {
								
								if(parent==null) {
									s.graph.l=re;
									n=re;
								}
								else {
									parent.sub=re;
									n=re;
								}
							} else {
								Node l=n;
								while(l.next!=j)	l=l.next;
								l.next=re;
							}
	
							//if a {b a} isolate b
							if(k!=i.sub)	{
								re.itergraph=i.sub;
								Node temp=re.itergraph;
								while(temp.next!=k) temp=temp.next;
								temp.next=null;
							}
							
							re.next=i.next;
							re.up=i.up;
							i=re;
						
						}
						if(k.up) samelevel2=false;
						k=k.next;
						
					}

					j=j.next;
				}			
			}		
			if(i.up) samelevel=false;
			i=i.next;
		}
	}
}


public class Graph {
	
	public Node l;	// left end of graph = head
	public Node r;	// right end of graph = list of nodes to be linked to successor graph
	public Size graphSize;
	
	public Graph() {
		l = null; r = null;
	}
	
	public Graph(Node left, Node right) {
		l = left; r = right;
	}
	
	public Graph(Node p) {
		l = p; r = p;
	}

	public static void MakeFirstAlt(Graph g) {
		g.l = new Node(Node.alt, g.l); 
		g.l.next = g.r;
		g.r = g.l;
	}
	
	public static void MakeAlternative(Graph g1, Graph g2) {
		g2.l = new Node(Node.alt, g2.l);
		Node p = g1.l; while (p.down != null) p = p.down;
		p.down = g2.l;
		p = g1.r; while (p.next != null) p = p.next;
		p.next = g2.r;
	}
	
	public static void MakeSequence(Graph g1, Graph g2) {
		if(g1.l==null && g1.r==null) {/*case: g1 is empty */
			g1.l=g2.l;g1.r=g2.r;
		} else {
			
			Node p = g1.r.next; g1.r.next = g2.l; // link head node
			while (p != null) {  // link substructure
				Node q = p.next; p.next = g2.l; p.up = true;
				p = q;
			}
			g1.r = g2.r;
		}
	}
	
	public static void MakeIteration(Graph g) {
		g.l = new Node(Node.iter, g.l);
		Node p = g.r;
		g.r = g.l;
		while (p != null) {
			Node q = p.next; p.next = g.l; p.up = true;
			p = q;
		}
	}
	
	public static void MakeOption(Graph g) {
		g.l = new Node(Node.opt, g.l);
		g.l.next = g.r;
		g.r = g.l;
	}
	
	public static void Finish(Graph g) {
		Node p = g.r;
		while (p != null) {
			Node q = p.next; p.next = null; p = q;
		}
	}
		
}
