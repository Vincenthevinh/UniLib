"""
Full Authoritative Document Generator for UniLib PA3 - Software Design.
Generates:
1. pa/PA3/PA3-SoftwareDesign.docx (fully merged, no placeholders, professional tables, figures)
2. pa/PA3/PA3-SoftwareDesign.pdf (via Playwright HTML export with header, footer, styles)
"""

import os
import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    for child in list(tcPr):
        if child.tag.endswith('shd'):
            tcPr.remove(child)
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_table_borders(table, color="D3D3D3"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="single" w:sz="6" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="single" w:sz="6" w:space="0" w:color="{color}"/>'
        f'<w:insideH w:val="single" w:sz="4" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="none"/>'
        f'<w:left w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def format_table(table, col_widths=None, header_fill="1F497D", font_size=8.5):
    set_table_borders(table)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    # Format header
    for c_idx, cell in enumerate(table.rows[0].cells):
        set_cell_background(cell, header_fill)
        set_cell_margins(cell, top=120, bottom=120, left=120, right=120)
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        if col_widths and c_idx < len(col_widths):
            cell.width = col_widths[c_idx]
        for p in cell.paragraphs:
            for run in p.runs:
                run.font.bold = True
                run.font.color.rgb = RGBColor(255, 255, 255)
                run.font.size = Pt(font_size + 0.5)
                run.font.name = 'Calibri'
    # Format body
    for r_idx in range(1, len(table.rows)):
        row = table.rows[r_idx]
        fill_hex = "F8F9FA" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, cell in enumerate(row.cells):
            set_cell_background(cell, fill_hex)
            set_cell_margins(cell, top=70, bottom=70, left=120, right=120)
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            if col_widths and c_idx < len(col_widths):
                cell.width = col_widths[c_idx]
            for p in cell.paragraphs:
                for run in p.runs:
                    run.font.size = Pt(font_size)
                    run.font.name = 'Calibri'

def add_heading_styled(doc, text, level):
    h = doc.add_heading(text, level=level)
    h.paragraph_format.keep_with_next = True
    h.paragraph_format.space_before = Pt(14 if level == 1 else (10 if level == 2 else 6))
    h.paragraph_format.space_after = Pt(4)
    for run in h.runs:
        run.font.name = 'Calibri'
        if level == 1:
            run.font.color.rgb = RGBColor(31, 73, 125)
            run.font.size = Pt(15)
            run.font.bold = True
        elif level == 2:
            run.font.color.rgb = RGBColor(47, 85, 151)
            run.font.size = Pt(12.5)
            run.font.bold = True
        elif level == 3:
            run.font.color.rgb = RGBColor(80, 80, 80)
            run.font.size = Pt(10.5)
            run.font.bold = True
    return h

def add_paragraph_styled(doc, text, bold_prefix=None, space_after=4):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.bold = True
        r_pre.font.name = 'Calibri'
        r_pre.font.size = Pt(9.5)
    r = p.add_run(text)
    r.font.name = 'Calibri'
    r.font.size = Pt(9.5)
    return p

def add_bullet_point(doc, text, bold_prefix=None):
    p = doc.add_paragraph(style='List Paragraph')
    p.paragraph_format.space_after = Pt(2.5)
    p.paragraph_format.line_spacing = 1.15
    r_bullet = p.add_run("• ")
    r_bullet.bold = True
    r_bullet.font.name = 'Calibri'
    r_bullet.font.size = Pt(9.5)
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.bold = True
        r_pre.font.name = 'Calibri'
        r_pre.font.size = Pt(9.5)
    r = p.add_run(text)
    r.font.name = 'Calibri'
    r.font.size = Pt(9.5)
    return p

def add_figure_image(doc, img_path, caption_text, width_inches=5.8):
    if not os.path.exists(img_path):
        print(f"Warning: image {img_path} not found!")
        return
    p_img = doc.add_paragraph()
    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img.paragraph_format.space_before = Pt(8)
    p_img.paragraph_format.space_after = Pt(2)
    run_img = p_img.add_run()
    run_img.add_picture(img_path, width=Inches(width_inches))

    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_after = Pt(8)
    run_cap = p_cap.add_run(caption_text)
    run_cap.italic = True
    run_cap.font.name = 'Calibri'
    run_cap.font.size = Pt(8.5)
    run_cap.font.color.rgb = RGBColor(80, 80, 80)

def populate_table_data(table, data_rows):
    for r_data in data_rows:
        row = table.add_row()
        for c_idx, val in enumerate(r_data):
            if c_idx < len(row.cells):
                row.cells[c_idx].text = str(val)

print("Generator infrastructure ready.")
