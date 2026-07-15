# -*- coding: utf-8 -*-
"""Build NORCO_Group_Investor_Model.xlsx — V5, mirrors the structure of the
founder's Vestwoods Investor Model V4, extended to both divisions."""
import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.chart import BarChart, LineChart, Reference
from openpyxl.chart.series import SeriesLabel
from openpyxl.utils import get_column_letter
import model as M

OUT = os.path.join(os.path.dirname(__file__), "..", "NORCO_Group_Investor_Model.xlsx")

NAVY = "0F2942"; TEAL = "0F6E6A"; GOLD = "C8892A"; LIGHT = "F3F5F7"
BLUE = "2A78D6"; AQUA = "1BAF7A"; MID = "E9EDF0"; WHITE = "FFFFFF"; CREAM = "FFF4DF"

wb = openpyxl.Workbook()
thin = Side(style="thin", color="D8DCE0")
BORDER = Border(left=thin, right=thin, top=thin, bottom=thin)

def F(sz=10, b=False, color="1A1A19"):
    return Font(name="Calibri", size=sz, bold=b, color=color)

def cell(ws, ref, val, font=None, align=None, fmt=None, fillc=None, border=False, wrap=False):
    c = ws[ref]; c.value = val
    if font: c.font = font
    if fillc: c.fill = PatternFill("solid", fgColor=fillc)
    if align or wrap:
        c.alignment = Alignment(horizontal=align or "left", vertical="center", wrap_text=wrap)
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

USD = '#,##0'
USDP = '#,##0;(#,##0)'
PCT1 = '0.0%'
PCT0 = '0%'

COLS12 = [get_column_letter(2+i) for i in range(12)]   # B..M months
TOTCOL = "N"

def month_row(ws, r, label, vals, bold=False, fillc=None, fmt=USDP, label_font=None,
              total=None, size=9):
    cell(ws, f"A{r}", label, label_font or F(size, bold, NAVY if bold else "1A1A19"),
         fillc=fillc, border=True, wrap=True)
    for i, v in enumerate(vals):
        cell(ws, f"{COLS12[i]}{r}", v, F(size, bold, NAVY if bold else "1A1A19"),
             align="right", fmt=fmt, fillc=fillc, border=True)
    t = total if total is not None else f"=SUM(B{r}:M{r})"
    cell(ws, f"{TOTCOL}{r}", t, F(size, True, NAVY), align="right", fmt=fmt,
         fillc=fillc or MID, border=True)

# ============================================================== 1. ReadMe
ws = wb.active; ws.title = "ReadMe"
ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 26; ws.column_dimensions["B"].width = 100
title(ws, "NORCO — Group Investor Model V5", "Vestwoods (Haier Energy) + Al Reem Plastics (Angola) | Investment into NORCO Egypt | Aug 2026 – Jul 2031", "B")
rows = [
 ("Purpose", "Investor-grade 5-year model for NORCO's two-division distribution platform. The investor invests USD 1,500,000 into the EGYPT operating company for 50% of its shares."),
 ("Divisions & markets", "Vestwoods lithium BESS: Egypt, Sudan, Algeria, Libya. Al Reem Plastics houseware (sourced from the Al Reem plant in Angola on affiliated terms): Egypt and Sudan."),
 ("Vestwoods economics", "40ft container of 340 units. COGS = 72% of revenue at retail, 87% at wholesale (verified pricing list). Egypt sells 50% retail / 50% wholesale; all export markets wholesale-only."),
 ("Al Reem economics", "40ft container of 20,488 units / 69 SKUs (July-2026 packing list), landed cost USD 59,343. NORCO buys 30% below price list: margin = 30% of retail revenue, 20% of wholesale revenue. Egypt 50/50 retail-wholesale; Sudan wholesale-only."),
 ("Container plan", "Vestwoods — Egypt 6/7/9/11/15, Sudan 4/5/6/8/10, Algeria 3/4/6/7/8, Libya 0/4/5/6/8. Al Reem — Egypt 10/12/15/18/20, Sudan 5/8/10/12/15 (Y1..Y5)."),
 ("Investment ask", "USD 1,500,000 (funding requirement band USD 1.0M – 1.5M). Tranche 1 USD 1.0M at close (Aug-26); Tranche 2 USD 0.5M at Month 4, milestone-gated."),
 ("Shareholding", "NORCO Egypt: Investor 50% | NORCO UAE 20% | Founder 20% | Partner A 5% | Partner B 5%. Founder-side combined interest 40% (20% direct + 20% via NORCO UAE)."),
 ("Currency & FX", "USD throughout. Planning rate USD 1 = EGP 53. Corporate tax 22.5% on net profit; Year-1 tax computed with loss carry-forward."),
 ("Supplier terms", "Vestwoods Year 1: 100% payment before shipment; from Month 13: 10% down + 90% at 3-month credit. Al Reem (affiliate): paid against shipping documents."),
 ("Sheets", "Key Assumptions | Pre-Op Investment | Pricing Reference | Staff Plan | Monthly P&L Year 1 | Annual P&L Summary Y1-Y5 | Cash Flow Year 1 | 5Y Cash Flow | Market Detail | Funding & Returns | Shareholding | Dashboard"),
 ("Version", "V5 (Group) — 14 July 2026. Strictly Private & Confidential. Prepared by Fadi Jannan, Managing Director."),
]
r = 4
for k, v in rows:
    cell(ws, f"A{r}", k, F(10, True, NAVY))
    cell(ws, f"B{r}", v, F(9.5), wrap=True)
    ws.row_dimensions[r].height = 34; r += 1

