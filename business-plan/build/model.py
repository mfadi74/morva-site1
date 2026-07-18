# -*- coding: utf-8 -*-
"""
NORCO — Vestwoods Investor Model V7 (single source of truth, VESTWOODS ONLY)
Ties 1:1 to NORCO_Vestwoods_Investor_Model.xlsx. Al Reem Plastics removed.
Investor: USD 1.0M core for 50% of NORCO Egypt (+ optional 0.5M accelerator).
Margins per the founder's plan: Egypt product cost 79% of Egypt revenue;
export product cost 50% of export revenue (Sudan/Algeria/Libya, wholesale).
"""

YEARS = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"]
MONTHS = ["Aug-26", "Sep-26", "Oct-26", "Nov-26", "Dec-26", "Jan-27",
          "Feb-27", "Mar-27", "Apr-27", "May-27", "Jun-27", "Jul-27"]
FX = 53.0
TAX = 0.225

# ---------------- CONTAINER ECONOMICS ----------------
VW_MIX = [
    ("VE51100L", "Smart Battery 5.12kWh", 70, 672, 988, 1137, 1364),
    ("VE51200L", "Smart Battery 10.24kWh", 24, 1200, 1748, 2011, 2413),
    ("VE51314L", "Smart Battery 16.07kWh", 32, 1560, 2266, 2607, 3129),
    ("VEH-T20KA3", "3-Phase Inverter 20kW", 24, 1870, 2713, 3121, 3745),
    ("HEH-S6KB3", "Hybrid Inverter 6kW", 70, 390, 582, 670, 804),
    ("VEP500W", "Rescube Portable 0.5kW/1kWh", 40, 145, 229, 264, 317),
    ("VEP1K20", "Rescube All-in-One 1kW/2kWh", 80, 365, 546, 628, 754),
]
VW_CONT_COGS = 342316          # landed cost per 40ft container (340 units)
VW_CONT_SUPPLIER = 239805      # supplier FOB+freight
VW_CONT_WHOLESALE = 393861     # export container billing (wholesale)
VW_CONT_RETAIL = 472680
VW_CONT_EGYPT = 433281         # Egypt 50/50 retail-wholesale blend

# ---------------- MARKETS ----------------
VW_CONT = {"Egypt": [6, 7, 9, 11, 15], "Sudan": [4, 5, 6, 8, 10],
           "Algeria": [3, 4, 6, 7, 8], "Libya": [0, 4, 5, 6, 8]}
VW_MARKET_REV = {
    "Egypt":   [2599483, 3119380, 3743256, 4491907, 5390288],
    "Sudan":   [1575444, 1890533, 2268639, 2722367, 3266841],
    "Algeria": [1181583, 1417900, 1701480, 2041775, 2450131],
    "Libya":   [0, 1576000, 1891200, 2269440, 2723328],
}
VW_TOTAL_CONT = [sum(VW_CONT[k][i] for k in VW_CONT) for i in range(5)]

# ---------------- GROUP == VESTWOODS (aliases kept so build scripts are unchanged) ----------------
REV  = [5356510, 8003813, 9604575, 11525489, 13830588]
COGS = [3432105, 4906527, 5887832, 7065398, 8478478]
GP   = [1924405, 3097286, 3716743, 4460092, 5352110]
EGYPT_SALES = VW_MARKET_REV["Egypt"]
PERSONNEL = [496014, 625715, 788670, 973176, 1298912]
FACILITIES = [115200, 115200, 135000, 175000, 220000]
MARKETING = [59600, 85000, 120000, 165000, 215000]
OPERATIONS_GA = [78400, 105000, 130000, 165000, 205000]   # Y1 incl. trade-finance interest
DA = [16800, 16800, 16800, 20000, 30000]
OPEX = [766014, 947715, 1190470, 1498176, 1968912]
EBIT = [1158391, 2149571, 2526273, 2961916, 3383198]      # after interest (= EBT)
TAX_AMT = [260638, 483654, 568412, 666431, 761220]
NP   = [897753, 1665918, 1957862, 2295484, 2621979]
NET_MARGIN = [n / r for n, r in zip(NP, REV)]
REV_5YR = sum(REV); GP_5YR = sum(GP); NP_5YR = sum(NP)

