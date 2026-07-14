"""Generate print-ready investor charts (PNG @ 200 dpi) for the NORCO group plan."""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter
import matplotlib.font_manager as fm
import model as M
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "assets")
os.makedirs(OUT, exist_ok=True)

# Fonts: Liberation Sans (Arial-like)
for f in ["/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
          "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"]:
    try: fm.fontManager.addfont(f)
    except Exception: pass
plt.rcParams.update({
    "font.family": "Liberation Sans",
    "font.size": 11,
    "axes.edgecolor": M.BRAND["muted"],
    "axes.linewidth": 0.8,
    "text.color": M.BRAND["ink"],
    "axes.labelcolor": M.BRAND["ink"],
    "xtick.color": M.BRAND["muted"],
    "ytick.color": M.BRAND["muted"],
    "figure.dpi": 200,
    "savefig.dpi": 200,
})
B = M.BRAND
YRS = ["Y1", "Y2", "Y3", "Y4", "Y5"]

def style(ax, ygrid=True):
    for s in ("top", "right"):
        ax.spines[s].set_visible(False)
    ax.spines["left"].set_color(B["grid"])
    ax.spines["bottom"].set_color(B["muted"])
    if ygrid:
        ax.yaxis.grid(True, color=B["grid"], linewidth=0.8, zorder=0)
        ax.set_axisbelow(True)
    ax.tick_params(length=0)

def save(fig, name):
    fig.savefig(os.path.join(OUT, name), bbox_inches="tight", facecolor="white", pad_inches=0.12)
    plt.close(fig)
    print("wrote", name)

def m(v):  # USD 000 -> "$X.XM"
    return f"${v/1000:.1f}M"

# ---------------------------------------------------------------- 1. Revenue by division (stacked)
def chart_revenue_division():
    fig, ax = plt.subplots(figsize=(7.4, 4.0))
    x = range(5)
    vw, ar = M.VW_REV, M.AR_REV
    ax.bar(x, vw, 0.62, label="Vestwoods (energy storage)", color=B["blue"], zorder=3)
    ax.bar(x, ar, 0.62, bottom=vw, label="Al Reem Plastics (houseware)", color=B["aqua"], zorder=3,
           edgecolor="white", linewidth=1.5)
    for i in range(5):
        ax.text(i, vw[i]+ar[i]+700, m(vw[i]+ar[i]), ha="center", va="bottom",
                fontweight="bold", fontsize=11, color=B["navy"])
    style(ax)
    ax.set_xticks(list(x)); ax.set_xticklabels(YRS)
    ax.set_ylim(0, 40000)
    ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: f"${v/1000:.0f}M"))
    ax.set_title("Group revenue by division", fontsize=13, fontweight="bold",
                 color=B["navy"], loc="left", pad=12)
    ax.legend(frameon=False, loc="upper left", fontsize=9.5, ncol=1)
    save(fig, "revenue_by_division.png")

# ---------------------------------------------------------------- 2. Revenue by market (Vestwoods, stacked)
def chart_revenue_market():
    fig, ax = plt.subplots(figsize=(7.4, 4.0))
    x = range(5)
    order = [("Egypt", B["blue"]), ("Sudan", B["aqua"]),
             ("Algeria", B["yellow"]), ("Libya", B["orange"])]
    bottom = [0]*5
    for name, col in order:
        vals = M.VW_MARKET_REV[name]
        ax.bar(x, vals, 0.62, bottom=bottom, label=name, color=col, zorder=3,
               edgecolor="white", linewidth=1.2)
        bottom = [b+v for b, v in zip(bottom, vals)]
    for i in range(5):
        ax.text(i, bottom[i]+500, m(bottom[i]), ha="center", va="bottom",
                fontweight="bold", fontsize=10.5, color=B["navy"])
    style(ax)
    ax.set_xticks(list(x)); ax.set_xticklabels(YRS)
    ax.set_ylim(0, 31000)
    ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: f"${v/1000:.0f}M"))
    ax.set_title("Vestwoods revenue by export corridor", fontsize=13, fontweight="bold",
                 color=B["navy"], loc="left", pad=12)
    ax.legend(frameon=False, loc="upper left", fontsize=9.5, ncol=2)
    save(fig, "revenue_by_market.png")

