# NORCO Egypt — Vestwoods Business Plan & Investor Package (V7)

Investor package for **NORCO Egypt**, the exclusive distributor of **Vestwoods (Haier Energy)**
lithium battery energy-storage systems across four markets — **Egypt · Sudan · Algeria · Libya**.

The investor invests **USD 1.0M for 50% of NORCO Egypt** (two $500K tranches + optional $500K
accelerator, ceiling $1.5M); NORCO General Trading L.L.C. (UAE) holds 20% and anchors the exclusive
Vestwoods agency.

> This is the **Vestwoods-only** package. The earlier two-division (Vestwoods + Al Reem Plastics)
> version is preserved in git history.

## Deliverables

| File | What it is |
|------|------------|
| **NORCO_Vestwoods_Business_Plan.docx** | The written plan — 10 sections incl. a competitive battery pricing study ($/kWh vs. Pylontech/Huawei/Deye/Growatt), 18 tables, 8 charts. |
| **NORCO_Vestwoods_Investor_Model.xlsx** | 13-sheet financial model: Key Assumptions, Pre-Op Investment, Pricing Reference, Staff Plan, Monthly P&L Year 1, Annual P&L Y1–Y5 (formula-driven), Cash Flow Year 1 (monthly), 5Y Cash Flow, Market Detail, Funding & Returns (live IRR), Shareholding, Dashboard. |
| **NORCO_Vestwoods_Investor_Brief.html / .pdf** | Graphics-rich one-page investor brief (browser + print PDF; light/dark themes). |
| **assets/** | The eight charts as standalone PNGs. |

## Headline numbers (5-year, NORCO Egypt)

- Revenue **USD 48.3M** · gross profit **USD 18.6M** · net profit **USD 9.4M**
- Operating & cumulative break-even both **Month 6** (Jan-27)
- Peak self-funded cash need **USD 0.92M** — covered by the $1.0M raise (min cash $84K)
- Investor return (50% equity, 100% dividend payout + terminal at 5× Y5 profit):
  **~40% IRR / 3.4x from dividends alone**, **~69% IRR / 10.0x including terminal value**

## Key economics

- **Container** (340 units, 40ft): landed cost **$342,316**. Egypt sells at **$433,281** (50/50
  retail-wholesale, 21% margin); exports (Sudan/Algeria/Libya) at **$393,861** wholesale.
- **Margins as modelled:** Egypt product cost 79% of revenue; export product cost 50% of revenue,
  per the founder's negotiated export supply pricing.
- Container plan — Egypt 6/7/9/11/15 · Sudan 4/5/6/8/10 · Algeria 3/4/6/7/8 · Libya 0/4/5/6/8
  (13 → 41 containers).
- FX EGP 53 = USD 1 · corporate tax 22.5% (Y1 loss carry-forward).

### Diligence note on export margin

Exports are booked at a **50% product-cost margin**. At the verified **$342,316** landed container
cost, the **$393,861** wholesale price implies a **~13%** margin, so the 50% figure rests on the
supply agreement rather than the pricing list. The plan and workbook flag this explicitly (Pricing
Reference sheet and Financial Plan §6.4). At a 13% export margin the export gross profit and Year-5
net profit rebase downward materially.

## Rebuilding

```bash
pip install openpyxl python-docx matplotlib numpy
cd build
python3 charts.py        # -> assets/*.png
python3 build_docx.py    # -> NORCO_Vestwoods_Business_Plan.docx
python3 build_xlsx.py    # -> NORCO_Vestwoods_Investor_Model.xlsx
python3 build_html.py    # -> NORCO_Vestwoods_Investor_Brief.html
```

`build/model.py` is the single source of truth for every number in all deliverables; the PDF is
produced by print-rendering the HTML brief.