# ---------------- YEAR 1 MONTHLY P&L ----------------
M_VW_EGYPT = [20000, 40000, 119483, 200000, 220000, 230000, 220000, 230000, 270000, 300000, 350000, 400000]
M_VW_SUDAN = [0, 0, 0, 0, 0, 393861, 0, 393861, 0, 393861, 0, 393861]
M_VW_ALG   = [0, 0, 0, 0, 0, 0, 0, 393861, 0, 393861, 0, 393861]
M_REV  = [20000, 40000, 119483, 200000, 220000, 623861, 220000, 1017722, 270000, 1087722, 350000, 1187722]
M_CEG  = [15800.0, 31600.0, 94391.6, 158000.0, 173800.0, 181700.0, 173800.0, 181700.0, 213300.0, 237000.0, 276500.0, 316000.0]
M_CSU  = [0.0, 0.0, 0.0, 0.0, 0.0, 196930.5, 0.0, 196930.5, 0.0, 196930.5, 0.0, 196930.5]
M_CAL  = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 196930.5, 0.0, 196930.5, 0.0, 196930.5]
M_COGS = [15800.0, 31600.0, 94391.6, 158000.0, 173800.0, 378630.5, 173800.0, 575561.0, 213300.0, 630861.0, 276500.0, 709861.0]
M_GP   = [4200.0, 8400.0, 25091.4, 42000.0, 46200.0, 245230.5, 46200.0, 442161.0, 56700.0, 456861.0, 73500.0, 477861.0]
M_BASE = [18800, 23400, 26500, 28200, 28200, 29400, 29400, 31400, 31400, 31400, 31400, 31400]
M_BEN  = [round(b * 0.15, 1) for b in M_BASE]
M_COMM = [800.0, 1600.0, 4779.3, 8000.0, 8800.0, 9200.0, 8800.0, 9200.0, 10800.0, 12000.0, 14000.0, 16000.0]
M_PERS = [22420.0, 28510.0, 35254.3, 40430.0, 41230.0, 43010.0, 42610.0, 45310.0, 46910.0, 48110.0, 50110.0, 52110.0]
M_FAC  = [12100, 9100, 9400, 9400, 9400, 9400, 9400, 9400, 9400, 9400, 9400, 9400]
M_OPS  = [800, 800, 800, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500]
M_MKT  = [7000, 6300, 12000, 5000, 4400, 3900, 3900, 3900, 3300, 3300, 3300, 3300]
M_GA   = [10700, 6900, 6900, 3900, 3900, 3700, 3500, 3500, 3500, 3500, 3500, 3500]
M_DA   = [1400] * 12
M_INT  = [0] + [500] * 11
M_OPEX = [54420.0, 53010.0, 65754.3, 61630.0, 61830.0, 62910.0, 62310.0, 65010.0, 66010.0, 67210.0, 69210.0, 71210.0]
M_EBIT = [round(M_GP[i] - M_OPEX[i], 1) for i in range(12)]
M_EBT  = [-50220.0, -45110.0, -41162.9, -20130.0, -16130.0, 181820.5, -16610.0, 376651.0, -9810.0, 389151.0, 3790.0, 406151.0]
M_TAX  = [0.0, 0.0, 0.0, 0.0, 0.0, 2040.2, 0.0, 81009.2, 0.0, 85351.8, 852.7, 91384.0]
M_NP   = [-50220.0, -45110.0, -41162.9, -20130.0, -16130.0, 179780.3, -16610.0, 295641.8, -9810.0, 303799.2, 2937.3, 314767.0]

# ---------------- YEAR 1 MONTHLY CASH FLOW ----------------
CF_IN_EGYPT  = [20000, 40000, 40518, 55000, 80000, 130000, 180000, 270000, 330000, 380000, 420000, 440000]
CF_IN_SUDAN  = [0, 0, 0, 0, 0, 196930.5, 196930.5, 196930.5, 196930.5, 196930.5, 196930.5, 196930.5]
CF_IN_ALG    = [0, 0, 0, 0, 0, 0, 0, 196930.5, 196930.5, 196930.5, 196930.5, 196930.5]
CF_IN_FUND   = [500000, 0, 0, 500000, 0, 0, 0, 0, 0, 0, 0, 0]
M_IN   = [520000, 40000, 40518, 555000, 80000, 326930.5, 376930.5, 663861.0, 723861.0, 773861.0, 813861.0, 833861.0]
CF_CONT = [50000, 171149.5, 0, 171149.5, 342299, 342299, 0, 70000, 35000, 420000, 630000, 1015000]
CF_SETUP = [50000] + [0] * 11
CF_OPEX_M = [53020.0, 51610.0, 64354.3, 60230.0, 60430.0, 61510.0, 60910.0, 63610.0, 64610.0, 65810.0, 67810.0, 69810.0]
M_OUT  = [153020.0, 222759.5, 64354.3, 231379.5, 402729.0, 403809.0, 60910.0, 133610.0, 99610.0, 485810.0, 697810.0, 1084810.0]
M_NET  = [round(M_IN[i] - M_OUT[i], 1) for i in range(12)]
M_CUM  = [366980.0, 184220.5, 160384.2, 484004.7, 161275.7, 84397.2, 400417.7, 930668.7, 1554919.7, 1842970.7, 1959021.7, 1708072.7]
MIN_CASH_WITH_RAISE = 84397
PEAK_DEFICIT = -915603
Y1_END_CASH = 1708073
BREAKEVEN_OP = "Month 6 (Jan-27)"
BREAKEVEN_CUM = "Month 6 (Jan-27)"

