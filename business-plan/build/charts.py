"""Print-ready investor charts (PNG @ 200 dpi) — NORCO Vestwoods plan V7 (Vestwoods only)."""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter
import matplotlib.font_manager as fm
import model as M
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "assets")
os.makedirs(OUT, exist_ok=True)
for f in ["/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
          "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"]:
    try: fm.fontManager.addfont(f)
    except Exception: pass
plt.rcParams.update({
    "font.family": "Liberation Sans", "font.size": 11,
    "axes.edgecolor": M.BRAND["muted"], "axes.linewidth": 0.8,
    "text.color": M.BRAND["ink"], "axes.labelcolor": M.BRAND["ink"],
    "xtick.color": M.BRAND["muted"], "ytick.color": M.BRAND["muted"],
    "figure.dpi": 200, "savefig.dpi": 200,
})
B = M.BRAND
YRS = ["Y1", "Y2", "Y3", "Y4", "Y5"]

def style(ax, ygrid=True):
    for s in ("top", "right"): ax.spines[s].set_visible(False)
    ax.spines["left"].set_color(B["grid"]); ax.spines["bottom"].set_color(B["muted"])
    if ygrid:
        ax.yaxis.grid(True, color=B["grid"], linewidth=0.8, zorder=0); ax.set_axisbelow(True)
    ax.tick_params(length=0)

def save(fig, name):
    fig.savefig(os.path.join(OUT, name), bbox_inches="tight", facecolor="white", pad_inches=0.12)
    plt.close(fig); print("wrote", name)

def m(v): return f"${v/1e6:.1f}M" if abs(v) >= 950_000 else f"${v/1000:.0f}K"

# 1. Revenue by market (hero)
def chart_revenue_market():
    fig, ax = plt.subplots(figsize=(7.4, 4.1))
    x = range(5); bottom = [0]*5
    for name, col in [("Egypt", B["blue"]), ("Sudan", B["aqua"]),
                      ("Algeria", B["yellow"]), ("Libya", B["orange"])]:
        vals = M.VW_MARKET_REV[name]
        ax.bar(x, vals, 0.62, bottom=bottom, label=name, color=col, zorder=3,
               edgecolor="white", linewidth=1.2)
        bottom = [b+v for b, v in zip(bottom, vals)]
    for i in x:
        ax.text(i, bottom[i]+2.2e5, m(bottom[i]), ha="center", va="bottom",
                fontweight="bold", fontsize=11, color=B["navy"])
    style(ax); ax.set_xticks(list(x)); ax.set_xticklabels(YRS)
    ax.set_ylim(0, 15.6e6)
    ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: f"${v/1e6:.0f}M"))
    ax.set_title("Vestwoods revenue by market", fontsize=13, fontweight="bold",
                 color=B["navy"], loc="left", pad=12)
    ax.legend(frameon=False, loc="upper left", fontsize=9.5, ncol=2)
    save(fig, "revenue_by_market.png")

# 2. GP vs NP
def chart_profit_trend():
    fig, ax = plt.subplots(figsize=(7.4, 4.0))
    x = range(5)
    ax.bar([i-0.21 for i in x], M.GP, 0.4, label="Gross profit", color=B["teal"], zorder=3)
    ax.bar([i+0.21 for i in x], M.NP, 0.4, label="Net profit", color=B["gold"], zorder=3)
    for i in x:
        ax.text(i-0.21, M.GP[i]+8e4, m(M.GP[i]), ha="center", va="bottom", fontsize=8.6, color=B["teal"], fontweight="bold")
        ax.text(i+0.21, M.NP[i]+8e4, m(M.NP[i]), ha="center", va="bottom", fontsize=8.6, color=B["gold"], fontweight="bold")
    style(ax); ax.set_xticks(list(x)); ax.set_xticklabels(YRS)
    ax.set_ylim(0, 6.1e6)
    ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: f"${v/1e6:.1f}M"))
    ax.set_title("Gross profit and net profit", fontsize=13, fontweight="bold", color=B["navy"], loc="left", pad=12)
    ax.legend(frameon=False, loc="upper left", fontsize=9.5)
    save(fig, "profit_trend.png")

