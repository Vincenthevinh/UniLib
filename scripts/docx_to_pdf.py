"""
Script to convert pa/PA3/PA3-SoftwareDesign.docx to pa/PA3/PA3-SoftwareDesign.pdf
using python-docx element traversal, high-quality HTML rendering, and Playwright Chromium.
"""

import os
import sys
import base64
import docx
from docx.enum.text import WD_ALIGN_PARAGRAPH
from playwright.sync_api import sync_playwright

def docx_to_html(docx_path):
    doc = docx.Document(docx_path)
    html_parts = []
    
    html_parts.append("""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>UniLib — Software Design (PA3)</title>
<style>
  @page {
    size: A4;
    margin: 20mm 15mm 20mm 15mm;
    @bottom-right {
      content: counter(page);
    }
  }
  body {
    font-family: 'Segoe UI', Calibri, Arial, sans-serif;
    color: #262626;
    line-height: 1.4;
    font-size: 10pt;
  }
  h1 {
    color: #1F497D;
    font-size: 16pt;
    border-bottom: 2px solid #1F497D;
    padding-bottom: 4px;
    margin-top: 24px;
    margin-bottom: 8px;
    page-break-after: avoid;
  }
  h2 {
    color: #2F5597;
    font-size: 13pt;
    margin-top: 18px;
    margin-bottom: 6px;
    page-break-after: avoid;
  }
  h3 {
    color: #595959;
    font-size: 11pt;
    margin-top: 12px;
    margin-bottom: 4px;
    page-break-after: avoid;
  }
  p {
    margin-top: 3px;
    margin-bottom: 6px;
    text-align: justify;
  }
  ul {
    margin-top: 3px;
    margin-bottom: 6px;
    padding-left: 20px;
  }
  li {
    margin-bottom: 3px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    margin-bottom: 14px;
    font-size: 8.5pt;
    page-break-inside: auto;
  }
  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }
  th {
    background-color: #1F497D;
    color: #ffffff;
    font-weight: bold;
    padding: 6px 8px;
    border: 1px solid #D3D3D3;
    text-align: left;
  }
  td {
    padding: 5px 8px;
    border: 1px solid #D3D3D3;
    vertical-align: middle;
  }
  tr:nth-child(even) td {
    background-color: #F8F9FA;
  }
  .figure-container {
    text-align: center;
    margin: 12px 0;
    page-break-inside: avoid;
  }
  .figure-container img {
    max-width: 95%;
    height: auto;
    border: 1px solid #E0E0E0;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  .figure-caption {
    font-size: 8.5pt;
    font-style: italic;
    color: #555555;
    margin-top: 4px;
  }
  .cover-page {
    text-align: center;
    padding-top: 80px;
    padding-bottom: 80px;
    page-break-after: always;
  }
  .cover-university {
    font-size: 14pt;
    font-weight: bold;
    color: #1F497D;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .cover-course {
    font-size: 12pt;
    color: #595959;
    margin-top: 8px;
  }
  .cover-title {
    font-size: 26pt;
    font-weight: bold;
    color: #1F497D;
    margin-top: 90px;
    margin-bottom: 10px;
  }
  .cover-subtitle {
    font-size: 14pt;
    color: #2F5597;
    margin-bottom: 120px;
  }
  .cover-meta {
    font-size: 11pt;
    color: #333333;
    line-height: 1.8;
  }
  .toc-box {
    background-color: #F8F9FA;
    border: 1px solid #D3D3D3;
    padding: 16px 20px;
    border-radius: 4px;
    margin: 20px 0 30px 0;
    page-break-after: always;
  }
  .toc-title {
    font-size: 14pt;
    font-weight: bold;
    color: #1F497D;
    margin-bottom: 12px;
  }
  .toc-item {
    font-size: 9.5pt;
    padding: 3px 0;
    color: #333333;
    border-bottom: 1px dotted #E0E0E0;
  }
</style>
</head>
<body>
""")

    # Render Cover Page
    html_parts.append("""
<div class="cover-page">
  <div class="cover-university">Vietnam National University, Ho Chi Minh City<br>University of Science — Faculty of Information Technology</div>
  <div class="cover-course">Introduction to Software Engineering (HK1/2026-2027)</div>
  <div class="cover-title">UniLib — Software Design (PA3)</div>
  <div class="cover-subtitle">University Library Management System · Architecture & Detailed Design</div>
  <div class="cover-meta">
    <strong>Team:</strong> T05<br>
    <strong>Authors:</strong> Nguyễn Phan Thế Vinh (Lead) · Trần Hà Anh Quân · Nguyễn Thanh Thảo Nguyên · Vũ Thị Ánh<br>
    <strong>Baseline Reference:</strong> SRS PA2 Frozen Baseline v1.0.0 (pa/PA2/T05-PA2.docx)<br>
    <strong>Release Version:</strong> v0.3-pa3-demo<br>
    <strong>Date:</strong> Friday, November 27, 2026
  </div>
</div>

<div class="toc-box">
  <div class="toc-title">Table of Contents</div>
  <div class="toc-item">1. Objectives</div>
  <div class="toc-item">2. Member Contribution Assessment (Policy, Contribution Table, Peer Review, Sign-off)</div>
  <div class="toc-item">3. Design Overview (Design Goals and Constraints, NFRs, Scope F01–F07, Business Rules)</div>
  <div class="toc-item">4. Architectural Design (Style, C4 L1 Context, C4 L2 Container, Component API, Deployment, ADRs)</div>
  <div class="toc-item">5. Object-Oriented Design (Domain Model, Class Diagram, Specifications C1–C8, Sequences, States, Patterns)</div>
  <div class="toc-item">6. Data Design (ERD, Data Specifications, 3NF Proof, 12 Indexes, Concurrency Control)</div>
  <div class="toc-item">7. User Interface and User Experience Design (Screen Flow, Screen Specifications, Accessibility)</div>
  <div class="toc-item">8. Traceability Update (6-Layer Forward RTM, 0 TBD)</div>
  <div class="toc-item">9. Changes to the Requirements Since PA2 (Clarifications Register, Governance)</div>
  <div class="toc-item">10. AI Usage Log (Consolidated Table & Member Logs)</div>
  <div class="toc-item">11. Sign-off and Delivery Acceptance (Team Sign-off Matrix)</div>
</div>
""")

    # Traverse body elements from paragraph 35 onward
    body = doc.element.body
    elements = list(body)[35:]
    
    i = 0
    while i < len(elements):
        el = elements[i]
        tag = el.tag.split('}')[-1]
        if tag == 'p':
            p = docx.text.paragraph.Paragraph(el, doc)
            text = p.text.strip()
            style = p.style.name if p.style else 'Normal'
            
            # Check if this paragraph contains an image
            img_runs = [r for r in p.runs if len(r._r.xpath('.//a:blip')) > 0]
            if img_runs:
                # Next paragraph is likely caption
                caption_text = ""
                if i + 1 < len(elements) and elements[i+1].tag.split('}')[-1] == 'p':
                    p_next = docx.text.paragraph.Paragraph(elements[i+1], doc)
                    if p_next.text.startswith("Figure "):
                        caption_text = p_next.text
                        i += 1 # advance caption
                
                # Extract image bytes
                blip = img_runs[0]._r.xpath('.//a:blip')[0]
                embed_id = blip.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
                image_part = doc.part.related_parts[embed_id]
                img_data = image_part.image.blob
                b64_img = base64.b64encode(img_data).decode('ascii')
                content_type = image_part.content_type
                
                html_parts.append(f"""
<div class="figure-container">
  <img src="data:{content_type};base64,{b64_img}" alt="{caption_text}">
  <div class="figure-caption">{caption_text}</div>
</div>
""")
            elif 'Heading 1' in style:
                html_parts.append(f"<h1>{text}</h1>")
            elif 'Heading 2' in style:
                html_parts.append(f"<h2>{text}</h2>")
            elif 'Heading 3' in style:
                html_parts.append(f"<h3>{text}</h3>")
            elif 'List Paragraph' in style or text.startswith('•'):
                cleaned = text.lstrip('•').strip()
                html_parts.append(f"<ul><li>{cleaned}</li></ul>")
            elif text.startswith('Figure '):
                html_parts.append(f'<div class="figure-caption" style="text-align:center; margin-bottom:8px;">{text}</div>')
            elif text:
                html_parts.append(f"<p>{text}</p>")
        elif tag == 'tbl':
            t = docx.table.Table(el, doc)
            html_parts.append("<table>")
            for r_idx, row in enumerate(t.rows):
                html_parts.append("<tr>")
                for cell in row.cells:
                    tag_cell = "th" if r_idx == 0 else "td"
                    cell_text = cell.text.strip().replace('\n', '<br>')
                    html_parts.append(f"<{tag_cell}>{cell_text}</{tag_cell}>")
                html_parts.append("</tr>")
            html_parts.append("</table>")
        i += 1

    html_parts.append("""
</body>
</html>
""")
    return "\n".join(html_parts)