# ============================================================== 2. Key Assumptions
ws = wb.create_sheet("Key Assumptions")
ws.sheet_view.showGridLines = False
for col, w in zip("ABC", [40, 34, 62]): ws.column_dimensions[col].width = w
title(ws, "Key Assumptions", "Corrected plan basis — July 2026 | Blue = key input", "C")
hdr(ws, 4, ["Parameter", "Value", "Notes"], size=9.5)
KA = [
 ("► GENERAL", None, None),
 ("Business start", "August 2026", "Month 1 = Aug-26; fiscal years run Aug–Jul"),
 ("Scope", "Two divisions on one platform", "Vestwoods (Haier Energy) BESS + Al Reem Plastics houseware"),
 ("Investment vehicle", "NORCO Egypt (operating company)", "Investor subscribes for 50% of NORCO Egypt; NORCO UAE holds 20%"),
 ("FX planning rate", "USD 1 = EGP 53", "Conservative vs spot ~49–51"),
 ("Corporate tax", "22.5% on net profit", "Loss carry-forward applied in Year 1"),
 ("► VESTWOODS", None, None),
 ("Markets", "Egypt, Sudan, Algeria, Libya", "Egypt retail+wholesale; exports wholesale-only"),
 ("Container", f"340 units / 40ft, COGS USD {M.VW_CONT_COGS:,.0f}", "Supplier prepay USD 239,805 + local import costs USD 102,511"),
 ("COGS — retail", "72% of revenue", f"Container retail value USD {M.VW_CONT_RETAIL:,.0f}"),
 ("COGS — wholesale", "87% of revenue", f"Container wholesale value USD {M.VW_CONT_WHOLESALE:,.0f}"),
 ("Egypt mix", "50% retail / 50% wholesale", f"Blended Egypt revenue USD {M.VW_CONT_EGYPT:,.0f}/container (21.0% GM)"),
 ("Container plan Y1→Y5", "Egypt 6→15 | Sudan 4→10 | Algeria 3→8 | Libya 0→8", "41 containers by Year 5"),
 ("Supplier terms Y1", "100% payment before shipment", "Drives the working-capital need and the raise"),
 ("Supplier terms Y2+", "10% down + 90% at 3-month credit", "From Month 13 — releases ~90% of container capital"),
 ("► AL REEM PLASTICS (ANGOLA)", None, None),
 ("Markets", "Egypt and Sudan", "Export corridors expand later"),
 ("Sourcing", "Affiliated plant in Angola — 30% below price list", "Margin = 30% of retail revenue / 20% of wholesale revenue"),
 ("Container", f"{M.AR_UNITS:,} units / {M.AR_SKUS} SKUs, landed cost USD {M.AR_CONT_COST:,}", "Priced line-by-line from the July-2026 Egypt packing list"),
 ("Egypt revenue / container", f"USD {M.AR_CONT_EGYPT:,.0f} (50/50 retail-wholesale)", "GM 25.3% blended"),
 ("Sudan revenue / container", f"USD {M.AR_CONT_WHOLESALE:,.0f} (wholesale)", "GM 20.0%; 50% advance + 50% on delivery"),
 ("Container plan Y1→Y5", "Egypt 10→20 | Sudan 5→15", "35 containers by Year 5"),
 ("► CUSTOMER TERMS", None, None),
 ("Egypt customers", "30–60 days (avg 45); 1-month collection lag", "Invoice on delivery"),
 ("Sudan", "50% advance at order + 50% on delivery", "Cash before/at shipment"),
 ("Algeria", "100% LC before shipment (FOB Jebel Ali)", "Licensed importer; zero in-country exposure"),
 ("Libya", "Advance / confirmed LC", "From Year 2, dual-hub distributors"),
 ("► FACILITIES & STAFF", None, None),
 ("Showroom #1", "6th October City — OPERATIONAL", "EGP 10,000/mo = USD 200; renovated & furnished"),
 ("Showroom #2", "New Cairo ~100 sqm — opens Month 1", "USD 3,500/month"),
 ("Office", "New Cairo, ~100 sqm furnished", "USD 3,000/month"),
 ("Warehouse", "300–700 sqm — 6th Oct / Sheikh Zayed / New Cairo", "USD 3,000/month; located on best available cost"),
 ("Sales compensation", "Salary + 4% commission on Egypt sales", "Commission on both divisions' Egypt revenue"),
 ("Headcount", "19 (M12) → 55 (Year 5)", "Full roster in Staff Plan sheet"),
 ("► FUNDING", None, None),
 ("Investment", "USD 1,500,000 for 50% of NORCO Egypt", "Band USD 1.0M – 1.5M; two tranches"),
 ("Peak funding need", f"USD {abs(M.PEAK_DEFICIT):,.0f} (self-funded deficit)", "Covered by the raise with buffer; min cash +USD %s" % f"{M.MIN_CASH_WITH_RAISE:,.0f}"),
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
    ws.row_dimensions[r].height = 24
    r += 1

# ============================================================== 3. Pre-Op Investment (as is)
ws = wb.create_sheet("Pre-Op Investment")
ws.sheet_view.showGridLines = False
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
    cell(ws, f"A{r}", d, F(9.5), border=True, wrap=True)
    cell(ws, f"B{r}", dt, F(9.5), border=True)
    cell(ws, f"C{r}", orig, F(9.5), align="right", border=True)
    cell(ws, f"D{r}", usd, F(9.5), align="right", fmt=USD, border=True)
    cell(ws, f"E{r}", cat, F(9, False, "5C5B57"), border=True)
    r += 1
cell(ws, f"A{r}", "TOTAL PRE-OPERATIONAL INVESTMENT", F(10, True, NAVY), fillc=MID, border=True)
for col in "BCE": ws[f"{col}{r}"].fill = PatternFill("solid", fgColor=MID)
cell(ws, f"D{r}", f"=SUM(D5:D{r-1})", F(10, True, NAVY), align="right", fmt=USD, fillc=MID, border=True)
r += 2
cell(ws, f"A{r}", "Note: EGP 31,948.50 of product stock was purchased and sold through the operating showroom before launch — live proof of demand at the retail point of sale.",
     F(9, True, TEAL)); ws.merge_cells(f"A{r}:E{r}")

# ============================================================== 4. Pricing Reference
ws = wb.create_sheet("Pricing Reference")
ws.sheet_view.showGridLines = False
for col, w in zip("ABCDEFGH", [14, 34, 12, 12, 12, 12, 13, 13]): ws.column_dimensions[col].width = w
title(ws, "Pricing Reference — Both Divisions",
      "Vestwoods verified pricing (EGP 53 = USD 1) | Al Reem container economics from the July-2026 packing list", "H")
cell(ws, "A4", "A.  VESTWOODS — verified unit pricing (USD)", F(11, True, TEAL))
hdr(ws, 5, ["Model", "Description", "Qty / 40ft", "Factory", "COGS", "Wholesale", "Retail USD", "Retail EGP"])
r = 6
for model, desc, qty, fac, cogs, whl, ret in M.VW_MIX:
    cell(ws, f"A{r}", model, F(9), border=True)
    cell(ws, f"B{r}", desc, F(9), border=True)
    cell(ws, f"C{r}", qty, F(9), align="right", fmt=USD, border=True)
    cell(ws, f"D{r}", fac, F(9), align="right", fmt=USD, border=True)
    cell(ws, f"E{r}", cogs, F(9), align="right", fmt=USD, border=True)
    cell(ws, f"F{r}", whl, F(9), align="right", fmt=USD, border=True)
    cell(ws, f"G{r}", ret, F(9), align="right", fmt=USD, border=True)
    cell(ws, f"H{r}", round(ret*M.FX), F(9), align="right", fmt=USD, border=True)
    r += 1
cell(ws, f"A{r}", "CONTAINER TOTALS (340 units)", F(9.5, True, NAVY), fillc=MID, border=True)
cell(ws, f"B{r}", "40ft FCL China → Alexandria", F(9, True, NAVY), fillc=MID, border=True)
cell(ws, f"C{r}", f"=SUM(C6:C{r-1})", F(9.5, True, NAVY), align="right", fmt=USD, fillc=MID, border=True)
cell(ws, f"D{r}", M.VW_CONT_SUPPLIER-6865, F(9.5, True, NAVY), align="right", fmt=USD, fillc=MID, border=True)
cell(ws, f"E{r}", M.VW_CONT_COGS, F(9.5, True, NAVY), align="right", fmt=USD, fillc=MID, border=True)
cell(ws, f"F{r}", round(M.VW_CONT_WHOLESALE), F(9.5, True, NAVY), align="right", fmt=USD, fillc=MID, border=True)
cell(ws, f"G{r}", round(M.VW_CONT_RETAIL), F(9.5, True, NAVY), align="right", fmt=USD, fillc=MID, border=True)
ws[f"H{r}"].fill = PatternFill("solid", fgColor=MID)
r += 1
notes = [
 "COGS includes freight (USD 6,865/40ft), 5% duty, 2% GOEIC, handling — the full landed basis.",
 f"Margins: wholesale price = COGS ÷ 0.87 (13.1% GM) | retail = COGS ÷ 0.724 (27.6% GM).",
 f"Egypt container revenue (50% retail / 50% wholesale): USD {M.VW_CONT_EGYPT:,.0f} — GM USD {M.VW_GP_EGYPT:,.0f} (21.0%).",
 f"Export container revenue (wholesale): USD {M.VW_CONT_WHOLESALE:,.0f} — GM USD {M.VW_GP_EXPORT:,.0f} (13.1%).",
]
for n in notes:
    cell(ws, f"A{r}", "• " + n, F(8.5, False, "5C5B57")); ws.merge_cells(f"A{r}:H{r}"); r += 1
r += 1
cell(ws, f"A{r}", "B.  AL REEM PLASTICS — container economics (Angola, affiliated supply)", F(11, True, TEAL)); r += 1
hdr(ws, r, ["Measure", "Value (USD)", "", "", "", "", "", ""], fillc=TEAL); r += 1
AR_ROWS = [
 ("Units per 40ft container (69 SKUs, Jul-2026 packing list)", M.AR_UNITS, USD),
 ("Landed cost per container (30% below price list)", M.AR_CONT_COST, USD),
 ("Retail value per container (margin 30% of revenue)", round(M.AR_CONT_RETAIL), USD),
 ("Wholesale value per container (margin 20% of revenue)", round(M.AR_CONT_WHOLESALE), USD),
 ("Egypt revenue per container (50/50 retail-wholesale)", round(M.AR_CONT_EGYPT), USD),
 ("Egypt gross profit per container", round(M.AR_GP_EGYPT), USD),
 ("Sudan gross profit per container (wholesale)", round(M.AR_GP_SUDAN), USD),
]
for label, v, fmt in AR_ROWS:
    cell(ws, f"A{r}", label, F(9.5), border=True, wrap=True)
    ws.merge_cells(f"A{r}:A{r}")
    cell(ws, f"B{r}", v, F(9.5), align="right", fmt=fmt, border=True)
    r += 1
cell(ws, f"A{r}", "Representative retail prices (USD → EGP): 90L waste bin 16.40 → 869 | Clothes drier 28.71 → 1,522 | Laundry basket w/ lid 14.19 → 752 | 8L food container 4.27 → 226.",
     F(8.5, False, "5C5B57")); ws.merge_cells(f"A{r}:H{r}")

# ============================================================== 5. Staff Plan (as is)
ws = wb.create_sheet("Staff Plan")
ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 30; ws.column_dimensions["B"].width = 11
for c in COLS12: ws.column_dimensions[c].width = 9
ws.column_dimensions[TOTCOL].width = 11
title(ws, "Staffing Plan & Monthly Payroll (USD)",
      "Phased hiring | Base salaries (pre-15% benefits) | Year 1 monthly detail | Years 2–5 annual rosters", TOTCOL)
hdr(ws, 4, ["ROLE", "Monthly Salary"] + M.MONTHS[:12] + ["Y1 Total"][0:1], size=8)
# header: A role, B salary, C..N months... adjust: months in C..N
ws.delete_rows(4)
hdr4 = ["ROLE", "Monthly\nSalary"] + M.MONTHS + ["Y1 Total"]
for i, lab in enumerate(hdr4):
    cell(ws, f"{get_column_letter(1+i)}4", lab, F(8, True, WHITE), align="center" if i else "left",
         fillc=NAVY, border=True, wrap=True)
Y1_ROSTER = [  # role, salary, start month index (0=Aug)
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
    cell(ws, f"A{r}", role, F(8.5), border=True)
    cell(ws, f"B{r}", sal, F(8.5), align="right", fmt=USD, border=True)
    for mi in range(12):
        v = sal if mi >= start else "–"
        cell(ws, f"{get_column_letter(3+mi)}{r}", v, F(8.5), align="right",
             fmt=USD if isinstance(v, int) else None, border=True)
    cell(ws, f"{get_column_letter(15)}{r}", sal * (12-start), F(8.5, True), align="right", fmt=USD, border=True)
    r += 1
totrow = r
cell(ws, f"A{r}", "TOTAL BASE SALARIES", F(9, True, NAVY), fillc=MID, border=True)
ws[f"B{r}"].fill = PatternFill("solid", fgColor=MID)
for mi in range(12):
    col = get_column_letter(3+mi)
    cell(ws, f"{col}{r}", f"=SUM({col}5:{col}{r-1})", F(8.5, True, NAVY), align="right", fmt=USD, fillc=MID, border=True)
cell(ws, f"O{r}", f"=SUM(O5:O{r-1})", F(8.5, True, NAVY), align="right", fmt=USD, fillc=MID, border=True)
r += 1
cell(ws, f"A{r}", "Social Insurance & Benefits (15%)", F(8.5), border=True)
ws[f"B{r}"].border = BORDER
for mi in range(12):
    col = get_column_letter(3+mi)
    cell(ws, f"{col}{r}", f"={col}{totrow}*0.15", F(8.5), align="right", fmt=USD, border=True)
cell(ws, f"O{r}", f"=O{totrow}*0.15", F(8.5, True), align="right", fmt=USD, border=True)
r += 1
cell(ws, f"A{r}", "TOTAL PERSONNEL (base + benefits)", F(9, True, NAVY), fillc=CREAM, border=True)
ws[f"B{r}"].fill = PatternFill("solid", fgColor=CREAM)
for mi in range(12):
    col = get_column_letter(3+mi)
    cell(ws, f"{col}{r}", f"={col}{totrow}*1.15", F(8.5, True, NAVY), align="right", fmt=USD, fillc=CREAM, border=True)
cell(ws, f"O{r}", f"=O{totrow}*1.15", F(8.5, True, NAVY), align="right", fmt=USD, fillc=CREAM, border=True)
r += 2
cell(ws, f"A{r}", "Sales commissions (4% of Egypt sales, both divisions) are variable pay on top — see Monthly P&L. Headcount reaches 21 by Month 12.",
     F(8.5, False, "5C5B57")); ws.merge_cells(f"A{r}:O{r}"); r += 2

# Y2-Y5 rosters (compact, as attached)
Y_ROSTERS = [
 ("YEAR 2 (Aug 2027 – Jul 2028) — 26 staff", 435600,
  "+ Administrative Asst #3, Logistics Coordinator, Sales Staff #5–6, Customer Service Manager, Technical Specialist, Driver #3"),
 ("YEAR 3 (Aug 2028 – Jul 2029) — 35 staff", 555600,
  "+ Alexandria Branch (manager, 2 sales, admin), Finance Analyst, Supply Chain Analyst, Senior Sales Executive, Installation Engineers #1–2"),
 ("YEAR 4 (Aug 2029 – Jul 2030) — 44 staff", 690000,
  "+ B2G/Tenders Manager, C&I Sales Manager + 2 staff, Senior Accountant, IT/CRM Administrator, Warehouse Staff #3, Maintenance Technician, Sudan Market Coordinator"),
 ("YEAR 5 (Aug 2030 – Jul 2031) — 55 staff (senior raises applied)", 942000,
  "+ Libya Market Manager, Senior Marketing Manager, Sales Supervisor, C&I Sales #3–4, Field Engineers #3–4, Legal & Compliance, CRM & Digital Marketing Specialists, Driver #4"),
]
egypt_rev = M.EGYPT_SALES
for i, (label, base, additions) in enumerate(Y_ROSTERS):
    yr = i + 1
    cell(ws, f"A{r}", label, F(10, True, TEAL)); ws.merge_cells(f"A{r}:O{r}"); r += 1
    cell(ws, f"A{r}", "Additions", F(8.5, True), border=True)
    cell(ws, f"B{r}", additions, F(8.5), wrap=True); ws.merge_cells(f"B{r}:O{r}")
    ws.row_dimensions[r].height = 24; r += 1
    for lab, val, fmt in [
        ("Total base salaries (annual)", base, USD),
        ("Social insurance & benefits (15%)", round(base*0.15), USD),
        ("Personnel sub-total", round(base*1.15), USD),
        (f"Sales commissions (4% of Egypt sales USD {egypt_rev[yr]:,.0f})", M.COMMISSION[yr], USD),
        ("TOTAL ANNUAL PERSONNEL COST", M.PERSONNEL[yr], USD)]:
        bold = lab.startswith("TOTAL")
        cell(ws, f"A{r}", lab, F(8.5, bold, NAVY if bold else "1A1A19"),
             fillc=MID if bold else None, border=True)
        cell(ws, f"B{r}", val, F(8.5, bold, NAVY if bold else "1A1A19"), align="right",
             fmt=fmt, fillc=MID if bold else None, border=True)
        r += 1
    r += 1

# ============================================================== 6. Monthly P&L Year 1
ws = wb.create_sheet("Monthly P&L Year 1")
ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 46
for c in COLS12: ws.column_dimensions[c].width = 10.5
ws.column_dimensions[TOTCOL].width = 12
title(ws, "Monthly Profit & Loss Statement — Year 1 (August 2026 – July 2027)",
      "Both divisions | USD | Egypt COGS: Vestwoods 79.0% blended, Al Reem 74.7% blended | Exports wholesale: Vestwoods 87%, Al Reem 80%", TOTCOL)
hdr(ws, 4, ["DESCRIPTION"] + M.MONTHS + ["TOTAL\nYear 1"], size=8.5)
r = 5
def sect(label):
    global r
    cell(ws, f"A{r}", label, F(9, True, TEAL), fillc=LIGHT)
    for c in COLS12 + [TOTCOL]: ws[f"{c}{r}"].fill = PatternFill("solid", fgColor=LIGHT)
    r += 1

sect("REVENUE")
month_row(ws, r, "Egypt — Vestwoods (6 containers)", M.M_VW_EGYPT); r += 1
month_row(ws, r, "Egypt — Al Reem Plastics (10 containers)", M.M_AR_EGYPT); r += 1
month_row(ws, r, "Sudan — Vestwoods (4 containers)", M.M_VW_SUDAN); r += 1
month_row(ws, r, "Sudan — Al Reem Plastics (5 containers)", M.M_AR_SUDAN); r += 1
month_row(ws, r, "Algeria — Vestwoods, 100% LC (3 containers)", M.M_VW_ALG); r += 1
month_row(ws, r, "TOTAL REVENUE", M.M_REV, bold=True, fillc=MID); REV_R = r; r += 1
sect("COST OF GOODS SOLD")
m_cogs_vw_eg = [round(v * (M.VW_CONT_COGS / M.VW_CONT_EGYPT)) for v in M.M_VW_EGYPT]
m_cogs_ar_eg = [round(v * (M.AR_CONT_COST / M.AR_CONT_EGYPT)) for v in M.M_AR_EGYPT]
m_cogs_exp_vw = [round((M.M_VW_SUDAN[i] + M.M_VW_ALG[i]) * M.VW_COGS_WHOLESALE_PCT) for i in range(12)]
m_cogs_ar_sd = [round(v * 0.80) for v in M.M_AR_SUDAN]
month_row(ws, r, "Vestwoods Egypt COGS (79.0% — 50% retail / 50% wholesale)", m_cogs_vw_eg); r += 1
month_row(ws, r, "Al Reem Egypt COGS (74.7% — 50% retail / 50% wholesale)", m_cogs_ar_eg); r += 1
month_row(ws, r, "Vestwoods export COGS (87% wholesale)", m_cogs_exp_vw); r += 1
month_row(ws, r, "Al Reem Sudan COGS (80% wholesale)", m_cogs_ar_sd); r += 1
month_row(ws, r, "TOTAL COGS", M.M_COGS, bold=True, fillc=MID); r += 1
month_row(ws, r, "GROSS PROFIT", M.M_GP, bold=True, fillc=CREAM); GP_R = r; r += 1

sect("OPERATING EXPENSES — PERSONNEL")
month_row(ws, r, "Total base salaries (Staff Plan roster)", M.M_BASE); r += 1
month_row(ws, r, "Social insurance & benefits (15%)", M.M_BEN); r += 1
month_row(ws, r, "Sales commissions (4% of Egypt sales, both divisions)", M.M_COMM); r += 1
month_row(ws, r, "TOTAL PERSONNEL", M.M_PERSONNEL, bold=True, fillc=MID); r += 1
sect("OPERATING EXPENSES — FACILITIES")
sh1 = [200]*12; sh2 = [3500]*12; off = [6000]+[3000]*11; wh = [3000]*12
util = [400, 400] + [700]*10
month_row(ws, r, "Showroom #1 — 6th October City (existing, EGP 10,000/mo)", sh1); r += 1
month_row(ws, r, "Showroom #2 — New Cairo ~100 sqm (opens Month 1)", sh2); r += 1
month_row(ws, r, "Office — New Cairo 100 sqm furnished", off); r += 1
month_row(ws, r, "Warehouse — 6th Oct / Sheikh Zayed / New Cairo (300–700 sqm)", wh); r += 1
month_row(ws, r, "Utilities", util); r += 1
month_row(ws, r, "TOTAL FACILITIES", M.M_FACILITIES, bold=True, fillc=MID); r += 1
sect("OPERATING EXPENSES — OPERATIONS, MARKETING, G&A")
month_row(ws, r, "Vehicles & fuel", M.M_OPS); r += 1
month_row(ws, r, "Marketing & promotions (incl. exhibitions M3)", M.M_MKT); r += 1
month_row(ws, r, "General & administrative", M.M_GA); r += 1
month_row(ws, r, "Depreciation & amortisation (fit-out, 3-yr)", M.M_DA); r += 1
month_row(ws, r, "TOTAL OPERATING EXPENSES", M.M_OPEX, bold=True, fillc=MID); r += 1
month_row(ws, r, "EBIT (OPERATING PROFIT)", M.M_EBIT, bold=True); r += 1
month_row(ws, r, "Interest on trade finance (est.)", M.M_INT); r += 1
month_row(ws, r, "EARNINGS BEFORE TAX", M.M_EBT, bold=True); r += 1
# monthly tax with loss carry-forward
m_tax = []; cum = 0.0; paid = 0.0
for e in M.M_EBT:
    cum += e
    t = max(0.0, cum * M.TAX - paid); paid += t; m_tax.append(round(t))
month_row(ws, r, "Corporate tax (22.5%, loss carry-forward)", m_tax); r += 1
m_np = [M.M_EBT[i] - m_tax[i] for i in range(12)]
month_row(ws, r, "NET PROFIT / (LOSS)", m_np, bold=True, fillc=CREAM); r += 1
cumnp = []; s = 0
for v in m_np: s += v; cumnp.append(s)
month_row(ws, r, "Cumulative profit / (loss)", cumnp, total=cumnp[-1]); r += 2
cell(ws, f"A{r}", "Operating break-even: Month 4 (Nov-26). Cumulative break-even: Month 8 (Mar-27). "
     "Egypt Y1: Vestwoods 6 + Al Reem 10 containers | Sudan: 4 + 5 | Algeria: 3 (LC).",
     F(8.5, True, TEAL)); ws.merge_cells(f"A{r}:N{r}")

# ============================================================== 7. Annual P&L Summary
ws = wb.create_sheet("Annual P&L Summary Y1-Y5")
ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 42
for c in "BCDEFG": ws.column_dimensions[c].width = 14
title(ws, "5-Year Annual P&L Summary (USD)",
      "Vestwoods: Egypt 6/7/9/11/15, Sudan 4/5/6/8/10, Algeria 3/4/6/7/8, Libya 0/4/5/6/8 | Al Reem: Egypt 10/12/15/18/20, Sudan 5/8/10/12/15", "G")
hdr(ws, 4, ["DESCRIPTION", "Year 1\n(Aug26-Jul27)", "Year 2\n(Aug27-Jul28)", "Year 3\n(Aug28-Jul29)", "Year 4\n(Aug29-Jul30)", "Year 5\n(Aug30-Jul31)", "5-YEAR\nTOTAL"])
r = 5
def annual_row(label, vals, bold=False, fillc=None, fmt=USDP, pct=False):
    global r
    cell(ws, f"A{r}", label, F(9.5, bold, NAVY if bold else "1A1A19"), fillc=fillc, border=True, wrap=True)
    for i, v in enumerate(vals):
        cell(ws, f"{get_column_letter(2+i)}{r}", v, F(9.5, bold, NAVY if bold else "1A1A19"),
             align="right", fmt=PCT1 if pct else fmt, fillc=fillc, border=True)
    if not pct:
        cell(ws, f"G{r}", f"=SUM(B{r}:F{r})", F(9.5, True, NAVY), align="right", fmt=fmt,
             fillc=fillc or MID, border=True)
    r += 1

def asect(label):
    global r
    cell(ws, f"A{r}", label, F(9.5, True, TEAL), fillc=LIGHT)
    for c in "BCDEFG": ws[f"{c}{r}"].fill = PatternFill("solid", fgColor=LIGHT)
    r += 1

asect("REVENUE")
annual_row("Egypt — Vestwoods", M.VW_MARKET_REV["Egypt"])
annual_row("Egypt — Al Reem Plastics", M.AR_MARKET_REV["Egypt"])
annual_row("Sudan — Vestwoods", M.VW_MARKET_REV["Sudan"])
annual_row("Sudan — Al Reem Plastics", M.AR_MARKET_REV["Sudan"])
annual_row("Algeria — Vestwoods (100% LC)", M.VW_MARKET_REV["Algeria"])
annual_row("Libya — Vestwoods (from Year 2)", M.VW_MARKET_REV["Libya"])
annual_row("TOTAL REVENUE", M.REV, bold=True, fillc=MID)
asect("COST OF GOODS SOLD")
annual_row("Vestwoods COGS (retail 72% / wholesale 87%)", M.VW_COGS)
annual_row("Al Reem COGS (retail 70% / wholesale 80%)", M.AR_COGS)
annual_row("TOTAL COGS", M.COGS, bold=True, fillc=MID)
annual_row("GROSS PROFIT", M.GP, bold=True, fillc=CREAM)
annual_row("Gross margin %", [g/rv for g, rv in zip(M.GP, M.REV)], pct=True)
asect("OPERATING EXPENSES")
annual_row("Personnel (Staff Plan + 4% Egypt commissions)", M.PERSONNEL)
annual_row("Rent & facilities (2 showrooms, office, warehouse)", M.FACILITIES)
annual_row("Marketing & promotions", M.MARKETING)
annual_row("Operations, G&A & trade-finance interest", M.OPERATIONS_GA)
annual_row("Depreciation & amortisation", M.DA)
annual_row("TOTAL OPERATING EXPENSES", M.OPEX, bold=True, fillc=MID)
asect("PROFITABILITY")
annual_row("EBIT (operating profit)", M.EBIT, bold=True)
annual_row("EBIT margin %", [e/rv for e, rv in zip(M.EBIT, M.REV)], pct=True)
annual_row("Corporate income tax (22.5%)", M.TAX_AMT)
annual_row("NET PROFIT", M.NP, bold=True, fillc=CREAM)
annual_row("Net margin %", M.NET_MARGIN, pct=True)
cum = []; s = 0
for v in M.NP: s += v; cum.append(s)
annual_row("Cumulative net profit", cum, fmt=USDP)
r += 1
for line in [
 f"Total 5-year revenue USD {M.REV_5YR:,.0f} | gross profit USD {M.GP_5YR:,.0f} | net profit USD {M.NP_5YR:,.0f}",
 "Operating break-even Month 4 (Nov-26); cumulative break-even Month 8 (Mar-27).",
 f"Cumulative net profit exceeds the USD 1.5M investment during Year 3.",
]:
    cell(ws, f"A{r}", "• " + line, F(9, True, TEAL)); ws.merge_cells(f"A{r}:G{r}"); r += 1

# ============================================================== 8. Cash Flow Year 1
ws = wb.create_sheet("Cash Flow Year 1")
ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 46
for c in COLS12: ws.column_dimensions[c].width = 10.5
ws.column_dimensions[TOTCOL].width = 12
title(ws, "Monthly Cash Flow — Year 1 (August 2026 – July 2027)",
      "Vestwoods Y1: 100% supplier payment before shipment | Al Reem: paid against documents | Egypt 1-month collection lag | Sudan 50% advance + 50% delivery | Algeria 100% LC", TOTCOL)
hdr(ws, 4, ["CASH FLOW ITEM"] + M.MONTHS + ["YEAR 1\nTOTAL"], size=8.5)
r = 5
sect_ws = ws
def csect(label):
    global r
    cell(ws, f"A{r}", label, F(9, True, TEAL), fillc=LIGHT)
    for c in COLS12 + [TOTCOL]: ws[f"{c}{r}"].fill = PatternFill("solid", fgColor=LIGHT)
    r += 1
csect("CASH INFLOWS")
month_row(ws, r, "Egypt collections — both divisions (1-month lag)", M.M_IN_EGYPT); r += 1
month_row(ws, r, "Export cash — Sudan advances/delivery + Algeria LC", M.M_IN_EXPORT); r += 1
month_row(ws, r, "Investor capital (T1 Aug: 1.0M | T2 Nov: 0.5M)", M.M_IN_FUND); r += 1
month_row(ws, r, "TOTAL CASH INFLOWS", M.M_INFLOW, bold=True, fillc=MID); r += 1
csect("CASH OUTFLOWS")
month_row(ws, r, "Vestwoods supplier prepayments (USD 239,805 × 13 POs)", [M.VW_PO[i]*M.VW_CONT_SUPPLIER for i in range(12)]); r += 1
month_row(ws, r, "Vestwoods local import costs at clearance (USD 102,511)", [M.VW_ARRIVE[i]*M.VW_CONT_LOCAL for i in range(12)]); r += 1
month_row(ws, r, "Al Reem containers (USD 59,343 × 15, against documents)", M.M_OUT_AR); r += 1
month_row(ws, r, "One-time setup (fit-out, deposits, licences, demo stock)", M.M_OUT_SETUP); r += 1
month_row(ws, r, "Operating expenses (cash, incl. commissions & interest)", M.M_OUT_OPEX); r += 1
month_row(ws, r, "TOTAL CASH OUTFLOWS", M.M_OUTFLOW, bold=True, fillc=MID); r += 1
month_row(ws, r, "NET MONTHLY CASH FLOW", M.M_NET, bold=True); r += 1
month_row(ws, r, "CUMULATIVE CASH POSITION", M.M_CUM, bold=True, fillc=CREAM, total=M.M_CUM[-1]); r += 2
for line in [
 f"Peak self-funded deficit (excluding investor capital): USD {abs(M.PEAK_DEFICIT):,.0f} — covered by the USD 1.5M raise.",
 f"Minimum cash position with the raise: USD {M.MIN_CASH_WITH_RAISE:,.0f} (Oct-26, before Tranche 2).",
 f"Year-1 ending cash: USD {M.Y1_END_CASH:,.0f} — funds Year-2 growth before the Month-13 credit switch.",
 "Sudan advances (50% at order) arrive ~2 months before delivery and partially offset Vestwoods prepayments.",
]:
    cell(ws, f"A{r}", "• " + line, F(8.5, True, TEAL)); ws.merge_cells(f"A{r}:N{r}"); r += 1

# ============================================================== 9. 5Y Cash Flow
ws = wb.create_sheet("5Y Cash Flow")
ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 46
for c in "BCDEF": ws.column_dimensions[c].width = 14
title(ws, "Five-Year Cash Flow (USD)",
      "Y1 from the monthly sheet (100% prepayment). Y2+ under credit terms: 10% at PO + 90% at 3-month credit (~22.5% of Vestwoods supplier purchases outstanding at year end)", "F")
hdr(ws, 4, ["ITEM", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"])
r = 5
def cf_row(label, vals, bold=False, fillc=None):
    global r
    cell(ws, f"A{r}", label, F(9.5, bold, NAVY if bold else "1A1A19"), fillc=fillc, border=True, wrap=True)
    for i, v in enumerate(vals):
        cell(ws, f"{get_column_letter(2+i)}{r}", v, F(9.5, bold, NAVY if bold else "1A1A19"),
             align="right", fmt=USDP, fillc=fillc, border=True)
    r += 1
cf_row("Customer collections", M.CF_COLLECT)
cf_row("Investor capital (T1 + T2)", [1500000, 0, 0, 0, 0])
cf_row("Supplier & inventory payments (both divisions)", [-v for v in M.CF_SUPPLIER])
cf_row("Operating expenses (cash)", [-v for v in M.CF_OPEX])
cf_row("Corporate tax paid (prior year, in arrears)", [-v for v in M.CF_TAX])
cf_row("Dividends paid (100% of prior-year net profit)", [-v for v in M.CF_DIV])
cf_row("Capex", [-v for v in M.CAPEX])
cf_row("NET ANNUAL CASH FLOW", M.CF_NET, bold=True, fillc=MID)
cf_row("CLOSING CASH POSITION", M.CF_CLOSE, bold=True, fillc=CREAM)
r += 1
for line in [
 "STRENGTH — the Month-13 credit switch (10% down + 90% at 3-month credit) releases ~90% of Vestwoods container capital: Year-2 cash jumps despite full dividend payout.",
 "STRENGTH — Al Reem's fast-turning houseware generates cash from the first quarter and smooths the battery cycle.",
 "STRENGTH — closing cash rises every year while distributing 100% of profits and paying rising taxes; no capital call after Tranche 2.",
 "RISK — Year 1 depends on the raise closing on time: peak self-funded deficit USD %s under 100%% prepayment." % f"{abs(M.PEAK_DEFICIT):,.0f}",
]:
    cell(ws, f"A{r}", "• " + line, F(8.5, False, "5C5B57"), wrap=True); ws.merge_cells(f"A{r}:F{r}")
    ws.row_dimensions[r].height = 24; r += 1

# ============================================================== 10. Market Detail
ws = wb.create_sheet("Market Detail")
ws.sheet_view.showGridLines = False
for col, w in zip("ABCDEF", [24, 11, 15, 9, 26, 44]): ws.column_dimensions[col].width = w
title(ws, "Market Detail — Both Divisions",
      "Container allocations, revenue, margins, terms and market actions per year", "F")
hdr(ws, 4, ["Market / Year", "Containers", "Revenue (USD)", "GM %", "Payment terms", "Key market action"])
r = 5
def mkt_block(header, rows):
    global r
    cell(ws, f"A{r}", header, F(9.5, True, TEAL), fillc=LIGHT)
    for c in "BCDEF": ws[f"{c}{r}"].fill = PatternFill("solid", fgColor=LIGHT)
    r += 1
    for yr, cont, rev, gm, terms, action in rows:
        cell(ws, f"A{r}", yr, F(9), border=True)
        cell(ws, f"B{r}", cont, F(9), align="right", border=True)
        cell(ws, f"C{r}", rev, F(9), align="right", fmt=USD, border=True)
        cell(ws, f"D{r}", gm, F(9), align="right", fmt=PCT1, border=True)
        cell(ws, f"E{r}", terms, F(8.5), border=True, wrap=True)
        cell(ws, f"F{r}", action, F(8.5), border=True, wrap=True)
        r += 1

VW_ACTIONS = {
 "Egypt": ["Two showrooms live; dealer network build; I LOCK wholesale anchor",
           "Alexandria coverage via dealers; first C&I quotes", "Alexandria branch opens; telecom accounts",
           "B2G/tenders desk; C&I pipeline", "40+ dealer network; CKD assembly evaluation"],
 "Sudan": ["Committed buyer orders on arrival of first containers", "3 dealers; add Omdurman, El Obeid",
           "Telecom tower contracts", "C&I projects; Khartoum tenders", "Standalone Sudan office consideration"],
 "Algeria": ["First LC orders under negotiated agency (FOB Jebel Ali)", "Agency formalised; dealer sub-network",
             "Solar programme alignment", "C&I entries; coverage expansion", "Scale; assess in-country JV"],
 "Libya": ["—", "Sign Tripoli + Benghazi distributors", "Residential solar in outage districts",
           "C&I backup; NGO/health supply", "Secondary-city coverage"],
}
for mkt in ["Egypt", "Sudan", "Algeria", "Libya"]:
    gm = 0.210 if mkt == "Egypt" else 0.131
    terms = {"Egypt": "Retail + 30–60 day dealer terms", "Sudan": "50% advance + 50% on delivery",
             "Algeria": "100% LC before shipment", "Libya": "Advance / confirmed LC"}[mkt]
    rows = []
    for i in range(5):
        c = M.VW_CONT[mkt][i]
        if c == 0 and mkt == "Libya" and i == 0: rows.append((f"Year {i+1}", "—", 0, 0, terms, "—")); continue
        rows.append((f"Year {i+1}", c, M.VW_MARKET_REV[mkt][i], gm, terms, VW_ACTIONS[mkt][i]))
    mkt_block(f"VESTWOODS — {mkt.upper()}", rows)
AR_ACTIONS = {
 "Egypt": ["Launch through both showrooms + wholesale to retailers", "Hypermarket listings (Carrefour-class)",
           "Online channel + Alexandria dealers", "Private-label conversations", "Nationwide wholesale coverage"],
 "Sudan": ["Same sub-distributor channel as Vestwoods", "Khartoum + Port Sudan dealers",
           "Range extension to 100+ SKUs", "Second distributor", "Scale with market recovery"],
}
for mkt in ["Egypt", "Sudan"]:
    gm = 0.253 if mkt == "Egypt" else 0.20
    terms = "Retail + wholesale 30–45 days" if mkt == "Egypt" else "50% advance + 50% on delivery"
    rev = M.AR_MARKET_REV[mkt]
    rows = [(f"Year {i+1}", M.AR_CONT[mkt][i], rev[i], gm, terms, AR_ACTIONS[mkt][i]) for i in range(5)]
    mkt_block(f"AL REEM PLASTICS — {mkt.upper()}", rows)
cell(ws, f"A{r}", "Sudan cash terms mean revenue is collected before or at shipment; Algeria LC-before-shipment carries zero receivable risk.",
     F(8.5, True, TEAL)); ws.merge_cells(f"A{r}:F{r}")

# ============================================================== 11. Funding & Returns
ws = wb.create_sheet("Funding & Returns")
ws.sheet_view.showGridLines = False
for col, w in zip("ABCDEFG", [36, 13, 13, 13, 13, 13, 13]): ws.column_dimensions[col].width = w
title(ws, "Funding Structure & Investor Returns",
      "USD 1,500,000 for 50% of NORCO Egypt | band USD 1.0M – 1.5M | dividends 100% payout in arrears | terminal at 5× Year-5 net profit", "G")
r = 4
cell(ws, f"A{r}", "A.  TRANCHE STRUCTURE", F(11, True, TEAL)); r += 1
hdr(ws, r, ["Tranche", "Amount (USD)", "Timing", "Gate / purpose", "", "", ""]); r += 1
for name, amt, timing, purpose in M.TRANCHES:
    cell(ws, f"A{r}", name, F(9), border=True)
    cell(ws, f"B{r}", amt, F(9), align="right", fmt=USD, border=True)
    cell(ws, f"C{r}", timing, F(9), border=True, wrap=True)
    ws.merge_cells(f"D{r}:G{r}")
    cell(ws, f"D{r}", purpose, F(9), border=True, wrap=True)
    ws.row_dimensions[r].height = 24; r += 1
cell(ws, f"A{r}", "Total", F(9.5, True, NAVY), fillc=MID, border=True)
cell(ws, f"B{r}", f"=SUM(B{r-2}:B{r-1})", F(9.5, True, NAVY), align="right", fmt=USD, fillc=MID, border=True)
for c in "CDEFG": ws[f"{c}{r}"].fill = PatternFill("solid", fgColor=MID)
r += 2
cell(ws, f"A{r}", "B.  SIZING", F(11, True, TEAL)); r += 1
for raise_, note in [("USD 1,000,000 (minimum)", "Container plan slows: Vestwoods waves stretched, Al Reem held at 6-7 containers Y1; break-even delayed ~2 months"),
                     ("USD 1,500,000 (recommended)", f"Full two-division plan as modelled; covers the USD {abs(M.PEAK_DEFICIT):,.0f} peak with buffer")]:
    cell(ws, f"A{r}", raise_, F(9, True), border=True)
    ws.merge_cells(f"B{r}:G{r}"); cell(ws, f"B{r}", note, F(9), border=True, wrap=True)
    ws.row_dimensions[r].height = 24; r += 1
r += 1
cell(ws, f"A{r}", "C.  INVESTOR CASH FLOW — 50% equity of NORCO Egypt", F(11, True, TEAL)); r += 1
hdr(ws, r, ["Flow (USD)", "Y0 (close)", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"]); r += 1
flows = [
 ("Capital invested", [-M.RAISE, 0, 0, 0, 0, 0]),
 ("Dividends (50% of prior-year net profit)", [0] + M.INV_DIV),
 ("Terminal value (50% × 5 × Y5 net profit)", [0, 0, 0, 0, 0, M.INV_TERMINAL]),
]
start_r = r
for label, vals in flows:
    cell(ws, f"A{r}", label, F(9), border=True, wrap=True)
    for i, v in enumerate(vals):
        cell(ws, f"{get_column_letter(2+i)}{r}", v, F(9), align="right", fmt=USDP, border=True)
    r += 1
net_r = r
cell(ws, f"A{r}", "Net investor cash flow", F(9.5, True, NAVY), fillc=MID, border=True)
for i in range(6):
    col = get_column_letter(2+i)
    cell(ws, f"{col}{r}", f"=SUM({col}{start_r}:{col}{r-1})", F(9.5, True, NAVY),
         align="right", fmt=USDP, fillc=MID, border=True)
r += 1
cell(ws, f"A{r}", "Investor IRR", F(10, True, GOLD), border=True)
cell(ws, f"B{r}", f"=IRR(B{net_r}:G{net_r})", F(11, True, GOLD), align="right", fmt=PCT1, border=True)
cell(ws, f"D{r}", "MOIC", F(10, True, GOLD), border=True)
cell(ws, f"E{r}", f"=SUM(C{net_r}:G{net_r})/-B{net_r}", F(11, True, GOLD), align="right", fmt='0.00"x"', border=True)
r += 2
cell(ws, f"A{r}", "D.  INVESTOR PROTECTIONS", F(11, True, TEAL)); r += 1
for p in [
 "Tranche 2 released only against verified Month-4 milestones (≥3 containers sold through + Sudan advances received).",
 "Quarterly management accounts; monthly cash & inventory reporting across both divisions; USD-denominated books.",
 "Egypt customers on max 60-day terms; Sudan cash-before-shipment; Algeria LC only; Libya advance/LC.",
 "Exclusive Vestwoods agency and the Al Reem (Angola) affiliated supply agreement held within the group; assignable as security.",
 "Founder pre-investment of USD 14,517 already deployed — operating showroom, licences and import permits complete.",
]:
    cell(ws, f"A{r}", "• " + p, F(9, False, "5C5B57"), wrap=True); ws.merge_cells(f"A{r}:G{r}")
    ws.row_dimensions[r].height = 22; r += 1

# ============================================================== 12. Shareholding
ws = wb.create_sheet("Shareholding")
ws.sheet_view.showGridLines = False
for col, w in zip("ABC", [44, 16, 64]): ws.column_dimensions[col].width = w
title(ws, "Shareholding — NORCO Egypt (the investment vehicle)",
      "Investor subscribes into the Egypt operating company; NORCO UAE anchors supply relationships as a 20% shareholder", "C")
hdr(ws, 4, ["Shareholder", "NORCO Egypt %", "Notes"])
r = 5
for name, pct, note in M.SHAREHOLDING:
    cell(ws, f"A{r}", name, F(9.5), border=True, wrap=True)
    cell(ws, f"B{r}", pct, F(9.5), align="right", fmt=PCT0, border=True)
    cell(ws, f"C{r}", note, F(9, False, "5C5B57"), border=True, wrap=True)
    ws.row_dimensions[r].height = 24; r += 1
cell(ws, f"A{r}", "TOTAL", F(10, True, NAVY), fillc=MID, border=True)
cell(ws, f"B{r}", f"=SUM(B5:B{r-1})", F(10, True, NAVY), align="right", fmt=PCT0, fillc=MID, border=True)
ws[f"C{r}"].fill = PatternFill("solid", fgColor=MID)
r += 2
for line in [
 "Founder-side combined interest = 40%: 20% held directly by the Chairman + 20% held via NORCO General Trading L.L.C. (UAE), which he controls (80%).",
 "NORCO UAE contributes the exclusive Vestwoods agency and the Al Reem (Angola) supply relationship to the Egypt company under long-term agreements.",
 "Dividend policy: 100% of net profit distributed annually in arrears — investor receives 50% of every distribution.",
]:
    cell(ws, f"A{r}", "• " + line, F(9, False, "5C5B57"), wrap=True); ws.merge_cells(f"A{r}:C{r}")
    ws.row_dimensions[r].height = 26; r += 1

# ============================================================== 13. Dashboard
ws = wb.create_sheet("Dashboard")
ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 40; ws.column_dimensions["B"].width = 18
for c in "CDEFGH": ws.column_dimensions[c].width = 12
title(ws, "Investor Dashboard", "Headline metrics — NORCO Egypt, both divisions", "H")
metrics = [
 ("Total 5-year revenue (USD)", M.REV_5YR, USD),
 ("Total 5-year gross profit (USD)", M.GP_5YR, USD),
 ("Total 5-year net profit (USD)", M.NP_5YR, USD),
 ("Year 1 revenue (USD)", M.REV[0], USD),
 ("Year 1 net profit (USD)", M.NP[0], USD),
 ("Year 5 net profit (USD)", M.NP[4], USD),
 ("Operating break-even", "Month 4 (Nov-26)", None),
 ("Cumulative break-even", "Month 8 (Mar-27)", None),
 ("Peak self-funded cash deficit (USD)", abs(M.PEAK_DEFICIT), USD),
 ("Year-1 ending cash with raise (USD)", M.Y1_END_CASH, USD),
 ("Year-5 closing cash (USD)", M.CF_CLOSE[4], USD),
 ("Investment (USD, for 50% of NORCO Egypt)", M.RAISE, USD),
 ("Investor IRR (dividends + terminal)", M.INV_IRR, PCT1),
 ("Investor MOIC", M.INV_MOIC, '0.00"x"'),
 ("Founder pre-operational investment (USD)", 14517, USD),
]
r = 4
for label, v, fmt in metrics:
    cell(ws, f"A{r}", label, F(9.5, True, NAVY), border=True)
    cell(ws, f"B{r}", v, F(10, True, TEAL if fmt else "1A1A19"), align="right", fmt=fmt, border=True)
    r += 1
# chart data block
r += 1
data_r = r
cell(ws, f"A{r}", "Chart data (USD)", F(8.5, True, "5C5B57")); r += 1
yr_r = r
cell(ws, f"A{r}", "Year", F(8.5, True))
for i, y in enumerate(["Y1", "Y2", "Y3", "Y4", "Y5"]):
    cell(ws, f"{get_column_letter(2+i)}{r}", y, F(8.5, True), align="center")
r += 1
vw_r = r
cell(ws, f"A{r}", "Vestwoods revenue", F(8.5))
for i in range(5): cell(ws, f"{get_column_letter(2+i)}{r}", M.VW_REV[i], F(8.5), align="right", fmt=USD)
r += 1
ar_r = r
cell(ws, f"A{r}", "Al Reem revenue", F(8.5))
for i in range(5): cell(ws, f"{get_column_letter(2+i)}{r}", M.AR_REV[i], F(8.5), align="right", fmt=USD)
r += 1
np_r = r
cell(ws, f"A{r}", "Net profit", F(8.5))
for i in range(5): cell(ws, f"{get_column_letter(2+i)}{r}", M.NP[i], F(8.5), align="right", fmt=USD)

chart = BarChart(); chart.type = "col"; chart.grouping = "stacked"; chart.overlap = 100
chart.title = "Group revenue by division (USD)"; chart.height = 8; chart.width = 15
cats = Reference(ws, min_col=2, min_row=yr_r, max_col=6)
chart.add_data(Reference(ws, min_col=2, min_row=vw_r, max_row=ar_r, max_col=6), from_rows=True)
chart.set_categories(cats)
chart.series[0].tx = SeriesLabel(v="Vestwoods"); chart.series[0].graphicalProperties.solidFill = BLUE
chart.series[1].tx = SeriesLabel(v="Al Reem Plastics"); chart.series[1].graphicalProperties.solidFill = AQUA
chart.x_axis.delete = False; chart.y_axis.delete = False
ws.add_chart(chart, "D4")
lc = LineChart(); lc.title = "Net profit (USD)"; lc.height = 7; lc.width = 15
lc.add_data(Reference(ws, min_col=2, min_row=np_r, max_col=6), from_rows=True)
lc.set_categories(cats)
lc.series[0].tx = SeriesLabel(v="Net profit")
lc.series[0].graphicalProperties.line.solidFill = GOLD
lc.series[0].graphicalProperties.line.width = 28000
lc.x_axis.delete = False; lc.y_axis.delete = False
ws.add_chart(lc, "D21")

wb.save(OUT)
print("Saved", OUT)
