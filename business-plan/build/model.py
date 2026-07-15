# -*- coding: utf-8 -*-
"""
NORCO — Group Investor Model V5 (single source of truth)
Two divisions: Vestwoods (Haier Energy) BESS + Al Reem Plastics (Angola) houseware.
Investor invests in the EGYPT company. All figures USD unless noted. FX: USD 1 = EGP 53.

Corrected per owner instructions (Jul-2026):
- Raise USD 1.5M (band 1.0M – 1.5M)
- Vestwoods markets: Egypt, Sudan, Algeria, Libya. Al Reem: Egypt + Sudan only.
- Vestwoods COGS: retail 72% of revenue, wholesale 87% of revenue.
  Exports (Sudan/Algeria/Libya) wholesale-only; Egypt 50% retail / 50% wholesale.
- Al Reem Plastics (Angola affiliate): 30% discount off price list ->
  margin 30% of revenue at retail, 20% of revenue at wholesale. Sudan wholesale-only.
- Egypt opco shareholding: Investor 50%, NORCO UAE 20%, Founder 20%, Partners 5% + 5%.
"""

YEARS = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"]
YEAR_RANGE = ["Aug26-Jul27", "Aug27-Jul28", "Aug28-Jul29", "Aug29-Jul30", "Aug30-Jul31"]
MONTHS = ["Aug-26", "Sep-26", "Oct-26", "Nov-26", "Dec-26", "Jan-27",
          "Feb-27", "Mar-27", "Apr-27", "May-27", "Jun-27", "Jul-27"]
FX = 53.0
TAX = 0.225

# ============================================================================
# VESTWOODS CONTAINER ECONOMICS (from verified pricing reference, 340-unit mix)
# mix: 70 VE51100L, 24 VE51200L, 32 VE51314L, 24 VEH-T20KA3, 70 HEH-S6KB3,
#      40 VEP500W, 80 VEP1K20
# ============================================================================
VW_MIX = [  # (model, desc, qty, factory, cogs_unit, wholesale, retail)
    ("VE51100L", "Smart Battery 5.12kWh", 70, 672, 988, 1137, 1364),
    ("VE51200L", "Smart Battery 10.24kWh", 24, 1200, 1748, 2011, 2413),
    ("VE51314L", "Smart Battery 16.07kWh", 32, 1560, 2266, 2607, 3129),
    ("VEH-T20KA3", "3-Phase Inverter 20kW", 24, 1870, 2713, 3121, 3745),
    ("HEH-S6KB3", "Hybrid Inverter 6kW", 70, 390, 582, 670, 804),
    ("VEP500W", "Rescube Portable 0.5kW/1kWh", 40, 145, 229, 264, 317),
    ("VEP1K20", "Rescube All-in-One 1kW/2kWh", 80, 365, 546, 628, 754),
]
VW_UNITS = sum(q for _, _, q, *_ in VW_MIX)                       # 340
VW_CONT_COGS = sum(q * c for _, _, q, _, c, _, _ in VW_MIX)       # 342,316
VW_CONT_WHOLESALE = sum(q * w for _, _, q, _, _, w, _ in VW_MIX)  # 393,882
VW_CONT_RETAIL = sum(q * r for _, _, q, _, _, _, r in VW_MIX)     # 472,680
VW_CONT_EGYPT = 0.5 * VW_CONT_WHOLESALE + 0.5 * VW_CONT_RETAIL    # 433,281
VW_CONT_SUPPLIER = sum(q * f for _, _, q, f, *_ in VW_MIX) + 6865  # 239,805 prepaid
VW_CONT_LOCAL = VW_CONT_COGS - VW_CONT_SUPPLIER                    # 102,511 at clearance
VW_GP_EGYPT = VW_CONT_EGYPT - VW_CONT_COGS                        # 90,965 (21.0%)
VW_GP_EXPORT = VW_CONT_WHOLESALE - VW_CONT_COGS                   # 51,566 (13.1%)
VW_COGS_RETAIL_PCT = VW_CONT_COGS / VW_CONT_RETAIL                # 72.4%
VW_COGS_WHOLESALE_PCT = VW_CONT_COGS / VW_CONT_WHOLESALE          # 86.9%

