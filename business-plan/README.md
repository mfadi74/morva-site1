# NORCO General Trading L.L.C. — Group Business Plan & Investor Package

A complete investor package for **NORCO**, covering **both** product divisions on one
distribution platform:

- **Vestwoods (Haier Energy)** — exclusive Egypt agency for lithium battery energy-storage
  systems (Egypt · Sudan · Libya · Algeria).
- **Al Reem Plastics** — a 147-SKU premium houseware range sourced from Türkiye.

Built from the source documents provided (Vestwoods Business Plan V4, the Vestwoods investor
model, and the Al Reem Plastics costed catalogue), consolidated into one group plan and set of
financials for an investor considering a **USD 2.0M** raise.

## Deliverables

| File | What it is |
|------|------------|
| **NORCO_Group_Business_Plan.docx** | The full written business plan — 10 sections, 18 tables, 8 embedded charts. The primary document to submit to the investor. |
| **NORCO_Group_Investor_Model.xlsx** | The formula-driven financial model — assumptions, consolidated 5-year P&L, revenue detail, Al Reem catalogue economics, cash flow, funding & returns (live IRR/MOIC), shareholding, dashboard. Change the blue input cells to flex the plan. |
| **NORCO_Investor_Brief.html** | A one-page, graphics-rich investor brief (opens in any browser; light & dark themes; print-friendly). The "convince the investor" visual summary. |
| **assets/** | The eight source charts as standalone PNGs. |

## Headline numbers (consolidated group, 5-year)

- Revenue **USD 101.4M** · gross profit **USD 28.2M** · net profit **USD 13.8M**
- Operating break-even in **Month 3**
- Investor returns: **Option A** (50% equity) ~**60% IRR / 8.8x MOIC**; **Option B**
  (25% profit share + capital redemption) ~**28% IRR / 2.7x MOIC**
- Ask: **USD 2.0M** core raise in three milestone-gated tranches (band USD 1.0M – 2.5M)

## Notes on the figures

- **Vestwoods** figures follow the founder's vetted *Business Plan V4* (internally consistent
  across the source document).
- **Al Reem Plastics** figures are planning projections built on the **verified April-2026
  catalogue unit economics** (landed COGS, wholesale = COGS × 1.15, retail = COGS × 1.38,
  blended gross margin 19% → 23%).
- Planning FX: USD 1 = EGP 53. Corporate tax 22.5% on net profit.

## Rebuilding

The `build/` folder regenerates every artifact from a single source of truth (`model.py`):

```bash
pip install openpyxl python-docx matplotlib
cd build
python3 charts.py        # -> assets/*.png
python3 build_docx.py    # -> NORCO_Group_Business_Plan.docx
python3 build_xlsx.py    # -> NORCO_Group_Investor_Model.xlsx
python3 build_html.py     # -> NORCO_Investor_Brief.html
```
