# -*- coding: utf-8 -*-
"""Build NORCO_Vestwoods_Investor_Model.xlsx — V7, Vestwoods only.
Mirrors the founder's V4 sheet structure; Al Reem Plastics removed."""
import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.chart import BarChart, LineChart, Reference
from openpyxl.chart.series import SeriesLabel
from openpyxl.utils import get_column_letter
import model as M

OUT = os.path.join(os.path.dirname(__file__), "..", "NORCO_Vestwoods_Investor_Model.xlsx")
NAVY = "0F2942"; TEAL = "0F6E6A"; GOLD = "C8892A"; LIGHT = "F3F5F7"
BLUE = "2A78D6"; AQUA = "1BAF7A"; MID = "E9EDF0"; WHITE = "FFFFFF"; CREAM = "FFF4DF"
wb = openpyxl.Workbook()
thin = Side(style="thin", color="D8DCE0")
BORDER = Border(left=thin, right=thin, top=thin, bottom=thin)

def F(sz=10, b=False, c="1A1A19"): return Font(name="Calibri", size=sz, bold=b, color=c)
def cell(ws, ref, val, font=None, align=None, fmt=None, fillc=None, border=False, wrap=False):
    c = ws[ref]; c.value = val
    if font: c.font = font
    if fillc: c.fill = PatternFill("solid", fgColor=fillc)
    if align or wrap: c.alignment = Alignment(horizontal=align or "left", vertical="center", wrap_text=wrap)
    if fmt: c.number_format = fmt
    if border: c.border = BORDER
    return c
def title(ws, t, sub, span="N"):
    ws.merge_cells(f"A1:{span}1"); cell(ws, "A1", t, F(14, True, NAVY))
    ws.merge_cells(f"A2:{span}2"); cell(ws, "A2", sub, F(9.5, False, "5C5B57"))
def hdr(ws, row, labels, fillc=NAVY, start=1, size=9):
    for i, lab in enumerate(labels):
        cell(ws, f"{get_column_letter(start+i)}{row}", lab, F(size, True, WHITE),
             align="center" if i > 0 else "left", fillc=fillc, border=True, wrap=True)

USD = '#,##0'; USDP = '#,##0;(#,##0)'; PCT1 = '0.0%'; PCT0 = '0%'
COLS12 = [get_column_letter(2+i) for i in range(12)]; TOTCOL = "N"

def month_row(ws, r, label, vals, bold=False, fillc=None, fmt=USDP, total=None, size=9):
    cell(ws, f"A{r}", label, F(size, bold, NAVY if bold else "1A1A19"), fillc=fillc, border=True, wrap=True)
    for i, v in enumerate(vals):
        cell(ws, f"{COLS12[i]}{r}", v, F(size, bold, NAVY if bold else "1A1A19"),
             align="right", fmt=fmt, fillc=fillc, border=True)
    t = total if total is not None else f"=SUM(B{r}:M{r})"
    cell(ws, f"{TOTCOL}{r}", t, F(size, True, NAVY), align="right", fmt=fmt, fillc=fillc or MID, border=True)

# ============================================================== 1. ReadMe
ws = wb.active; ws.title = "ReadMe"; ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 26; ws.column_dimensions["B"].width = 100
title(ws, "NORCO — Vestwoods Investor Model V7", "Exclusive Vestwoods (Haier Energy) battery storage | Egypt · Sudan · Algeria · Libya | Aug 2026 – Jul 2031", "B")
rows = [
 ("Purpose", "Investor-grade 5-year model for NORCO's exclusive Vestwoods lithium battery storage business. The investor invests USD 1,000,000 into the EGYPT operating company for 50% of its shares."),
 ("Scope", "Vestwoods (Haier Energy) products only — residential, C&I and telecom battery energy storage, hybrid inverters and Rescube portable power. Al Reem Plastics is not part of this plan."),
 ("Markets", "Egypt (retail + wholesale), Sudan (committed buyer), Algeria (agency + 100% LC from Month 8), Libya (dual-hub distributors from Year 2)."),
 ("Container economics", "40ft FCL of 340 units, landed cost USD 342,316 (factory + freight + 5% duty + 2% GOEIC + handling). Egypt revenue USD 433,281/container (50/50 retail-wholesale); export USD 393,861 (wholesale)."),
 ("Margins", "Egypt product cost 79% of Egypt revenue; export product cost 50% of export revenue (per the founder's negotiated export supply pricing). See the diligence note on the Pricing Reference sheet."),
 ("Container plan Y1→Y5", "Egypt 6/7/9/11/15 · Sudan 4/5/6/8/10 · Algeria 3/4/6/7/8 · Libya 0/4/5/6/8. Total 13 → 41 containers."),
 ("Investment ask", "USD 1,000,000 core for 50% of NORCO Egypt — Tranche 1 USD 500K at close (Aug-26), Tranche 2 USD 500K at Month 4 (milestone-gated) — plus an optional USD 500K accelerator (ceiling USD 1.5M)."),
 ("Shareholding", "NORCO Egypt: Investor 50% | NORCO UAE 20% | Founder 20% | Partner A 5% | Partner B 5%. Founder-side combined interest 40% (20% direct + 20% via NORCO UAE)."),
 ("Supplier terms", "Year 1: Sinosure-backed — containers 1-4 to the shipping schedule, 5-13 at 10% down + 90% at 3-month credit. Year 2+: 10% down + 90% at 3-month credit on all POs."),
 ("Currency & FX", "USD throughout. Planning rate USD 1 = EGP 53. Corporate tax 22.5% on net profit; Year-1 tax computed with loss carry-forward."),
 ("Sheets", "Key Assumptions | Pre-Op Investment | Pricing Reference | Staff Plan | Monthly P&L Year 1 | Annual P&L Summary Y1-Y5 | Cash Flow Year 1 | 5Y Cash Flow | Market Detail | Funding & Returns | Shareholding | Dashboard"),
 ("Version", "V7 (Vestwoods) — 14 July 2026. Strictly Private & Confidential. Prepared by Fadi Jannan, Managing Director."),
]
r = 4
for k, v in rows:
    cell(ws, f"A{r}", k, F(10, True, NAVY)); cell(ws, f"B{r}", v, F(9.5), wrap=True)
    ws.row_dimensions[r].height = 34; r += 1

