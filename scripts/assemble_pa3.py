"""
Main script to assemble the complete PA3-SoftwareDesign.docx and generate PA3-SoftwareDesign.pdf.
"""

import os
import sys

sys.path.insert(0, os.getcwd())
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

from scripts.build_pa3_content import build_section_objectives, build_section_contributions
from scripts.build_pa3_part2 import build_section_design_overview, build_section_architecture
from scripts.build_pa3_part3 import build_section_oo_design
from scripts.build_pa3_part4 import build_section_data_design, build_section_ui_design
from scripts.build_pa3_part5 import (
    build_section_traceability, build_section_changes,
    build_section_ai_usage, build_section_signoff
)

def assemble():
    docx_path = "pa/PA3/PA3-SoftwareDesign.docx"
    print(f"Loading base document from {docx_path}...")
    doc = docx.Document(docx_path)

    # 1. Update Table of Contents text at paragraph 29
    if len(doc.paragraphs) > 29:
        toc_text = (
            "1  Objectives\n"
            "2  Member Contribution Assessment (Policy, Contribution Table, Peer Review, Sign-off)\n"
            "3  Design Overview (Design Goals and Constraints, NFRs, Scope F01–F07, Business Rules)\n"
            "4  Architectural Design (Style, C4 L1 Context, C4 L2 Container, Component API, Deployment, ADRs)\n"
            "5  Object-Oriented Design (Domain Model, Class Diagram, Specifications C1–C8, Sequences, States, Patterns)\n"
            "6  Data Design (ERD, Data Specifications, 3NF Proof, 12 Indexes, Concurrency Control)\n"
            "7  User Interface and User Experience Design (Screen Flow, Screen Specifications, Accessibility)\n"
            "8  Traceability Update (6-Layer Forward RTM, 0 TBD)\n"
            "9  Changes to the Requirements Since PA2 (Clarifications Register, Governance)\n"
            "10 AI Usage Log (Consolidated Table & Member Logs)\n"
            "11 Sign-off and Delivery Acceptance (Team Sign-off Matrix)"
        )
        doc.paragraphs[29].text = toc_text
        doc.paragraphs[29].runs[0].font.name = 'Calibri'
        doc.paragraphs[29].runs[0].font.size = Pt(10)
        doc.paragraphs[29].runs[0].font.color.rgb = RGBColor(60, 60, 60)

    # 2. Clear elements from index 35 to the end of body
    body = doc.element.body
    print(f"Total elements before clearing: {len(body)}")
    elements_to_remove = list(body)[35:]
    for el in elements_to_remove:
        body.remove(el)
    print(f"Total elements after clearing: {len(body)}")

    # 3. Build each section sequentially
    print("Building Section 1: Objectives...")
    build_section_objectives(doc)

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

    print("Building Section 7: User Interface Design...")
    build_section_ui_design(doc)

    print("Building Section 8: Traceability Update...")
    build_section_traceability(doc)

    print("Building Section 9: Changes Since PA2...")
    build_section_changes(doc)

    print("Building Section 10: AI Usage Log...")
    build_section_ai_usage(doc)

    print("Building Section 11: Sign-off & Delivery Acceptance...")
    build_section_signoff(doc)

    # 4. Save updated document
    doc.save(docx_path)
    print(f"Document saved successfully to {docx_path}!")

    # 5. Automated Verification
    verify_document(docx_path)

def verify_document(path):
    print("Verifying generated document...")
    doc = docx.Document(path)
    placeholder_count = 0
    bracket_samples = []

    for idx, p in enumerate(doc.paragraphs):
        text = p.text
        if "[" in text and "]" in text:
            # Check if it's an actual template placeholder
            if any(k in text for k in ["List every member", "Name the architectural style", "Update the context", "Show web/mobile", "Decompose the main", "Show where each", "Record at least", "Conceptual class", "Design-level class", "Specify the 6", "Superclass", "Draw a sequence", "For objects whose", "ERD / database", "For a DBMS", "State the normal", "Draw the screen", "Specify the 5", "Extend the traceability", "List any changes", "Required in every PA"]):
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

if __name__ == "__main__":
    assemble()
