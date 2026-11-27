"""
Authoritative generator helper script for PA3-SoftwareDesign.docx
Team T05 (UniLib - University Library Management System)
Formats strictly matching PA3-SoftwareDesign-template.docx
"""

import os
import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

COLOR_HEADER_BG = "548DD4"      # Template cornflower / steel blue
COLOR_ADR_LABEL_BG = "DBE5F1"   # Template light soft blue
COLOR_BORDER = "D3D3D3"         # Standard grid border

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    for child in list(tcPr):
        if child.tag.endswith('shd'):
            tcPr.remove(child)
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=60, bottom=60, left=90, right=90):
    tcPr = cell._tc.get_or_add_tcPr()
    for child in list(tcPr):
        if child.tag.endswith('tcMar'):
            tcPr.remove(child)
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_table_borders(table, color="D3D3D3"):
    tblPr = table._tbl.tblPr
    for child in list(tblPr):
        if child.tag.endswith('tblBorders'):
            tblPr.remove(child)
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="single" w:sz="4" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="single" w:sz="4" w:space="0" w:color="{color}"/>'
        f'<w:left w:val="single" w:sz="4" w:space="0" w:color="{color}"/>'
        f'<w:right w:val="single" w:sz="4" w:space="0" w:color="{color}"/>'
        f'<w:insideH w:val="single" w:sz="4" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="single" w:sz="4" w:space="0" w:color="{color}"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def format_table(table, col_widths=None, header_fill=COLOR_HEADER_BG, font_size=8.5):
    set_table_borders(table)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    # Header row
    for c_idx, cell in enumerate(table.rows[0].cells):
        set_cell_background(cell, header_fill)
        set_cell_margins(cell, top=80, bottom=80, left=90, right=90)
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        if col_widths and c_idx < len(col_widths):
            cell.width = col_widths[c_idx]
        for p in cell.paragraphs:
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            for run in p.runs:
                run.font.bold = True
                run.font.color.rgb = RGBColor(255, 255, 255)
                run.font.size = Pt(font_size + 0.5)
                run.font.name = 'Calibri'
    # Data rows
    for r_idx in range(1, len(table.rows)):
        row = table.rows[r_idx]
        for c_idx, cell in enumerate(row.cells):
            set_cell_background(cell, "FFFFFF")
            set_cell_margins(cell, top=50, bottom=50, left=90, right=90)
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            if col_widths and c_idx < len(col_widths):
                cell.width = col_widths[c_idx]
            for p in cell.paragraphs:
                p.paragraph_format.space_before = Pt(0)
                p.paragraph_format.space_after = Pt(0)
                for run in p.runs:
                    run.font.size = Pt(font_size)
                    run.font.name = 'Calibri'

def create_table_with_data(doc, headers, rows_data, col_widths=None, header_fill=COLOR_HEADER_BG, font_size=8.5):
    t = doc.add_table(rows=1, cols=len(headers))
    t.style = 'Table Grid'
    for c_idx, h in enumerate(headers):
        t.rows[0].cells[c_idx].text = h
    for r in rows_data:
        row = t.add_row()
        for c_idx, val in enumerate(r):
            if c_idx < len(row.cells):
                row.cells[c_idx].text = str(val)
    format_table(t, col_widths, header_fill, font_size)
    # Add empty paragraph after table for spacing
    p_after = doc.add_paragraph()
    p_after.paragraph_format.space_before = Pt(0)
    p_after.paragraph_format.space_after = Pt(6)
    return t

