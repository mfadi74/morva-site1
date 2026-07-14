# -*- coding: utf-8 -*-
"""Build NORCO_Group_Investor_Model.xlsx — consolidated, formula-driven."""
import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side, NamedStyle
from openpyxl.chart import BarChart, LineChart, Reference, Series
from openpyxl.chart.label import DataLabelList
from openpyxl.utils import get_column_letter
import model as M

OUT = os.path.join(os.path.dirname(__file__), "..", "NORCO_Group_Investor_Model.xlsx")

NAVY = "0F2942"; TEAL = "0F6E6A"; GOLD = "C8892A"; LIGHT = "F3F5F7"
BLUE = "2A78D6"; AQUA = "1BAF7A"; MID = "E9EDF0"; WHITE = "FFFFFF"

wb = openpyxl.Workbook()

thin = Side(style="thin", color="D8DCE0")
border_all = Border(left=thin, right=thin, top=thin, bottom=thin)

def F(sz=10, b=False, color="1A1A19", name="Calibri"):
    return Font(name=name, size=sz, bold=b, color=color)

def fill(hex_):
    return PatternFill("solid", fgColor=hex_)

def cell(ws, ref, val, font=None, align=None, fmt=None, fillc=None, border=False, wrap=False):
    c = ws[ref]
    c.value = val
    if font: c.font = font
    if fillc: c.fill = fill(fillc)
    if align or wrap:
        c.alignment = Alignment(horizontal=align or "left", vertical="center", wrap_text=wrap)
    if fmt: c.number_format = fmt
    if border: c.border = border_all
    return c

def title_block(ws, title, subtitle):
    ws.merge_cells("A1:H1"); cell(ws, "A1", title, F(15, True, NAVY))
    ws.merge_cells("A2:H2"); cell(ws, "A2", subtitle, F(10, False, "5C5B57"))
    ws.row_dimensions[1].height = 22

def hdr_row(ws, row, labels, start=1, fillc=NAVY):
    for i, lab in enumerate(labels):
        c = cell(ws, f"{get_column_letter(start+i)}{row}", lab,
                 F(9.5, True, WHITE), align="center" if i > 0 else "left", fillc=fillc, border=True, wrap=True)

USD0 = '#,##0'
USDk = '#,##0'
PCT = '0.0%'
PCT0 = '0%'
MULT = '0.00"x"'

# ============================================================ 0. ReadMe
ws = wb.active; ws.title = "ReadMe"
ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 26; ws.column_dimensions["B"].width = 95
title_block(ws, "NORCO General Trading L.L.C. — Group Investor Model",
            "Vestwoods (energy storage) + Al Reem Plastics (houseware) | Egypt · Sudan · Libya · Algeria | Aug 2026 – Jul 2031")
notes = [
    ("Purpose", "Investor-grade 5-year model for NORCO's two-division distribution platform. All figures USD; Vestwoods in USD 000, Al Reem built from verified per-unit economics."),
    ("Divisions", "Vestwoods = exclusive Haier Energy lithium BESS agency (Business Plan V4). Al Reem Plastics = 147-SKU premium houseware range from Türkiye (April-2026 costed catalogue)."),
    ("Investment ask", "USD 2,000,000 core raise in 3 milestone-gated tranches (band USD 1.0M–2.5M). Fully deployable within 18 months of the Aug-2026 start."),
    ("Currency & FX", "USD throughout. Planning rate USD 1 = EGP 53 (NORCO pricelist Jun-2026; spot ~49–51 — conservative)."),
    ("Tax", "Corporate income tax 22.5% on net profit. Renewable-energy CIT incentive possible (GOEI/NREA) — not assumed."),
    ("Colour code", "Blue text = input assumption you can change. Black = formula-driven."),
    ("Sheets", "Assumptions | Consolidated P&L | Revenue Detail | Al Reem Catalogue | Cash Flow | Funding & Returns | Shareholding | Dashboard"),
    ("Confidentiality", "Strictly Private & Confidential. Prepared by Fadi Jannan, Managing Director — 14 July 2026, Version 5.0 (Group)."),
]
r = 4
for k, v in notes:
    cell(ws, f"A{r}", k, F(10, True, NAVY), align="left")
    cell(ws, f"B{r}", v, F(10), wrap=True)
    ws.row_dimensions[r].height = 30
    r += 1

# ============================================================ 1. Assumptions
ws = wb.create_sheet("Assumptions")
ws.sheet_view.showGridLines = False
for col, w in zip("ABCDEFG", [34, 12, 12, 12, 12, 12, 40]):
    ws.column_dimensions[col].width = w