VW_CONT = {
    "Egypt":   [6, 7, 9, 11, 15],
    "Sudan":   [4, 5, 6, 8, 10],
    "Algeria": [3, 4, 6, 7, 8],
    "Libya":   [0, 4, 5, 6, 8],
}
VW_MARKET_REV = {
    "Egypt":   [round(c * VW_CONT_EGYPT) for c in VW_CONT["Egypt"]],
    "Sudan":   [round(c * VW_CONT_WHOLESALE) for c in VW_CONT["Sudan"]],
    "Algeria": [round(c * VW_CONT_WHOLESALE) for c in VW_CONT["Algeria"]],
    "Libya":   [round(c * VW_CONT_WHOLESALE) for c in VW_CONT["Libya"]],
}
VW_REV = [sum(v) for v in zip(*VW_MARKET_REV.values())]
VW_GP = [round(VW_CONT["Egypt"][i] * VW_GP_EGYPT +
               (VW_CONT["Sudan"][i] + VW_CONT["Algeria"][i] + VW_CONT["Libya"][i]) * VW_GP_EXPORT)
         for i in range(5)]
VW_COGS = [r - g for r, g in zip(VW_REV, VW_GP)]

# ============================================================================
# AL REEM PLASTICS (ANGOLA) — priced from the July-2026 Egypt packing list
# 20,488 units / 69 SKUs per 40ft container, landed cost USD 59,343.
# NORCO buys at 30% below price list -> margin 30% of retail revenue,
# 20% of wholesale revenue. Egypt 50/50 retail-wholesale; Sudan wholesale only.
# ============================================================================
AR_CONT_COST = 59343
AR_UNITS = 20488
AR_SKUS = 69
AR_CONT_RETAIL = AR_CONT_COST / 0.70          # 84,776 (retail value)
AR_CONT_WHOLESALE = AR_CONT_COST / 0.80       # 74,179
AR_CONT_EGYPT = 0.5 * AR_CONT_RETAIL + 0.5 * AR_CONT_WHOLESALE   # 79,477
AR_GP_EGYPT = AR_CONT_EGYPT - AR_CONT_COST    # 20,134 (25.3%)
AR_GP_SUDAN = AR_CONT_WHOLESALE - AR_CONT_COST  # 14,836 (20.0%)

AR_CONT = {
    "Egypt": [10, 12, 15, 18, 20],
    "Sudan": [5, 8, 10, 12, 15],
}
AR_MARKET_REV = {
    "Egypt": [round(c * AR_CONT_EGYPT) for c in AR_CONT["Egypt"]],
    "Sudan": [round(c * AR_CONT_WHOLESALE) for c in AR_CONT["Sudan"]],
}
AR_REV = [sum(v) for v in zip(*AR_MARKET_REV.values())]
AR_GP = [round(AR_CONT["Egypt"][i] * AR_GP_EGYPT + AR_CONT["Sudan"][i] * AR_GP_SUDAN)
         for i in range(5)]
AR_COGS = [r - g for r, g in zip(AR_REV, AR_GP)]

# ============================================================================
# GROUP REVENUE / GROSS PROFIT
# ============================================================================
REV = [a + b for a, b in zip(VW_REV, AR_REV)]
GP = [a + b for a, b in zip(VW_GP, AR_GP)]
COGS = [a + b for a, b in zip(VW_COGS, AR_COGS)]
EGYPT_SALES = [VW_MARKET_REV["Egypt"][i] + AR_MARKET_REV["Egypt"][i] for i in range(5)]

# ============================================================================
# OPERATING EXPENSES
# Personnel per the Staff Plan (as-is roster) + 4% commission on Egypt sales.
# Facilities: showroom #1 6th Oct (USD 200), showroom #2 New Cairo ~100 sqm
# (USD 3,500), office New Cairo 100 sqm furnished (USD 3,000), warehouse
# 300-700 sqm (USD 3,000), utilities.
# ============================================================================
PERS_BASE_BEN = [392035, 500940, 638940, 793500, 1083300]   # base + 15% benefits
COMMISSION = [round(0.04 * e) for e in EGYPT_SALES]
PERSONNEL = [p + c for p, c in zip(PERS_BASE_BEN, COMMISSION)]
FACILITIES = [127200, 127200, 147000, 187000, 232000]
OPERATIONS_GA = [78400, 105000, 130000, 165000, 205000]     # vehicles+G&A+interest
MARKETING = [59600, 85000, 120000, 165000, 215000]
DA = [16800, 16800, 16800, 20000, 30000]
OPEX = [sum(x) for x in zip(PERSONNEL, FACILITIES, OPERATIONS_GA, MARKETING, DA)]