# ---------------- 5-YEAR CASH FLOW ----------------
CF_COLLECT = [4748684, 8351691, 9552585, 11463101, 13755723]
CF_SUPPLIER = [3246897, 3987766, 5667038, 6800445, 8160534]   # current + prior-year balances
CF_OPEX = [793714, 930915, 1173670, 1478176, 1938912]
CF_TAX = [0, 260638, 483654, 568412, 666431]
CF_DIV = [0, 897753, 1665918, 1957862, 2295484]
CAPEX = [0, 25000, 30000, 35000, 40000]
CF_NET = [1708073, 2249618, 532306, 623207, 654361]
CF_CLOSE = [1708073, 3957691, 4489997, 5113204, 5767565]
CF_SUPP_CUR = [3246897, 3802558, 4563070, 5475683, 6570820]
CF_SUPP_PRI = [0, 185208, 1103968, 1324762, 1589714]
CF_PAYABLE = [185208, 1103969, 1324762, 1589714, 1907658]
CF_RECV = [607826, 259948, 311938, 374326, 449191]

# ---------------- FUNDING & INVESTOR RETURNS ----------------
RAISE = 1000000
BAND = (1000000, 1500000)
TRANCHES = [
    ("Tranche 1 — Launch", 500000, "Month 1 (Aug-26, at close)",
     "First Vestwoods containers (Sinosure credit approved), setup, opex runway"),
    ("Tranche 2 — Scale", 500000, "Month 4 (Nov-26), milestone-gated",
     "Released on ≥3 containers sold through + Sudan advances received; funds container waves 4–13"),
    ("Optional accelerator", 500000, "Months 6–12, by mutual agreement",
     "Standing buffer / faster Libya & Algeria ramp; brings total to the USD 1.5M ceiling"),
]
TERMINAL_MULTIPLE = 5
INV_DIV = [0, 448876, 832959, 978931, 1147742]     # received Y2..Y5 (50% of prior NP)
INV_TERMINAL = 6554947
INV_CF = [-RAISE, 0, 448876, 832959, 978931, 1147742 + INV_TERMINAL]
INV_IRR = 0.694
INV_MOIC = 9.96
INV_IRR_DIV = 0.400
INV_MOIC_DIV = 3.41

SHAREHOLDING = [
    ("Investor (USD 1.0M capital)", 0.50, "Cash for 50% of NORCO Egypt; board seat; reserved matters"),
    ("NORCO General Trading L.L.C. (UAE)", 0.20, "Holds the Vestwoods exclusive agency"),
    ("Mohammed Fadi Jannan — Chairman & Founder", 0.20, "Executive lead; combined founder-side interest 40% (20% direct + 20% via NORCO UAE)"),
    ("Partner A", 0.05, "Existing partner"),
    ("Partner B", 0.05, "Existing partner"),
]

BATTERY_COMPETITORS = [
    ("Vestwoods (NORCO)", "VE51100L 5.12 kWh", 1364, 5.12, "5 years + Cairo service bench", "Haier-backed challenger"),
    ("Pylontech", "US5000 4.8 kWh", 1850, 4.8, "7 years", "Premium tier-1"),
    ("Huawei", "LUNA2000-5 5 kWh", 2300, 5.0, "10 years (bundled)", "Premium tier-1"),
    ("Deye", "SE-G5.1 5.12 kWh", 1550, 5.12, "5 years", "Mid-tier"),
    ("Growatt", "ARK 5.12 kWh", 1600, 5.12, "5 years", "Mid-tier"),
    ("Grey-market imports", "unbranded 5.12 kWh", 1150, 5.12, "None / seller-only", "No service, no warranty"),
]

BRAND = {
    "navy": "#0f2942", "teal": "#0f6e6a", "gold": "#c8892a",
    "blue": "#2a78d6", "aqua": "#1baf7a", "yellow": "#eda100", "orange": "#eb6834",
    "ink": "#1a1a19", "muted": "#5c5b57", "grid": "#e6e6e2", "surface": "#ffffff",
}

if __name__ == "__main__":
    print("REV:", REV, sum(REV))
    print("NP :", NP, sum(NP))
    print("CF close:", CF_CLOSE)
    print("Investor IRR/MOIC:", INV_IRR, INV_MOIC, "| div-only:", INV_IRR_DIV, INV_MOIC_DIV)
    assert abs(sum(M_NP) - NP[0]) < 2, "Y1 monthly NP must tie to annual"
    assert abs(sum(M_REV) - REV[0]) < 2, "Y1 monthly REV must tie to annual"
    print("Y1 monthly ties to annual OK")