def generate_pdf():
    docx_path = "pa/PA3/PA3-SoftwareDesign.docx"
    pdf_path = "pa/PA3/PA3-SoftwareDesign.pdf"
    html_temp = "pa/PA3/PA3-temp.html"
    
    print("Generating HTML from DOCX...")
    html_content = docx_to_html(docx_path)
    with open(html_temp, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"HTML saved to {html_temp}")
    
    print("Converting HTML to PDF via Playwright...")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("file:///" + os.path.abspath(html_temp).replace("\\", "/"))
        page.pdf(
            path=pdf_path,
            format="A4",
            margin={"top": "20mm", "bottom": "20mm", "left": "15mm", "right": "15mm"},
            print_background=True,
            display_header_footer=True,
            header_template='<div style="font-size: 8pt; color: #888; width: 100%; text-align: right; padding-right: 15mm;">UniLib — Software Design (PA3) · Team T05</div>',
            footer_template='<div style="font-size: 8pt; color: #888; width: 100%; text-align: right; padding-right: 15mm;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>'
        )
        browser.close()
    
    if os.path.exists(html_temp):
        os.remove(html_temp)
    
    print(f"SUCCESS: PDF generated successfully at {pdf_path} ({os.path.getsize(pdf_path)} bytes)!")

if __name__ == "__main__":
    generate_pdf()