EBIT = [g - o for g, o in zip(GP, OPEX)]
TAX_AMT = [round(max(0, e) * TAX) for e in EBIT]
NP = [e - t for e, t in zip(EBIT, TAX_AMT)]
NET_MARGIN = [n / r for n, r in zip(NP, REV)]

REV_5YR = sum(REV); GP_5YR = sum(GP); NP_5YR = sum(NP)

# ============================================================================
# YEAR 1 MONTHLY MODEL
# ============================================================================
# Vestwoods Egypt monthly revenue phasing (template ramp, rescaled to 6 containers)
_ramp = [0, 60000, 119483, 200000, 220000, 230000, 220000, 230000, 270000, 300000, 350000, 400000]
_scale = (6 * VW_CONT_EGYPT) / sum(_ramp)
M_VW_EGYPT = [round(x * _scale) for x in _ramp]
M_VW_EGYPT[-1] += round(6 * VW_CONT_EGYPT) - sum(M_VW_EGYPT)  # exact total
# Sudan: 4 containers Jan/Mar/May/Jul; Algeria: 3 containers Mar/May/Jul (LC)
M_VW_SUDAN = [0]*12; M_VW_ALG = [0]*12
for m in (5, 7, 9, 11): M_VW_SUDAN[m] = round(VW_CONT_WHOLESALE)
for m in (7, 9, 11): M_VW_ALG[m] = round(VW_CONT_WHOLESALE)
# Al Reem: Egypt 10 containers Oct-Jul (1/month); Sudan 5 in Nov/Jan/Mar/May/Jul
M_AR_EGYPT = [0, 0] + [round(AR_CONT_EGYPT)] * 10
M_AR_SUDAN = [0]*12
for m in (3, 5, 7, 9, 11): M_AR_SUDAN[m] = round(AR_CONT_WHOLESALE)

M_REV = [M_VW_EGYPT[i] + M_VW_SUDAN[i] + M_VW_ALG[i] + M_AR_EGYPT[i] + M_AR_SUDAN[i]
         for i in range(12)]
# COGS by stream
M_COGS = [round(M_VW_EGYPT[i] * (VW_CONT_COGS / VW_CONT_EGYPT))
          + round((M_VW_SUDAN[i] + M_VW_ALG[i]) * VW_COGS_WHOLESALE_PCT)
          + round(M_AR_EGYPT[i] * (AR_CONT_COST / AR_CONT_EGYPT))
          + round(M_AR_SUDAN[i] * 0.80)
          for i in range(12)]
M_GP = [r - c for r, c in zip(M_REV, M_COGS)]

# Monthly personnel (staff plan base salaries, incl. 2 showroom managers)
M_BASE = [18800, 23400, 26500, 28200, 28200, 29400, 29400, 31400, 31400, 31400, 31400, 31400]
M_BEN = [round(b * 0.15) for b in M_BASE]
M_COMM = [round(0.04 * (M_VW_EGYPT[i] + M_AR_EGYPT[i])) for i in range(12)]
M_PERSONNEL = [b + n + c for b, n, c in zip(M_BASE, M_BEN, M_COMM)]
M_FACILITIES = [12400] + [10600] * 2 + [10900] * 9      # incl. office first-month double
# facilities detail: sh1 200 + sh2 3500 + office 3000 (Aug 6000) + wh 3000 + util 400/700
M_FACILITIES = []
for i in range(12):
    office = 6000 if i == 0 else 3000
    util = 400 if i < 2 else 700
    M_FACILITIES.append(200 + 3500 + office + 3000 + util)
M_OPS = [800]*3 + [1500]*9
M_MKT = [7000, 6300, 12000, 5000, 4400, 3900, 3900, 3900, 3300, 3300, 3300, 3300]
M_GA = [10700, 6900, 6900, 3900, 3900, 3700, 3500, 3500, 3500, 3500, 3500, 3500]
M_DA = [1400]*12
M_INT = [0] + [500]*11
M_OPEX = [M_PERSONNEL[i] + M_FACILITIES[i] + M_OPS[i] + M_MKT[i] + M_GA[i] + M_DA[i]
          for i in range(12)]
