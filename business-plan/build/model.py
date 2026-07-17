# -*- coding: utf-8 -*-
"""
NORCO — Group Investor Model V6 (single source of truth for documents)
Numbers tie 1:1 to NORCO_Group_Investor_Model.xlsx (corrected July 2026).
Investor: USD 1.0M core for 50% of NORCO Egypt (+ optional 0.5M accelerator).
"""

YEARS = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"]
MONTHS = ["Aug-26", "Sep-26", "Oct-26", "Nov-26", "Dec-26", "Jan-27",
          "Feb-27", "Mar-27", "Apr-27", "May-27", "Jun-27", "Jul-27"]
FX = 53.0
TAX = 0.225

# ---------------- VESTWOODS ----------------
VW_MIX = [
    ("VE51100L", "Smart Battery 5.12kWh", 70, 672, 988, 1137, 1364),
    ("VE51200L", "Smart Battery 10.24kWh", 24, 1200, 1748, 2011, 2413),
    ("VE51314L", "Smart Battery 16.07kWh", 32, 1560, 2266, 2607, 3129),
    ("VEH-T20KA3", "3-Phase Inverter 20kW", 24, 1870, 2713, 3121, 3745),
    ("HEH-S6KB3", "Hybrid Inverter 6kW", 70, 390, 582, 670, 804),
    ("VEP500W", "Rescube Portable 0.5kW/1kWh", 40, 145, 229, 264, 317),
    ("VEP1K20", "Rescube All-in-One 1kW/2kWh", 80, 365, 546, 628, 754),
]
VW_CONT_COGS = 342316
VW_CONT_SUPPLIER = 239805
VW_CONT_LOCAL = VW_CONT_COGS - VW_CONT_SUPPLIER
VW_CONT_WHOLESALE = 393861          # export container billing
VW_CONT_RETAIL = 472680
VW_CONT_EGYPT = 433281              # 50/50 blend

VW_CONT = {"Egypt": [6, 7, 9, 11, 15], "Sudan": [4, 5, 6, 8, 10],
           "Algeria": [3, 4, 6, 7, 8], "Libya": [0, 4, 5, 6, 8]}
VW_MARKET_REV = {
    "Egypt":   [2599483, 3119380, 3743256, 4491907, 5390288],
    "Sudan":   [1575444, 1890533, 2268639, 2722367, 3266841],
    "Algeria": [1181583, 1417900, 1701480, 2041775, 2450131],
    "Libya":   [0, 1576000, 1891200, 2269440, 2723328],
}
VW_REV = [sum(v) for v in zip(*VW_MARKET_REV.values())]
VW_TOTAL_CONT = [sum(VW_CONT[k][i] for k in VW_CONT) for i in range(5)]

# ---------------- AL REEM PLASTICS (ANGOLA) ----------------
AR_CONT_COST = 43339                # landed cost per 40ft (incl. USD 2,500 shipping)
AR_UNITS = 20488
AR_SKUS = 69
AR_CONT_EGYPT = 57688               # 50/50 retail-wholesale, 25% blended margin
AR_CONT_WHOLESALE = 52444           # export wholesale, 17.4% margin
AR_GP_EGYPT = AR_CONT_EGYPT - AR_CONT_COST
AR_GP_SUDAN = AR_CONT_WHOLESALE - AR_CONT_COST

AR_CONT = {"Egypt": [10, 20, 30, 30, 40], "Sudan": [5, 10, 20, 25, 30],
           "Nigeria": [0, 8, 12, 18, 25]}
AR_MARKET_REV = {
    "Egypt":   [576883, 1153766, 1730649, 1730649, 2307531],
    "Sudan":   [262220, 524440, 1048880, 1311100, 1573320],
    "Nigeria": [0, 419552, 629328, 943992, 1311100],
}
AR_REV = [sum(v) for v in zip(*AR_MARKET_REV.values())]
AR_TOTAL_CONT = [sum(AR_CONT[k][i] for k in AR_CONT) for i in range(5)]

