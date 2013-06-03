using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.IO;

namespace TM_Fonts_Generator
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();

            string strGeneration = Path.GetDirectoryName(Application.ExecutablePath);
            strGeneration = Path.GetDirectoryName(strGeneration);
            strGeneration = Path.GetDirectoryName(strGeneration);
            strGeneration = Path.GetDirectoryName(strGeneration);
            strGeneration = Path.GetDirectoryName(strGeneration);

            textBox1.Text = strGeneration + "\\Generations\\Input";
            textBox2.Text = strGeneration + "\\Generations\\Output";                      
        }

        private void button3_Click(object sender, EventArgs e)
        {
            // генератор бинарника
            AVSGraphics.CAVSWinFontsClass oWinFonts = new AVSGraphics.CAVSWinFontsClass();
            oWinFonts.SetAdditionalParam("InputFontsPath", textBox1.Text);
            oWinFonts.SetAdditionalParam("DumpBinaryPath", textBox1.Text + "\\font_selection.bin");

            AVSGraphics.CAVSFontManagerClass oManager = new AVSGraphics.CAVSFontManagerClass();
            oManager.SetAdditionalParam("InitializeFromFolder", textBox1.Text);
            oManager.SetAdditionalParam("DumpFontsJS", textBox2.Text);
        }

        private void button1_Click(object sender, EventArgs e)
        {
            if (DialogResult.OK != folderBrowserDialog1.ShowDialog())
                return;
            textBox1.Text = folderBrowserDialog1.SelectedPath;
        }

        private void button2_Click(object sender, EventArgs e)
        {
            if (DialogResult.OK != folderBrowserDialog1.ShowDialog())
                return;
            textBox2.Text = folderBrowserDialog1.SelectedPath;
        }
    }
}