M_EBIT = [g - o for g, o in zip(M_GP, M_OPEX)]
M_EBT = [e - i for e, i in zip(M_EBIT, M_INT)]
Y1_EBT = sum(M_EBT)
Y1_TAX = round(max(0, Y1_EBT) * TAX)
Y1_NP = Y1_EBT - Y1_TAX

# Reconcile annual Y1 with the monthly model (monthly is authoritative for Y1)
OPEX[0] = sum(M_OPEX) + sum(M_INT)
EBIT[0] = GP[0] - OPEX[0]
TAX_AMT[0] = round(max(0, EBIT[0]) * TAX)
NP[0] = EBIT[0] - TAX_AMT[0]
NET_MARGIN = [n / r for n, r in zip(NP, REV)]
NP_5YR = sum(NP)

# ============================================================================
# YEAR 1 MONTHLY CASH FLOW
# Vestwoods Y1: 100% supplier payment before shipment (239,805/container at PO,
# ~2 months before sale) + local import costs 102,511 at clearance.
# Al Reem: full landed cost paid against shipping documents (~1 month pre-sale).
# Egypt customers 1-month lag; Sudan 50/50 (cash in sale month); Algeria LC.
# ============================================================================
VW_PO = [1, 0, 1, 1, 1, 2, 1, 3, 1, 2, 0, 0]        # 13 container prepayments
VW_ARRIVE = [0, 0, 1, 0, 1, 1, 1, 2, 1, 3, 1, 2]     # local costs on arrival (13)
AR_PAY = [0, 1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 0]        # 15 Al Reem containers paid

M_IN_EGYPT = [0] + [M_VW_EGYPT[i] + M_AR_EGYPT[i] for i in range(11)]  # 1-month lag
# Sudan pays 50% advance at order (VW: 2 months pre-delivery; AR: 1 month) + 50% on delivery
M_IN_EXPORT = [0.0]*12
for i in range(12):
    M_IN_EXPORT[i] += M_VW_ALG[i]                      # Algeria: 100% LC at shipment
    M_IN_EXPORT[i] += 0.5 * M_VW_SUDAN[i] + 0.5 * M_AR_SUDAN[i]
    if i + 2 < 12: M_IN_EXPORT[i] += 0.5 * M_VW_SUDAN[i+2]
    if i + 1 < 12: M_IN_EXPORT[i] += 0.5 * M_AR_SUDAN[i+1]
# advances for the first Sudan deliveries (sale months Jan / Nov) arrive pre-order in Nov/Oct
M_IN_EXPORT = [round(x) for x in M_IN_EXPORT]
M_IN_FUND = [1000000, 0, 0, 500000] + [0]*8
M_INFLOW = [M_IN_EGYPT[i] + M_IN_EXPORT[i] + M_IN_FUND[i] for i in range(12)]

SETUP_ONE_TIME = 40667
M_OUT_VW = [VW_PO[i] * VW_CONT_SUPPLIER + VW_ARRIVE[i] * VW_CONT_LOCAL for i in range(12)]
M_OUT_AR = [AR_PAY[i] * AR_CONT_COST for i in range(12)]
M_OUT_OPEX = [M_OPEX[i] - M_DA[i] + M_INT[i] for i in range(12)]
M_OUT_SETUP = [SETUP_ONE_TIME] + [0]*11
M_OUTFLOW = [M_OUT_VW[i] + M_OUT_AR[i] + M_OUT_OPEX[i] + M_OUT_SETUP[i] for i in range(12)]

M_NET = [i - o for i, o in zip(M_INFLOW, M_OUTFLOW)]
M_CUM = []
_c = 0
for n in M_NET:
    _c += n; M_CUM.append(_c)
Y1_END_CASH = M_CUM[-1]
# Peak self-funded deficit (excluding investor capital)
_c = 0; M_CUM_NOFUND = []
for i in range(12):
    _c += M_NET[i] - M_IN_FUND[i]; M_CUM_NOFUND.append(_c)
PEAK_DEFICIT = min(M_CUM_NOFUND)
MIN_CASH_WITH_RAISE = min(M_CUM)