# ============================================================== 2. Key Assumptions
ws = wb.create_sheet("Key Assumptions"); ws.sheet_view.showGridLines = False
for col, w in zip("ABC", [40, 34, 62]): ws.column_dimensions[col].width = w
title(ws, "Key Assumptions", "Vestwoods-only plan basis | Blue = key input", "C")
hdr(ws, 4, ["Parameter", "Value / Assumption", "Notes"], size=9.5)
KA = [
 ("► GENERAL", None, None),
 ("Business start", "August 2026", "Month 1 = Aug-26; fiscal years run Aug–Jul"),
 ("Scope", "Vestwoods (Haier Energy) products only", "Residential, C&I, telecom BESS + inverters"),
 ("Investment vehicle", "NORCO Egypt (operating company)", "Investor subscribes for 50%; NORCO UAE holds 20%"),
 ("FX planning rate", "USD 1 = EGP 53", "Conservative vs spot ~49–51"),
 ("Corporate tax", "22.5% on net profit", "Loss carry-forward applied in Year 1"),
 ("► CONTAINER ECONOMICS", None, None),
 ("Container", "340 units / 40ft FCL, landed COGS USD 342,316", "Factory + USD 6,865 freight + 5% duty + 2% GOEIC + handling"),
 ("Egypt revenue / container", "USD 433,281 (50% retail / 50% wholesale)", "21.0% blended margin; product cost 79% of revenue"),
 ("Export revenue / container", "USD 393,861 (wholesale)", "Sudan/Algeria/Libya; product cost 50% of revenue (founder's supply pricing)"),
 ("Lead time", "45–55 days PO → Egypt warehouse", "Factory 15–20 + sea 18 + clearance 7–10 days"),
 ("Supplier terms Y1", "Sinosure: containers 1-4 to schedule; 5-13 at 10% down + 90% at 3-month credit", "Keeps the Year-1 working-capital need to ~USD 0.9M"),
 ("Supplier terms Y2+", "10% down + 90% at 3-month credit on all POs", "~22.5% of purchases outstanding at year end"),
 ("► REVENUE", None, None),
 ("Egypt containers Y1→Y5", "6 / 7 / 9 / 11 / 15", "I LOCK wholesale + direct/dealer retail"),
 ("Sudan containers Y1→Y5", "4 / 5 / 6 / 8 / 10", "Committed buyer; 50% advance + 50% delivery"),
 ("Algeria containers Y1→Y5", "3 / 4 / 6 / 7 / 8", "Agency + 100% LC before shipment from Month 8"),
 ("Libya containers Y2→Y5", "0 / 4 / 5 / 6 / 8", "Dual-hub distributors from Year 2"),
 ("Sales commissions", "4% of Egypt sales", "Variable, paid monthly"),
 ("Egypt exhibitions", "USD 15,000 Y1 (2 events) rising to USD 35K by Y5", "Electricx / Solar & Storage Cairo booths (in marketing)"),
 ("► CUSTOMER TERMS", None, None),
 ("Egypt customers", "30–60 days (avg 45); 1-month collection lag", "Invoice on delivery"),
 ("Sudan", "50% advance at order + 50% on delivery", "Cash before/at shipment"),
 ("Algeria", "100% LC before shipment (FOB Jebel Ali)", "Licensed importer; zero in-country exposure"),
 ("Libya", "Advance / confirmed LC", "From Year 2, dual-hub distributors"),
 ("► FACILITIES & STAFF", None, None),
 ("Showroom #1", "6th October City — OPERATIONAL", "EGP 10,000/mo = USD 200; renovated & furnished"),
 ("Showroom #2", "New Cairo ~100 sqm — opens Month 1", "USD 2,500/month"),
 ("Office", "New Cairo, ~100 sqm furnished", "USD 3,000/month"),
 ("Warehouse", "300–700 sqm — 6th Oct / Sheikh Zayed / New Cairo", "USD 3,000/month; located on best available cost"),
 ("Sales compensation", "Salary + 4% commission on Egypt sales", "Performance incentive on top of base"),
 ("Headcount", "21 (M12) → 55 (Year 5)", "Full roster in Staff Plan sheet"),
 ("► FUNDING", None, None),
 ("Investment", "USD 1,000,000 for 50% of NORCO Egypt", "T1 500K + T2 500K; optional 500K accelerator (ceiling 1.5M)"),
 ("Peak funding need", f"USD {abs(M.PEAK_DEFICIT):,.0f} (self-funded deficit, Jan-27)", f"Covered by the raise; minimum cash +USD {M.MIN_CASH_WITH_RAISE:,.0f}"),
 ("Dividend policy", "100% of net profit distributed, in arrears", "Investor receives 50% of each distribution"),
]
r = 5
for a, b, c in KA:
    if b is None:
        cell(ws, f"A{r}", a, F(10, True, TEAL), fillc=LIGHT)
        for col in "BC": ws[f"{col}{r}"].fill = PatternFill("solid", fgColor=LIGHT)
        r += 1; continue
    cell(ws, f"A{r}", a, F(9.5), border=True, wrap=True)
    cell(ws, f"B{r}", b, F(9.5, False, "1F4E79"), border=True, wrap=True)
    cell(ws, f"C{r}", c, F(9, False, "5C5B57"), border=True, wrap=True)
    ws.row_dimensions[r].height = 24; r += 1

# ============================================================== 3. Pre-Op Investment
ws = wb.create_sheet("Pre-Op Investment"); ws.sheet_view.showGridLines = False
for col, w in zip("ABCDE", [52, 14, 16, 12, 24]): ws.column_dimensions[col].width = w
title(ws, "Pre-Operational Investment (Already Spent by Founder)",
      "Incurred before the August 2026 launch — demonstrates founder commitment and operational readiness", "E")
hdr(ws, 4, ["Description", "Date", "Original Amount", "USD", "Category"])
PREOP = [
 ("Showroom renovation — 6th October City", "Jun 2026", "EGP 82,000", 1640, "Capex — Fit-out"),
 ("Showroom furniture & fittings", "Jun 2026", "EGP 85,000", 1700, "Capex — Fit-out"),
 ("Security cameras & CCTV", "Jun 2026", "EGP 7,500", 150, "Capex — Security"),
 ("Additional setup & equipment", "Jun 2026", "EGP 50,000", 1000, "Capex — Equipment"),
 ("Legal & licensing — Egypt company registration", "Jul 2025", "EGP 87,000", 1740, "OpEx — Legal/Egypt"),
 ("Legal & licensing — import permits Egypt", "Jun 2026", "EGP 80,000", 1600, "OpEx — Legal/Egypt"),
 ("UAE business licence — NORCO General Trading LLC", "2025–2026", "AED 15,000", 4084, "OpEx — Legal/UAE"),
 ("Showroom rent — pre-operations (2 months)", "Jun–Jul 2026", "EGP 20,000", 400, "OpEx — Rent"),
 ("Sales representative salary — 2 months pre-launch", "Jun–Jul 2026", "2 × USD 500", 1000, "OpEx — Salaries"),
 ("Products purchased & sold through showroom (pre-launch trading)", "Jun–Jul 2026", "EGP 31,948.50", 603, "Working capital — Inventory"),
 ("Company branding, logo & stationery", "2025", "USD 300", 300, "OpEx — Marketing"),
 ("Corporate website — norcotrading.com", "2025", "USD 300", 300, "OpEx — Marketing"),
]
r = 5
for d, dt, orig, usd, cat in PREOP:
    cell(ws, f"A{r}", d, F(9.5), border=True, wrap=True); cell(ws, f"B{r}", dt, F(9.5), border=True)
    cell(ws, f"C{r}", orig, F(9.5), align="right", border=True)
    cell(ws, f"D{r}", usd, F(9.5), align="right", fmt=USD, border=True)
    cell(ws, f"E{r}", cat, F(9, False, "5C5B57"), border=True); r += 1
cell(ws, f"A{r}", "TOTAL PRE-OPERATIONAL INVESTMENT", F(10, True, NAVY), fillc=MID, border=True)
for col in "BCE": ws[f"{col}{r}"].fill = PatternFill("solid", fgColor=MID)
cell(ws, f"D{r}", f"=SUM(D5:D{r-1})", F(10, True, NAVY), align="right", fmt=USD, fillc=MID, border=True); r += 2
cell(ws, f"A{r}", "Note: EGP 31,948.50 of product stock was purchased and sold through the operating showroom before launch — live proof of demand at the retail point of sale.",
     F(9, True, TEAL)); ws.merge_cells(f"A{r}:E{r}")