# 3. Cumulative NP vs raise
def chart_cumulative():
    fig, ax = plt.subplots(figsize=(7.4, 3.6))
    x = range(5); cum, s = [], 0
    for n in M.NP: s += n; cum.append(s)
    ax.fill_between(x, cum, color=B["blue"], alpha=0.14, zorder=2)
    ax.plot(x, cum, color=B["blue"], linewidth=2.6, marker="o", markersize=7,
            markerfacecolor=B["blue"], markeredgecolor="white", markeredgewidth=1.5, zorder=4)
    ax.axhline(M.RAISE, color=B["orange"], linewidth=1.8, linestyle="--", zorder=3)
    ax.text(0.05, M.RAISE+2.0e5, "Capital raised  $1.0M", ha="left", color=B["orange"], fontsize=9.5, fontweight="bold")
    for i in x:
        ax.text(i, cum[i]+2.6e5, m(cum[i]), ha="center", va="bottom", fontsize=9.5, fontweight="bold", color=B["navy"])
    style(ax); ax.set_xticks(list(x)); ax.set_xticklabels(YRS)
    ax.set_ylim(0, 10.6e6)
    ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: f"${v/1e6:.0f}M"))
    ax.set_title("Cumulative net profit vs. capital invested — raise earned back inside Year 1",
                 fontsize=12.2, fontweight="bold", color=B["navy"], loc="left", pad=12)
    save(fig, "cumulative_profit.png")

# 4. Use of funds
def chart_use_of_funds():
    fig, ax = plt.subplots(figsize=(5.2, 4.2))
    labels = ["Vestwoods container\nprepayments", "Setup & showroom\nfit-out", "Opex runway &\nbuffer"]
    vals = [650, 150, 200]
    cols = [B["blue"], B["gold"], B["teal"]]
    w = ax.pie(vals, colors=cols, startangle=90, counterclock=False,
               wedgeprops=dict(width=0.42, edgecolor="white", linewidth=2))[0]
    ax.text(0, 0.08, "$1.0M", ha="center", va="center", fontsize=20, fontweight="bold", color=B["navy"])
    ax.text(0, -0.16, "core raise", ha="center", va="center", fontsize=10, color=B["muted"])
    leg = [f"{l.replace(chr(10),' ')}  —  ${v}K ({v/10:.0f}%)" for l, v in zip(labels, vals)]
    ax.legend(w, leg, frameon=False, loc="center", bbox_to_anchor=(0.5, -0.12), fontsize=8.8)
    ax.set_title("Use of funds", fontsize=13, fontweight="bold", color=B["navy"], pad=6)
    save(fig, "use_of_funds.png")

# 5. Containers per year (by market, stacked)
def chart_containers():
    fig, ax = plt.subplots(figsize=(7.4, 3.6))
    x = range(5); bottom = [0]*5
    for name, col in [("Egypt", B["blue"]), ("Sudan", B["aqua"]),
                      ("Algeria", B["yellow"]), ("Libya", B["orange"])]:
        vals = M.VW_CONT[name]
        ax.bar(x, vals, 0.6, bottom=bottom, label=name, color=col, zorder=3, edgecolor="white", linewidth=1)
        bottom = [b+v for b, v in zip(bottom, vals)]
    for i in x:
        ax.text(i, bottom[i]+0.6, str(bottom[i]), ha="center", va="bottom", fontsize=10.5, fontweight="bold", color=B["navy"])
    style(ax); ax.set_xticks(list(x)); ax.set_xticklabels(YRS)
    ax.set_ylim(0, 46)
    ax.set_title("40ft containers shipped per year (4 markets)", fontsize=12.5, fontweight="bold",
                 color=B["navy"], loc="left", pad=12)
    ax.legend(frameon=False, loc="upper left", fontsize=9.5, ncol=2)
    save(fig, "containers.png")

