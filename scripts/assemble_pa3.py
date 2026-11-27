"""
Main script to assemble the complete PA3-SoftwareDesign.docx strictly adhering to
PA3-SoftwareDesign-template.docx format, removing all irrelevant sections.
"""

import os
import sys

sys.path.insert(0, os.getcwd())
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.oxml import parse_xml

from scripts.build_pa3_content import build_section_objectives, build_section_contributions
from scripts.build_pa3_part2 import build_section_design_overview, build_section_architecture
from scripts.build_pa3_part3 import build_section_oo_design
from scripts.build_pa3_part4 import build_section_data_design, build_section_ui_design
from scripts.build_pa3_part5 import (
    build_section_traceability, build_section_changes,
    build_section_ai_usage
)

def update_table_of_contents(doc):
    """
    Updates the Table of Contents on paragraph 29 while preserving the native Word TOC field.
    """
    if len(doc.paragraphs) <= 29:
        return
    p29 = doc.paragraphs[29]
    toc_xml = (
        '<w:r xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
        '<w:rPr>'
        '<w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>'
        '<w:sz w:val="20"/>'
        '<w:color w:val="333333"/>'
        '</w:rPr>'
        '<w:t xml:space="preserve">1  Objectives</w:t><w:br/>'
        '<w:t xml:space="preserve">2  Member Contribution Assessment</w:t><w:br/>'
        '<w:t xml:space="preserve">3  Design Overview (Design Goals and Constraints)</w:t><w:br/>'
        '<w:t xml:space="preserve">4  Architectural Design (Style, C4 Models, ADR-001..04)</w:t><w:br/>'
        '<w:t xml:space="preserve">5  Object-Oriented Design (Domain Model, Classes C1..C8, Sequence, State)</w:t><w:br/>'
        '<w:t xml:space="preserve">6  Data Design (ERD, Data Specifications, 3NF Proof, 12 Indexes)</w:t><w:br/>'
        '<w:t xml:space="preserve">7  User Interface and User Experience Design (Screen Flow, Specifications, Accessibility)</w:t><w:br/>'
        '<w:t xml:space="preserve">8  Traceability Update (Requirements Traceability Matrix)</w:t><w:br/>'
        '<w:t xml:space="preserve">9  Changes to the Requirements Since PA2</w:t><w:br/>'
        '<w:t xml:space="preserve">10 AI Usage Log</w:t>'
        '</w:r>'
    )
    for r in p29._p.xpath('.//w:r'):
        t_nodes = r.xpath('.//w:t')
        if t_nodes and any("Right-click here" in t.text or "Objectives" in t.text for t in t_nodes if t.text):
            new_r = parse_xml(toc_xml)
            p29._p.replace(r, new_r)
            break

def assemble():
    template_path = "pa/PA3/PA3-SoftwareDesign-template.docx"
    output_docx_path = "pa/PA3/PA3-SoftwareDesign.docx"
    
    print(f"Loading template from {template_path}...")
    doc = docx.Document(template_path)

    # 1. Update Table of Contents field at paragraph 29
    update_table_of_contents(doc)

    # 2. Clear template placeholder elements from index 46 onwards
    # Index 0-27: Cover page (Section 0)
    # Index 28-31: Table of Contents (Section 1)
    # Index 32-45: Objectives (Section 2, ending with sectPr at index 45)
    # Index 46+: Body content (Section 3) to be populated
    body = doc.element.body
    print(f"Total elements before clearing: {len(body)}")
    elements_to_remove = list(body)[46:]
    for el in elements_to_remove:
        body.remove(el)
    print(f"Total elements after clearing placeholder body: {len(body)}")

    # 3. Build each section sequentially matching template structure
    print("Building Section 2: Member Contribution Assessment...")
    build_section_contributions(doc)

    print("Building Section 3: Design Overview...")
    build_section_design_overview(doc)

    print("Building Section 4: Architectural Design...")
    build_section_architecture(doc)

    print("Building Section 5: Object-Oriented Design...")
    build_section_oo_design(doc)

    print("Building Section 6: Data Design...")
    build_section_data_design(doc)

    print("Building Section 7: User Interface and User Experience Design...")
    build_section_ui_design(doc)

    print("Building Section 8: Traceability Update...")
    build_section_traceability(doc)

    print("Building Section 9: Changes to the Requirements Since PA2...")
    build_section_changes(doc)

    print("Building Section 10: AI Usage Log...")
    build_section_ai_usage(doc)

    # 4. Save updated document
    doc.save(output_docx_path)
    print(f"Document saved successfully to {output_docx_path}!")

    # 5. Automated Verification
    verify_document(output_docx_path)

def verify_document(path):
    print("\n=== VERIFYING GENERATED DOCUMENT ===")
    doc = docx.Document(path)
    placeholder_count = 0
    bracket_samples = []

    for idx, p in enumerate(doc.paragraphs):
        text = p.text
        if "[" in text and "]" in text:
            if any(k in text for k in [
                "List every member", "Name the architectural style", "Update the context",
                "Show web/mobile", "Decompose the main", "Show where each", "Record at least",
                "Conceptual class", "Design-level class", "Specify the 6", "Superclass",
                "Draw a sequence", "For objects whose", "ERD / database", "For a DBMS",
                "State the normal", "Draw the screen", "Specify the 5", "Extend the traceability",
                "List any changes", "Required in every PA"
            ]):
                placeholder_count += 1
                bracket_samples.append((idx, text[:60]))

    for t_idx, t in enumerate(doc.tables):
        for r_idx, r in enumerate(t.rows):
            for c_idx, cell in enumerate(r.cells):
                cell_text = cell.text
                if any(k in cell_text for k in ["<Student", "<title>", "<e.g.", "<different", "<ticket"]):
                    placeholder_count += 1
                    bracket_samples.append((f"T{t_idx}R{r_idx}C{c_idx}", cell_text[:60]))

    print(f"Total Paragraphs: {len(doc.paragraphs)}")
    print(f"Total Tables: {len(doc.tables)}")
    print(f"Template Placeholders Remaining: {placeholder_count}")
    if placeholder_count > 0:
        print("WARNING: Placeholders found:", bracket_samples)
    else:
        print("SUCCESS: 0 template placeholders remaining! Acceptance criterion SATISFIED.")

    # Verify headings
    print("\n--- ALL DOCUMENT HEADINGS ---")
    for p in doc.paragraphs:
        if p.style.name.startswith("Heading"):
            print(f"  {p.style.name:10s} : {p.text}")

if __name__ == "__main__":
    assemble()
