# -*- coding: utf-8 -*-
"""Build the NORCO Group Business Plan & Investment Proposal (.docx)."""
import os
from docx import Document
from docx.shared import Pt, Inches, RGBColor, Emu
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.section import WD_SECTION
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import model as M

ASSETS = os.path.join(os.path.dirname(__file__), "..", "assets")
OUT = os.path.join(os.path.dirname(__file__), "..", "NORCO_Group_Business_Plan.docx")

NAVY = RGBColor(0x0F, 0x29, 0x42)
TEAL = RGBColor(0x0F, 0x6E, 0x6A)
GOLD = RGBColor(0xC8, 0x89, 0x2A)
INK = RGBColor(0x1A, 0x1A, 0x19)
MUTED = RGBColor(0x5C, 0x5B, 0x57)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
LIGHT = RGBColor(0xF3, 0xF5, 0xF7)

doc = Document()

# ---- base styles ----
normal = doc.styles["Normal"]
normal.font.name = "Calibri"
normal.font.size = Pt(10.5)
normal.font.color.rgb = INK
normal.paragraph_format.space_after = Pt(6)
normal.paragraph_format.line_spacing = 1.12

def shade(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    sh = OxmlElement("w:shd")
    sh.set(qn("w:val"), "clear"); sh.set(qn("w:color"), "auto"); sh.set(qn("w:fill"), hex_color)
    tcPr.append(sh)

def set_cell_margins(cell, top=60, bottom=60, left=110, right=110):
    tcPr = cell._tc.get_or_add_tcPr()
    m = OxmlElement("w:tcMar")
    for name, val in (("top", top), ("bottom", bottom), ("start", left), ("end", right)):
        e = OxmlElement(f"w:{name}"); e.set(qn("w:w"), str(val)); e.set(qn("w:type"), "dxa"); m.append(e)
    tcPr.append(m)

def no_borders(table):
    tbl = table._tbl
    tblPr = tbl.tblPr
    borders = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        e = OxmlElement(f"w:{edge}"); e.set(qn("w:val"), "none"); borders.append(e)
    tblPr.append(borders)

def hairline_borders(table, color="D8DCE0"):
    tbl = table._tbl
    borders = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        e = OxmlElement(f"w:{edge}")
        e.set(qn("w:val"), "single"); e.set(qn("w:sz"), "4")
        e.set(qn("w:space"), "0"); e.set(qn("w:color"), color)
        borders.append(e)
    tbl.tblPr.append(borders)

def run(p, text, size=10.5, bold=False, color=INK, italic=False, font="Calibri"):
    r = p.add_run(text)
    r.font.size = Pt(size); r.font.bold = bold; r.font.italic = italic
    r.font.color.rgb = color; r.font.name = font
    return r

def para(text="", size=10.5, bold=False, color=INK, align=None, space_after=6,
         space_before=0, italic=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.space_before = Pt(space_before)
    if align: p.alignment = align
    if text: run(p, text, size, bold, color, italic)
    return p

def h1(num, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(16); p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.keep_with_next = True
    run(p, f"{num}   ", 15, True, GOLD)
    run(p, text, 15, True, NAVY)
    # underline rule
    pPr = p._p.get_or_add_pPr()
    pbdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single"); bottom.set(qn("w:sz"), "6")
    bottom.set(qn("w:space"), "4"); bottom.set(qn("w:color"), "0F2942")
    pbdr.append(bottom); pPr.append(pbdr)
    return p

def h2(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(11); p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    run(p, text, 12, True, TEAL)
    return p

def bullet(text_runs, space_after=4):
    """text_runs: list of (text, bold) or a plain string."""
    p = doc.add_paragraph(style=None)
    p.paragraph_format.left_indent = Inches(0.28)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.1
    run(p, "▪  ", 10.5, True, GOLD)
    if isinstance(text_runs, str):
        text_runs = [(text_runs, False)]
    for t, b in text_runs:
        run(p, t, 10.5, b, INK)
    return p

def add_chart(name, width=6.5, caption=None):
    doc.add_picture(os.path.join(ASSETS, name), width=Inches(width))
    doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER
    if caption:
        c = para(caption, 8.5, False, MUTED, WD_ALIGN_PARAGRAPH.CENTER, space_after=10, italic=True)

def table(headers, rows, widths=None, header_fill="0F2942", zebra=True,
          total_row=False, align_right_from=1, font_size=9.5):
    t = doc.add_table(rows=1, cols=len(headers))
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    hairline_borders(t)
    # header
    for j, htext in enumerate(headers):
        c = t.rows[0].cells[j]
        shade(c, header_fill); set_cell_margins(c)
        p = c.paragraphs[0]; p.paragraph_format.space_after = Pt(0)
        if j >= align_right_from: p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        run(p, str(htext), font_size, True, WHITE)
    # body
    for i, rowvals in enumerate(rows):
        cells = t.add_row().cells
        is_total = total_row and i == len(rows)-1
        for j, val in enumerate(rowvals):
            c = cells[j]; set_cell_margins(c)
            if is_total: shade(c, "E9EDF0")
            elif zebra and i % 2 == 1: shade(c, "F5F7F9")
            p = c.paragraphs[0]; p.paragraph_format.space_after = Pt(0)
            if j >= align_right_from: p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            run(p, str(val), font_size, bold=is_total or j == 0 and is_total,
                color=NAVY if is_total else INK)
    if widths:
        for j, w in enumerate(widths):
            for row in t.rows:
                row.cells[j].width = Inches(w)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return t

def kpi_band(items):
    """items: list of (value, label). Renders a shaded KPI strip."""
    t = doc.add_table(rows=2, cols=len(items))
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    no_borders(t)
    for j, (val, label) in enumerate(items):
        cv = t.rows[0].cells[j]; cl = t.rows[1].cells[j]
        shade(cv, "0F2942"); shade(cl, "0F2942")
        set_cell_margins(cv, top=90, bottom=10); set_cell_margins(cl, top=0, bottom=90)
        pv = cv.paragraphs[0]; pv.alignment = WD_ALIGN_PARAGRAPH.CENTER; pv.paragraph_format.space_after = Pt(0)
        run(pv, val, 17, True, WHITE)
        pl = cl.paragraphs[0]; pl.alignment = WD_ALIGN_PARAGRAPH.CENTER; pl.paragraph_format.space_after = Pt(0)
        run(pl, label, 8, False, RGBColor(0xC7, 0xD3, 0xDE))
    doc.add_paragraph().paragraph_format.space_after = Pt(4)
    return t

def usd(v):  # v in USD 000
    return f"${v:,.0f}K" if v < 1000 else f"${v/1000:.2f}M"

def money0(v):
    return f"{v:,.0f}"

# =====================================================================
# COVER PAGE
# =====================================================================
sec = doc.sections[0]
sec.top_margin = Inches(0.9); sec.bottom_margin = Inches(0.8)
sec.left_margin = Inches(0.9); sec.right_margin = Inches(0.9)

# Top navy band with company name
def cover_band():
    t = doc.add_table(rows=1, cols=1)
    no_borders(t)
    c = t.rows[0].cells[0]; shade(c, "0F2942")
    set_cell_margins(c, top=260, bottom=260, left=260, right=260)
    p = c.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after = Pt(0)
    run(p, "NORCO", 40, True, WHITE)
    p2 = c.add_paragraph(); p2.alignment = WD_ALIGN_PARAGRAPH.CENTER; p2.paragraph_format.space_after = Pt(0)
    run(p2, "GENERAL TRADING L.L.C.", 13, True, RGBColor(0xC8, 0x89, 0x2A))
    p3 = c.add_paragraph(); p3.alignment = WD_ALIGN_PARAGRAPH.CENTER; p3.paragraph_format.space_before = Pt(6); p3.paragraph_format.space_after = Pt(0)
    run(p3, "Energy Storage  ·  Houseware Distribution", 10.5, False, RGBColor(0xC7, 0xD3, 0xDE))

para(space_after=14)
cover_band()
para(space_after=20)
para("BUSINESS PLAN & INVESTMENT PROPOSAL", 20, True, NAVY, WD_ALIGN_PARAGRAPH.CENTER, space_after=6)
para("A Two-Division Distribution Platform for North & East Africa", 13, False, TEAL,
     WD_ALIGN_PARAGRAPH.CENTER, space_after=18, italic=True)

# Two-division summary boxes
tb = doc.add_table(rows=1, cols=2); tb.alignment = WD_TABLE_ALIGNMENT.CENTER
hairline_borders(tb, "C8892A")
for cell, title, sub, fill in [
    (tb.rows[0].cells[0], "VESTWOODS", "Haier Energy lithium battery\nenergy storage systems", "F3F5F7"),
    (tb.rows[0].cells[1], "AL REEM PLASTICS", "Premium houseware &\nplastic products from Türkiye", "F3F5F7")]:
    shade(cell, fill); set_cell_margins(cell, top=150, bottom=150, left=150, right=150)
    p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after = Pt(2)
    run(p, title, 13, True, NAVY)
    for line in sub.split("\n"):
        pp = cell.add_paragraph(); pp.alignment = WD_ALIGN_PARAGRAPH.CENTER; pp.paragraph_format.space_after = Pt(0)
        run(pp, line, 9.5, False, MUTED)
para(space_after=18)

para("Egypt  ·  Sudan  ·  Libya  ·  Algeria   |   August 2026 – July 2031", 11, True, INK, WD_ALIGN_PARAGRAPH.CENTER, space_after=14)

# Ask highlight box
t = doc.add_table(rows=1, cols=1); t.alignment = WD_TABLE_ALIGNMENT.CENTER
no_borders(t); c = t.rows[0].cells[0]; shade(c, "C8892A")
set_cell_margins(c, top=130, bottom=130, left=200, right=200)
p = c.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after = Pt(0)
run(p, "Investment Sought:  USD 2,000,000", 15, True, WHITE)
p2 = c.add_paragraph(); p2.alignment = WD_ALIGN_PARAGRAPH.CENTER; p2.paragraph_format.space_after = Pt(0)
run(p2, "core raise  (band USD 1,000,000 – 2,500,000)", 10, False, RGBColor(0xFF, 0xF4, 0xDF))
para(space_after=20)

para("Prepared by  Fadi Jannan — Managing Director", 10.5, True, INK, WD_ALIGN_PARAGRAPH.CENTER, space_after=2)
para("Dubai, UAE  ·  Cairo, Egypt   |   +971 58 509 3383  ·  +20 10 5544 2066", 9.5, False, MUTED, WD_ALIGN_PARAGRAPH.CENTER, space_after=2)
para("f.jannan@norcotrading.com   ·   www.norcotrading.com", 9.5, False, MUTED, WD_ALIGN_PARAGRAPH.CENTER, space_after=14)
para("14 July 2026  ·  Version 5.0 (Group)  ·  Strictly Private & Confidential", 9, True, MUTED, WD_ALIGN_PARAGRAPH.CENTER)

doc.add_page_break()

# =====================================================================
# FOOTER (page numbers) on main sections
# =====================================================================
def add_footer(section):
    footer = section.footer
    p = footer.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run(p, "NORCO General Trading L.L.C.  ·  Business Plan & Investment Proposal  ·  Strictly Private & Confidential", 7.5, False, MUTED)
add_footer(sec)

# =====================================================================
# 1. EXECUTIVE SUMMARY
# =====================================================================
h1("1", "Executive Summary")
para("NORCO General Trading L.L.C. is a UAE- and Egypt-registered distribution company "
     "operating two complementary product divisions across four high-growth North and East "
     "African markets. Commercial operations begin in August 2026 from an already-renovated, "
     "operating showroom in 6th October City, Cairo.", 10.5, space_after=8)

h2("Two divisions, one platform")
bullet([("Vestwoods (Haier Energy) — ", True),
        ("NORCO is the exclusive distributor of Vestwoods lithium battery energy storage "
         "systems for Egypt, with three live export corridors: a committed Sudan buyer ready to "
         "order on arrival of the first containers, an Algerian company in advanced agency "
         "negotiation, and Libya launching in Year 2.", False)])
bullet([("Al Reem Plastics — ", True),
        ("a verified 147-SKU range of premium houseware and plastic products sourced from "
         "Türkiye. High-turnover, lower-ticket, cash-generative goods that diversify NORCO's "
         "revenue, deepen its dealer relationships and share the same warehouse, showroom and "
         "logistics platform — at low incremental cost.", False)])

para(space_after=2)
kpi_band([("$101.4M", "5-YEAR GROUP REVENUE"), ("$13.8M", "5-YEAR NET PROFIT"),
          ("Month 3", "OPERATING BREAK-EVEN"), ("60% / 28%", "INVESTOR IRR — OPT A / B")])

h2("Why the two divisions fit together")
para("Vestwoods is a high-value, capital-intensive business: every container is prepaid in Year 1, "
     "so it needs working capital up front but delivers large gross-profit dollars. Al Reem Plastics "
     "is the mirror image — low unit cost, fast inventory turns, everyday demand that is insensitive "
     "to the economic cycle. Together they smooth NORCO's cash flow, keep the sales team and "
     "showrooms productive between battery shipments, and turn one distribution licence, one "
     "warehouse and one management team into two revenue engines.", 10.5, space_after=8)

h2("The ask")
para("USD 2,000,000 core raise, released in three milestone-gated tranches (Section 8), fully "
     "deployable within 18 months of the August 2026 start. Band: USD 1.0M minimum to USD 2.5M "
     "full acceleration. The capital funds Vestwoods' Year-1 container prepayments and Al Reem's "
     "opening houseware inventory; from Month 13 Vestwoods converts to supplier credit and the "
     "group becomes self-funding.", 10.5, space_after=8)

h2("The returns")
bullet([("Group 5-year performance — ", True),
        (f"USD {M.REV_5YR/1000:.1f}M revenue, USD {M.GP_5YR/1000:.1f}M gross profit, "
         f"USD {M.NP_5YR/1000:.1f}M net profit. Year 1: USD {M.REV[0]/1000:.2f}M revenue and "
         f"USD {M.NP[0]:,}K net profit, with operating break-even in Month 3.", False)])
bullet([("Option A — 50% equity: ", True),
        (f"dividends plus retained stake deliver a {M.OPT_A_IRR*100:.0f}% IRR and {M.OPT_A_MOIC:.1f}x "
         f"MOIC; dividends alone return {M.OPT_A_DIV_MULTIPLE:.2f}x the capital inside five years.", False)])
bullet([("Option B — 25% profit share + capital redemption at Year 5: ", True),
        (f"{M.OPT_B_IRR*100:.0f}% IRR, {M.OPT_B_MOIC:.2f}x MOIC, with the investor's capital "
         "repaid at par.", False)])

h2("Proof already on the table")
para("The founder has invested USD 14,517 pre-launch — including EGP 31,948.50 of product stock "
     "purchased and sold through the operating showroom before launch. UAE and Egypt registration, "
     "import permits, GOEIC application, fit-out and branding are complete. The Al Reem Plastics "
     "range is fully costed at the SKU level and the supplier relationship is in place.", 10.5, space_after=6)

add_chart("revenue_by_division.png", 6.4)

doc.add_page_break()

# =====================================================================
# 2. COMPANY DESCRIPTION & OWNERSHIP
# =====================================================================
h1("2", "Company Description & Ownership")
bullet([("Legal structure — ", True),
        ("NORCO General Trading L.L.C., UAE-registered (Dubai trade licence active) with Egyptian "
         "commercial registration, import permits and GOEIC application complete. Operations are led "
         "from Cairo; supplier and treasury relationships from Dubai.", False)])
bullet([("Business model — ", True),
        ("an asset-light import-and-distribute platform. NORCO imports finished goods, holds them in "
         "its 6th October City warehouse, and sells through its own showrooms, a growing dealer "
         "network, and export sub-distributors — across two product divisions.", False)])
bullet([("Locations — ", True),
        ("Showroom #1: 6th October City (operational, 2-year lease). Showroom #2: Fifth Settlement "
         "(opens Month 1). Office: Fifth Settlement, 100 sqm. Warehouse: 6th October City, "
         "300–500 sqm — shared by both divisions.", False)])

h2("2.1  Proposed distribution of shares")
para("The company currently has three shareholders. Under the proposed 50% investor scenario, the "
     "existing partners dilute proportionally as follows:", 10.5, space_after=6)
sh_rows = [[name, f"{cur*100:.0f}%" if cur else "—", f"{post*100:.0f}%"]
           for name, cur, post in M.SHAREHOLDING]
sh_rows.append(["Total", "100%", "100%"])
table(["Shareholder", "Current", "Post-investment (50%)"], sh_rows,
      widths=[3.9, 1.3, 1.7], total_row=True, align_right_from=1)
para("Alternative structure available: no equity — 25% net-profit share plus capital redemption at "
     "par at the end of Year 5 (Section 8). The Chairman remains executive lead and exclusive-agency "
     "holder under both structures.", 9.5, italic=True, color=MUTED, space_after=8)

h2("2.2  Pre-operational investment — USD 14,517 already spent")
preop = [
    ["Showroom renovation — 6th October City", "EGP 82,000", "1,640"],
    ["Showroom furniture & fittings", "EGP 85,000", "1,700"],
    ["Security cameras & CCTV", "EGP 7,500", "150"],
    ["Additional setup & equipment", "EGP 50,000", "1,000"],
    ["Legal & licensing — Egypt registration (2025)", "EGP 87,000", "1,740"],
    ["Legal & licensing — import permits (2026)", "EGP 80,000", "1,600"],
    ["UAE business licence — NORCO LLC", "AED 15,000", "4,084"],
    ["Showroom rent — 2 months pre-operations", "EGP 20,000", "400"],
    ["Sales representative — 2 months pre-launch", "2 × USD 500", "1,000"],
    ["Products purchased & sold in showroom (pre-launch trading)", "EGP 31,948.50", "603"],
    ["Branding, logo & stationery", "USD 300", "300"],
    ["Corporate website — norcotrading.com", "USD 300", "300"],
    ["Total pre-operational investment", "", "14,517"],
]
table(["Item", "Original", "USD"], preop, widths=[4.4, 1.6, 0.9], total_row=True, align_right_from=2)

doc.add_page_break()

# =====================================================================
# 3. THE TWO DIVISIONS
# =====================================================================
h1("3", "The Two Divisions")

h2("3.1  Vestwoods — Haier Energy battery storage")
para("Vestwoods is a Haier Energy brand of lithium (LFP) battery energy storage systems, hybrid "
     "inverters and telecom power. NORCO holds the exclusive Egypt agency with price control. The "
     "product answers a purchase of necessity: chronic load-shedding, diesel-price escalation and a "
     "national solar push across residential, telecom and commercial & industrial (C&I) segments. "
     "Vestwoods prices 15–25% below premium brands with Haier-backed quality and a 5-year "
     "warranty; grey-market imports cannot match warranty, service or price control.", 10.5, space_after=6)
para("Full Vestwoods range ships in 40ft FCL containers (340 units, landed USD 239,805 each), "
     "China → Alexandria, 45–55 day lead time. Verified pricing (USD, EGP 53):", 10.5, space_after=6)
vw_price = [
    ["VE51100L", "Smart Battery 5.12 kWh", "672", "853", "1,137", "1,364"],
    ["VE51200L", "Smart Battery 10.24 kWh", "1,200", "1,508", "2,011", "2,413"],
    ["VE51314L", "Smart Battery 16.07 kWh", "1,560", "1,955", "2,607", "3,128"],
    ["HEH-S6KB3-LV", "Hybrid Inverter 6 kW", "390", "504", "670", "804"],
    ["VEP1K20", "Rescube All-in-One 2 kWh", "365", "473", "628", "754"],
    ["VEB 704 / 832", "C&I Cabinets 221 / 261 kWh", "27,300+", "33,880+", "38,973+", "project"],
    ["VT48100E / VT48200", "Telecom 48V batteries", "563 / 980", "943 / 1,380", "1,044 / 1,530", "B2B"],
]
table(["Model", "Description", "Factory", "Landed", "Wholesale", "Retail"], vw_price,
      widths=[1.3, 2.0, 0.85, 0.85, 0.95, 0.85], align_right_from=2, font_size=8.8)

h2("3.2  Al Reem Plastics — premium houseware from Türkiye")
para("Al Reem Plastics is a full range of 147 stock-keeping units of household plastic products "
     "— storage drawers and boxes, kitchen and food containers, laundry and cleaning ware, "
     "bowls and tableware, planters, chairs and tables. The goods are sourced from established "
     "Türkiye manufacturers and imported in mixed 40ft containers. Every SKU is costed to the "
     "cent: landed cost, wholesale price (COGS ×15%) and retail price (COGS ×38%) are already "
     "modelled in NORCO's pricing sheet.", 10.5, space_after=6)
para("Strategically, Al Reem does four things for NORCO:", 10.5, bold=True, space_after=4)
bullet([("Diversification — ", True), ("everyday, cycle-resistant demand that is uncorrelated with "
        "the energy-capex cycle and unaffected by grid policy.", False)])
bullet([("Cash velocity — ", True), ("low unit cost and fast turns generate working capital that "
        "helps fund the heavier Vestwoods inventory.", False)])
bullet([("Platform leverage — ", True), ("shares the same warehouse, showrooms, logistics and "
        "management, so gross margin drops almost straight to contribution.", False)])
bullet([("Channel depth — ", True), ("gives NORCO a second reason to call on every retailer and "
        "wholesaler, widening the dealer network that also sells Vestwoods.", False)])
para("Representative Al Reem unit economics (verified, USD):", 10.5, space_after=6, space_before=4)
ar_price = [
    ["Storage Drawers (4) w/ compartment", "23.98", "27.75", "33.30", "16 / 39%"],
    ["Clothes Drier", "19.95", "23.12", "27.74", "16 / 39%"],
    ["90L Waste bin with cover", "11.33", "13.21", "15.85", "17 / 40%"],
    ["50L Waste bin", "9.04", "10.57", "12.68", "17 / 40%"],
    ["Large Laundry Basket with Lid", "9.78", "11.43", "13.71", "17 / 40%"],
    ["13.5L Rectangular Food Container", "3.77", "4.51", "5.41", "20 / 43%"],
    ["Sugar box with cover & spoon", "0.67", "0.94", "1.13", "40 / 68%"],
]
table(["Representative SKU", "Landed COGS", "Wholesale", "Retail", "GM% W/R"], ar_price,
      widths=[2.9, 1.05, 1.0, 0.85, 1.0], align_right_from=1, font_size=8.8)
para("Across the 147-SKU range, blended gross margin runs ~19% wholesale to ~28% at retail; NORCO "
     "models the division at a 19% blended margin in Year 1, rising to 23% by Year 5 as the "
     "own-showroom retail mix and brand pull grow.", 9.5, italic=True, color=MUTED, space_after=6)

doc.add_page_break()

# =====================================================================
# 4. MARKET ANALYSIS
# =====================================================================
h1("4", "Market Analysis")
h2("4.1  Vestwoods — four energy-storage corridors")
bullet([("Egypt — ", True), ("chronic load-shedding, diesel escalation and the national solar push "
        "make lithium storage a purchase of necessity across residential, telecom and C&I segments. "
        "Vestwoods' price/quality position and warranty beat both premium brands and grey-market "
        "imports. 12 → 40 containers over five years.", False)])
bullet([("Sudan — ", True), ("committed buyer already identified; orders trigger on arrival of the "
        "first containers at NORCO's warehouse, on 50% advance + 50% on delivery. Grid instability "
        "makes solar-household and telecom kits essential goods. 4 → 20 containers.", False)])
bullet([("Algeria — ", True), ("NORCO is in active negotiation with an Algerian company to take the "
        "agency and place first orders by the end of Year 1. Structured FOB Jebel Ali to a licensed "
        "importer under the bank-domiciliation regime, 100% LC before shipment, zero in-country "
        "exposure. 1 → 9 containers.", False)])
bullet([("Libya — ", True), ("dual-hub distributors (Tripoli + Benghazi) from Year 2 on advance/LC "
        "terms; 2 → 7 containers.", False)])
add_chart("revenue_by_market.png", 6.2)

h2("4.2  Al Reem Plastics — everyday houseware demand")
para("Egypt's ~110 million people, rapid new-city housing (New Cairo, 6th October, the New "
     "Administrative Capital) and a large informal-retail base drive constant replacement demand for "
     "affordable, durable household plastics. Türkiye-made goods carry a quality-and-design premium "
     "over local production while remaining price-competitive after duty. The same Sudan and Libya "
     "corridors that take Vestwoods also absorb houseware through NORCO's export sub-distributors. "
     "NORCO enters at wholesale to retailers and hypermarkets, and at retail through its own "
     "showrooms and online channel.", 10.5, space_after=8)

h2("4.3  SWOT — NORCO Group")
sw = doc.add_table(rows=2, cols=2); sw.alignment = WD_TABLE_ALIGNMENT.CENTER
hairline_borders(sw)
swot = [
    ("Strengths", "F0F6F2",
     "Two complementary divisions on one platform; Vestwoods exclusive agency + price control; "
     "operating showroom with pre-launch sales; committed Sudan buyer; Al Reem fully SKU-costed; Haier brand."),
    ("Weaknesses", "FBF3F0",
     "Year-1 Vestwoods prepayment strains working capital; execution depends on the raise closing "
     "on time; two supply chains to manage; new houseware brand-building in Egypt."),
    ("Opportunities", "F0F6F2",
     "Egypt energy tenders (NUCA/EEHC, Law 5/2015 CKD roadmap); telecom fleet contracts; houseware "
     "hypermarket listings; four-market compounding across both divisions."),
    ("Threats", "FBF3F0",
     "EGP devaluation; customs delays; grey-market pricing; regional instability in export corridors; "
     "low-cost local plastics competition."),
]
for idx, (title, fill, body) in enumerate(swot):
    cell = sw.rows[idx//2].cells[idx % 2]
    shade(cell, fill); set_cell_margins(cell, top=110, bottom=110, left=140, right=140)
    p = cell.paragraphs[0]; p.paragraph_format.space_after = Pt(3)
    run(p, title, 11, True, NAVY)
    pb = cell.add_paragraph(); pb.paragraph_format.space_after = Pt(0)
    run(pb, body, 9, False, INK)
doc.add_paragraph().paragraph_format.space_after = Pt(2)

doc.add_page_break()

# =====================================================================
# 5. SUPPLIER & CUSTOMER TERMS
# =====================================================================
h1("5", "Supplier & Customer Terms — the Cash-Flow Engine")
para("The structure of the plan is driven by payment terms. Vestwoods requires full prepayment in "
     "Year 1, which is exactly why the raise is needed; Al Reem and the export customers generate "
     "cash quickly, which is exactly what funds the group thereafter.", 10.5, space_after=8)
terms = [
    ["Vestwoods — Year 1 (POs Aug-26 – Jul-27)", "100% payment before shipment, every container",
     "Capital sits ~2 months ahead of revenue; peak working-capital need in Month 4"],
    ["Vestwoods — Year 2+ (POs from Month 13)", "10% downpayment + 90% at 3-month credit",
     "~90% of container capital released; Year 2+ growth self-funding"],
    ["Al Reem Plastics — supplier", "Deposit + balance against shipping documents",
     "Lower ticket size; inventory turns fast, releasing cash within the quarter"],
    ["Egypt customers", "30–60 days (avg 45); 1-month collection lag", "Held to agreed limits; stop-supply discipline"],
    ["Sudan / Libya", "50% advance + 50% on delivery (same month)", "Cash received before/at shipment — working-capital positive"],
    ["Algeria", "100% LC before shipment", "Zero receivable risk; zero in-country exposure"],
]
table(["Party / period", "Terms", "Cash impact"], terms, widths=[2.4, 2.3, 2.3],
      align_right_from=99, font_size=9)

doc.add_page_break()

# =====================================================================
# 6. FINANCIAL PLAN
# =====================================================================
h1("6", "Financial Plan")
para("All figures USD thousands unless noted. Vestwoods figures follow the founder's vetted "
     "Business Plan V4; Al Reem Plastics figures are planning projections built on the verified "
     "April-2026 catalogue unit economics. Planning FX: USD 1 = EGP 53 (spot ~49–51, "
     "conservative). Corporate tax 22.5% on net profit.", 9.5, italic=True, color=MUTED, space_after=8)

h2("6.1  Consolidated 5-year P&L")
pl_rows = [
    ["Vestwoods revenue"] + [money0(v) for v in M.VW_REV],
    ["Al Reem Plastics revenue"] + [money0(v) for v in M.AR_REV],
    ["Total revenue"] + [money0(v) for v in M.REV],
    ["Gross profit"] + [money0(v) for v in M.GP],
    ["Gross margin %"] + [f"{g/r*100:.0f}%" for g, r in zip(M.GP, M.REV)],
    ["Operating expenses"] + [money0(v) for v in M.OPEX],
    ["EBIT"] + [money0(v) for v in M.EBIT],
    ["Corporate tax (22.5%)"] + [money0(v) for v in M.TAX_AMT],
    ["Net profit"] + [money0(v) for v in M.NP],
    ["Net margin %"] + [f"{n/r*100:.1f}%" for n, r in zip(M.NP, M.REV)],
]
table(["USD 000", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"], pl_rows,
      widths=[2.2, 0.9, 0.9, 0.9, 0.9, 0.9], font_size=9)
add_chart("profit_trend.png", 6.0)
add_chart("net_margin.png", 6.0)

doc.add_page_break()

h2("6.2  Revenue build — markets & divisions")
mkt_rows = [
    ["Egypt (Vestwoods)"] + [money0(v) for v in M.VW_MARKET_REV["Egypt"]],
    ["Sudan (Vestwoods)"] + [money0(v) for v in M.VW_MARKET_REV["Sudan"]],
    ["Libya (Vestwoods)"] + [money0(v) for v in M.VW_MARKET_REV["Libya"]],
    ["Algeria (Vestwoods)"] + [money0(v) for v in M.VW_MARKET_REV["Algeria"]],
    ["Al Reem Plastics (all markets)"] + [money0(v) for v in M.AR_REV],
    ["Total group revenue"] + [money0(v) for v in M.REV],
]
table(["USD 000", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"], mkt_rows,
      widths=[2.4, 0.85, 0.85, 0.85, 0.85, 0.85], total_row=True, font_size=9)
add_chart("containers.png", 6.0)

h2("6.3  Cash flow & the working-capital story")
para("Year 1 is the only year that depends on the raise. Vestwoods' 100%-prepayment terms mean "
     "container capital sits roughly two months ahead of revenue, creating a peak funding need in "
     "the opening months. From Month 13 the Vestwoods credit switch (10% down + 90% on 3-month "
     "credit) releases the vast majority of that capital, and Al Reem's fast-turning inventory "
     "throws off cash from the first quarter. The combined effect: closing cash rises every year "
     "thereafter, even while paying dividends and rising taxes, with no capital call after "
     "Tranche 3.", 10.5, space_after=8)
cf_rows = [
    ["Customer collections", "6,400", "12,050", "18,300", "25,500", "34,600"],
    ["Investor capital (T1–T3)", "2,000", "—", "—", "—", "—"],
    ["Supplier & inventory payments", "(5,540)", "(8,930)", "(13,760)", "(18,940)", "(25,120)"],
    ["Operating expenses (cash)", "(945)", "(1,400)", "(1,915)", "(2,500)", "(3,465)"],
    ["Tax paid (prior year, arrears)", "—", "(249)", "(426)", "(709)", "(1,076)"],
    ["Investor dividends (Option A, 50%)", "—", "(428)", "(734)", "(1,220)", "(1,853)"],
    ["Capex", "(50)", "(25)", "(30)", "(35)", "(40)"],
    ["Closing cash position", "1,865", "2,883", "4,318", "6,414", "9,280"],
]
table(["USD 000", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"], cf_rows,
      widths=[2.4, 0.85, 0.85, 0.85, 0.85, 0.85], total_row=True, font_size=9)
para("Illustrative group cash flow; the formula-driven companion workbook carries the full monthly "
     "Year-1 detail and the five-year build.", 8.5, italic=True, color=MUTED, space_after=6)

doc.add_page_break()

# =====================================================================
# 7. STAFFING
# =====================================================================
h1("7", "Staffing Plan")
para("Institutional management from day one, shared across both divisions: CEO/MD, CFO and COO "
     "hired in Month 1, Director of Sales in Month 2, Marketing and HR in Month 3. Headcount reaches "
     "21 by Month 12 and grows to ~58 by Year 5. Egyptian social insurance at 15% and 4% Egypt sales "
     "commissions are included. A dedicated houseware sales desk is added within the existing "
     "structure, keeping Al Reem's incremental personnel cost low.", 10.5, space_after=8)
staff = [
    ["Year 1 — launch team (CEO, CFO, COO, Directors, showrooms, warehouse, sales)", "21", "547,515"],
    ["Year 2 — + BD Director, Logistics, Customer Service, houseware desk", "29", "751,440"],
    ["Year 3 — + Alexandria branch, installation engineers, analysts", "38", "1,014,200"],
    ["Year 4 — + B2G/Tenders, C&I sales, IT/CRM, Sudan coordinator", "47", "1,303,160"],
    ["Year 5 — + Algeria/Libya export desk, service & warehouse scale", "58", "1,935,060"],
]
table(["Year & additions", "Headcount", "Total personnel (USD)"], staff,
      widths=[4.2, 1.2, 1.6], align_right_from=1, font_size=9)

# =====================================================================
# 8. FUNDING & INVESTOR PROPOSAL
# =====================================================================
h1("8", "Funding Requirements & Investor Proposal")
h2("8.1  The ask")
para("USD 2,000,000 core raise for the combined two-division plan — an expansion of the "
     "Vestwoods-only requirement to fund Al Reem's opening inventory alongside Vestwoods' Year-1 "
     "container prepayments. Released in three milestone-gated tranches; band USD 1.0M – 2.5M.",
     10.5, space_after=6)
tr_rows = [[name, f"{amt:,},000".replace(",000,000", ",000,000"), timing, purpose]
           for name, amt, timing, purpose in
           [(n, a*1000, t, p) for n, a, t, p in M.TRANCHES]]
# format amounts cleanly
tr_rows = []
for n, a, t, p in M.TRANCHES:
    tr_rows.append([n, f"{a*1000:,.0f}", t, p])
table(["Tranche", "USD", "Timing", "Purpose / gate"], tr_rows,
      widths=[1.5, 0.9, 1.7, 2.5], align_right_from=1, font_size=8.8)
add_chart("use_of_funds.png", 4.6)

h2("8.2  Investor structures")
bullet([("Option A — 50% equity: ", True),
        (f"the investor takes 50% of the company (existing shareholders dilute per Section 2.1). "
         f"Dividends at 50% of net profit plus the retained stake deliver a {M.OPT_A_IRR*100:.0f}% IRR "
         f"and {M.OPT_A_MOIC:.1f}x MOIC over five years; dividends alone return "
         f"{M.OPT_A_DIV_MULTIPLE:.2f}x the capital, before counting a 50% share of a business earning "
         f"USD {M.NP[4]/1000:.1f}M net profit by Year 5.", False)])
bullet([("Option B — no equity: ", True),
        (f"25% net-profit share plus capital redemption at par at the end of Year 5 — "
         f"{M.OPT_B_IRR*100:.0f}% IRR, {M.OPT_B_MOIC:.2f}x MOIC, with the investor's principal returned.", False)])
add_chart("returns.png", 6.0)
add_chart("cumulative_profit.png", 6.0)

h2("8.3  Investor protections (both options)")
bullet("Milestone-gated tranches — Tranche 2 released only against verified Month-4 milestones "
       "(containers sold through + Sudan advances received); Tranche 3 against houseware sell-through.")
bullet("Quarterly management accounts from the formula-driven model; monthly cash and inventory "
       "reporting across both divisions.")
bullet("USD-denominated books; Egypt customers on max 60-day terms; Sudan/Libya cash-before-shipment; "
       "Algeria LC only.")
bullet("Exclusive Vestwoods agency (with first right of engagement and non-circumvention) assignable "
       "as security.")
bullet("Founder pre-investment of USD 14,517 already deployed — operational showroom, licences and "
       "import permits complete.")

doc.add_page_break()

# =====================================================================
# 9. OPERATIONS, RISKS & MITIGATION
# =====================================================================
h1("9", "Operations, Risks & Mitigation")
bullet([("Supply chain (Vestwoods) — ", True),
        ("PO (100% prepaid Y1) → factory 15–20 days → sea 18 days → clearance 7–10 days "
         "(5% duty, 2% GOEIC, 14% VAT recoverable) → 6th October warehouse; roughly one container "
         "every three weeks in Year 1.", False)])
bullet([("Supply chain (Al Reem) — ", True),
        ("mixed 40ft containers from Türkiye on a shorter Mediterranean lead time; higher SKU count "
         "managed by the shared warehouse team and a simple min/max reorder system.", False)])
risks = [
    ["EGP devaluation", "USD-indexed pricing at EGP 53 planning rate (spot ~49–51); 30-day quote validity; USD books"],
    ["Y1 Vestwoods prepayment exposure", "Haier-backed counterparty; staged POs; credit switch contractually anchored at Month 13"],
    ["Raise timing", "Tranche 1 must close before first PO; container schedule flexes with drawdown"],
    ["Customs / GOEIC delays", "Permits issued; broker retained; 45–60 day inventory cover"],
    ["Egypt receivables", "45-day terms; anchor accounts on agreed limits; stop-supply discipline"],
    ["Export instability (Sudan/Libya)", "Cash before shipment; no in-country assets"],
    ["Algeria regime", "Licensed-importer FOB + 100% LC; zero NORCO exposure"],
    ["Grey-market / local plastics pricing", "5-yr warranty + Cairo service bench (Vestwoods); Türkiye quality + brand (Al Reem)"],
    ["Two supply chains to manage", "Shared platform, single ERP/inventory system, one management team"],
]
table(["Risk", "Mitigation"], risks, widths=[2.3, 4.4], align_right_from=99, font_size=9)

# =====================================================================
# 10. EXECUTION ROADMAP
# =====================================================================
h1("10", "Execution Roadmap")
road = [
    ["Launch", "M1–M3", "T1 drawn; Vestwoods containers 1–3 prepaid; showroom #2 opens; Sudan buyer "
     "inspects warehouse stock and places first order; first Al Reem houseware container ordered"],
    ["Prove", "M4–M6", "T2 drawn; operating break-even confirmed; dealers signed; first Cairo energy "
     "exhibition; Al Reem retail sell-through established; Algeria negotiation to term sheet"],
    ["Convert", "M7–M12", "T3 drawn for houseware inventory; second exhibition; Algeria agency signed "
     "— first LC order ships; Libya distributor due diligence"],
    ["Compound", "M13–M18", "Vestwoods credit terms activate; Libya first containers; four-market, "
     "two-division operation running on self-generated cash"],
    ["Scale", "Y3–Y5", "40 Egypt + 20 Sudan + 7 Libya + 9 Algeria Vestwoods containers by Y5; Al Reem "
     "houseware scaled across retail & export; CKD assembly evaluation; closing cash ~USD 9.3M"],
]
table(["Phase", "Timing", "Milestones"], road, widths=[1.2, 1.1, 4.4], align_right_from=99, font_size=9)

para(space_after=8)
# Closing statement box
t = doc.add_table(rows=1, cols=1); t.alignment = WD_TABLE_ALIGNMENT.CENTER
no_borders(t); c = t.rows[0].cells[0]; shade(c, "0F2942")
set_cell_margins(c, top=160, bottom=160, left=200, right=200)
p = c.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after = Pt(4)
run(p, "The opportunity", 11, True, GOLD)
p2 = c.add_paragraph(); p2.alignment = WD_ALIGN_PARAGRAPH.CENTER; p2.paragraph_format.space_after = Pt(0)
run(p2, "USD 2.0M funds a de-risked, two-division distribution platform with an exclusive energy-storage "
     "agency, a fully-costed houseware range, live export corridors and a founder already invested and "
     "operational — targeting USD 101M of revenue and USD 13.8M of net profit over five years, at a "
     "60% investor IRR.", 10.5, False, WHITE)

para(space_after=8)
para("Companion workbook: NORCO_Group_Investor_Model.xlsx — consolidated 5-year P&L, revenue build "
     "by market and division, cash flow, Al Reem catalogue economics, funding scenarios, investor "
     "returns and shareholding, all formula-driven.", 9, italic=True, color=MUTED)

doc.save(OUT)
print("Saved", OUT)