# ============================================================== 4. Pricing Reference
ws = wb.create_sheet("Pricing Reference"); ws.sheet_view.showGridLines = False
for col, w in zip("ABCDEFGH", [14, 34, 12, 12, 12, 12, 13, 13]): ws.column_dimensions[col].width = w
title(ws, "Pricing Reference — Vestwoods", "Verified unit pricing (EGP 53 = USD 1) | 40ft container USD 6,865 shipping | landed = factory + freight + 5% duty + 2% GOEIC + handling", "H")
hdr(ws, 4, ["Model", "Description", "Qty / 40ft", "Factory", "Landed COGS", "Wholesale", "Retail USD", "Retail EGP"])
r = 5
for model, desc, qty, fac, cogs, whl, ret in M.VW_MIX:
    cell(ws, f"A{r}", model, F(9), border=True); cell(ws, f"B{r}", desc, F(9), border=True)
    cell(ws, f"C{r}", qty, F(9), align="right", fmt=USD, border=True)
    cell(ws, f"D{r}", fac, F(9), align="right", fmt=USD, border=True)
    cell(ws, f"E{r}", cogs, F(9), align="right", fmt=USD, border=True)
    cell(ws, f"F{r}", whl, F(9), align="right", fmt=USD, border=True)
    cell(ws, f"G{r}", ret, F(9), align="right", fmt=USD, border=True)
    cell(ws, f"H{r}", round(ret*M.FX), F(9), align="right", fmt=USD, border=True); r += 1
cell(ws, f"A{r}", "CONTAINER TOTALS (340 units)", F(9.5, True, NAVY), fillc=MID, border=True)
cell(ws, f"B{r}", "40ft FCL China → Alexandria", F(9, True, NAVY), fillc=MID, border=True)
cell(ws, f"C{r}", f"=SUM(C5:C{r-1})", F(9.5, True, NAVY), align="right", fmt=USD, fillc=MID, border=True)
cell(ws, f"D{r}", M.VW_CONT_SUPPLIER, F(9.5, True, NAVY), align="right", fmt=USD, fillc=MID, border=True)
cell(ws, f"E{r}", M.VW_CONT_COGS, F(9.5, True, NAVY), align="right", fmt=USD, fillc=MID, border=True)
cell(ws, f"F{r}", round(M.VW_CONT_WHOLESALE), F(9.5, True, NAVY), align="right", fmt=USD, fillc=MID, border=True)
cell(ws, f"G{r}", round(M.VW_CONT_RETAIL), F(9.5, True, NAVY), align="right", fmt=USD, fillc=MID, border=True)
ws[f"H{r}"].fill = PatternFill("solid", fgColor=MID); r += 1
notes = [
 "Egypt container revenue (50% retail / 50% wholesale): USD 433,281 — product cost 79% of revenue (21.0% margin).",
 "Export container revenue (wholesale, Sudan/Algeria/Libya): USD 393,861 — booked at 50% product cost per the founder's negotiated export supply pricing.",
 "DILIGENCE NOTE: at the USD 342,316 landed container cost, USD 393,861 wholesale implies a ~13% margin. The 50% export margin in this model rests on the supply agreement — confirm before relying on the export gross margin.",
]
for n in notes:
    cell(ws, f"A{r}", "• " + n, F(8.5, False, "5C5B57")); ws.merge_cells(f"A{r}:H{r}"); ws.row_dimensions[r].height = 24; r += 1

# ============================================================== 5. Staff Plan
ws = wb.create_sheet("Staff Plan"); ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 32; ws.column_dimensions["B"].width = 11
for c in COLS12: ws.column_dimensions[c].width = 9
ws.column_dimensions["O"].width = 11
title(ws, "Staffing Plan & Monthly Payroll (USD)", "Phased hiring | base salaries (pre-15% benefits) | Year-1 monthly detail | Years 2–5 annual rosters", "O")
hdr4 = ["ROLE", "Monthly\nSalary"] + M.MONTHS + ["Y1 Total"]
for i, lab in enumerate(hdr4):
    cell(ws, f"{get_column_letter(1+i)}4", lab, F(8, True, WHITE), align="center" if i else "left", fillc=NAVY, border=True, wrap=True)
Y1_ROSTER = [
 ("CEO / Director", 8000, 0), ("Financial Manager", 4000, 0), ("Operations Manager", 4000, 0),
 ("Marketing Manager", 1500, 2), ("HR Manager", 1000, 2), ("Sales Manager", 3000, 1),
 ("Warehouse Manager", 1200, 0), ("Accountant #1", 800, 1), ("Accountant #2", 800, 7),
 ("Showroom Manager #1 (6th October)", 500, 0), ("Showroom Manager #2 (New Cairo)", 800, 1),
 ("Sales Staff #1", 600, 2), ("Sales Staff #2", 600, 3), ("Sales Staff #3", 600, 5),
 ("Sales Staff #4", 600, 7), ("Driver #1", 500, 0), ("Driver #2", 500, 3),
 ("Administrative Asst #1", 600, 0), ("Administrative Asst #2", 600, 5),
 ("Warehouse Staff #1", 600, 3), ("Warehouse Staff #2", 600, 7),
]
r = 5
for role, sal, start in Y1_ROSTER:
    cell(ws, f"A{r}", role, F(8.5), border=True); cell(ws, f"B{r}", sal, F(8.5), align="right", fmt=USD, border=True)
    for mi in range(12):
        v = sal if mi >= start else "–"
        cell(ws, f"{get_column_letter(3+mi)}{r}", v, F(8.5), align="right", fmt=USD if isinstance(v, int) else None, border=True)
    cell(ws, f"O{r}", sal*(12-start), F(8.5, True), align="right", fmt=USD, border=True); r += 1
totrow = r
cell(ws, f"A{r}", "TOTAL BASE SALARIES", F(9, True, NAVY), fillc=MID, border=True); ws[f"B{r}"].fill = PatternFill("solid", fgColor=MID)
for mi in range(12):
    col = get_column_letter(3+mi)
    cell(ws, f"{col}{r}", f"=SUM({col}5:{col}{r-1})", F(8.5, True, NAVY), align="right", fmt=USD, fillc=MID, border=True)
cell(ws, f"O{r}", f"=SUM(O5:O{r-1})", F(8.5, True, NAVY), align="right", fmt=USD, fillc=MID, border=True); r += 1
cell(ws, f"A{r}", "Social Insurance & Benefits (15%)", F(8.5), border=True); ws[f"B{r}"].border = BORDER
for mi in range(12):
    col = get_column_letter(3+mi); cell(ws, f"{col}{r}", f"={col}{totrow}*0.15", F(8.5), align="right", fmt=USD, border=True)
cell(ws, f"O{r}", f"=O{totrow}*0.15", F(8.5, True), align="right", fmt=USD, border=True); r += 1
cell(ws, f"A{r}", "TOTAL PERSONNEL (base + benefits)", F(9, True, NAVY), fillc=CREAM, border=True); ws[f"B{r}"].fill = PatternFill("solid", fgColor=CREAM)
for mi in range(12):
    col = get_column_letter(3+mi); cell(ws, f"{col}{r}", f"={col}{totrow}*1.15", F(8.5, True, NAVY), align="right", fmt=USD, fillc=CREAM, border=True)