title_block(ws, "Key Assumptions", "Blue = input you can change; drives every downstream sheet")
INPUT_FONT = F(10, False, BLUE)

hdr_row(ws, 4, ["Driver (USD 000 unless noted)", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Notes"])
arow = 5
def assum(label, vals, note="", fmt=USD0, inp=True):
    global arow
    cell(ws, f"A{arow}", label, F(10, False, "1A1A19"), border=True)
    for i, v in enumerate(vals):
        cell(ws, f"{get_column_letter(2+i)}{arow}", v, INPUT_FONT if inp else F(10),
             align="right", fmt=fmt, border=True)
    cell(ws, f"G{arow}", note, F(9, False, "5C5B57"), border=True, wrap=True)
    arow += 1

def section(label):
    global arow
    cell(ws, f"A{arow}", label, F(10, True, TEAL))
    for c in "BCDEFG":
        ws[f"{c}{arow}"].fill = fill(LIGHT)
    ws[f"A{arow}"].fill = fill(LIGHT)
    arow += 1

section("► VESTWOODS — revenue by market")
assum("Egypt revenue", M.VW_MARKET_REV["Egypt"], "12 → 40 containers")
assum("Sudan revenue", M.VW_MARKET_REV["Sudan"], "committed buyer; 4 → 20 containers")
assum("Libya revenue", M.VW_MARKET_REV["Libya"], "from Year 2; 2 → 7 containers")
assum("Algeria revenue", M.VW_MARKET_REV["Algeria"], "from end-Y1; 1 → 9 containers")
assum("Vestwoods gross margin %", [round(g/r,4) for g,r in zip(M.VW_GP,M.VW_REV)],
      "blended retail/wholesale/export", PCT)
assum("Vestwoods operating expenses", M.VW_OPEX, "personnel, rent, marketing, G&A")

section("► AL REEM PLASTICS — houseware")
assum("Al Reem revenue", M.AR_REV, "houseware; Egypt + export")
assum("Al Reem gross margin %", M.AR_GM, "19% (Y1) → 23% (Y5); catalogue-verified", PCT)
assum("Al Reem incremental opex", M.AR_OPEX, "sales desk, extra warehouse, logistics")

section("► GROUP")
assum("Corporate tax rate", [M.TAX]*5, "22.5% on net profit", PCT, inp=True)

section("► FUNDING")
cell(ws, f"A{arow}", "Core raise (USD 000)", F(10), border=True)
cell(ws, f"B{arow}", M.RAISE, INPUT_FONT, align="right", fmt=USD0, border=True)
cell(ws, f"G{arow}", "band 1,000 – 2,500", F(9, False, "5C5B57"), border=True); arow += 1
cell(ws, f"A{arow}", "Terminal equity multiple (× Y5 net profit)", F(10), border=True)
cell(ws, f"B{arow}", M.TERMINAL_MULTIPLE, INPUT_FONT, align="right", fmt='0"x"', border=True)
cell(ws, f"G{arow}", "for Option A equity valuation", F(9, False, "5C5B57"), border=True); arow += 1
ASSUM_ROWS = {  # row references for formulas
    "egypt": 6, "sudan": 7, "libya": 8, "algeria": 9, "vw_gm": 10, "vw_opex": 11,
    "ar_rev": 13, "ar_gm": 14, "ar_opex": 15, "tax": 17, "raise": 19, "term_mult": 20,
}

# ============================================================ 2. Consolidated P&L
ws = wb.create_sheet("Consolidated P&L")
ws.sheet_view.showGridLines = False
for col, w in zip("ABCDEF", [30, 13, 13, 13, 13, 13]):
    ws.column_dimensions[col].width = w
title_block(ws, "Consolidated 5-Year P&L (USD 000)", "Formula-driven from the Assumptions sheet")
hdr_row(ws, 4, ["Description", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"])
A = "Assumptions"
cols = ["B", "C", "D", "E", "F"]
prow = 5
def pl_line(label, formula_fn, fmt=USD0, bold=False, fillc=None, band=False):
    global prow
    cell(ws, f"A{prow}", label, F(10, bold, NAVY if bold else "1A1A19"), fillc=fillc, border=True)
    for i, col in enumerate(cols):
        f = formula_fn(col, i)
        c = cell(ws, f"{col}{prow}", f, F(10, bold, NAVY if bold else "1A1A19"),
                 align="right", fmt=fmt, fillc=fillc, border=True)
    prow += 1

def a(ref_row, col):  # assumptions cell
    return f"{A}!{col}{ref_row}"

pl_line("Vestwoods revenue",
        lambda c,i: f"=SUM({a(ASSUM_ROWS['egypt'],c)},{a(ASSUM_ROWS['sudan'],c)},{a(ASSUM_ROWS['libya'],c)},{a(ASSUM_ROWS['algeria'],c)})")
VW_REV_ROW = prow-1
pl_line("Al Reem Plastics revenue", lambda c,i: f"={a(ASSUM_ROWS['ar_rev'],c)}")
AR_REV_ROW = prow-1
pl_line("Total revenue", lambda c,i: f"={c}{VW_REV_ROW}+{c}{AR_REV_ROW}", bold=True, fillc=MID)
TOTREV_ROW = prow-1
pl_line("Vestwoods gross profit",
        lambda c,i: f"={c}{VW_REV_ROW}*{a(ASSUM_ROWS['vw_gm'],c)}")
VW_GP_ROW = prow-1
pl_line("Al Reem gross profit",
        lambda c,i: f"={c}{AR_REV_ROW}*{a(ASSUM_ROWS['ar_gm'],c)}")
AR_GP_ROW = prow-1
pl_line("Total gross profit", lambda c,i: f"={c}{VW_GP_ROW}+{c}{AR_GP_ROW}", bold=True, fillc=MID)
GP_ROW = prow-1
pl_line("Gross margin %", lambda c,i: f"={c}{GP_ROW}/{c}{TOTREV_ROW}", fmt=PCT)
pl_line("Operating expenses",
        lambda c,i: f"={a(ASSUM_ROWS['vw_opex'],c)}+{a(ASSUM_ROWS['ar_opex'],c)}")
OPEX_ROW = prow-1
pl_line("EBIT (operating profit)", lambda c,i: f"={c}{GP_ROW}-{c}{OPEX_ROW}", bold=True)
EBIT_ROW = prow-1
pl_line("EBIT margin %", lambda c,i: f"={c}{EBIT_ROW}/{c}{TOTREV_ROW}", fmt=PCT)
pl_line("Corporate tax (22.5%)", lambda c,i: f"=MAX(0,{c}{EBIT_ROW})*{a(ASSUM_ROWS['tax'],c)}")
TAX_ROW = prow-1
pl_line("Net profit", lambda c,i: f"={c}{EBIT_ROW}-{c}{TAX_ROW}", bold=True, fillc="FFF4DF")
NP_ROW = prow-1
pl_line("Net margin %", lambda c,i: f"={c}{NP_ROW}/{c}{TOTREV_ROW}", fmt=PCT)
pl_line("Cumulative net profit",
        lambda c,i: f"={c}{NP_ROW}" if i==0 else f"={cols[i-1]}{prow}+{c}{NP_ROW}")

# 5-year totals column
cell(ws, "A"+str(prow+1), "5-YEAR TOTALS", F(11, True, NAVY))
prow2 = prow+2
for lbl, row in [("Total revenue", TOTREV_ROW), ("Total gross profit", GP_ROW), ("Total net profit", NP_ROW)]:
    cell(ws, f"A{prow2}", lbl, F(10, True, NAVY), border=True)
    cell(ws, f"B{prow2}", f"=SUM(B{row}:F{row})", F(10, True, NAVY), "right", USD0, border=True)
    cell(ws, f"C{prow2}", "USD 000", F(9, False, "5C5B57"))
    prow2 += 1
PL_NP_ROW = NP_ROW; PL_TOTREV_ROW = TOTREV_ROW; PL_GP_ROW = GP_ROW
PL_VWREV_ROW = VW_REV_ROW; PL_ARREV_ROW = AR_REV_ROW

# ============================================================ 3. Revenue Detail
ws = wb.create_sheet("Revenue Detail")
ws.sheet_view.showGridLines = False
for col, w in zip("ABCDEF", [30, 13, 13, 13, 13, 13]):
    ws.column_dimensions[col].width = w
title_block(ws, "Revenue Build — Markets & Divisions (USD 000)", "Vestwoods by corridor + Al Reem; container counts below")
hdr_row(ws, 4, ["Line", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"])
rd = 5
def rev_line(label, ref_row, div="Vestwoods"):
    global rd
    cell(ws, f"A{rd}", label, F(10), border=True)
    for c in cols:
        cell(ws, f"{c}{rd}", f"={A}!{c}{ref_row}", F(10), "right", USD0, border=True)
    rd += 1
rev_line("Egypt (Vestwoods)", ASSUM_ROWS['egypt'])
rev_line("Sudan (Vestwoods)", ASSUM_ROWS['sudan'])
rev_line("Libya (Vestwoods)", ASSUM_ROWS['libya'])
rev_line("Algeria (Vestwoods)", ASSUM_ROWS['algeria'])
rev_line("Al Reem Plastics (all markets)", ASSUM_ROWS['ar_rev'])
cell(ws, f"A{rd}", "Total group revenue", F(10, True, NAVY), fillc=MID, border=True)
for c in cols:
    cell(ws, f"{c}{rd}", f"=SUM({c}5:{c}9)", F(10, True, NAVY), align="right", fmt=USD0, fillc=MID, border=True)
rd += 2
# Container table (Vestwoods)
cell(ws, f"A{rd}", "Vestwoods 40ft containers per year", F(10, True, TEAL)); rd += 1
hdr_row(ws, rd, ["Market", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"], fillc=TEAL); rd += 1
for name in ["Egypt", "Sudan", "Libya", "Algeria"]:
    cell(ws, f"A{rd}", name, F(10), border=True)
    for i, v in enumerate(M.VW_CONTAINERS[name]):
        cell(ws, f"{get_column_letter(2+i)}{rd}", v, F(10), "right", '0', border=True)
    rd += 1
cell(ws, f"A{rd}", "Total containers", F(10, True, NAVY), fillc=MID, border=True)
for i, c in enumerate(cols):
    tot = sum(M.VW_CONTAINERS[k][i] for k in M.VW_CONTAINERS)
    cell(ws, f"{c}{rd}", tot, F(10, True, NAVY), align="right", fmt='0', fillc=MID, border=True)

# ============================================================ 4. Al Reem Catalogue
ws = wb.create_sheet("Al Reem Catalogue")
ws.sheet_view.showGridLines = False
for col, w in zip("ABCDEFG", [34, 12, 12, 12, 12, 12, 14]):
    ws.column_dimensions[col].width = w
title_block(ws, "Al Reem Plastics — Catalogue Unit Economics (USD)",
            "Verified April-2026 costing. Wholesale = landed COGS × 1.15 · Retail = landed COGS × 1.38")
hdr_row(ws, 4, ["Representative SKU", "Landed COGS", "Wholesale", "Retail", "GM% Wholesale", "GM% Retail", "Category"])
catalogue = [
    ("Storage Drawers (4) with compartment", 23.98, "Storage"),
    ("Clothes Drier", 19.95, "Laundry"),
    ("90L Waste bin with cover", 11.33, "Cleaning"),
    ("Large Storage Drawers (3)", 23.23, "Storage"),
    ("50L Waste bin", 9.04, "Cleaning"),
    ("Large Laundry Basket with Lid", 9.78, "Laundry"),
    ("Vegetable Basket 4 levels with cover", 21.19, "Kitchen"),
    ("Bathroom Cabinet", 6.99, "Bathroom"),
    ("Dish Drainer 2 levels", 9.16, "Kitchen"),
    ("Shoe Rack Double", 14.18, "Storage"),
    ("13.5L Rectangular Food Container", 3.77, "Food storage"),
    ("Industrial basket", 8.60, "Baskets"),
    ("Baby Bathtub", 6.06, "Bathroom"),
    ("Coffee Table", 6.25, "Furniture"),
    ("8L Rectangular Food Container", 2.84, "Food storage"),
    ("Square bowl 46cm", 2.84, "Bowls"),
    ("Cake box with plate", 5.69, "Kitchen"),
    ("Round Spice Container 1.8L", 0.85, "Kitchen"),
    ("Lunch box 4 levels", 1.35, "Food storage"),
    ("Sugar box with cover & spoon", 0.67, "Kitchen"),
    ("Cup with handle", 0.48, "Tableware"),
]
cr = 5
for name, cogs, cat in catalogue:
    cell(ws, f"A{cr}", name, F(9.5), border=True)
    cell(ws, f"B{cr}", cogs, F(9.5), "right", '0.00', border=True)
    cell(ws, f"C{cr}", f"=B{cr}*(1+{M.AR_MARKUP_WHOLESALE})", F(9.5), "right", '0.00', border=True)
    cell(ws, f"D{cr}", f"=B{cr}*(1+{M.AR_MARKUP_RETAIL})", F(9.5), "right", '0.00', border=True)
    cell(ws, f"E{cr}", f"=(C{cr}-B{cr})/C{cr}", F(9.5), "right", PCT0, border=True)
    cell(ws, f"F{cr}", f"=(D{cr}-B{cr})/D{cr}", F(9.5), "right", PCT0, border=True)
    cell(ws, f"G{cr}", cat, F(9.5, False, "5C5B57"), border=True)
    cr += 1
cr += 1
cell(ws, f"A{cr}", f"Full range: {M.AR_SKUS} SKUs across 15+ categories. Blended margin modelled at "
     f"19% (Y1) rising to 23% (Y5) as own-retail mix grows.", F(9, True, TEAL)); ws.merge_cells(f"A{cr}:G{cr}")

# ============================================================ 5. Cash Flow
ws = wb.create_sheet("Cash Flow")
ws.sheet_view.showGridLines = False
for col, w in zip("ABCDEF", [32, 13, 13, 13, 13, 13]):
    ws.column_dimensions[col].width = w
title_block(ws, "Group Cash Flow (USD 000)", "Y1 depends on the raise; the Month-13 Vestwoods credit switch makes Y2+ self-funding")
hdr_row(ws, 4, ["Item", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"])
cf_data = [
    ("Customer collections", [6400, 12050, 18300, 25500, 34600], USD0, False),
    ("Investor capital (Tranches 1–3)", [2000, 0, 0, 0, 0], USD0, False),
    ("Supplier & inventory payments", [-5540, -8930, -13760, -18940, -25120], USD0, False),
    ("Operating expenses (cash)", [-945, -1400, -1915, -2500, -3465], USD0, False),
    ("Tax paid (prior year, arrears)", [0, -249, -426, -709, -1076], USD0, False),
    ("Investor dividends (Option A, 50%)", [0, -428, -734, -1220, -1853], USD0, False),
    ("Capex", [-50, -25, -30, -35, -40], USD0, False),
]
cfr = 5
first_row = cfr
for label, vals, fmt, bold in cf_data:
    cell(ws, f"A{cfr}", label, F(10), border=True)
    for i, v in enumerate(vals):
        cell(ws, f"{get_column_letter(2+i)}{cfr}", v, F(10), "right", '#,##0;(#,##0)', border=True)
    cfr += 1
last_row = cfr-1
cell(ws, f"A{cfr}", "Net annual cash flow", F(10, True, NAVY), fillc=MID, border=True)
for c in cols:
    cell(ws, f"{c}{cfr}", f"=SUM({c}{first_row}:{c}{last_row})", F(10, True, NAVY), align="right", fmt='#,##0;(#,##0)', fillc=MID, border=True)
netcf = cfr; cfr += 1
cell(ws, f"A{cfr}", "Closing cash position", F(10, True, NAVY), fillc="FFF4DF", border=True)
for i, c in enumerate(cols):
    if i == 0:
        cell(ws, f"{c}{cfr}", f"={c}{netcf}", F(10, True, NAVY), align="right", fmt=USD0, fillc="FFF4DF", border=True)
    else:
        cell(ws, f"{c}{cfr}", f"={cols[i-1]}{cfr}+{c}{netcf}", F(10, True, NAVY), align="right", fmt=USD0, fillc="FFF4DF", border=True)
cfr += 2
for note in [
    "STRENGTH: the Month-13 Vestwoods credit switch (10% down + 90% on 3-month credit) releases ~90% of container capital.",
    "STRENGTH: Al Reem's fast-turning houseware inventory generates cash from the first quarter, cushioning the Vestwoods ramp.",
    "STRENGTH: closing cash grows every year while paying dividends and taxes — no capital call after Tranche 3.",
    "RISK: Year 1 depends on the raise closing on time; container schedule flexes with drawdown.",
]:
    cell(ws, f"A{cfr}", "• " + note, F(9, False, "5C5B57")); ws.merge_cells(f"A{cfr}:F{cfr}")
    ws.row_dimensions[cfr].height = 26; cfr += 1

# ============================================================ 6. Funding & Returns
ws = wb.create_sheet("Funding & Returns")
ws.sheet_view.showGridLines = False
for col, w in zip("ABCDEFG", [30, 13, 13, 13, 13, 13, 13]):
    ws.column_dimensions[col].width = w
title_block(ws, "Funding & Investor Returns", "Two structures; IRR & MOIC computed live from the P&L")
# Tranches
cell(ws, "A4", "A.  Tranche structure (USD)", F(11, True, TEAL))
hdr_row(ws, 5, ["Tranche", "Amount", "Timing", "Gate / purpose"], fillc=NAVY)
tr = 6
for name, amt, timing, purpose in M.TRANCHES:
    cell(ws, f"A{tr}", name, F(9.5), border=True)
    cell(ws, f"B{tr}", amt*1000, F(9.5), "right", USD0, border=True)
    cell(ws, f"C{tr}", timing, F(9.5), border=True)
    ws.merge_cells(f"D{tr}:G{tr}"); cell(ws, f"D{tr}", purpose, F(9.5), border=True, wrap=True)
    tr += 1
cell(ws, f"A{tr}", "Total core raise", F(10, True, NAVY), fillc=MID, border=True)
cell(ws, f"B{tr}", f"=SUM(B6:B{tr-1})", F(10, True, NAVY), align="right", fmt=USD0, fillc=MID, border=True)
for c in "CDEFG": ws[f"{c}{tr}"].fill = fill(MID)
tr += 2

PL = "'Consolidated P&L'"
NPr = PL_NP_ROW
# Option A
cell(ws, f"A{tr}", "B.  Option A — 50% equity (dividends + retained stake)", F(11, True, TEAL)); tr += 1
hdr_row(ws, tr, ["Investor cash flow (USD 000)", "Y0 close", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"], fillc=NAVY); tr += 1
capA = tr
cell(ws, f"A{tr}", "Capital invested", F(10), border=True)
cell(ws, f"B{tr}", f"=-Assumptions!B{ASSUM_ROWS['raise']}", F(10), "right", '#,##0;(#,##0)', border=True)
for c in "CDEFG": cell(ws, f"{c}{tr}", 0, F(10), "right", '#,##0;(#,##0)', border=True)
tr += 1
divA = tr
cell(ws, f"A{tr}", "Dividends (50% of prior-yr NP, arrears)", F(10), border=True)
cell(ws, f"B{tr}", 0, F(10), "right", '#,##0;(#,##0)', border=True)
cell(ws, f"C{tr}", 0, F(10), "right", '#,##0;(#,##0)', border=True)  # Y1 none (arrears)
# Y2..Y5 dividends = 50% of prior-year NP
for i, c in enumerate(["D", "E", "F", "G"]):
    prevcol = cols[i]  # B..E map to P&L Y1..Y4
    cell(ws, f"{c}{tr}", f"=0.5*{PL}!{prevcol}{NPr}", F(10), "right", '#,##0;(#,##0)', border=True)
tr += 1
termA = tr
cell(ws, f"A{tr}", "Terminal value (50% × mult × Y5 NP)", F(10), border=True)
for c in "BCDEF": cell(ws, f"{c}{tr}", 0, F(10), "right", '#,##0;(#,##0)', border=True)
cell(ws, f"G{tr}", f"=0.5*Assumptions!B{ASSUM_ROWS['term_mult']}*{PL}!F{NPr}", F(10), "right", '#,##0;(#,##0)', border=True)
tr += 1
netA = tr
cell(ws, f"A{tr}", "Net investor cash flow", F(10, True, NAVY), fillc=MID, border=True)
for c in "BCDEFG":
    cell(ws, f"{c}{tr}", f"=SUM({c}{capA}:{c}{termA})", F(10, True, NAVY), align="right", fmt='#,##0;(#,##0)', fillc=MID, border=True)
tr += 1
cell(ws, f"A{tr}", "Option A — IRR", F(10, True, GOLD), border=True)
cell(ws, f"B{tr}", f"=IRR(B{netA}:G{netA})", F(11, True, GOLD), "right", PCT, border=True)
cell(ws, f"D{tr}", "MOIC", F(10, True, GOLD), border=True)
cell(ws, f"E{tr}", f"=SUM(C{netA}:G{netA})/-B{capA}", F(11, True, GOLD), "right", MULT, border=True)
tr += 2

# Option B
cell(ws, f"A{tr}", "C.  Option B — 25% net-profit share + capital redemption at Year 5", F(11, True, TEAL)); tr += 1
hdr_row(ws, tr, ["Investor cash flow (USD 000)", "Y0 close", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"], fillc=NAVY); tr += 1
capB = tr
cell(ws, f"A{tr}", "Capital invested", F(10), border=True)
cell(ws, f"B{tr}", f"=-Assumptions!B{ASSUM_ROWS['raise']}", F(10), "right", '#,##0;(#,##0)', border=True)
for c in "CDEFG": cell(ws, f"{c}{tr}", 0, F(10), "right", '#,##0;(#,##0)', border=True)
tr += 1
shB = tr
cell(ws, f"A{tr}", "Profit share (25% of NP, year earned)", F(10), border=True)
cell(ws, f"B{tr}", 0, F(10), "right", '#,##0;(#,##0)', border=True)
for i, c in enumerate(["C", "D", "E", "F", "G"]):
    plcol = cols[i]
    cell(ws, f"{c}{tr}", f"=0.25*{PL}!{plcol}{NPr}", F(10), "right", '#,##0;(#,##0)', border=True)
tr += 1
redB = tr
cell(ws, f"A{tr}", "Capital redemption (end Y5)", F(10), border=True)
for c in "BCDEF": cell(ws, f"{c}{tr}", 0, F(10), "right", '#,##0;(#,##0)', border=True)
cell(ws, f"G{tr}", f"=Assumptions!B{ASSUM_ROWS['raise']}", F(10), "right", '#,##0;(#,##0)', border=True)
tr += 1
netB = tr
cell(ws, f"A{tr}", "Net investor cash flow", F(10, True, NAVY), fillc=MID, border=True)
for c in "BCDEFG":
    cell(ws, f"{c}{tr}", f"=SUM({c}{capB}:{c}{redB})", F(10, True, NAVY), align="right", fmt='#,##0;(#,##0)', fillc=MID, border=True)
tr += 1
cell(ws, f"A{tr}", "Option B — IRR", F(10, True, GOLD), border=True)
cell(ws, f"B{tr}", f"=IRR(B{netB}:G{netB})", F(11, True, GOLD), "right", PCT, border=True)
cell(ws, f"D{tr}", "MOIC", F(10, True, GOLD), border=True)
cell(ws, f"E{tr}", f"=SUM(C{netB}:G{netB})/-B{capB}", F(11, True, GOLD), "right", MULT, border=True)

# ============================================================ 7. Shareholding
ws = wb.create_sheet("Shareholding")
ws.sheet_view.showGridLines = False
for col, w in zip("ABCD", [40, 16, 22, 30]):
    ws.column_dimensions[col].width = w
title_block(ws, "Proposed Distribution of Shares", "Post-investment 50% scenario (Option A)")
hdr_row(ws, 4, ["Shareholder", "Current %", "Post-investment %", "Notes"])
sh = 5
notes_map = {
    "Investor (USD 2.0M core capital)": "USD 2,000,000 core capital (band 1.0–2.5M)",
    "Mohammed Fadi Jannan - Chairman & Founder": "Founder; exclusive agency holder; pre-op USD 14,517",
    "Partner A": "Existing partner — dilutes 10% → 5%",
    "Partner B": "Existing partner — dilutes 10% → 5%",
}
for name, cur, post in M.SHAREHOLDING:
    cell(ws, f"A{sh}", name, F(10), border=True)
    cell(ws, f"B{sh}", cur, F(10), "right", PCT0, border=True)
    cell(ws, f"C{sh}", post, F(10), "right", PCT0, border=True)
    cell(ws, f"D{sh}", notes_map.get(name, ""), F(9, False, "5C5B57"), border=True, wrap=True)
    sh += 1
cell(ws, f"A{sh}", "Total", F(10, True, NAVY), fillc=MID, border=True)
cell(ws, f"B{sh}", f"=SUM(B5:B{sh-1})", F(10, True, NAVY), align="right", fmt=PCT0, fillc=MID, border=True)
cell(ws, f"C{sh}", f"=SUM(C5:C{sh-1})", F(10, True, NAVY), align="right", fmt=PCT0, fillc=MID, border=True)
ws[f"D{sh}"].fill = fill(MID)
sh += 2
cell(ws, f"A{sh}", "Alternative (Option B): investor takes no equity — 25% net-profit share + "
     "capital redemption at par end of Year 5.", F(9, True, TEAL)); ws.merge_cells(f"A{sh}:D{sh}")

# ============================================================ 8. Dashboard (with charts)
ws = wb.create_sheet("Dashboard")
ws.sheet_view.showGridLines = False
for col, w in zip("ABCDEFGH", [30, 14, 14, 14, 14, 14, 4, 4]):
    ws.column_dimensions[col].width = w
title_block(ws, "Investor Dashboard", "Headline metrics pull live from the model")
metrics = [
    ("Total 5-year group revenue (USD 000)", f"=SUM({PL}!B{PL_TOTREV_ROW}:F{PL_TOTREV_ROW})", USD0),
    ("Total 5-year net profit (USD 000)", f"=SUM({PL}!B{NPr}:F{NPr})", USD0),
    ("Year 1 revenue (USD 000)", f"={PL}!B{PL_TOTREV_ROW}", USD0),
    ("Year 1 net profit (USD 000)", f"={PL}!B{NPr}", USD0),
    ("Year 5 net profit (USD 000)", f"={PL}!F{NPr}", USD0),
    ("Recommended core raise (USD 000)", f"=Assumptions!B{ASSUM_ROWS['raise']}", USD0),
    ("Option A IRR (50% equity)", f"='Funding & Returns'!B{tr-14 if False else 0}", None),  # placeholder fixed below
]
dr = 4
for label, formula, fmt in metrics[:6]:
    cell(ws, f"A{dr}", label, F(10, True, NAVY), border=True)
    cell(ws, f"B{dr}", formula, F(11, True, TEAL), "right", fmt, border=True)
    dr += 1
# returns metrics referencing Funding sheet cells directly
cell(ws, f"A{dr}", "Option A IRR (50% equity)", F(10, True, NAVY), border=True)
cell(ws, f"B{dr}", M.OPT_A_IRR, F(11, True, GOLD), "right", PCT, border=True); dr += 1
cell(ws, f"A{dr}", "Option B IRR (25% + redemption)", F(10, True, NAVY), border=True)
cell(ws, f"B{dr}", M.OPT_B_IRR, F(11, True, GOLD), "right", PCT, border=True); dr += 1

# Data table for chart (revenue by division)
cd = dr + 2
cell(ws, f"A{cd}", "Chart data (USD 000)", F(9, True, "5C5B57"))
cd += 1
cell(ws, f"A{cd}", "Year", F(9, True))
for i, y in enumerate(["Y1", "Y2", "Y3", "Y4", "Y5"]):
    cell(ws, f"{get_column_letter(2+i)}{cd}", y, F(9, True), "center")
cd += 1
cell(ws, f"A{cd}", "Vestwoods", F(9))
for i, c in enumerate(cols): cell(ws, f"{c}{cd}", f"={PL}!{c}{PL_VWREV_ROW}", F(9), "right", USD0)
vw_data_row = cd; cd += 1
cell(ws, f"A{cd}", "Al Reem Plastics", F(9))
for i, c in enumerate(cols): cell(ws, f"{c}{cd}", f"={PL}!{c}{PL_ARREV_ROW}", F(9), "right", USD0)
ar_data_row = cd; cd += 1
cell(ws, f"A{cd}", "Net profit", F(9))
for i, c in enumerate(cols): cell(ws, f"{c}{cd}", f"={PL}!{c}{NPr}", F(9), "right", USD0)
np_data_row = cd

# Stacked bar chart: revenue by division
chart = BarChart(); chart.type = "col"; chart.grouping = "stacked"; chart.overlap = 100
chart.title = "Group revenue by division (USD 000)"
chart.height = 8; chart.width = 16
data = Reference(ws, min_col=1, min_row=vw_data_row, max_row=ar_data_row, max_col=6)
cats = Reference(ws, min_col=2, min_row=cd-3, max_col=6)  # year row
chart.add_data(Reference(ws, min_col=2, min_row=vw_data_row, max_row=ar_data_row, max_col=6), from_rows=True, titles_from_data=False)
chart.set_categories(cats)
chart.series[0].tx = openpyxl.chart.series.SeriesLabel(v="Vestwoods")
chart.series[1].tx = openpyxl.chart.series.SeriesLabel(v="Al Reem Plastics")
s0 = chart.series[0]; s0.graphicalProperties.solidFill = BLUE
s1 = chart.series[1]; s1.graphicalProperties.solidFill = AQUA
chart.y_axis.title = "USD 000"; chart.x_axis.delete = False; chart.y_axis.delete = False
ws.add_chart(chart, "D4")

# Line chart: net profit
lc = LineChart(); lc.title = "Group net profit (USD 000)"; lc.height = 7; lc.width = 16
npref = Reference(ws, min_col=2, min_row=np_data_row, max_col=6)
lc.add_data(npref, from_rows=True, titles_from_data=False)
lc.set_categories(cats)
lc.series[0].graphicalProperties.line.solidFill = GOLD
lc.series[0].graphicalProperties.line.width = 28000
lc.series[0].tx = openpyxl.chart.series.SeriesLabel(v="Net profit")
lc.y_axis.delete = False; lc.x_axis.delete = False
ws.add_chart(lc, "D20")

wb.save(OUT)
print("Saved", OUT)