def create_adr_table(doc, adr_id_title, status, context, decision, alternatives, consequences, col_widths=None):
    """
    Creates an ADR table strictly matching Table 1 in PA3-SoftwareDesign-template.docx:
    Row 0: ADR | ADR-00X: <title>   (both cells fill #548DD4, white bold text)
    Row 1: Status | ...             (col 0 fill #DBE5F1, bold)
    Row 2: Context | ...            (col 0 fill #DBE5F1, bold)
    Row 3: Decision | ...           (col 0 fill #DBE5F1, bold)
    Row 4: Alternatives considered  (col 0 fill #DBE5F1, bold)
    Row 5: Consequences | ...       (col 0 fill #DBE5F1, bold)
    """
    if col_widths is None:
        col_widths = [Inches(1.8), Inches(5.0)]

    t = doc.add_table(rows=6, cols=2)
    t.style = 'Table Grid'
    set_table_borders(t)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER

    data = [
        ("ADR", adr_id_title),
        ("Status", status),
        ("Context", context),
        ("Decision", decision),
        ("Alternatives considered", alternatives),
        ("Consequences", consequences),
    ]

    for r_idx, (label, val) in enumerate(data):
        row = t.rows[r_idx]
        cell0 = row.cells[0]
        cell1 = row.cells[1]

        cell0.text = label
        cell1.text = val

        cell0.width = col_widths[0]
        cell1.width = col_widths[1]

        if r_idx == 0:
            set_cell_background(cell0, COLOR_HEADER_BG)
            set_cell_background(cell1, COLOR_HEADER_BG)
            set_cell_margins(cell0, top=70, bottom=70, left=90, right=90)
            set_cell_margins(cell1, top=70, bottom=70, left=90, right=90)
            for p in cell0.paragraphs:
                p.paragraph_format.space_before = Pt(0)
                p.paragraph_format.space_after = Pt(0)
                for r in p.runs:
                    r.font.bold = True
                    r.font.color.rgb = RGBColor(255, 255, 255)
                    r.font.size = Pt(9.5)
                    r.font.name = 'Calibri'
            for p in cell1.paragraphs:
                p.paragraph_format.space_before = Pt(0)
                p.paragraph_format.space_after = Pt(0)
                for r in p.runs:
                    r.font.bold = True
                    r.font.color.rgb = RGBColor(255, 255, 255)
                    r.font.size = Pt(9.5)
                    r.font.name = 'Calibri'
        else:
            set_cell_background(cell0, COLOR_ADR_LABEL_BG)
            set_cell_background(cell1, "FFFFFF")
            set_cell_margins(cell0, top=50, bottom=50, left=90, right=90)
            set_cell_margins(cell1, top=50, bottom=50, left=90, right=90)
            for p in cell0.paragraphs:
                p.paragraph_format.space_before = Pt(0)
                p.paragraph_format.space_after = Pt(0)
                for r in p.runs:
                    r.font.bold = True
                    r.font.size = Pt(9.0)
                    r.font.name = 'Calibri'
            for p in cell1.paragraphs:
                p.paragraph_format.space_before = Pt(0)
                p.paragraph_format.space_after = Pt(0)
                for r in p.runs:
                    r.font.size = Pt(9.0)
                    r.font.name = 'Calibri'

    p_after = doc.add_paragraph()
    p_after.paragraph_format.space_before = Pt(0)
    p_after.paragraph_format.space_after = Pt(6)
    return t

def add_heading_styled(doc, text, level):
    """
    Adds heading adhering strictly to the template Heading styles:
    Heading 1 (22pt, #0070C0), Heading 2 (16pt, #0070C0), Heading 3 (13pt).
    No artificial overrides of color or size so it matches template perfectly.
    """
    h = doc.add_heading(text, level=level)
    h.paragraph_format.keep_with_next = True
    if level == 1:
        h.paragraph_format.space_before = Pt(14)
        h.paragraph_format.space_after = Pt(4)
    elif level == 2:
        h.paragraph_format.space_before = Pt(10)
        h.paragraph_format.space_after = Pt(3)
    elif level == 3:
        h.paragraph_format.space_before = Pt(6)
        h.paragraph_format.space_after = Pt(2)
    return h

def add_paragraph_styled(doc, text, bold_prefix=None, space_after=4):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.bold = True
        r_pre.font.name = 'Calibri'
        r_pre.font.size = Pt(11.0)
    r = p.add_run(text)
    r.font.name = 'Calibri'
    r.font.size = Pt(11.0)
    return p

def add_bullet_point(doc, text, bold_prefix=None):
    p = doc.add_paragraph(style='List Paragraph')
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.15
    r_bullet = p.add_run("• ")
    r_bullet.bold = True
    r_bullet.font.name = 'Calibri'
    r_bullet.font.size = Pt(11.0)
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.bold = True
        r_pre.font.name = 'Calibri'
        r_pre.font.size = Pt(11.0)
    r = p.add_run(text)
    r.font.name = 'Calibri'
    r.font.size = Pt(11.0)
    return p

def add_figure_image(doc, img_path, caption_text, width_inches=5.8):
    if not os.path.exists(img_path):
        print(f"Warning: image {img_path} not found!")
        return
    p_img = doc.add_paragraph()
    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img.paragraph_format.space_before = Pt(6)
    p_img.paragraph_format.space_after = Pt(2)
    run_img = p_img.add_run()
    run_img.add_picture(img_path, width=Inches(width_inches))

    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_after = Pt(8)
    run_cap = p_cap.add_run(caption_text)
    run_cap.italic = True
    run_cap.font.name = 'Calibri'
    run_cap.font.size = Pt(9.0)
    run_cap.font.color.rgb = RGBColor(100, 100, 100)

print("build_pa3_full core loaded successfully.")