cell(ws, f"O{r}", f"=O{totrow}*1.15", F(8.5, True, NAVY), align="right", fmt=USD, fillc=CREAM, border=True); r += 2
cell(ws, f"A{r}", "Sales commissions (4% of Egypt sales) are variable pay on top — see Monthly P&L. Headcount reaches 21 by Month 12.", F(8.5, False, "5C5B57")); ws.merge_cells(f"A{r}:O{r}"); r += 2
Y_ROSTERS = [
 ("YEAR 2 (Aug 2027 – Jul 2028) — 26 staff", 500940, "+ Administrative Asst #3, Logistics Coordinator, Sales Staff #5–6, Customer Service Manager, Technical Specialist, Driver #3"),
 ("YEAR 3 (Aug 2028 – Jul 2029) — 35 staff", 638940, "+ Alexandria Branch (manager, 2 sales, admin), Finance Analyst, Supply Chain Analyst, Senior Sales Executive, Installation Engineers #1–2"),
 ("YEAR 4 (Aug 2029 – Jul 2030) — 44 staff", 793500, "+ B2G/Tenders Manager, C&I Sales Manager + 2 staff, Senior Accountant, IT/CRM Administrator, Warehouse Staff #3, Maintenance Technician, Sudan Market Coordinator"),
 ("YEAR 5 (Aug 2030 – Jul 2031) — 55 staff (senior raises applied)", 1083300, "+ Libya Market Manager, Senior Marketing Manager, Sales Supervisor, C&I Sales #3–4, Field Engineers #3–4, Legal & Compliance, CRM & Digital Marketing Specialists, Driver #4"),
]
for i, (label, baseben, additions) in enumerate(Y_ROSTERS):
    yr = i + 1
    cell(ws, f"A{r}", label, F(10, True, TEAL)); ws.merge_cells(f"A{r}:O{r}"); r += 1
    cell(ws, f"A{r}", "Additions", F(8.5, True), border=True)
    cell(ws, f"B{r}", additions, F(8.5), wrap=True); ws.merge_cells(f"B{r}:O{r}"); ws.row_dimensions[r].height = 24; r += 1
    base = round(baseben/1.15)
    for lab, val in [("Total base salaries (annual)", base), ("Social insurance & benefits (15%)", round(base*0.15)),
                     ("Personnel sub-total", baseben),
                     (f"Sales commissions (4% of Egypt sales USD {M.EGYPT_SALES[yr]:,.0f})", M.PERSONNEL[yr]-baseben),
                     ("TOTAL ANNUAL PERSONNEL COST", M.PERSONNEL[yr])]:
        bold = lab.startswith("TOTAL")
        cell(ws, f"A{r}", lab, F(8.5, bold, NAVY if bold else "1A1A19"), fillc=MID if bold else None, border=True)
        cell(ws, f"B{r}", val, F(8.5, bold, NAVY if bold else "1A1A19"), align="right", fmt=USD, fillc=MID if bold else None, border=True); r += 1
    r += 1

# ============================================================== 6. Monthly P&L Year 1
ws = wb.create_sheet("Monthly P&L Year 1"); ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 46
for c in COLS12: ws.column_dimensions[c].width = 10.5
ws.column_dimensions[TOTCOL].width = 12
title(ws, "Monthly Profit & Loss Statement — Year 1 (August 2026 – July 2027)",
      "Vestwoods only | USD | Egypt product cost 79% of Egypt sales; export product cost 50% of export sales", TOTCOL)
hdr(ws, 4, ["DESCRIPTION"] + M.MONTHS + ["TOTAL\nYear 1"], size=8.5)
r = 5
def sect(label):
    global r
    cell(ws, f"A{r}", label, F(9, True, TEAL), fillc=LIGHT)
    for c in COLS12 + [TOTCOL]: ws[f"{c}{r}"].fill = PatternFill("solid", fgColor=LIGHT)
    r += 1
sect("REVENUE")
month_row(ws, r, "Egypt — Vestwoods (6 containers)", M.M_VW_EGYPT); r += 1
month_row(ws, r, "Sudan — Vestwoods (4 containers)", M.M_VW_SUDAN); r += 1
month_row(ws, r, "Algeria — Vestwoods, 100% LC (3 containers)", M.M_VW_ALG); r += 1
month_row(ws, r, "TOTAL REVENUE", M.M_REV, bold=True, fillc=MID); r += 1
sect("COST OF GOODS SOLD")
month_row(ws, r, "Egypt product cost (79% of Egypt sales)", M.M_CEG); r += 1
month_row(ws, r, "Sudan product cost (50% of Sudan sales)", M.M_CSU); r += 1
month_row(ws, r, "Algeria product cost (50% of Algeria sales)", M.M_CAL); r += 1
month_row(ws, r, "TOTAL COGS", M.M_COGS, bold=True, fillc=MID); r += 1
month_row(ws, r, "GROSS PROFIT", M.M_GP, bold=True, fillc=CREAM); r += 1
sect("OPERATING EXPENSES — PERSONNEL")
month_row(ws, r, "Total base salaries (Staff Plan roster)", M.M_BASE); r += 1
month_row(ws, r, "Social insurance & benefits (15%)", M.M_BEN); r += 1
month_row(ws, r, "Sales commissions (4% of Egypt sales)", M.M_COMM); r += 1
month_row(ws, r, "TOTAL PERSONNEL", M.M_PERS, bold=True, fillc=MID); r += 1
sect("OPERATING EXPENSES — FACILITIES, OPS, MARKETING, G&A")
sh1 = [200]*12; sh2 = [2500]*12; off = [6000]+[3000]*11; wh = [3000]*12; util = [400, 400]+[700]*10
month_row(ws, r, "Showroom #1 — 6th October City (existing)", sh1); r += 1
month_row(ws, r, "Showroom #2 — New Cairo ~100 sqm (opens Month 1)", sh2); r += 1
month_row(ws, r, "Office — New Cairo 100 sqm furnished", off); r += 1
month_row(ws, r, "Warehouse — 6th Oct / Sheikh Zayed / New Cairo", wh); r += 1
month_row(ws, r, "Utilities", util); r += 1
month_row(ws, r, "Vehicles & fuel", M.M_OPS); r += 1
month_row(ws, r, "Marketing & promotions (incl. exhibitions M3)", M.M_MKT); r += 1
month_row(ws, r, "General & administrative", M.M_GA); r += 1
month_row(ws, r, "Depreciation & amortisation (fit-out, 3-yr)", M.M_DA); r += 1
month_row(ws, r, "TOTAL OPERATING EXPENSES", M.M_OPEX, bold=True, fillc=MID); r += 1
month_row(ws, r, "EBIT (OPERATING PROFIT)", M.M_EBIT, bold=True); r += 1
month_row(ws, r, "Interest on trade finance (est.)", M.M_INT); r += 1
month_row(ws, r, "EARNINGS BEFORE TAX", M.M_EBT, bold=True); r += 1
month_row(ws, r, "Corporate tax (22.5%, loss carry-forward)", M.M_TAX); r += 1
month_row(ws, r, "NET PROFIT / (LOSS)", M.M_NP, bold=True, fillc=CREAM); r += 1
cum = []; s = 0
for v in M.M_NP: s = round(s+v, 1); cum.append(s)
month_row(ws, r, "Cumulative profit / (loss)", cum, total=cum[-1]); r += 2
cell(ws, f"A{r}", "Operating & cumulative break-even both in Month 6 (Jan-27). Egypt Y1: 6 containers | Sudan: 4 | Algeria: 3 (LC).",
     F(8.5, True, TEAL)); ws.merge_cells(f"A{r}:N{r}")