# ============================================================================
# 5-YEAR CASH FLOW (annual; Y1 from monthly model)
# Y2+: Vestwoods credit switch — 10% at PO + 90% at 3-month credit
# (~22.5% of Vestwoods supplier purchases outstanding at year end).
# ============================================================================
VW_TOTAL_CONT = [sum(VW_CONT[k][i] for k in VW_CONT) for i in range(5)]
AR_TOTAL_CONT = [AR_CONT["Egypt"][i] + AR_CONT["Sudan"][i] for i in range(5)]

CF_COLLECT, CF_SUPPLIER, CF_OPEX, CF_TAX, CF_DIV, CF_CAPEX, CF_NET, CF_CLOSE = ([] for _ in range(8))
_egypt_ar_prev = 0.0   # Egypt receivables (1-month) at year end
_payables_prev = 0.0   # Vestwoods supplier payables at year end
_close = 0.0
CAPEX = [0, 25000, 30000, 35000, 40000]
for i in range(5):
    egypt_ar = EGYPT_SALES[i] / 12.0
    collect = REV[i] - (egypt_ar - _egypt_ar_prev)
    if i == 0:
        collect = sum(M_INFLOW) - sum(M_IN_FUND)
    vw_purch = VW_TOTAL_CONT[i] * VW_CONT_COGS
    ar_purch = AR_TOTAL_CONT[i] * AR_CONT_COST
    if i == 0:
        supplier = sum(M_OUT_VW) + sum(M_OUT_AR) + SETUP_ONE_TIME
        payables = 0.0
    else:
        payables = 0.225 * (VW_TOTAL_CONT[i] * VW_CONT_SUPPLIER)
        supplier = vw_purch + ar_purch - (payables - _payables_prev)
    opex_cash = OPEX[i] - DA[i]
    if i == 0:
        opex_cash = sum(M_OUT_OPEX)
    tax_paid = 0 if i == 0 else TAX_AMT[i-1]
    div = 0 if i == 0 else NP[i-1]           # 100% payout of prior-year NP
    fund = 1500000 if i == 0 else 0
    net = (collect + fund) - supplier - opex_cash - tax_paid - div - CAPEX[i]
    _close += net
    CF_COLLECT.append(round(collect)); CF_SUPPLIER.append(round(supplier))
    CF_OPEX.append(round(opex_cash)); CF_TAX.append(round(tax_paid))
    CF_DIV.append(round(div)); CF_NET.append(round(net)); CF_CLOSE.append(round(_close))
    _egypt_ar_prev = egypt_ar; _payables_prev = payables

# ============================================================================
# FUNDING & INVESTOR RETURNS — USD 1.5M for 50% of the Egypt company
# Dividends: 100% payout of prior-year NP, investor receives 50%.
# Terminal: 5x Year-5 net profit x 50% stake.
# ============================================================================
RAISE = 1500000
BAND = (1000000, 1500000)
TRANCHES = [
    ("Tranche 1 — Launch", 1000000, "Month 1 (Aug-26, at close)",
     "Vestwoods prepaid container waves + first Al Reem containers, setup, opex runway"),
    ("Tranche 2 — Scale", 500000, "Month 4 (Nov-26), milestone-gated",
     "Released on ≥3 containers sold through + Sudan advances received; funds waves 4-6"),
]
TERMINAL_MULTIPLE = 5
INV_DIV = [0] + [round(0.5 * NP[i]) for i in range(4)]           # received Y2..Y5
INV_TERMINAL = round(0.5 * TERMINAL_MULTIPLE * NP[4])
INV_CF = [-RAISE, INV_DIV[0], INV_DIV[1], INV_DIV[2], INV_DIV[3], INV_DIV[4] + INV_TERMINAL]

def _irr(cfs):
    import numpy as np
    roots = np.roots(cfs[::-1])
    cands = [1/r.real - 1 for r in roots if abs(r.imag) < 1e-9 and r.real > 0]
    cands = [x for x in cands if -0.99 < x < 10]
    return max(cands) if cands else float("nan")

INV_IRR = _irr(INV_CF)
INV_MOIC = sum(INV_CF[1:]) / RAISE

# ============================================================================
# SHAREHOLDING — Egypt operating company
# ============================================================================
SHAREHOLDING = [
    ("Investor (USD 1.5M capital)", 0.50,
     "Cash for 50% of NORCO Egypt; board seat; reserved matters"),
    ("NORCO General Trading L.L.C. (UAE)", 0.20,
     "Holds the Vestwoods exclusive agency & Al Reem (Angola) supply relationship"),
    ("Mohammed Fadi Jannan — Chairman & Founder", 0.20,
     "Executive lead; combined founder-side interest 40% (20% direct + 20% via NORCO UAE)"),
    ("Partner A", 0.05, "Existing partner"),
    ("Partner B", 0.05, "Existing partner"),
]