# ---------------------------------------------------------------- 3. Profit bridge: GP -> NP
def chart_profit_trend():
    fig, ax = plt.subplots(figsize=(7.4, 4.0))
    x = range(5)
    ax.bar([i-0.21 for i in x], M.GP, 0.4, label="Gross profit", color=B["teal"], zorder=3)
    ax.bar([i+0.21 for i in x], M.NP, 0.4, label="Net profit", color=B["gold"], zorder=3)
    for i in x:
        ax.text(i-0.21, M.GP[i]+120, m(M.GP[i]), ha="center", va="bottom", fontsize=9, color=B["teal"], fontweight="bold")
        ax.text(i+0.21, M.NP[i]+120, m(M.NP[i]), ha="center", va="bottom", fontsize=9, color=B["gold"], fontweight="bold")
    style(ax)
    ax.set_xticks(list(x)); ax.set_xticklabels(YRS)
    ax.set_ylim(0, 11500)
    ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: f"${v/1000:.0f}M"))
    ax.set_title("Group gross profit and net profit", fontsize=13, fontweight="bold",
                 color=B["navy"], loc="left", pad=12)
    ax.legend(frameon=False, loc="upper left", fontsize=9.5)
    save(fig, "profit_trend.png")

# ---------------------------------------------------------------- 4. Net margin line
def chart_margin():
    fig, ax = plt.subplots(figsize=(7.4, 3.4))
    x = range(5)
    y = [v*100 for v in M.NET_MARGIN]
    ax.plot(x, y, color=B["navy"], linewidth=2.4, marker="o", markersize=8,
            markerfacecolor=B["gold"], markeredgecolor="white", markeredgewidth=1.5, zorder=4)
    for i in x:
        ax.text(i, y[i]+0.5, f"{y[i]:.1f}%", ha="center", va="bottom",
                fontsize=10, fontweight="bold", color=B["navy"])
    style(ax)
    ax.set_xticks(list(x)); ax.set_xticklabels(YRS)
    ax.set_ylim(0, 18)
    ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: f"{v:.0f}%"))
    ax.set_title("Net profit margin — operating leverage as volume scales",
                 fontsize=13, fontweight="bold", color=B["navy"], loc="left", pad=12)
    save(fig, "net_margin.png")

# ---------------------------------------------------------------- 5. Cumulative net profit vs raise
def chart_cumulative():
    fig, ax = plt.subplots(figsize=(7.4, 3.6))
    x = range(5)
    cum = []
    s = 0
    for n in M.NP:
        s += n; cum.append(s)
    ax.fill_between(x, cum, color=B["blue"], alpha=0.14, zorder=2)
    ax.plot(x, cum, color=B["blue"], linewidth=2.6, marker="o", markersize=7,
            markerfacecolor=B["blue"], markeredgecolor="white", markeredgewidth=1.5, zorder=4)
    ax.axhline(M.RAISE, color=B["orange"], linewidth=1.8, linestyle="--", zorder=3)
    ax.text(4, M.RAISE+250, f"Capital raised  ${M.RAISE/1000:.1f}M", ha="right",
            color=B["orange"], fontsize=9.5, fontweight="bold")
    for i in x:
        ax.text(i, cum[i]+350, m(cum[i]), ha="center", va="bottom",
                fontsize=9.5, fontweight="bold", color=B["navy"])
    style(ax)
    ax.set_xticks(list(x)); ax.set_xticklabels(YRS)
    ax.set_ylim(0, 15500)
    ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: f"${v/1000:.0f}M"))
    ax.set_title("Cumulative net profit vs. capital invested",
                 fontsize=13, fontweight="bold", color=B["navy"], loc="left", pad=12)
    save(fig, "cumulative_profit.png")