# ---------------- GROUP P&L (ties to Annual P&L sheet) ----------------
REV  = [6195613, 10101570, 13013431, 15511230, 19022538]
GP   = [2114147, 3446656, 4440183, 5292432, 6490490]
COGS = [r - g for r, g in zip(REV, GP)]
EGYPT_SALES = [VW_MARKET_REV["Egypt"][i] + AR_MARKET_REV["Egypt"][i] for i in range(5)]
PERSONNEL = [513321, 660328, 840590, 1025096, 1368137]
FACILITIES = [115200, 115200, 135000, 175000, 220000]
MARKETING = [59600, 85000, 120000, 165000, 215000]
OPERATIONS_GA = [78400, 105000, 130000, 165000, 205000]   # Y1 incl. trade-finance interest
DA = [16800, 16800, 16800, 20000, 30000]
OPEX = [783321, 982328, 1242390, 1550096, 2038137]        # totals incl. Y1 interest
EBIT = [1330826, 2464328, 3197793, 3742336, 4452353]      # after interest (= EBT)
TAX_AMT = [299436, 554474, 719503, 842026, 1001779]
NP   = [1031391, 1909854, 2478290, 2900311, 3450573]
NET_MARGIN = [n / r for n, r in zip(NP, REV)]
REV_5YR = sum(REV); GP_5YR = sum(GP); NP_5YR = sum(NP)

# ---------------- YEAR 1 MONTHLY (ties to Monthly P&L / Cash Flow sheets) ----------------
M_CUM = [365580, 200820.5, 118305.2, 480025.7, 118718.7, 96046.2, 380526.7,
         1018101.4, 1655060.4, 2032230.6, 2189141.9, 2021553.2]
MIN_CASH_WITH_RAISE = 96046
PEAK_DEFICIT = -903954
Y1_END_CASH = 2021553
BREAKEVEN_OP = "Month 6 (Jan-27)"
BREAKEVEN_CUM = "Month 6 (Jan-27)"

# ---------------- 5-YEAR CASH FLOW (ties to 5Y Cash Flow sheet) ----------------
CF_COLLECT = [5587787, 10449448, 12961442, 15448843, 18947673]
CF_SUPPLIER = [3738413, 6689517, 8352455, 9953846, 12214105]   # current + prior-year balances
CF_OPEX = [827821, 965528, 1225590, 1530096, 2008137]
CF_TAX = [0, 299436, 554474, 719503, 842026]
CF_DIV = [0, 1031391, 1909854, 2478290, 2900311]
CAPEX = [0, 25000, 30000, 35000, 40000]
CF_NET = [2021553, 1438576, 889070, 732108, 943094]
CF_CLOSE = [2021553, 3460129, 4349199, 5081307, 6024401]

# ---------------- FUNDING & INVESTOR RETURNS ----------------
RAISE = 1000000
BAND = (1000000, 1500000)
TRANCHES = [
    ("Tranche 1 — Launch", 500000, "Month 1 (Aug-26, at close)",
     "First Vestwoods containers (Sinosure credit approved), first Al Reem containers, setup, opex runway"),
    ("Tranche 2 — Scale", 500000, "Month 4 (Nov-26), milestone-gated",
     "Released on ≥3 containers sold through + Sudan advances received; funds container waves 4–13"),
    ("Optional accelerator", 500000, "Months 6–12, by mutual agreement",
     "Buffer / faster Al Reem & Libya ramp; brings total to the USD 1.5M ceiling"),
]
TERMINAL_MULTIPLE = 5
INV_DIV = [0, 515695, 954927, 1239145, 1450155]     # received Y2..Y5 (50% of prior NP)
INV_TERMINAL = 8626433
INV_CF = [-RAISE, 0, 515695, 954927, 1239145, 1450155 + INV_TERMINAL]
INV_IRR = 0.788
INV_MOIC = 12.79
INV_IRR_DIV = 0.477
INV_MOIC_DIV = 4.16

SHAREHOLDING = [
    ("Investor (USD 1.0M capital)", 0.50, "Cash for 50% of NORCO Egypt; board seat; reserved matters"),
    ("NORCO General Trading L.L.C. (UAE)", 0.20, "Holds the Vestwoods exclusive agency & Al Reem (Angola) supply relationship"),
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
HOUSEWARE_COMPETITORS = [
    ("90L waste bin with cover", 869, "800 – 1,000 (El Helal, Winner Plast)", "1,100 – 1,400"),
    ("Clothes drier (large)", 1522, "1,400 – 1,900 (El Helal, Max Plast)", "1,900 – 2,600"),
    ("Large laundry basket with lid", 752, "700 – 900", "950 – 1,300"),
    ("8L rectangular food container", 226, "200 – 300", "320 – 450"),
    ("Storage drawers (4-tier)", 1786, "1,600 – 2,100", "2,200 – 3,000"),
    ("Baby bathtub", 470, "420 – 560", "600 – 850"),
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