# ============================================================================
# MARKET SURVEY (indicative Cairo street prices, NORCO survey June 2026)
# ============================================================================
BATTERY_COMPETITORS = [
    # brand, model (5 kWh class), usd, kwh, warranty, tier
    ("Vestwoods (NORCO)", "VE51100L 5.12 kWh", 1364, 5.12, "5 years + Cairo service bench", "Haier-backed challenger"),
    ("Pylontech", "US5000 4.8 kWh", 1850, 4.8, "7 years", "Premium tier-1"),
    ("Huawei", "LUNA2000-5 5 kWh", 2300, 5.0, "10 years (bundled)", "Premium tier-1"),
    ("Deye", "SE-G5.1 5.12 kWh", 1550, 5.12, "5 years", "Mid-tier"),
    ("Growatt", "ARK 5.12 kWh", 1600, 5.12, "5 years", "Mid-tier"),
    ("Grey-market imports", "unbranded 5.12 kWh", 1150, 5.12, "None / seller-only", "No service, no warranty"),
]
HOUSEWARE_COMPETITORS = [
    # category, Al Reem retail EGP, local brands EGP, imported brands EGP
    ("90L waste bin with cover", 869, "800 – 1,000 (El Helal, Winner Plast)", "1,100 – 1,400"),
    ("Clothes drier (large)", 1522, "1,400 – 1,900 (El Helal, Max Plast)", "1,900 – 2,600"),
    ("Large laundry basket with lid", 752, "700 – 900", "950 – 1,300"),
    ("8L rectangular food container", 226, "200 – 300", "320 – 450"),
    ("Storage drawers (4-tier)", 1786, "1,600 – 2,100", "2,200 – 3,000"),
    ("Baby bathtub", 470, "420 – 560", "600 – 850"),
]

# Brand palette (validated CVD-safe)
BRAND = {
    "navy": "#0f2942", "teal": "#0f6e6a", "gold": "#c8892a",
    "blue": "#2a78d6", "aqua": "#1baf7a", "yellow": "#eda100", "orange": "#eb6834",
    "ink": "#1a1a19", "muted": "#5c5b57", "grid": "#e6e6e2", "surface": "#ffffff",
}

if __name__ == "__main__":
    f = lambda xs: [round(x/1000, 1) for x in xs]
    print("VW cont: COGS %.0f  WS %.0f  RT %.0f  EG %.0f  (COGS%%: rt %.1f ws %.1f)" %
          (VW_CONT_COGS, VW_CONT_WHOLESALE, VW_CONT_RETAIL, VW_CONT_EGYPT,
           VW_COGS_RETAIL_PCT*100, VW_COGS_WHOLESALE_PCT*100))
    print("AR cont: cost %.0f  WS %.0f  RT %.0f  EG %.0f" %
          (AR_CONT_COST, AR_CONT_WHOLESALE, AR_CONT_RETAIL, AR_CONT_EGYPT))
    print("REV  (K):", f(REV), " 5yr", round(REV_5YR/1e6, 2), "M")
    print("GP   (K):", f(GP))
    print("OPEX (K):", f(OPEX))
    print("EBIT (K):", f(EBIT))
    print("NP   (K):", f(NP), " 5yr", round(NP_5YR/1e6, 2), "M")
    print("margins :", [f"{m*100:.1f}%" for m in NET_MARGIN])
    print("Y1 monthly NP check: EBT %.0f tax %.0f NP %.0f" % (Y1_EBT, Y1_TAX, Y1_NP))
    print("Y1 cash: end %.0f  min-with-raise %.0f  peak-deficit %.0f" %
          (Y1_END_CASH, MIN_CASH_WITH_RAISE, PEAK_DEFICIT))
    print("5Y closing cash (K):", f(CF_CLOSE))
    print("Investor CF (K):", f(INV_CF))
    print("IRR %.1f%%  MOIC %.2fx  Terminal %.0f" % (INV_IRR*100, INV_MOIC, INV_TERMINAL))