# ---------------------------------------------------------------- 6. Use of funds (donut)
def chart_use_of_funds():
    fig, ax = plt.subplots(figsize=(5.2, 4.2))
    labels = ["Vestwoods container\ninventory (prepaid)", "Al Reem houseware\ninventory",
              "Group setup &\nshowrooms", "12-month opex\nrunway"]
    vals = [1150, 500, 150, 200]
    cols = [B["blue"], B["aqua"], B["gold"], B["teal"]]
    w, _ = ax.pie(vals, colors=cols, startangle=90, counterclock=False,
                  wedgeprops=dict(width=0.42, edgecolor="white", linewidth=2))[:2]
    ax.text(0, 0.08, "$2.0M", ha="center", va="center", fontsize=20, fontweight="bold", color=B["navy"])
    ax.text(0, -0.16, "core raise", ha="center", va="center", fontsize=10, color=B["muted"])
    # legend with values
    leg = [f"{l.replace(chr(10),' ')}  —  ${v/1000:.2f}M ({v/sum(vals)*100:.0f}%)"
           for l, v in zip(labels, vals)]
    ax.legend(w, leg, frameon=False, loc="center", bbox_to_anchor=(0.5, -0.14),
              fontsize=8.5, ncol=1)
    ax.set_title("Use of funds", fontsize=13, fontweight="bold", color=B["navy"], loc="center", pad=6)
    save(fig, "use_of_funds.png")

# ---------------------------------------------------------------- 7. Container growth
def chart_containers():
    fig, ax = plt.subplots(figsize=(7.4, 3.4))
    x = range(5)
    tot = [sum(M.VW_CONTAINERS[k][i] for k in M.VW_CONTAINERS) for i in range(5)]
    ax.bar(x, tot, 0.6, color=B["navy"], zorder=3)
    for i in x:
        ax.text(i, tot[i]+1, str(tot[i]), ha="center", va="bottom", fontsize=11,
                fontweight="bold", color=B["navy"])
    style(ax)
    ax.set_xticks(list(x)); ax.set_xticklabels(YRS)
    ax.set_ylim(0, 85)
    ax.set_title("Vestwoods 40ft containers shipped per year (4 markets)",
                 fontsize=12.5, fontweight="bold", color=B["navy"], loc="left", pad=12)
    save(fig, "containers.png")

# ---------------------------------------------------------------- 8. Returns comparison
def chart_returns():
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(7.4, 3.3))
    # IRR bars
    ax1.bar([0, 1], [M.OPT_A_IRR*100, M.OPT_B_IRR*100], 0.55,
            color=[B["gold"], B["teal"]], zorder=3)
    for i, v in enumerate([M.OPT_A_IRR*100, M.OPT_B_IRR*100]):
        ax1.text(i, v+1.5, f"{v:.0f}%", ha="center", va="bottom", fontsize=13, fontweight="bold", color=B["navy"])
    style(ax1)
    ax1.set_xticks([0, 1]); ax1.set_xticklabels(["Option A\n50% equity", "Option B\n25% share"], fontsize=9)
    ax1.set_ylim(0, 72)
    ax1.yaxis.set_major_formatter(FuncFormatter(lambda v, _: f"{v:.0f}%"))
    ax1.set_title("Investor IRR", fontsize=11.5, fontweight="bold", color=B["navy"], loc="left")
    # MOIC bars
    ax2.bar([0, 1], [M.OPT_A_MOIC, M.OPT_B_MOIC], 0.55, color=[B["gold"], B["teal"]], zorder=3)
    for i, v in enumerate([M.OPT_A_MOIC, M.OPT_B_MOIC]):
        ax2.text(i, v+0.15, f"{v:.1f}x", ha="center", va="bottom", fontsize=13, fontweight="bold", color=B["navy"])
    style(ax2)
    ax2.set_xticks([0, 1]); ax2.set_xticklabels(["Option A\n50% equity", "Option B\n25% share"], fontsize=9)
    ax2.set_ylim(0, 10)
    ax2.yaxis.set_major_formatter(FuncFormatter(lambda v, _: f"{v:.0f}x"))
    ax2.set_title("Investor MOIC (5-yr)", fontsize=11.5, fontweight="bold", color=B["navy"], loc="left")
    fig.subplots_adjust(wspace=0.35)
    save(fig, "returns.png")

if __name__ == "__main__":
    chart_revenue_division()
    chart_revenue_market()
    chart_profit_trend()
    chart_margin()
    chart_cumulative()
    chart_use_of_funds()
    chart_containers()
    chart_returns()
    print("All charts generated.")