# ============================================================== 7. Annual P&L Summary (formula-driven)
ws = wb.create_sheet("Annual P&L Summary Y1-Y5"); ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 42
for c in "BCDEFG": ws.column_dimensions[c].width = 14
title(ws, "5-Year Annual P&L Summary (USD)", "Vestwoods: Egypt 6/7/9/11/15 · Sudan 4/5/6/8/10 · Algeria 3/4/6/7/8 · Libya 0/4/5/6/8", "G")
hdr(ws, 4, ["DESCRIPTION", "Year 1\n(Aug26-Jul27)", "Year 2\n(Aug27-Jul28)", "Year 3\n(Aug28-Jul29)", "Year 4\n(Aug29-Jul30)", "Year 5\n(Aug30-Jul31)", "5-YEAR\nTOTAL"])
r = 5
def arow(label, vals, bold=False, fillc=None, fmt=USDP, pct=False, tot=True):
    global r
    cell(ws, f"A{r}", label, F(9.5, bold, NAVY if bold else "1A1A19"), fillc=fillc, border=True, wrap=True)
    for i, v in enumerate(vals):
        cell(ws, f"{get_column_letter(2+i)}{r}", v, F(9.5, bold, NAVY if bold else "1A1A19"),
             align="right", fmt=PCT1 if pct else fmt, fillc=fillc, border=True)
    if tot and not pct:
        cell(ws, f"G{r}", f"=SUM(B{r}:F{r})", F(9.5, True, NAVY), align="right", fmt=fmt, fillc=fillc or MID, border=True)
    r += 1
def asect(label):
    global r
    cell(ws, f"A{r}", label, F(9.5, True, TEAL), fillc=LIGHT)
    for c in "BCDEFG": ws[f"{c}{r}"].fill = PatternFill("solid", fgColor=LIGHT)
    r += 1
asect("REVENUE")
arow("Egypt — Vestwoods", M.VW_MARKET_REV["Egypt"]); egy_r = r-1
arow("Sudan — Vestwoods", M.VW_MARKET_REV["Sudan"])
arow("Algeria — Vestwoods (100% LC)", M.VW_MARKET_REV["Algeria"])
arow("Libya — Vestwoods (from Year 2)", M.VW_MARKET_REV["Libya"])
rev_r = r
cell(ws, f"A{r}", "TOTAL REVENUE", F(9.5, True, NAVY), fillc=MID, border=True)
for i, c in enumerate("BCDEF"):
    cell(ws, f"{c}{r}", f"=SUM({c}{egy_r}:{c}{r-1})", F(9.5, True, NAVY), align="right", fmt=USDP, fillc=MID, border=True)
cell(ws, f"G{r}", f"=SUM(B{r}:F{r})", F(9.5, True, NAVY), align="right", fmt=USDP, fillc=MID, border=True); r += 1
asect("COST OF GOODS SOLD")
arow("Egypt product cost (79%)", [round(0.79*v) for v in M.VW_MARKET_REV["Egypt"]]); ceg_r = r-1
arow("Export product cost (50% of Sudan+Algeria+Libya)",
     [round(0.50*(M.VW_MARKET_REV["Sudan"][i]+M.VW_MARKET_REV["Algeria"][i]+M.VW_MARKET_REV["Libya"][i])) for i in range(5)]); cex_r = r-1
cogs_r = r
cell(ws, f"A{r}", "TOTAL COGS", F(9.5, True, NAVY), fillc=MID, border=True)
for c in "BCDEF": cell(ws, f"{c}{r}", f"={c}{ceg_r}+{c}{cex_r}", F(9.5, True, NAVY), align="right", fmt=USDP, fillc=MID, border=True)
cell(ws, f"G{r}", f"=SUM(B{r}:F{r})", F(9.5, True, NAVY), align="right", fmt=USDP, fillc=MID, border=True); r += 1
gp_r = r
cell(ws, f"A{r}", "GROSS PROFIT", F(9.5, True, NAVY), fillc=CREAM, border=True)
for c in "BCDEF": cell(ws, f"{c}{r}", f"={c}{rev_r}-{c}{cogs_r}", F(9.5, True, NAVY), align="right", fmt=USDP, fillc=CREAM, border=True)
cell(ws, f"G{r}", f"=SUM(B{r}:F{r})", F(9.5, True, NAVY), align="right", fmt=USDP, fillc=CREAM, border=True); r += 1
cell(ws, f"A{r}", "Gross margin %", F(9.5), border=True)
for c in "BCDEF": cell(ws, f"{c}{r}", f"={c}{gp_r}/{c}{rev_r}", F(9.5), align="right", fmt=PCT1, border=True)
r += 1
asect("OPERATING EXPENSES")
arow("Personnel (Staff Plan + 4% Egypt commissions)", M.PERSONNEL); p1 = r-1
arow("Rent & facilities (2 showrooms, office, warehouse)", M.FACILITIES)
arow("Marketing & promotions", M.MARKETING)
arow("Operations, G&A & trade-finance interest", M.OPERATIONS_GA)
arow("Depreciation & amortisation", M.DA); p5 = r-1
opex_r = r
cell(ws, f"A{r}", "TOTAL OPERATING EXPENSES", F(9.5, True, NAVY), fillc=MID, border=True)
for c in "BCDEF": cell(ws, f"{c}{r}", f"=SUM({c}{p1}:{c}{p5})", F(9.5, True, NAVY), align="right", fmt=USDP, fillc=MID, border=True)
cell(ws, f"G{r}", f"=SUM(B{r}:F{r})", F(9.5, True, NAVY), align="right", fmt=USDP, fillc=MID, border=True); r += 1
asect("PROFITABILITY")
ebit_r = r
cell(ws, f"A{r}", "EBIT (after interest)", F(9.5, True, NAVY), border=True)
for c in "BCDEF": cell(ws, f"{c}{r}", f"={c}{gp_r}-{c}{opex_r}", F(9.5, True, NAVY), align="right", fmt=USDP, border=True)
cell(ws, f"G{r}", f"=SUM(B{r}:F{r})", F(9.5, True, NAVY), align="right", fmt=USDP, fillc=MID, border=True); r += 1
tax_r = r
cell(ws, f"A{r}", "Corporate income tax (22.5%)", F(9.5), border=True)
for c in "BCDEF": cell(ws, f"{c}{r}", f"=MAX(0,{c}{ebit_r})*0.225", F(9.5), align="right", fmt=USDP, border=True)
cell(ws, f"G{r}", f"=SUM(B{r}:F{r})", F(9.5, True, NAVY), align="right", fmt=USDP, fillc=MID, border=True); r += 1
np_r = r
cell(ws, f"A{r}", "NET PROFIT", F(9.5, True, NAVY), fillc=CREAM, border=True)
for c in "BCDEF": cell(ws, f"{c}{r}", f"={c}{ebit_r}-{c}{tax_r}", F(9.5, True, NAVY), align="right", fmt=USDP, fillc=CREAM, border=True)
cell(ws, f"G{r}", f"=SUM(B{r}:F{r})", F(9.5, True, NAVY), align="right", fmt=USDP, fillc=CREAM, border=True); r += 1
cell(ws, f"A{r}", "Net margin %", F(9.5), border=True)
for c in "BCDEF": cell(ws, f"{c}{r}", f"={c}{np_r}/{c}{rev_r}", F(9.5), align="right", fmt=PCT1, border=True)
r += 1
cell(ws, f"A{r}", "Cumulative net profit", F(9.5), border=True)
cell(ws, f"B{r}", f"=B{np_r}", F(9.5), align="right", fmt=USDP, border=True)
for i, c in enumerate("CDEF"):
    prev = "BCDE"[i]; cell(ws, f"{c}{r}", f"={prev}{r}+{c}{np_r}", F(9.5), align="right", fmt=USDP, border=True)