# 6. Investor cash flow
def chart_returns():
    fig, ax = plt.subplots(figsize=(7.4, 3.8))
    labels = ["Y0\ninvest", "Y1", "Y2", "Y3", "Y4", "Y5 + exit\nvalue"]
    vals = M.INV_CF
    cols = [B["orange"]] + [B["teal"]]*4 + [B["gold"]]
    x = range(6)
    ax.bar(x, vals, 0.58, color=cols, zorder=3)
    for i, v in enumerate(vals):
        off = 1.5e5 if v >= 0 else -1.5e5; va = "bottom" if v >= 0 else "top"
        ax.text(i, v+off, m(v), ha="center", va=va, fontsize=9.5, fontweight="bold", color=B["navy"])
    ax.axhline(0, color=B["muted"], linewidth=1)
    style(ax); ax.set_xticks(list(x)); ax.set_xticklabels(labels, fontsize=9)
    ax.set_ylim(-1.4e6, 8.6e6)
    ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: f"${v/1e6:.0f}M"))
    ax.set_title(f"Investor cash flow — 50% of NORCO Egypt for $1.0M  ·  IRR {M.INV_IRR*100:.0f}% (divs-only {M.INV_IRR_DIV*100:.0f}%)  ·  MOIC {M.INV_MOIC:.1f}x",
                 fontsize=11, fontweight="bold", color=B["navy"], loc="left", pad=12)
    save(fig, "returns.png")

# 7. Year 1 monthly cash position
def chart_y1_cash():
    fig, ax = plt.subplots(figsize=(7.4, 3.6))
    x = range(12)
    ax.fill_between(x, M.M_CUM, color=B["teal"], alpha=0.15, zorder=2)
    ax.plot(x, M.M_CUM, color=B["teal"], linewidth=2.4, marker="o", markersize=6,
            markerfacecolor=B["teal"], markeredgecolor="white", markeredgewidth=1.3, zorder=4)
    imin = M.M_CUM.index(min(M.M_CUM))
    ax.annotate(f"min {m(min(M.M_CUM))}", (imin, min(M.M_CUM)),
                xytext=(imin+0.3, min(M.M_CUM)+3.0e5), fontsize=9, fontweight="bold",
                color=B["orange"], arrowprops=dict(arrowstyle="-", color=B["orange"], lw=1))
    ax.text(11, M.M_CUM[-1]+7e4, m(M.M_CUM[-1]), ha="right", fontsize=10, fontweight="bold", color=B["navy"])
    style(ax); ax.set_xticks(list(x)); ax.set_xticklabels([mo.split("-")[0] for mo in M.MONTHS], fontsize=8.5)
    ax.set_ylim(0, 2.25e6)
    ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: f"${v/1e6:.1f}M"))
    ax.set_title("Year 1 cash position with the $1.0M raise (monthly)", fontsize=12.5,
                 fontweight="bold", color=B["navy"], loc="left", pad=12)
    save(fig, "y1_cash.png")

# 8. Battery price comparison
def chart_battery_prices():
    fig, ax = plt.subplots(figsize=(7.4, 3.9))
    rows = sorted(M.BATTERY_COMPETITORS, key=lambda r: r[2]/r[3])
    names = [r[0] for r in rows]; perkwh = [r[2]/r[3] for r in rows]
    cols = [B["gold"] if "NORCO" in n else ("#b9c2c9" if "Grey" not in n else "#8a9298") for n in names]
    y = range(len(rows))
    ax.barh(y, perkwh, 0.6, color=cols, zorder=3)
    for i, v in enumerate(perkwh):
        ax.text(v+6, i, f"${v:.0f}/kWh", va="center", fontsize=9.5, fontweight="bold", color=B["navy"])
    ax.set_yticks(list(y)); ax.set_yticklabels(names, fontsize=9.5); ax.invert_yaxis()
    style(ax); ax.xaxis.grid(True, color=B["grid"], linewidth=0.8, zorder=0); ax.yaxis.grid(False)
    ax.set_xlim(0, 560)
    ax.xaxis.set_major_formatter(FuncFormatter(lambda v, _: f"${v:.0f}"))
    ax.set_title("Egypt retail price per kWh — 5 kWh-class lithium batteries (survey Jun-2026)",
                 fontsize=11.8, fontweight="bold", color=B["navy"], loc="left", pad=12)
    save(fig, "battery_prices.png")

if __name__ == "__main__":
    chart_revenue_market(); chart_profit_trend(); chart_cumulative()
    chart_use_of_funds(); chart_containers(); chart_returns()
    chart_y1_cash(); chart_battery_prices()
    print("All charts generated.")
