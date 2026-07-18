# -*- coding: utf-8 -*-
"""Build the NORCO Vestwoods Business Plan & Investment Proposal V7 (.docx) — Vestwoods only."""
import os
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import model as M

ASSETS = os.path.join(os.path.dirname(__file__), "..", "assets")
OUT = os.path.join(os.path.dirname(__file__), "..", "NORCO_Vestwoods_Business_Plan.docx")

NAVY = RGBColor(0x0F, 0x29, 0x42); TEAL = RGBColor(0x0F, 0x6E, 0x6A)
GOLD = RGBColor(0xC8, 0x89, 0x2A); INK = RGBColor(0x1A, 0x1A, 0x19)
MUTED = RGBColor(0x5C, 0x5B, 0x57); WHITE = RGBColor(0xFF, 0xFF, 0xFF)

doc = Document()
normal = doc.styles["Normal"]
normal.font.name = "Calibri"; normal.font.size = Pt(10.5)
normal.font.color.rgb = INK
normal.paragraph_format.space_after = Pt(6)
normal.paragraph_format.line_spacing = 1.12

def shade(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    sh = OxmlElement("w:shd")
    sh.set(qn("w:val"), "clear"); sh.set(qn("w:color"), "auto"); sh.set(qn("w:fill"), hex_color)
    tcPr.append(sh)

def cell_margins(cell, top=60, bottom=60, left=110, right=110):
    tcPr = cell._tc.get_or_add_tcPr()
    m = OxmlElement("w:tcMar")
    for name, val in (("top", top), ("bottom", bottom), ("start", left), ("end", right)):
        e = OxmlElement(f"w:{name}"); e.set(qn("w:w"), str(val)); e.set(qn("w:type"), "dxa"); m.append(e)
    tcPr.append(m)

def no_borders(table):
    borders = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        e = OxmlElement(f"w:{edge}"); e.set(qn("w:val"), "none"); borders.append(e)
    table._tbl.tblPr.append(borders)

def hairline(table, color="D8DCE0"):
    borders = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        e = OxmlElement(f"w:{edge}")
        e.set(qn("w:val"), "single"); e.set(qn("w:sz"), "4")
        e.set(qn("w:space"), "0"); e.set(qn("w:color"), color)
        borders.append(e)
    table._tbl.tblPr.append(borders)

def run(p, text, size=10.5, bold=False, color=INK, italic=False):
    r = p.add_run(text)
    r.font.size = Pt(size); r.font.bold = bold; r.font.italic = italic
    r.font.color.rgb = color; r.font.name = "Calibri"
    return r

def para(text="", size=10.5, bold=False, color=INK, align=None, space_after=6, space_before=0, italic=False):
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
    run(p, f"{num}   ", 15, True, GOLD); run(p, text, 15, True, NAVY)
    pPr = p._p.get_or_add_pPr(); pbdr = OxmlElement("w:pBdr")
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
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Inches(0.28)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.1
    run(p, "▪  ", 10.5, True, GOLD)
    if isinstance(text_runs, str): text_runs = [(text_runs, False)]
    for t, b in text_runs: run(p, t, 10.5, b, INK)
    return p

def add_chart(name, width=6.4, caption=None):
    doc.add_picture(os.path.join(ASSETS, name), width=Inches(width))
    doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER
    if caption:
        para(caption, 8.5, False, MUTED, WD_ALIGN_PARAGRAPH.CENTER, space_after=10, italic=True)

def table(headers, rows, widths=None, zebra=True, total_row=False, align_right_from=1, font_size=9.5):
    t = doc.add_table(rows=1, cols=len(headers))
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    hairline(t)
    for j, htext in enumerate(headers):
        c = t.rows[0].cells[j]; shade(c, "0F2942"); cell_margins(c)
        p = c.paragraphs[0]; p.paragraph_format.space_after = Pt(0)
        if j >= align_right_from: p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        run(p, str(htext), font_size, True, WHITE)
    for i, rowvals in enumerate(rows):
        cells = t.add_row().cells
        is_total = total_row and i == len(rows)-1
        for j, val in enumerate(rowvals):
            c = cells[j]; cell_margins(c)
            if is_total: shade(c, "E9EDF0")
            elif zebra and i % 2 == 1: shade(c, "F5F7F9")
            p = c.paragraphs[0]; p.paragraph_format.space_after = Pt(0)
            if j >= align_right_from: p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            run(p, str(val), font_size, bold=is_total, color=NAVY if is_total else INK)
    if widths:
        for j, w in enumerate(widths):
            for row_ in t.rows: row_.cells[j].width = Inches(w)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return t

def kpi_band(items):
    t = doc.add_table(rows=2, cols=len(items)); t.alignment = WD_TABLE_ALIGNMENT.CENTER
    no_borders(t)
    for j, (val, label) in enumerate(items):
        cv, cl = t.rows[0].cells[j], t.rows[1].cells[j]
        shade(cv, "0F2942"); shade(cl, "0F2942")
        cell_margins(cv, top=90, bottom=10); cell_margins(cl, top=0, bottom=90)
        pv = cv.paragraphs[0]; pv.alignment = WD_ALIGN_PARAGRAPH.CENTER; pv.paragraph_format.space_after = Pt(0)
        run(pv, val, 16, True, WHITE)
        pl = cl.paragraphs[0]; pl.alignment = WD_ALIGN_PARAGRAPH.CENTER; pl.paragraph_format.space_after = Pt(0)
        run(pl, label, 8, False, RGBColor(0xC7, 0xD3, 0xDE))
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def K(v): return f"{v:,.0f}"
def MM(v): return f"${v/1e6:.2f}M"

# =====================================================================
# COVER
# =====================================================================
sec = doc.sections[0]
sec.top_margin = Inches(0.9); sec.bottom_margin = Inches(0.8)
sec.left_margin = Inches(0.9); sec.right_margin = Inches(0.9)

para(space_after=20)
t = doc.add_table(rows=1, cols=1); no_borders(t)
c = t.rows[0].cells[0]; shade(c, "0F2942"); cell_margins(c, 300, 300, 260, 260)
p = c.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after = Pt(0)
run(p, "NORCO", 42, True, WHITE)
p2 = c.add_paragraph(); p2.alignment = WD_ALIGN_PARAGRAPH.CENTER; p2.paragraph_format.space_after = Pt(0)
run(p2, "EGYPT  ·  GENERAL TRADING", 13, True, GOLD)
p3 = c.add_paragraph(); p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
p3.paragraph_format.space_before = Pt(6); p3.paragraph_format.space_after = Pt(0)
run(p3, "Exclusive Distributor of Vestwoods (Haier Energy) Battery Storage", 10.5, False, RGBColor(0xC7, 0xD3, 0xDE))
para(space_after=22)
para("VESTWOODS BUSINESS PLAN & INVESTMENT PROPOSAL", 19, True, NAVY, WD_ALIGN_PARAGRAPH.CENTER, space_after=6)
para("Lithium Battery Energy Storage for Egypt, Sudan, Algeria & Libya", 13, False, TEAL,
     WD_ALIGN_PARAGRAPH.CENTER, space_after=20, italic=True)
para("August 2026 – July 2031   |   Investment into NORCO Egypt", 11, True, INK,
     WD_ALIGN_PARAGRAPH.CENTER, space_after=16)

t = doc.add_table(rows=1, cols=1); t.alignment = WD_TABLE_ALIGNMENT.CENTER
no_borders(t); c = t.rows[0].cells[0]; shade(c, "C8892A"); cell_margins(c, 130, 130, 200, 200)
p = c.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after = Pt(0)
run(p, "Investment Sought:  USD 1,000,000  —  50% of NORCO Egypt", 14, True, WHITE)
p2 = c.add_paragraph(); p2.alignment = WD_ALIGN_PARAGRAPH.CENTER; p2.paragraph_format.space_after = Pt(0)
run(p2, "core raise  ·  optional USD 500,000 accelerator (ceiling USD 1.5M)", 10, False, RGBColor(0xFF, 0xF4, 0xDF))
para(space_after=22)
para("Prepared by  Fadi Jannan — Managing Director", 10.5, True, INK, WD_ALIGN_PARAGRAPH.CENTER, space_after=2)
para("Dubai, UAE  ·  Cairo, Egypt   |   +971 58 509 3383  ·  +20 10 5544 2066", 9.5, False, MUTED, WD_ALIGN_PARAGRAPH.CENTER, space_after=2)
para("f.jannan@norcotrading.com   ·   www.norcotrading.com", 9.5, False, MUTED, WD_ALIGN_PARAGRAPH.CENTER, space_after=14)
para("14 July 2026  ·  Version 7.0 (Vestwoods)  ·  Strictly Private & Confidential", 9, True, MUTED, WD_ALIGN_PARAGRAPH.CENTER)
doc.add_page_break()

footer = sec.footer.paragraphs[0]; footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
run(footer, "NORCO Egypt  ·  Vestwoods Business Plan & Investment Proposal  ·  Strictly Private & Confidential", 7.5, False, MUTED)

# =====================================================================
# 1. EXECUTIVE SUMMARY
# =====================================================================
h1("1", "Executive Summary")
para("NORCO Egypt is the exclusive distributor of Vestwoods (Haier Energy) lithium battery energy "
     "storage systems for Egypt, with three live export corridors across North and East Africa. The "
     "company is Cairo-based and backed by NORCO General Trading L.L.C. (UAE), which holds the "
     "exclusive Vestwoods agency and 20% of the Egyptian operating company. Commercial operations "
     "begin in August 2026 from an already-renovated, operating showroom in 6th October City.", space_after=8)

h2("Four markets, one agency")
bullet([("Egypt — ", True), ("the core market: chronic load-shedding, diesel escalation and the "
        "national solar push make lithium storage a purchase of necessity across residential, telecom "
        "and commercial & industrial (C&I) segments. 6 containers in Year 1 growing to 15 by Year 5.", False)])
bullet([("Sudan — ", True), ("committed buyer already identified; orders trigger on arrival of the "
        "first containers on 50% advance + 50% delivery terms. 4 → 10 containers.", False)])
bullet([("Algeria — ", True), ("agency in advanced negotiation; first orders on 100% letters of "
        "credit from Month 8, FOB Jebel Ali to a licensed importer. 3 → 8 containers.", False)])
bullet([("Libya — ", True), ("dual-hub distributors (Tripoli + Benghazi) from Year 2 on advance/LC "
        "terms. 0 → 8 containers. Total across four markets: 13 in Year 1 to 41 by Year 5.", False)])

para(space_after=2)
kpi_band([(MM(M.REV_5YR), "5-YEAR REVENUE"), (MM(M.NP_5YR), "5-YEAR NET PROFIT"),
          ("Month 6", "BREAK-EVEN (OP. & CUM.)"), (f"{M.INV_IRR*100:.0f}% / {M.INV_MOIC:.1f}x", "INVESTOR IRR / MOIC")])

h2("The ask and the return")
bullet([("USD 1,000,000 for 50% of NORCO Egypt ", True),
        ("released in two milestone-gated tranches of USD 500,000 — plus an optional USD 500,000 "
         "accelerator (ceiling USD 1.5M). The capital covers the Year-1 working-capital requirement "
         f"of USD {K(abs(M.PEAK_DEFICIT))} created by Vestwoods' import terms; Sinosure-approved supplier "
         "credit (10% down + 90% at 3-month credit) keeps the need this low.", False)])
bullet([("Profitable in Year 1 — ", True),
        (f"USD {MM(M.REV[0])} revenue and USD {K(M.NP[0])} net profit, with operating and cumulative "
         f"break-even both in Month 6 (January 2027). Five-year net profit USD {MM(M.NP_5YR)}; "
         "Year-1 profit alone approaches the full USD 1.0M investment and cumulative profit clears it "
         "inside Year 2.", False)])
bullet([("Investor cash flow — ", True),
        ("100% of net profit is distributed annually in arrears; the investor receives half of every "
         f"distribution — {M.INV_MOIC_DIV:.1f}x the capital in dividends alone ({M.INV_IRR_DIV*100:.0f}% IRR) — "
         f"plus a 50% share of the terminal value (5× Year-5 net profit), lifting the total to "
         f"{M.INV_MOIC:.1f}x and a {M.INV_IRR*100:.0f}% IRR.", False)])

h2("Proof already on the table")
para("The founder has invested USD 14,517 pre-launch — including EGP 31,948.50 of product stock "
     "purchased and sold through the operating showroom before launch. UAE and Egypt registration, "
     "import permits, GOEIC application, fit-out and branding are complete, and Vestwoods pricing is "
     "verified against the supplier's container packing list.", space_after=6)
add_chart("revenue_by_market.png")
doc.add_page_break()

# =====================================================================
# 2. COMPANY, STRUCTURE & OWNERSHIP
# =====================================================================
h1("2", "Company, Structure & Ownership")
bullet([("The investment vehicle — ", True),
        ("investors subscribe directly into NORCO Egypt, the operating company that owns the "
         "showrooms, inventory, receivables and Egyptian licences. NORCO General Trading L.L.C. "
         "(UAE, Dubai trade licence active) is a 20% shareholder and contributes the exclusive "
         "Vestwoods agency under a long-term agreement.", False)])
bullet([("Facilities — ", True),
        ("Showroom #1: 6th October City (operational, 2-year lease, EGP 10,000/month). "
         "Showroom #2: New Cairo, ~100 sqm, opens Month 1 (USD 2,500/month). Office: New Cairo, "
         "~100 sqm fully furnished (USD 3,000/month). Warehouse: 300–700 sqm in 6th October, "
         "Sheikh Zayed or New Cairo, selected on cost (USD 3,000/month planned).", False)])

h2("2.1  Shareholding of NORCO Egypt")
sh_rows = [[name, f"{pct*100:.0f}%", note] for name, pct, note in M.SHAREHOLDING]
sh_rows.append(["Total", "100%", ""])
table(["Shareholder", "NORCO Egypt", "Notes"], sh_rows, widths=[2.7, 1.0, 3.2],
      total_row=True, align_right_from=1, font_size=9)
para("The founder's combined interest is 40% — 20% held directly plus 20% held through NORCO UAE, "
     "which he controls. The Chairman remains executive lead and agency holder.", 9.5,
     italic=True, color=MUTED, space_after=8)

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
# 3. PRODUCTS & PRICING
# =====================================================================
h1("3", "Products & Pricing")
para("Vestwoods is a Haier Energy brand of lithium (LFP) battery energy storage, hybrid inverters "
     "and telecom power. NORCO holds the exclusive Egypt agency with price control. The product "
     "answers a purchase of necessity — chronic load-shedding, diesel-price escalation and a national "
     "solar push across residential, telecom and C&I segments. Vestwoods prices 15–25% below premium "
     "brands with Haier-backed quality and a 5-year warranty; grey-market imports cannot match "
     "warranty, service or price control.", space_after=6)
para("The full range ships in 40ft FCL containers (340 units, landed USD 342,316 each), China → "
     "Alexandria, 45–55 day lead time. In Egypt the container sells at a 50/50 retail-wholesale mix "
     "for USD 433,281 (21% blended margin); export containers to Sudan, Algeria and Libya are billed "
     "at USD 393,861 wholesale. Verified pricing (USD, EGP 53):", space_after=6)
vw_price = [[m_, d, f"{q}", K(f_), K(cg), K(w), K(rt)]
            for m_, d, q, f_, cg, w, rt in M.VW_MIX]
vw_price.append(["Container", "340 units, 40ft FCL", "340", K(M.VW_CONT_SUPPLIER),
                 K(M.VW_CONT_COGS), K(round(M.VW_CONT_WHOLESALE)), K(round(M.VW_CONT_RETAIL))])
table(["Model", "Description", "Qty", "Factory", "Landed COGS", "Wholesale", "Retail"],
      vw_price, widths=[1.15, 1.9, 0.5, 0.8, 0.95, 0.9, 0.85], align_right_from=2,
      font_size=8.6, total_row=True)
para("COGS includes freight (USD 6,865/40ft), 5% duty, 2% GOEIC and handling — the full landed "
     "basis. The five verified battery, inverter and Rescube lines above make up the standard "
     "container mix; C&I cabinets and telecom 48V lines are added to order.", 9, italic=True, color=MUTED, space_after=6)
doc.add_page_break()

# =====================================================================
# 4. MARKET ANALYSIS & COMPETITIVE PRICING STUDY
# =====================================================================
h1("4", "Market Analysis & Competitive Pricing Study")
h2("4.1  Egypt energy storage — the demand driver")
para("Egypt's grid has run structural summer deficits since 2023; load-shedding, diesel-price "
     "escalation and net-metering under Law 87/2015 have made battery storage a mainstream purchase "
     "for villas, clinics, telecom towers and light industry. The segments NORCO serves — residential "
     "hybrid systems, telecom DC power and C&I backup — are precisely where lithium replaces "
     "lead-acid and diesel.", space_after=6)

h2("4.2  Battery price benchmarking — where Vestwoods wins")
para("NORCO's June-2026 market survey of Cairo retail prices for 5 kWh-class lithium batteries "
     "(installed base brands, incl. VAT, at EGP 53/USD):", space_after=6)
bat_rows = [[brand, model_, K(usd), f"{usd/kwh:,.0f}", warranty, tier]
            for brand, model_, usd, kwh, warranty, tier in M.BATTERY_COMPETITORS]
table(["Brand", "Model (5 kWh class)", "Retail USD", "USD/kWh", "Warranty & service", "Position"],
      bat_rows, widths=[1.25, 1.35, 0.8, 0.7, 1.6, 1.4], align_right_from=2, font_size=8.4)
add_chart("battery_prices.png", 6.2)
bullet([("The pricing wedge — ", True),
        ("Vestwoods retails 15–26% below tier-1 premium brands (Pylontech, Huawei) on a per-kWh "
         "basis while carrying Haier manufacturing pedigree and a 5-year warranty backed by NORCO's "
         "Cairo service bench.", False)])
bullet([("Against the grey market — ", True),
        ("unbranded imports undercut everyone by ~15% but carry no warranty, no BMS support and no "
         "spare parts. Vestwoods' exclusive agency lets NORCO hold price while winning the "
         "warranty-sensitive buyer — installers, telecoms and C&I clients.", False)])
para("Indicative street prices, NORCO market survey June 2026; tier-1 pricing varies with FX and "
     "customs cycles.", 8.5, italic=True, color=MUTED, space_after=8)

h2("4.3  Export corridors")
bullet([("Sudan — ", True), ("committed buyer; orders trigger on arrival of the first containers on "
        "50% advance + 50% delivery. Post-conflict reconstruction demand for solar-household and "
        "telecom kits. 4 → 10 containers.", False)])
bullet([("Algeria — ", True), ("agency negotiation in progress with first Vestwoods orders by "
        "Month 8; structured FOB Jebel Ali to a licensed importer under the bank-domiciliation "
        "regime, 100% LC before shipment — zero in-country exposure. 3 → 8 containers.", False)])
bullet([("Libya — ", True), ("dual-hub distributors (Tripoli + Benghazi) from Year 2 on advance/LC "
        "terms; chronic-outage residential and telecom demand. 0 → 8 containers.", False)])

h2("4.4  SWOT — NORCO / Vestwoods")
sw = doc.add_table(rows=2, cols=2); sw.alignment = WD_TABLE_ALIGNMENT.CENTER
hairline(sw)
swot = [
    ("Strengths", "F0F6F2",
     "Exclusive Vestwoods agency + price control; operating showroom with pre-launch sales; committed "
     "Sudan buyer; Algeria agency advanced; Haier-backed quality priced under the premium brands."),
    ("Weaknesses", "FBF3F0",
     "Single-brand dependence; Year-1 import terms strain working capital; thin export (wholesale) "
     "margins demand volume discipline; execution depends on the raise closing on time."),
    ("Opportunities", "F0F6F2",
     "Egypt tenders (NUCA/EEHC, Law 5/2015 CKD roadmap); telecom fleet contracts; C&I backup; "
     "four-market compounding; local CKD assembly evaluation."),
    ("Threats", "FBF3F0",
     "EGP devaluation; customs delays; grey-market pricing; regional instability in export corridors."),
]
for idx, (title_, fill, body) in enumerate(swot):
    cell_ = sw.rows[idx//2].cells[idx % 2]
    shade(cell_, fill); cell_margins(cell_, 110, 110, 140, 140)
    p = cell_.paragraphs[0]; p.paragraph_format.space_after = Pt(3)
    run(p, title_, 11, True, NAVY)
    pb = cell_.add_paragraph(); pb.paragraph_format.space_after = Pt(0)
    run(pb, body, 9, False, INK)
doc.add_paragraph().paragraph_format.space_after = Pt(2)
doc.add_page_break()

# =====================================================================
# 5. SUPPLIER & CUSTOMER TERMS
# =====================================================================
h1("5", "Supplier & Customer Terms — the Cash-Flow Engine")
terms = [
    ["Vestwoods — Year 1 (Sinosure approved)", "Containers 1–4 paid to the shipping schedule; "
     "containers 5–13 at 10% down + 90% on 3-month credit",
     "Sinosure cover converts most Year-1 container capital to credit — the raise stays at USD 1.0M"],
    ["Vestwoods — Year 2+", "10% down + 90% at 3-month credit on all POs",
     "~22.5% of purchases outstanding at year end; growth self-funding"],
    ["Egypt customers", "30–60 days (avg 45); 1-month collection lag", "Anchor accounts on agreed limits; stop-supply discipline"],
    ["Sudan", "50% advance at order + 50% on delivery", "Advances arrive ~2 months before delivery; working-capital positive"],
    ["Algeria", "100% LC before shipment (FOB Jebel Ali)", "Zero receivable risk; zero in-country exposure"],
    ["Libya (Year 2+)", "Advance / confirmed LC", "Cash before shipment"],
]
table(["Party / period", "Terms", "Cash impact"], terms, widths=[2.3, 2.3, 2.4],
      align_right_from=99, font_size=8.8)
doc.add_page_break()

# =====================================================================
# 6. FINANCIAL PLAN
# =====================================================================
h1("6", "Financial Plan")
para("All figures USD, tying 1:1 to the companion workbook. Egypt product cost is booked at 79% of "
     "Egypt revenue (the full landed container cost against the 50/50 retail-wholesale mix); export "
     "product cost is booked at 50% of export revenue per the founder's negotiated export supply "
     "pricing. Planning FX EGP 53; corporate tax 22.5% with Year-1 loss carry-forward.",
     9.5, italic=True, color=MUTED, space_after=8)

h2("6.1  5-year P&L")
pl_rows = [
    ["Total revenue"] + [K(v) for v in M.REV],
    ["Cost of goods sold"] + [K(v) for v in M.COGS],
    ["Gross profit"] + [K(v) for v in M.GP],
    ["Gross margin %"] + [f"{g/r*100:.1f}%" for g, r in zip(M.GP, M.REV)],
    ["Operating expenses"] + [K(v) for v in M.OPEX],
    ["EBIT (after interest)"] + [K(v) for v in M.EBIT],
    ["Corporate tax (22.5%)"] + [K(v) for v in M.TAX_AMT],
    ["Net profit"] + [K(v) for v in M.NP],
    ["Net margin %"] + [f"{m_*100:.1f}%" for m_ in M.NET_MARGIN],
]
table(["USD", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"], pl_rows,
      widths=[1.9, 1.05, 1.05, 1.05, 1.05, 1.05], font_size=8.8)
add_chart("profit_trend.png", 6.0)

h2("6.2  Revenue build — markets & containers")
mkt_rows = [
    ["Egypt (6→15 containers)"] + [K(v) for v in M.VW_MARKET_REV["Egypt"]],
    ["Sudan (4→10 containers)"] + [K(v) for v in M.VW_MARKET_REV["Sudan"]],
    ["Algeria (3→8, 100% LC)"] + [K(v) for v in M.VW_MARKET_REV["Algeria"]],
    ["Libya (0→8, from Y2)"] + [K(v) for v in M.VW_MARKET_REV["Libya"]],
    ["Total revenue"] + [K(v) for v in M.REV],
]
table(["USD", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"], mkt_rows,
      widths=[2.35, 0.95, 0.95, 0.95, 0.95, 0.95], total_row=True, font_size=8.8)
add_chart("containers.png", 5.9)
doc.add_page_break()

h2("6.3  Year 1 — monthly profitability and cash")
para("Year 1 is modelled month-by-month in the workbook. Egypt revenue ramps from the operating "
     "showroom in August to a two-showroom, four-salesperson run-rate by summer; Sudan orders land in "
     "alternate months from January; Algeria's first LC orders ship from March. Operating and "
     "cumulative break-even both arrive in Month 6 (January 2027), and Year-1 net profit of "
     f"USD {K(M.NP[0])} nearly matches the full raise.", space_after=6)
add_chart("y1_cash.png", 6.0,
          f"Minimum cash USD {K(M.MIN_CASH_WITH_RAISE)} (Jan-27); Year-1 ending cash USD {K(M.Y1_END_CASH)}.")

h2("6.4  Five-year cash flow")
cf_rows = [
    ["Customer collections"] + [K(v) for v in M.CF_COLLECT],
    ["Investor capital (T1 + T2)", "1,000,000", "—", "—", "—", "—"],
    ["Supplier payments (current + prior yr)"] + [f"({K(v)})" for v in M.CF_SUPPLIER],
    ["Operating expenses (cash)"] + [f"({K(v)})" for v in M.CF_OPEX],
    ["Tax paid (prior year, arrears)"] + [("—" if v == 0 else f"({K(v)})") for v in M.CF_TAX],
    ["Dividends (100% of prior-year profit)"] + [("—" if v == 0 else f"({K(v)})") for v in M.CF_DIV],
    ["Capex"] + [("—" if v == 0 else f"({K(v)})") for v in M.CAPEX],
    ["Net annual cash flow"] + [K(v) for v in M.CF_NET],
    ["Closing cash position"] + [K(v) for v in M.CF_CLOSE],
]
table(["USD", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"], cf_rows,
      widths=[2.35, 0.95, 0.95, 0.95, 0.95, 0.95], total_row=True, font_size=8.6)
bullet([("Credit-powered growth — ", True),
        ("Sinosure-backed supplier credit (10% down + 90% at 3-month credit) carries ~22.5% of each "
         "year's purchases into the next year. Closing cash rises every year even while distributing "
         "100% of profits — no capital call after Tranche 2.", False)])
bullet([("Risk stated plainly — ", True),
        (f"Year 1 depends on the raise: the peak self-funded deficit is USD {K(abs(M.PEAK_DEFICIT))} "
         f"in January 2027, and minimum cash with the raise is USD {K(M.MIN_CASH_WITH_RAISE)} — a thin "
         "buffer that the optional accelerator widens. This is a working-capital risk, not a demand risk.", False)])
bullet([("Diligence note — ", True),
        ("export sales are booked at a 50% product-cost margin per the founder's negotiated supply "
         "pricing. An investor comparing the USD 342,316 landed container cost to the USD 393,861 "
         "wholesale container price should confirm this margin in the supply agreement; at standard "
         "wholesale pricing the export margin is ~13% and Year-5 net profit rebases accordingly.", False)])
doc.add_page_break()

# =====================================================================
# 7. STAFFING
# =====================================================================
h1("7", "Staffing Plan")
para("Institutional management from day one: CEO, Financial Manager and Operations Manager in "
     "Month 1, Sales Manager in Month 2, Marketing and HR in Month 3. Two showroom managers run 6th "
     "October and New Cairo. Headcount reaches 21 by Month 12 and 55 by Year 5. Sales staff earn "
     "salary plus 4% commission on Egypt sales; social insurance at 15% of base is included.", space_after=8)
staff = [
    ["Year 1 — launch team (CEO, managers, 2 showrooms, warehouse, 4 sales, drivers)", "21", K(M.PERSONNEL[0])],
    ["Year 2 — + logistics coordinator, customer service, technical specialist, 2 sales", "26", K(M.PERSONNEL[1])],
    ["Year 3 — + Alexandria branch, installation engineers, analysts", "35", K(M.PERSONNEL[2])],
    ["Year 4 — + B2G/tenders, C&I sales desk, IT/CRM, Sudan coordinator", "44", K(M.PERSONNEL[3])],
    ["Year 5 — + Libya market manager, field engineers, compliance (senior raises applied)", "55", K(M.PERSONNEL[4])],
]
table(["Year & additions", "Headcount", "Personnel cost (USD)"], staff,
      widths=[4.3, 1.0, 1.6], align_right_from=1, font_size=9)
para("Full role-by-role rosters with salaries and start months are in the Staff Plan sheet of the "
     "companion workbook. Personnel cost includes base salaries, 15% benefits and 4% Egypt sales "
     "commissions.", 9, italic=True, color=MUTED)

# =====================================================================
# 8. FUNDING & INVESTOR PROPOSAL
# =====================================================================
h1("8", "Funding Requirements & Investor Proposal")
h2("8.1  The ask")
para("USD 1,000,000 into NORCO Egypt for 50% of its shares, released in two milestone-gated tranches "
     "of USD 500,000. An optional USD 500,000 accelerator (by mutual agreement, Months 6–12) lifts the "
     "ceiling to USD 1.5M — adding standing buffer and pulling Libya and Algeria volumes forward.", space_after=6)
tr_rows = [[n, K(a), t_, p_] for n, a, t_, p_ in M.TRANCHES]
tr_rows.append(["Core total (T1 + T2)", K(M.RAISE), "", ""])
table(["Tranche", "USD", "Timing", "Purpose / gate"], tr_rows,
      widths=[1.35, 0.95, 1.8, 2.9], align_right_from=1, font_size=8.6, total_row=True)
add_chart("use_of_funds.png", 4.4)

h2("8.2  Investor returns")
para("Dividend policy: 100% of net profit distributed annually in arrears — the investor receives "
     f"half of every distribution: USD {K(sum(M.INV_DIV))} over the five-year window, "
     f"{M.INV_MOIC_DIV:.1f}x the capital from dividends alone ({M.INV_IRR_DIV*100:.0f}% IRR). Valuing "
     f"the retained 50% stake at 5× Year-5 net profit adds USD {K(M.INV_TERMINAL)} of terminal value, "
     f"lifting the total return to {M.INV_MOIC:.1f}x ({M.INV_IRR*100:.0f}% IRR):", space_after=6)
inv_rows = [
    ["Capital invested", f"({K(M.RAISE)})", "—", "—", "—", "—", "—"],
    ["Dividends (50% of prior-year NP)", "—", "—"] + [K(v) for v in M.INV_DIV[1:]],
    ["Terminal value (50% × 5 × Y5 NP)", "—", "—", "—", "—", "—", K(M.INV_TERMINAL)],
    ["Net investor cash flow"] + [f"({K(M.RAISE)})", "—"] + [K(M.INV_CF[i]) for i in range(2, 6)],
]
table(["USD", "Y0", "Y1", "Y2", "Y3", "Y4", "Y5"], inv_rows,
      widths=[2.15, 0.95, 0.55, 0.75, 0.75, 0.75, 1.1], total_row=True, font_size=8.6)
add_chart("returns.png", 6.0)
add_chart("cumulative_profit.png", 6.0)

h2("8.3  Investor protections")
bullet("Tranche 2 released only against verified Month-4 milestones: ≥3 containers sold through and Sudan advances received.")
bullet("Quarterly management accounts from the formula-driven model; monthly cash and inventory reporting; USD books.")
bullet("Egypt customers on maximum 60-day terms; Sudan cash-before-shipment; Algeria LC only.")
bullet("Exclusive Vestwoods agency (with first right of engagement and non-circumvention) held within the group and assignable as security.")
bullet("Founder pre-investment of USD 14,517 already deployed; board seat and reserved matters for the investor.")
doc.add_page_break()

# =====================================================================
# 9. OPERATIONS, RISKS & MITIGATION
# =====================================================================
h1("9", "Operations, Risks & Mitigation")
bullet([("Supply chain — ", True),
        ("PO → factory 15–20 days → sea 18 days → clearance 7–10 days (5% duty, 2% GOEIC, 14% VAT "
         "recoverable) → 6th October warehouse. Roughly one container every 3–4 weeks in Year 1, "
         "financed under Sinosure-backed supplier credit.", False)])
risks = [
    ["EGP devaluation", "USD-indexed pricing at EGP 53 planning rate (spot ~49–51); 30-day quote validity; USD books"],
    ["Y1 working-capital exposure", "Haier-backed counterparty; Sinosure credit; staged POs; credit terms anchored from Year 2"],
    ["Thin export (wholesale) margins", "Volume discipline; Egypt retail mix defended at 50%; commissions tied to sales"],
    ["Raise timing", "Tranche 1 must close before first PO; container schedule flexes with drawdown"],
    ["Customs / GOEIC delays", "Permits issued; broker retained; 45–60 day inventory cover"],
    ["Egypt receivables", "45-day terms; anchor accounts on agreed limits; stop-supply discipline"],
    ["Export instability (Sudan/Libya)", "Cash before shipment; no in-country assets"],
    ["Algeria regime", "Licensed-importer FOB + 100% LC; zero NORCO exposure"],
    ["Single-brand dependence", "Exclusive agency with first right of engagement; deep Haier product range across segments"],
]
table(["Risk", "Mitigation"], risks, widths=[2.3, 4.4], align_right_from=99, font_size=9)

# =====================================================================
# 10. EXECUTION ROADMAP
# =====================================================================
h1("10", "Execution Roadmap")
road = [
    ["Launch", "M1–M3", "T1 drawn; first Vestwoods POs placed under Sinosure credit; New Cairo "
     "showroom opens; Sudan buyer inspects stock and places first order (50% advance)"],
    ["Prove", "M4–M6", "T2 drawn against milestones; operating & cumulative break-even (M6); dealers "
     "signed; first Cairo energy exhibition; Algeria agency to term sheet"],
    ["Convert", "M7–M12", "Algeria first LC orders ship (M8); second exhibition; telecom and C&I "
     "pipeline; Libya distributor due diligence"],
    ["Compound", "M13–M18", "Credit terms activate on all POs; Libya first containers; full dividend "
     "distributions begin; four-market operation on self-generated cash"],
    ["Scale", "Y3–Y5", "41 containers/yr across four markets by Y5; Alexandria branch; B2G/tenders "
     f"desk; CKD assembly evaluation; closing cash USD {K(M.CF_CLOSE[4])}"],
]
table(["Phase", "Timing", "Milestones"], road, widths=[1.0, 1.0, 4.7], align_right_from=99, font_size=9)

para(space_after=8)
t = doc.add_table(rows=1, cols=1); t.alignment = WD_TABLE_ALIGNMENT.CENTER
no_borders(t); c = t.rows[0].cells[0]; shade(c, "0F2942"); cell_margins(c, 160, 160, 200, 200)
p = c.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after = Pt(4)
run(p, "The opportunity", 11, True, GOLD)
p2 = c.add_paragraph(); p2.alignment = WD_ALIGN_PARAGRAPH.CENTER; p2.paragraph_format.space_after = Pt(0)
run(p2, f"USD 1.0M buys half of a business that is already built: an exclusive energy-storage agency "
     f"priced 15–26% under the premium brands, four markets in motion, a committed Sudan buyer and a "
     f"founder already invested and operational — producing USD {M.NP_5YR/1e6:.1f}M of net profit over "
     f"five years, {M.INV_MOIC_DIV:.1f}x back in dividends alone, and every dollar of profit "
     "distributed.", 10.5, False, WHITE)
para(space_after=8)
para("Companion workbook: NORCO_Vestwoods_Investor_Model.xlsx — key assumptions, pre-op investment, "
     "pricing reference, staff plan, monthly Year-1 P&L and cash flow, 5-year P&L and cash flow, "
     "market detail, funding & returns, shareholding and dashboard.", 9, italic=True, color=MUTED)

doc.save(OUT)
print("Saved", OUT)
