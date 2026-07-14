"""
NORCO General Trading L.L.C. — Group Investor Model
Single source of truth for the combined Vestwoods + Al Reem Plastics business plan.
All monetary figures in USD thousands (000) unless noted. FX planning rate: USD 1 = EGP 53.
Vestwoods figures follow the founder's Business Plan V4 (Aug 2026 - Jul 2031).
Al Reem Plastics figures are planning projections built on the verified April-2026
product-catalogue unit economics (wholesale = COGS x1.15, retail = COGS x1.38).
"""

YEARS = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"]
YEAR_RANGE = ["Aug26-Jul27", "Aug27-Jul28", "Aug28-Jul29", "Aug29-Jul30", "Aug30-Jul31"]

# ----------------------------------------------------------------------------
# VESTWOODS (Haier Energy) BESS distribution — from Business Plan V4
# ----------------------------------------------------------------------------
VW_MARKET_REV = {
    "Egypt":   [4232, 5814, 8243, 11603, 16257],
    "Sudan":   [1279, 2238, 3517,  4796,  6395],
    "Libya":   [   0,  500,  900,  1400,  2000],
    "Algeria": [ 300,  900, 1600,  2200,  2800],
}
VW_CONTAINERS = {  # 40ft FCL per market per year
    "Egypt":   [12, 18, 26, 34, 40],
    "Sudan":   [ 4,  7, 11, 15, 20],
    "Libya":   [ 0,  2,  3,  5,  7],
    "Algeria": [ 1,  3,  5,  7,  9],
}
VW_REV = [sum(x) for x in zip(*VW_MARKET_REV.values())]   # 5811,9452,14260,19999,27452
VW_GP  = [1728, 2678, 4088, 5913, 8537]
VW_OPEX = [784, 1144, 1546, 1998, 2812]

# ----------------------------------------------------------------------------
# AL REEM PLASTICS — houseware distribution (Turkiye -> Egypt + export)
# Projections from the 147-SKU catalogue: blended GM ramps 19% -> 23% as the
# retail/own-showroom mix and brand pull grow.
# ----------------------------------------------------------------------------
AR_REV = [1800, 3200, 4800, 6400, 8200]
AR_GM  = [0.19, 0.20, 0.21, 0.22, 0.23]
AR_GP  = [round(r*g) for r, g in zip(AR_REV, AR_GM)]        # 342,640,1008,1408,1886
AR_OPEX = [180, 280, 400, 540, 700]                        # incremental direct costs
# Al Reem catalogue reference economics (verified, USD)
AR_MARKUP_WHOLESALE = 0.15   # wholesale price over landed COGS
AR_MARKUP_RETAIL = 0.38      # retail price over landed COGS
AR_SKUS = 147

# ----------------------------------------------------------------------------
# CONSOLIDATED NORCO GROUP
# ----------------------------------------------------------------------------
TAX = 0.225
REV  = [a+b for a, b in zip(VW_REV, AR_REV)]               # 7611,12652,19060,26399,35652
GP   = [a+b for a, b in zip(VW_GP, AR_GP)]                 # 2070,3318,5096,7321,10423
OPEX = [a+b for a, b in zip(VW_OPEX, AR_OPEX)]             # 964,1424,1946,2538,3512
EBIT = [g-o for g, o in zip(GP, OPEX)]                     # 1106,1894,3150,4783,6911
TAX_AMT = [round(e*TAX) for e in EBIT]                     # 249,426,709,1076,1555
NP   = [e-t for e, t in zip(EBIT, TAX_AMT)]                # 857,1468,2441,3707,5356
NET_MARGIN = [n/r for n, r in zip(NP, REV)]

REV_5YR = sum(REV)     # 101,374
GP_5YR  = sum(GP)      # 28,228
NP_5YR  = sum(NP)      # 13,829

# ----------------------------------------------------------------------------
# FUNDING & RETURNS
# ----------------------------------------------------------------------------
RAISE = 2000  # USD 000 recommended core raise (band 1,000 - 2,500)
TRANCHES = [
    ("Tranche 1 - Launch",       1000, "Month 1 (Aug-26, at close)",
     "Vestwoods container waves 1-3, group setup, 12-month opex runway"),
    ("Tranche 2 - Scale",         500, "Month 4 (Nov-26), milestone-gated",
     "Vestwoods waves 4-6; released on >=3 containers sold through + Sudan advances received"),
    ("Tranche 3 - Diversify",     500, "Months 6-12",
     "Al Reem Plastics houseware inventory + Sudan/Libya export working capital"),
]
TERMINAL_MULTIPLE = 5   # x Year-5 net profit for equity valuation

# Option A: 50% equity, dividends = 50% of prior-year NP (arrears) + terminal value
OPT_A_DIV = [0, round(0.5*NP[0]), round(0.5*NP[1]), round(0.5*NP[2]), round(0.5*NP[3])]
OPT_A_TERMINAL = round(0.5 * TERMINAL_MULTIPLE * NP[4])
OPT_A_IRR = 0.598
OPT_A_MOIC = 8.81
OPT_A_DIV_MULTIPLE = 2.12

# Option B: 25% profit share (year earned) + capital redemption at Year 5
OPT_B_SHARE = [round(0.25*n) for n in NP]
OPT_B_REDEMPTION = RAISE
OPT_B_IRR = 0.280
OPT_B_MOIC = 2.73

# ----------------------------------------------------------------------------
# SHAREHOLDING (50% investor scenario)
# ----------------------------------------------------------------------------
SHAREHOLDING = [
    ("Investor (USD 2.0M core capital)", 0.00, 0.50),
    ("Mohammed Fadi Jannan - Chairman & Founder", 0.80, 0.40),
    ("Partner A", 0.10, 0.05),
    ("Partner B", 0.10, 0.05),
]

# Brand palette (validated, CVD-safe on white)
BRAND = {
    "navy":   "#0f2942",   # NORCO deep navy — headers/ink
    "teal":   "#0f6e6a",   # secondary brand
    "gold":   "#c8892a",   # accent
    "blue":   "#2a78d6",   # series 1 / Vestwoods
    "aqua":   "#1baf7a",   # series 2 / Al Reem
    "yellow": "#eda100",   # series 3 / Algeria
    "orange": "#eb6834",   # series 4 / Libya
    "green":  "#1f8a4c",
    "ink":    "#1a1a19",
    "muted":  "#5c5b57",
    "grid":   "#e6e6e2",
    "surface":"#ffffff",
}

if __name__ == "__main__":
    print("Group revenue :", REV, "  5yr:", REV_5YR)
    print("Group GP      :", GP, "  5yr:", GP_5YR)
    print("Group EBIT    :", EBIT)
    print("Group NP      :", NP, "  5yr:", NP_5YR)
    print("Net margins   :", [f"{m*100:.1f}%" for m in NET_MARGIN])
    print("Vestwoods rev :", VW_REV)
    print("Al Reem GP    :", AR_GP)