r += 2
for line in [
 f"Total 5-year revenue USD {M.REV_5YR:,.0f} | gross profit USD {M.GP_5YR:,.0f} | net profit USD {M.NP_5YR:,.0f}",
 "Operating & cumulative break-even both Month 6 (Jan-27). Year-1 net profit nearly matches the USD 1.0M raise.",
 "Projected investor IRR 40% (dividends only) to 69% (incl. terminal value); MOIC 3.4x–10.0x on the USD 1.0M investment.",
]:
    cell(ws, f"A{r}", "• " + line, F(9, True, TEAL)); ws.merge_cells(f"A{r}:G{r}"); r += 1
PL_SHEET = "'Annual P&L Summary Y1-Y5'"; PL_NP_ROW = np_r; PL_REV_ROW = rev_r; PL_EGY_ROW = egy_r

# ============================================================== 8. Cash Flow Year 1
ws = wb.create_sheet("Cash Flow Year 1"); ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 46
for c in COLS12: ws.column_dimensions[c].width = 10.5
ws.column_dimensions[TOTCOL].width = 12
title(ws, "Monthly Cash Flow — Year 1 (August 2026 – July 2027)",
      "Sinosure-backed supplier credit | Egypt 1-month collection lag | Sudan 50% advance + 50% delivery | Algeria 100% LC", TOTCOL)
hdr(ws, 4, ["CASH FLOW ITEM"] + M.MONTHS + ["YEAR 1\nTOTAL"], size=8.5)
r = 5
def csect(label):
    global r
    cell(ws, f"A{r}", label, F(9, True, TEAL), fillc=LIGHT)
    for c in COLS12 + [TOTCOL]: ws[f"{c}{r}"].fill = PatternFill("solid", fgColor=LIGHT)
    r += 1
csect("CASH INFLOWS")
month_row(ws, r, "Egypt collections (1-month lag, 30-day avg)", M.CF_IN_EGYPT); r += 1
month_row(ws, r, "Sudan cash received (50% advance + 50% delivery)", M.CF_IN_SUDAN); r += 1
month_row(ws, r, "Algeria cash received (100% LC before shipment)", M.CF_IN_ALG); r += 1
month_row(ws, r, "Investor capital (T1 Aug 500K | T2 Nov 500K)", M.CF_IN_FUND); r += 1
month_row(ws, r, "TOTAL CASH INFLOWS", M.M_IN, bold=True, fillc=MID); r += 1
csect("CASH OUTFLOWS")
month_row(ws, r, "Vestwoods container payments (Sinosure schedule)", M.CF_CONT); r += 1
month_row(ws, r, "One-time setup (fit-out, deposits, licences, demo)", M.CF_SETUP); r += 1
month_row(ws, r, "Operating expenses (cash, incl. commissions & interest)", M.CF_OPEX_M); r += 1
month_row(ws, r, "TOTAL CASH OUTFLOWS", M.M_OUT, bold=True, fillc=MID); r += 1
month_row(ws, r, "NET MONTHLY CASH FLOW", M.M_NET, bold=True); r += 1
month_row(ws, r, "CUMULATIVE CASH POSITION", M.M_CUM, bold=True, fillc=CREAM, total=M.M_CUM[-1]); r += 2
for line in [
 f"Peak self-funded deficit (excluding investor capital): USD {abs(M.PEAK_DEFICIT):,.0f} — covered by the USD 1.0M raise.",
 f"Minimum cash position with the raise: USD {M.MIN_CASH_WITH_RAISE:,.0f} (Jan-27, before profits build).",
 f"Year-1 ending cash: USD {M.Y1_END_CASH:,.0f} — funds Year-2 growth alongside the credit terms.",
 "Sudan advances (50% at order) arrive ~2 months before delivery and partially offset container prepayments.",
]:
    cell(ws, f"A{r}", "• " + line, F(8.5, True, TEAL)); ws.merge_cells(f"A{r}:N{r}"); r += 1

