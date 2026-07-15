# NORCO Egypt — Group Business Plan & Investor Package (V5)

Investor package for **NORCO Egypt**, a two-division distribution company:

- **Vestwoods (Haier Energy)** — exclusive lithium battery energy-storage agency
  (Egypt · Sudan · Algeria · Libya).
- **Al Reem Plastics** — premium houseware produced at the group's affiliated plant in
  **Angola**, supplied to NORCO at 30% below price list (Egypt · Sudan).

The investor invests **USD 1.5M for 50% of NORCO Egypt** (funding band USD 1.0M–1.5M);
NORCO General Trading L.L.C. (UAE) holds 20% and anchors the supplier relationships.

## Deliverables

| File | What it is |
|------|------------|
| **NORCO_Group_Business_Plan.docx** | The written plan — 10 sections incl. a competitive pricing study (batteries $/kWh vs. Pylontech/Huawei/Deye/Growatt; houseware vs. Egyptian local & imported brands), 21 tables, 9 charts. |
| **NORCO_Group_Investor_Model.xlsx** | 13-sheet financial model mirroring the founder's V4 structure: Key Assumptions, Pre-Op Investment, Pricing Reference, Staff Plan, Monthly P&L Year 1, Annual P&L Y1–Y5, Cash Flow Year 1 (monthly), 5Y Cash Flow, Market Detail, Funding & Returns, Shareholding, Dashboard. |
| **NORCO_Investor_Brief.html** | Graphics-rich one-page investor brief (any browser; light/dark; print-friendly). |
| **assets/** | The nine charts as standalone PNGs. |

## Headline numbers (5-year, NORCO Egypt)

- Revenue **USD 63.6M** · gross profit **USD 10.9M** · net profit **USD 3.3M**
- Operating break-even **Month 4** (Nov-26); cumulative break-even **Month 8** (Mar-27)
- Peak self-funded cash need **USD 1.29M** — covered by the USD 1.5M raise with buffer
- Investor return (50% equity, 100% dividend payout + terminal at 5× Y5 profit):
  **~21% IRR · 2.4x MOIC**

## Key economics (verified)

- **Vestwoods container** (340 units): landed COGS $342,316 → sells $472,680 retail
  (COGS 72% of revenue) / $393,882 wholesale (COGS 87%). Egypt 50/50 mix; exports wholesale.
- **Al Reem container** (20,488 units / 69 SKUs, priced line-by-line from the July-2026
  packing list): landed cost $59,343 → margin 30% of retail revenue / 20% of wholesale.
- Container plan — Vestwoods: Egypt 6/7/9/11/15, Sudan 4/5/6/8/10, Algeria 3/4/6/7/8,
  Libya 0/4/5/6/8. Al Reem: Egypt 10/12/15/18/20, Sudan 5/8/10/12/15.
- FX EGP 53 = USD 1 · corporate tax 22.5% (Y1 loss carry-forward).

## Rebuilding

```bash
pip install openpyxl python-docx matplotlib numpy
cd build
python3 charts.py        # -> assets/*.png
python3 build_docx.py    # -> NORCO_Group_Business_Plan.docx
python3 build_xlsx.py    # -> NORCO_Group_Investor_Model.xlsx
python3 build_html.py    # -> NORCO_Investor_Brief.html
```

`build/model.py` is the single source of truth for every number in all three documents.