# ============================================================== 9. 5Y Cash Flow
ws = wb.create_sheet("5Y Cash Flow"); ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 46
for c in "BCDEF": ws.column_dimensions[c].width = 14
title(ws, "Five-Year Cash Flow (USD)", "Y1 from the monthly sheet. Y2+ under credit terms: 10% at PO + 90% at 3-month credit (~22.5% of purchases outstanding at year end)", "F")
hdr(ws, 4, ["ITEM", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"])
r = 5
def cfr(label, vals, bold=False, fillc=None):
    global r
    cell(ws, f"A{r}", label, F(9.5, bold, NAVY if bold else "1A1A19"), fillc=fillc, border=True, wrap=True)
    for i, v in enumerate(vals):
        cell(ws, f"{get_column_letter(2+i)}{r}", v, F(9.5, bold, NAVY if bold else "1A1A19"), align="right", fmt=USDP, fillc=fillc, border=True)
    r += 1
cfr("Customer collections", M.CF_COLLECT)
cfr("Investor capital (T1 + T2)", [1000000, 0, 0, 0, 0])
cfr("Supplier payments — current-year purchases", [-v for v in M.CF_SUPP_CUR])
cfr("Supplier payments — prior-year balances (credit)", [-v for v in M.CF_SUPP_PRI])
cfr("Operating expenses (cash; Y1 incl. USD 50,000 one-time setup)", [-v for v in M.CF_OPEX])
cfr("Corporate tax paid (prior year, in arrears)", [-v for v in M.CF_TAX])
cfr("Dividends paid (100% of prior-year net profit)", [-v for v in M.CF_DIV])
cfr("Capex", [-v for v in M.CAPEX])
cfr("NET ANNUAL CASH FLOW", M.CF_NET, bold=True, fillc=MID)
cfr("CLOSING CASH POSITION", M.CF_CLOSE, bold=True, fillc=CREAM)
r += 1
cfr("MEMO — Trade receivables (Egypt, 1 month + Y1 export)", M.CF_RECV)
cfr("MEMO — Supplier balances payable next year", M.CF_PAYABLE)
r += 1
for line in [
 "STRENGTH — Sinosure-backed credit (10% down + 90% at 3-month credit) carries ~22.5% of each year's purchases into the next year; closing cash rises every year despite full dividend payout.",
 f"RISK — Year 1 depends on the raise: peak self-funded deficit USD {abs(M.PEAK_DEFICIT):,.0f} (Jan-27); the USD 1.0M raise covers it with a USD {M.MIN_CASH_WITH_RAISE:,.0f} minimum. The optional accelerator widens the buffer.",
 "NOTE — supplier payments are modelled on P&L COGS (export at 50%). If exports are re-based to the ~13% wholesale margin implied by the landed container cost, supplier outflows rise and net cash falls — see the Pricing Reference diligence note.",
]:
    cell(ws, f"A{r}", "• " + line, F(8.5, False, "5C5B57"), wrap=True); ws.merge_cells(f"A{r}:F{r}"); ws.row_dimensions[r].height = 26; r += 1

# ============================================================== 10. Market Detail
ws = wb.create_sheet("Market Detail"); ws.sheet_view.showGridLines = False
for col, w in zip("ABCDEF", [22, 11, 15, 9, 26, 46]): ws.column_dimensions[col].width = w
title(ws, "Market Detail — Vestwoods", "Container allocations, revenue, margins, terms and market actions per year", "F")
hdr(ws, 4, ["Market / Year", "Containers", "Revenue (USD)", "GM %", "Payment terms", "Key market action"])
r = 5
ACT = {
 "Egypt": ["Two showrooms live; dealer network build; I LOCK wholesale anchor", "Alexandria coverage via dealers; first C&I quotes", "Alexandria branch opens; telecom accounts", "B2G/tenders desk; C&I pipeline", "40+ dealer network; CKD assembly evaluation"],
 "Sudan": ["Committed buyer orders on arrival of first containers", "3 dealers; add Omdurman, El Obeid", "Telecom tower contracts", "C&I projects; Khartoum tenders", "Standalone Sudan office consideration"],
 "Algeria": ["First LC orders under negotiated agency (FOB Jebel Ali)", "Agency formalised; dealer sub-network", "Solar programme alignment", "C&I entries; coverage expansion", "Scale; assess in-country JV"],
 "Libya": ["—", "Sign Tripoli + Benghazi distributors", "Residential solar in outage districts", "C&I backup; NGO/health supply", "Secondary-city coverage"],
}
for mkt in ["Egypt", "Sudan", "Algeria", "Libya"]:
    cell(ws, f"A{r}", f"{mkt.upper()}", F(9.5, True, TEAL), fillc=LIGHT)
    for c in "BCDEF": ws[f"{c}{r}"].fill = PatternFill("solid", fgColor=LIGHT)
    r += 1
    gm = 0.210 if mkt == "Egypt" else 0.50
    terms = {"Egypt": "Retail + 30–60 day dealer terms", "Sudan": "50% advance + 50% on delivery",
             "Algeria": "100% LC before shipment", "Libya": "Advance / confirmed LC"}[mkt]
    for i in range(5):
        conts = M.VW_CONT[mkt][i]
        if conts == 0 and mkt == "Libya":
            cell(ws, f"A{r}", f"Year {i+1}", F(9), border=True); cell(ws, f"B{r}", "—", F(9), align="right", border=True)
            cell(ws, f"C{r}", 0, F(9), align="right", fmt=USD, border=True); cell(ws, f"D{r}", "—", F(9), align="right", border=True)
            cell(ws, f"E{r}", terms, F(8.5), border=True, wrap=True); cell(ws, f"F{r}", ACT[mkt][i], F(8.5), border=True, wrap=True); r += 1; continue
        cell(ws, f"A{r}", f"Year {i+1}", F(9), border=True)
        cell(ws, f"B{r}", conts, F(9), align="right", border=True)
        cell(ws, f"C{r}", M.VW_MARKET_REV[mkt][i], F(9), align="right", fmt=USD, border=True)
        cell(ws, f"D{r}", gm, F(9), align="right", fmt=PCT1, border=True)
        cell(ws, f"E{r}", terms, F(8.5), border=True, wrap=True)
        cell(ws, f"F{r}", ACT[mkt][i], F(8.5), border=True, wrap=True); r += 1
cell(ws, f"A{r}", "Sudan cash terms mean revenue is collected before/at shipment; Algeria LC-before-shipment carries zero receivable risk. Export GM shown at the 50% supply-pricing basis (see Pricing Reference diligence note).",
     F(8.5, True, TEAL)); ws.merge_cells(f"A{r}:F{r}"); ws.row_dimensions[r].height = 26

# ============================================================== 11. Funding & Returns
ws = wb.create_sheet("Funding & Returns"); ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 38
for c in "BCDEFG": ws.column_dimensions[c].width = 13.5
title(ws, "Funding Structure & Investor Returns",
      "USD 1,000,000 core for 50% of NORCO Egypt (T1 500K + T2 500K) | optional 500K accelerator | dividends 100% payout in arrears | terminal at 5× Year-5 net profit", "G")
r = 4
cell(ws, f"A{r}", "A.  TRANCHE STRUCTURE", F(11, True, TEAL)); r += 1
for j, h in enumerate(["Tranche", "Amount (USD)", "Timing", "Gate / purpose"]):
    cell(ws, f"{chr(65+j)}{r}", h, F(9, True, WHITE), align="center" if j else "left", fillc=NAVY, border=True)
for c in "EFG": cell(ws, f"{c}{r}", "", fillc=NAVY)
r += 1; start = r
for name, amt, t, p in M.TRANCHES:
    cell(ws, f"A{r}", name, F(9), border=True); cell(ws, f"B{r}", amt, F(9), align="right", fmt=USD, border=True)
    cell(ws, f"C{r}", t, F(9), wrap=True); ws.merge_cells(f"D{r}:G{r}"); cell(ws, f"D{r}", p, F(9), wrap=True, border=True)
    ws.row_dimensions[r].height = 26; r += 1
cell(ws, f"A{r}", "Core total (T1+T2)", F(9.5, True, NAVY), fillc=MID, border=True)
cell(ws, f"B{r}", f"=SUM(B{start}:B{start+1})", F(9.5, True, NAVY), align="right", fmt=USD, fillc=MID, border=True)
for c in "CDEFG": cell(ws, f"{c}{r}", "", fillc=MID)
r += 2
cell(ws, f"A{r}", "B.  INVESTOR CASH FLOW — 50% equity of NORCO Egypt for USD 1.0M", F(11, True, TEAL)); r += 1
for j, h in enumerate(["Flow (USD)", "Y0 (close)", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"]):
    cell(ws, f"{chr(65+j)}{r}", h, F(9, True, WHITE), align="center" if j else "left", fillc=NAVY, border=True)
r += 1; startc = r
NPr = PL_NP_ROW
flows = [
 ("Capital invested", ["=-B2", 0, 0, 0, 0, 0]),   # placeholder, set below
 ("Dividends (50% of prior-year net profit)", [0, 0,
   f"=0.5*{PL_SHEET}!B{NPr}", f"=0.5*{PL_SHEET}!C{NPr}", f"=0.5*{PL_SHEET}!D{NPr}", f"=0.5*{PL_SHEET}!E{NPr}"]),
 ("Terminal value (50% × 5 × Y5 net profit)", [0, 0, 0, 0, 0, f"=0.5*5*{PL_SHEET}!F{NPr}"]),
]
cap_r = startc
cell(ws, f"A{cap_r}", "Capital invested", F(9), border=True)
cell(ws, f"B{cap_r}", -M.RAISE, F(9), align="right", fmt=USDP, border=True)
for c in "CDEFG": cell(ws, f"{c}{cap_r}", 0, F(9), align="right", fmt=USDP, border=True)
r += 1
div_r = r; cell(ws, f"A{r}", "Dividends (50% of prior-year net profit)", F(9), border=True)
cell(ws, f"B{r}", 0, F(9), align="right", fmt=USDP, border=True); cell(ws, f"C{r}", 0, F(9), align="right", fmt=USDP, border=True)
for i, c in enumerate("DEFG"):
    plc = "BCDE"[i]; cell(ws, f"{c}{r}", f"=0.5*{PL_SHEET}!{plc}{NPr}", F(9), align="right", fmt=USDP, border=True)
r += 1
term_r = r; cell(ws, f"A{r}", "Terminal value (50% × 5 × Y5 net profit)", F(9), border=True)
for c in "BCDEF": cell(ws, f"{c}{r}", 0, F(9), align="right", fmt=USDP, border=True)
cell(ws, f"G{r}", f"=0.5*5*{PL_SHEET}!F{NPr}", F(9), align="right", fmt=USDP, border=True)
r += 1
net_r = r; cell(ws, f"A{r}", "Net investor cash flow", F(9.5, True, NAVY), fillc=MID, border=True)
for c in "BCDEFG": cell(ws, f"{c}{r}", f"=SUM({c}{cap_r}:{c}{term_r})", F(9.5, True, NAVY), align="right", fmt=USDP, fillc=MID, border=True)
r += 1
cell(ws, f"A{r}", "IRR — incl. terminal value", F(10, True, GOLD), border=True)
cell(ws, f"B{r}", f"=IRR(B{net_r}:G{net_r})", F(11, True, GOLD), align="right", fmt=PCT1, border=True)
cell(ws, f"D{r}", "MOIC", F(10, True, GOLD), border=True)
cell(ws, f"E{r}", f"=SUM(C{net_r}:G{net_r})/-B{net_r}", F(11, True, GOLD), align="right", fmt='0.00"x"', border=True)
r += 1
cell(ws, f"A{r}", "IRR — dividends only (excl. terminal)", F(10, True, GOLD), border=True)
cell(ws, f"B{r}", M.INV_IRR_DIV, F(11, True, GOLD), align="right", fmt=PCT1, border=True)
cell(ws, f"D{r}", "MOIC", F(10, True, GOLD), border=True)
cell(ws, f"E{r}", M.INV_MOIC_DIV, F(11, True, GOLD), align="right", fmt='0.00"x"', border=True)
r += 2
cell(ws, f"A{r}", "C.  INVESTOR PROTECTIONS", F(11, True, TEAL)); r += 1
for p in [
 "Tranche 2 released only against verified Month-4 milestones (≥3 containers sold through + Sudan advances received).",
 "Quarterly management accounts; monthly cash & inventory reporting; USD-denominated books.",
 "Egypt customers on max 60-day terms; Sudan cash-before-shipment; Algeria LC only; Libya advance/LC.",
 "Exclusive Vestwoods agency (first right of engagement + non-circumvention) held within the group; assignable as security.",
 "Founder pre-investment of USD 14,517 already deployed; board seat and reserved matters for the investor.",
]:
    cell(ws, f"A{r}", "• " + p, F(9, False, "5C5B57"), wrap=True); ws.merge_cells(f"A{r}:G{r}"); ws.row_dimensions[r].height = 22; r += 1

# ============================================================== 12. Shareholding
ws = wb.create_sheet("Shareholding"); ws.sheet_view.showGridLines = False
for col, w in zip("ABC", [44, 16, 64]): ws.column_dimensions[col].width = w
title(ws, "Shareholding — NORCO Egypt (the investment vehicle)", "Investor subscribes into the Egypt operating company; NORCO UAE anchors the Vestwoods agency as a 20% shareholder", "C")
hdr(ws, 4, ["Shareholder", "NORCO Egypt %", "Notes"])
r = 5
for name, pct, note in M.SHAREHOLDING:
    cell(ws, f"A{r}", name, F(9.5), border=True, wrap=True)
    cell(ws, f"B{r}", pct, F(9.5), align="right", fmt=PCT0, border=True)
    cell(ws, f"C{r}", note, F(9, False, "5C5B57"), border=True, wrap=True); ws.row_dimensions[r].height = 24; r += 1
cell(ws, f"A{r}", "TOTAL", F(10, True, NAVY), fillc=MID, border=True)
cell(ws, f"B{r}", f"=SUM(B5:B{r-1})", F(10, True, NAVY), align="right", fmt=PCT0, fillc=MID, border=True)
ws[f"C{r}"].fill = PatternFill("solid", fgColor=MID); r += 2
for line in [
 "Founder-side combined interest = 40%: 20% held directly by the Chairman + 20% held via NORCO General Trading L.L.C. (UAE), which he controls.",
 "NORCO UAE contributes the exclusive Vestwoods agency to the Egypt company under a long-term agreement.",
 "Dividend policy: 100% of net profit distributed annually in arrears — investor receives 50% of every distribution.",
]:
    cell(ws, f"A{r}", "• " + line, F(9, False, "5C5B57"), wrap=True); ws.merge_cells(f"A{r}:C{r}"); ws.row_dimensions[r].height = 26; r += 1

# ============================================================== 13. Dashboard
ws = wb.create_sheet("Dashboard"); ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 40; ws.column_dimensions["B"].width = 18
for c in "CDEFGH": ws.column_dimensions[c].width = 12
title(ws, "Investor Dashboard", "Headline metrics — NORCO Egypt, Vestwoods only", "H")
metrics = [
 ("Total 5-year revenue (USD)", f"=SUM({PL_SHEET}!B{PL_REV_ROW}:F{PL_REV_ROW})", USD),
 ("Total 5-year net profit (USD)", f"=SUM({PL_SHEET}!B{NPr}:F{NPr})", USD),
 ("Year 1 revenue (USD)", f"={PL_SHEET}!B{PL_REV_ROW}", USD),
 ("Year 1 net profit (USD)", f"={PL_SHEET}!B{NPr}", USD),
 ("Year 5 net profit (USD)", f"={PL_SHEET}!F{NPr}", USD),
 ("Operating break-even", "Month 6 (Jan-27)", None),
 ("Cumulative break-even", "Month 6 (Jan-27)", None),
 ("Peak self-funded cash deficit (USD)", abs(M.PEAK_DEFICIT), USD),
 ("Year-1 ending cash with raise (USD)", M.Y1_END_CASH, USD),
 ("Year-5 closing cash (USD)", M.CF_CLOSE[4], USD),
 ("Investment (USD, for 50% of NORCO Egypt)", M.RAISE, USD),
 ("Investor IRR (dividends + terminal)", M.INV_IRR, PCT1),
 ("Investor MOIC (dividends + terminal)", M.INV_MOIC, '0.00"x"'),
 ("Investor IRR / MOIC (dividends only)", M.INV_IRR_DIV, PCT1),
 ("Founder pre-operational investment (USD)", 14517, USD),
]
r = 4
for label, v, fmt in metrics:
    cell(ws, f"A{r}", label, F(9.5, True, NAVY), border=True)
    cell(ws, f"B{r}", v, F(10, True, TEAL if fmt else "1A1A19"), align="right", fmt=fmt, border=True); r += 1
r += 1
cell(ws, f"A{r}", "Chart data (USD)", F(8.5, True, "5C5B57")); r += 1
yr_r = r; cell(ws, f"A{r}", "Year", F(8.5, True))
for i, y in enumerate(["Y1", "Y2", "Y3", "Y4", "Y5"]): cell(ws, f"{get_column_letter(2+i)}{r}", y, F(8.5, True), align="center")
r += 1
rev_dr = r; cell(ws, f"A{r}", "Revenue", F(8.5))
for i in range(5): cell(ws, f"{get_column_letter(2+i)}{r}", M.REV[i], F(8.5), align="right", fmt=USD)
r += 1
gp_dr = r; cell(ws, f"A{r}", "Gross profit", F(8.5))
for i in range(5): cell(ws, f"{get_column_letter(2+i)}{r}", M.GP[i], F(8.5), align="right", fmt=USD)
r += 1
np_dr = r; cell(ws, f"A{r}", "Net profit", F(8.5))
for i in range(5): cell(ws, f"{get_column_letter(2+i)}{r}", M.NP[i], F(8.5), align="right", fmt=USD)
chart = BarChart(); chart.type = "col"; chart.title = "Revenue, gross profit & net profit (USD)"; chart.height = 8; chart.width = 16
cats = Reference(ws, min_col=2, min_row=yr_r, max_col=6)
chart.add_data(Reference(ws, min_col=2, min_row=rev_dr, max_row=np_dr, max_col=6), from_rows=True)
chart.set_categories(cats)
for idx, (nm, col) in enumerate([("Revenue", NAVY), ("Gross profit", TEAL), ("Net profit", GOLD)]):
    chart.series[idx].tx = SeriesLabel(v=nm); chart.series[idx].graphicalProperties.solidFill = col
chart.x_axis.delete = False; chart.y_axis.delete = False
ws.add_chart(chart, "D4")

wb.save(OUT)
print("Saved", OUT)
