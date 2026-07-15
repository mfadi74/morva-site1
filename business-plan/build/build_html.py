# -*- coding: utf-8 -*-
"""Generate the NORCO investor brief: standalone HTML + artifact fragment."""
import base64, os
import model as M

HERE = os.path.dirname(__file__)
ASSETS = os.path.join(HERE, "assets".replace("assets", "..", 1)) if False else os.path.join(HERE, "..", "assets")

def data_uri(name):
    with open(os.path.join(ASSETS, name), "rb") as f:
        return "data:image/png;base64," + base64.b64encode(f.read()).decode()

CH = {n: data_uri(n) for n in [
    "revenue_by_division.png", "revenue_by_market.png", "profit_trend.png",
    "cumulative_profit.png", "use_of_funds.png", "containers.png",
    "returns.png", "y1_cash.png", "battery_prices.png"]}

STYLE = """
<style>
  :root{
    --navy:#0f2942; --navy2:#163a5c; --gold:#c8892a; --gold2:#e0a94a;
    --teal:#0f6e6a; --blue:#2a78d6; --aqua:#1baf7a;
    --surface:#f6f5f1; --card:#ffffff; --ink:#17242f; --muted:#5c6b77;
    --line:#e4e6e0; --hero-ink:#eaf1f7; --hero-mute:#9fb6c9;
    --shadow:0 1px 2px rgba(15,41,66,.06),0 8px 28px rgba(15,41,66,.07);
  }
  @media (prefers-color-scheme:dark){
    :root:not([data-theme="light"]){
      --surface:#0b141d; --card:#122232; --ink:#e9eef2; --muted:#9db0bd;
      --line:#233543; --shadow:0 1px 2px rgba(0,0,0,.4),0 10px 30px rgba(0,0,0,.35);
    }
  }
  :root[data-theme="dark"]{
    --surface:#0b141d; --card:#122232; --ink:#e9eef2; --muted:#9db0bd;
    --line:#233543; --shadow:0 1px 2px rgba(0,0,0,.4),0 10px 30px rgba(0,0,0,.35);
  }
  *{box-sizing:border-box}
  .brief{background:var(--surface);color:var(--ink);
    font-family:-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    line-height:1.55;font-size:16px;-webkit-font-smoothing:antialiased;}
  .brief h1,.brief h2,.brief h3,.brief .serif{
    font-family:Georgia,"Iowan Old Style","Times New Roman",serif;
    text-wrap:balance;letter-spacing:-.01em;}
  .wrap{max-width:1000px;margin:0 auto;padding:0 28px;}
  .num{font-variant-numeric:tabular-nums;}
  .eyebrow{font-family:-apple-system,"Segoe UI",sans-serif;text-transform:uppercase;
    letter-spacing:.16em;font-size:12px;font-weight:700;color:var(--gold);}

  /* HERO */
  .hero{background:linear-gradient(160deg,#0f2942 0%,#173d5f 100%);color:var(--hero-ink);
    padding:0;overflow:hidden;position:relative;}
  .hero .wrap{padding:58px 28px 46px;position:relative;z-index:1;}
  .hero .brand{font-family:Georgia,serif;font-size:34px;font-weight:700;letter-spacing:.02em;color:#fff;}
  .hero .brand small{display:block;font-size:12px;letter-spacing:.34em;color:var(--gold2);
    font-family:-apple-system,sans-serif;font-weight:700;margin-top:4px;}
  .hero h1{font-size:clamp(30px,5vw,50px);line-height:1.05;margin:26px 0 14px;color:#fff;font-weight:700;}
  .hero p.lede{font-size:19px;color:var(--hero-ink);max-width:60ch;margin:0 0 30px;}
  .hero .tag{display:inline-flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;}
  .hero .tag span{background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.16);
    color:var(--hero-ink);padding:5px 13px;border-radius:999px;font-size:13px;font-weight:600;}
  .askbox{display:flex;flex-wrap:wrap;align-items:center;gap:22px;
    background:rgba(255,255,255,.06);border:1px solid rgba(224,169,74,.4);
    border-radius:14px;padding:20px 24px;margin-top:6px;}
  .askbox .big{font-family:Georgia,serif;font-size:40px;font-weight:700;color:#fff;line-height:1;}
  .askbox .lbl{font-size:13px;color:var(--gold2);text-transform:uppercase;letter-spacing:.12em;font-weight:700;}
  .askbox .sub{font-size:14px;color:var(--hero-mute);}
  .askbox .divider{width:1px;align-self:stretch;background:rgba(255,255,255,.15);}

  /* KPI STRIP */
  .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:0;
    background:var(--navy);border-radius:0;}
  .kpi{padding:26px 22px;text-align:center;border-right:1px solid rgba(255,255,255,.09);}
  .kpi:last-child{border-right:none;}
  .kpi .v{font-family:Georgia,serif;font-size:30px;font-weight:700;color:#fff;line-height:1;}
  .kpi .l{font-size:12px;color:var(--hero-mute);text-transform:uppercase;letter-spacing:.09em;margin-top:8px;font-weight:600;}

  section.band{padding:52px 0;}
  section.band.alt{background:var(--card);border-top:1px solid var(--line);border-bottom:1px solid var(--line);}
  h2.sec{font-size:29px;margin:0 0 6px;color:var(--ink);font-weight:700;}
  .sec-lead{color:var(--muted);font-size:17px;margin:0 0 30px;max-width:64ch;}

  .divisions{display:grid;grid-template-columns:1fr 1fr;gap:22px;}
  .dcard{background:var(--card);border:1px solid var(--line);border-radius:16px;
    padding:26px;box-shadow:var(--shadow);position:relative;overflow:hidden;}
  .dcard::before{content:"";position:absolute;left:0;top:0;bottom:0;width:5px;}
  .dcard.vw::before{background:var(--blue);}
  .dcard.ar::before{background:var(--aqua);}
  .dcard .tag{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;}
  .dcard.vw .tag{color:var(--blue);} .dcard.ar .tag{color:var(--teal);}
  .dcard h3{font-size:23px;margin:6px 0 10px;color:var(--ink);}
  .dcard p{color:var(--muted);font-size:15px;margin:0 0 14px;}
  .dcard ul{margin:0;padding-left:18px;color:var(--ink);font-size:14.5px;}
  .dcard li{margin-bottom:6px;}
  .dcard .metric{display:flex;gap:18px;margin-top:16px;padding-top:16px;border-top:1px solid var(--line);}
  .dcard .metric div{flex:1;}
  .dcard .metric .n{font-family:Georgia,serif;font-size:22px;font-weight:700;color:var(--ink);}
  .dcard .metric .c{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;}

  .figrid{display:grid;grid-template-columns:1fr 1fr;gap:22px;}
  figure.chart{margin:0;background:#fff;border:1px solid var(--line);border-radius:14px;
    padding:16px 16px 10px;box-shadow:var(--shadow);}
  figure.chart img{width:100%;height:auto;display:block;}
  figure.chart figcaption{font-size:13px;color:#5c6b77;margin-top:8px;padding:0 4px 4px;}
  .full{grid-column:1/-1;}

  .why{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
  .why .item{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:22px;box-shadow:var(--shadow);}
  .why .item .h{font-family:Georgia,serif;font-weight:700;font-size:18px;color:var(--ink);margin-bottom:6px;}
  .why .item .h b{color:var(--gold);}
  .why .item p{color:var(--muted);font-size:14.5px;margin:0;}

  table.ret{width:100%;border-collapse:collapse;background:var(--card);border-radius:14px;overflow:hidden;
    box-shadow:var(--shadow);border:1px solid var(--line);}
  table.ret th,table.ret td{padding:14px 18px;text-align:left;font-size:15px;border-bottom:1px solid var(--line);}
  table.ret thead th{background:var(--navy);color:#fff;font-size:13px;text-transform:uppercase;letter-spacing:.06em;}
  table.ret td.n{text-align:right;font-variant-numeric:tabular-nums;font-weight:700;color:var(--ink);}
  table.ret tr:last-child td{border-bottom:none;}
  table.ret .opt{font-weight:700;color:var(--ink);}
  table.ret .em{color:var(--gold);font-family:Georgia,serif;font-size:19px;}

  .timeline{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;counter-reset:ph;}
  .phase{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:18px 16px;box-shadow:var(--shadow);}
  .phase .p{font-size:12px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:.08em;}
  .phase .t{font-family:Georgia,serif;font-weight:700;font-size:17px;color:var(--ink);margin:2px 0 8px;}
  .phase p{font-size:13px;color:var(--muted);margin:0;}

  .cta{background:linear-gradient(160deg,#0f2942,#173d5f);color:#fff;text-align:center;padding:56px 0;}
  .cta h2{font-size:32px;color:#fff;margin:0 0 12px;}
  .cta p{color:var(--hero-ink);max-width:66ch;margin:0 auto 22px;font-size:17px;}
  .cta .contact{color:var(--gold2);font-size:15px;font-weight:600;}
  .foot{background:var(--navy);color:var(--hero-mute);text-align:center;padding:22px;font-size:12.5px;
    border-top:1px solid rgba(255,255,255,.08);}

  @media(max-width:760px){
    .kpis{grid-template-columns:repeat(2,1fr);} .kpi:nth-child(2n){border-right:none;}
    .divisions,.figrid,.why,.timeline{grid-template-columns:1fr;}
    .askbox .divider{display:none;}
  }
  @media print{
    .brief{font-size:12px;} section.band{padding:24px 0;} .hero .wrap{padding:30px 28px;}
    figure.chart,.dcard,.why .item,.phase,table.ret{box-shadow:none;}
  }
</style>
"""

def money(v): return f"${v/1000:.1f}M"

BODY = f"""
<div class="brief">

  <header class="hero">
    <div class="wrap">
      <div class="brand">NORCO<small>EGYPT &nbsp;&middot;&nbsp; GENERAL TRADING</small></div>
      <div class="tag" style="margin-top:22px">
        <span>Exclusive Vestwoods (Haier Energy) agency</span>
        <span>Al Reem Plastics &middot; group plant in Angola</span>
        <span>Egypt &middot; Sudan &middot; Algeria &middot; Libya</span>
      </div>
      <h1>Two divisions.<br>One distribution platform.</h1>
      <p class="lede">Invest in NORCO Egypt: high-value lithium energy storage paired with
      fast-turning houseware from the group's own Angola plant &mdash; targeting
      <b style="color:#fff">${M.REV_5YR/1e6:.1f}M revenue</b> and
      <b style="color:#fff">${M.NP_5YR/1e6:.1f}M net profit</b> over five years,
      with every dollar of profit distributed.</p>
      <div class="askbox">
        <div>
          <div class="lbl">Investment sought</div>
          <div class="big num">$1.5M</div>
          <div class="sub">for 50% of NORCO Egypt &middot; band $1.0M &ndash; $1.5M</div>
        </div>
        <div class="divider"></div>
        <div>
          <div class="lbl">Investor return</div>
          <div class="big num">{M.INV_IRR*100:.0f}%<span style="font-size:20px;color:var(--hero-mute)"> IRR &middot; {M.INV_MOIC:.1f}x</span></div>
          <div class="sub">dividends + terminal value at 5&times; Y5 profit</div>
        </div>
        <div class="divider"></div>
        <div>
          <div class="lbl">Break-even</div>
          <div class="big num">Month 4</div>
          <div class="sub">operating &middot; cumulative Month 8</div>
        </div>
      </div>
    </div>
  </header>

  <div class="kpis">
    <div class="kpi"><div class="v num">${M.REV_5YR/1e6:.1f}M</div><div class="l">5-yr revenue</div></div>
    <div class="kpi"><div class="v num">${M.NP_5YR/1e6:.1f}M</div><div class="l">5-yr net profit</div></div>
    <div class="kpi"><div class="v num">76</div><div class="l">containers / yr by Y5</div></div>
    <div class="kpi"><div class="v num">100%</div><div class="l">profit distributed yearly</div></div>
  </div>

  <section class="band">
    <div class="wrap">
      <div class="eyebrow">The opportunity</div>
      <h2 class="sec">Why the two divisions fit together</h2>
      <p class="sec-lead">Vestwoods brings the ticket size; Al Reem brings the cash velocity and a
      margin locked in by the group's own plant. One licence, one warehouse, one team.</p>
      <div class="why">
        <div class="item"><div class="h"><b>Complementary</b> cash cycles</div>
          <p>Vestwoods containers are prepaid in Year 1 &mdash; heavy but high-value. Al Reem's
          20,000-unit houseware containers turn in weeks and throw off cash that cushions the
          battery ramp.</p></div>
        <div class="item"><div class="h"><b>Locked-in</b> houseware margin</div>
          <p>Al Reem Plastics is the group's own producer in Angola. NORCO buys 30% below price
          list &mdash; a guaranteed 30% retail / 20% wholesale margin no third-party supplier can
          squeeze.</p></div>
        <div class="item"><div class="h"><b>Priced to win</b> in batteries</div>
          <p>Vestwoods retails 15&ndash;26% below tier-1 brands per kWh with Haier pedigree, a
          5-year warranty and a Cairo service bench the grey market cannot match.</p></div>
      </div>
    </div>
  </section>

  <section class="band alt">
    <div class="wrap">
      <div class="eyebrow">The divisions</div>
      <h2 class="sec">What NORCO sells</h2>
      <div class="divisions">
        <div class="dcard vw">
          <div class="tag">Division 1 &middot; Energy storage</div>
          <h3>Vestwoods &mdash; Haier Energy BESS</h3>
          <p>Exclusive Egypt agency for lithium (LFP) storage, hybrid inverters and telecom power.
          Egypt sells 50/50 retail-wholesale; Sudan, Algeria and Libya buy at wholesale on
          cash-before-shipment terms.</p>
          <ul>
            <li>340 units / 40ft &middot; landed cost $342,316</li>
            <li>Container sells $472,680 retail / $393,882 wholesale</li>
            <li>Committed Sudan buyer; Algeria on 100% LC from Month 8</li>
          </ul>
          <div class="metric">
            <div><div class="n num">${M.VW_REV[4]/1e6:.1f}M</div><div class="c">Year-5 revenue</div></div>
            <div><div class="n num">13 &rarr; 41</div><div class="c">containers Y1 &rarr; Y5</div></div>
          </div>
        </div>
        <div class="dcard ar">
          <div class="tag">Division 2 &middot; Houseware</div>
          <h3>Al Reem Plastics &mdash; Angola</h3>
          <p>69 SKUs and 20,488 units per container of storage, kitchen, laundry and tableware,
          costed line-by-line from the July-2026 packing list. Sold in Egypt (retail + wholesale)
          and Sudan (wholesale).</p>
          <ul>
            <li>Landed cost $59,343 per container, 30% below list</li>
            <li>Margin locked: 30% retail / 20% wholesale</li>
            <li>Local-brand prices with imported-brand finish</li>
          </ul>
          <div class="metric">
            <div><div class="n num">${M.AR_REV[4]/1e6:.1f}M</div><div class="c">Year-5 revenue</div></div>
            <div><div class="n num">15 &rarr; 35</div><div class="c">containers Y1 &rarr; Y5</div></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="band">
    <div class="wrap">
      <div class="eyebrow">Market study</div>
      <h2 class="sec">Priced to win on both shelves</h2>
      <p class="sec-lead">NORCO's June-2026 Cairo market survey: Vestwoods undercuts every warrantied
      competitor per kWh, and Al Reem lands at local-brand price points with full margin intact.</p>
      <div class="figrid">
        <figure class="chart full"><img alt="Battery price per kWh comparison" src="{CH['battery_prices.png']}">
          <figcaption>Vestwoods at $266/kWh vs. $303&ndash;$460 for warrantied competitors; only the
          no-warranty grey market is cheaper. Houseware: Al Reem's 90L waste bin retails EGP 869 vs.
          EGP 800&ndash;1,000 local and EGP 1,100&ndash;1,400 imported.</figcaption></figure>
      </div>
    </div>
  </section>

  <section class="band alt">
    <div class="wrap">
      <div class="eyebrow">The numbers</div>
      <h2 class="sec">Financial trajectory</h2>
      <p class="sec-lead">Margins are set by verified unit economics: Vestwoods COGS is 72% of retail
      and 87% of wholesale revenue; Al Reem margins are contractual. Year 1 is modelled monthly.</p>
      <div class="figrid">
        <figure class="chart full"><img alt="Group revenue by division" src="{CH['revenue_by_division.png']}">
          <figcaption>Group revenue scales from ${M.REV[0]/1e6:.1f}M to ${M.REV[4]/1e6:.1f}M.</figcaption></figure>
        <figure class="chart"><img alt="Gross and net profit" src="{CH['profit_trend.png']}">
          <figcaption>Profitable from Year 1; net profit reaches ${M.NP[4]/1e3:,.0f}K by Year 5.</figcaption></figure>
        <figure class="chart"><img alt="Vestwoods revenue by market" src="{CH['revenue_by_market.png']}">
          <figcaption>Four Vestwoods markets compounding.</figcaption></figure>
        <figure class="chart"><img alt="Containers per year" src="{CH['containers.png']}">
          <figcaption>Container throughput, both divisions.</figcaption></figure>
        <figure class="chart"><img alt="Year 1 monthly cash position" src="{CH['y1_cash.png']}">
          <figcaption>Year-1 cash never goes below ${M.MIN_CASH_WITH_RAISE/1e3:,.0f}K with the raise;
          ends at ${M.Y1_END_CASH/1e6:.2f}M.</figcaption></figure>
      </div>
    </div>
  </section>

  <section class="band">
    <div class="wrap">
      <div class="eyebrow">The return</div>
      <h2 class="sec">What the investor earns</h2>
      <p class="sec-lead">$1.5M buys 50% of NORCO Egypt. 100% of net profit is distributed annually in
      arrears; NORCO UAE (20% shareholder) anchors the agency and the Angola supply line.</p>
      <div class="figrid">
        <figure class="chart"><img alt="Investor cash flow" src="{CH['returns.png']}">
          <figcaption>Dividends build to ${M.INV_DIV[4]/1e3:,.0f}K/yr; terminal value of
          ${M.INV_TERMINAL/1e6:.1f}M at a conservative 5&times; Year-5 profit.</figcaption></figure>
        <figure class="chart"><img alt="Cumulative net profit vs capital" src="{CH['cumulative_profit.png']}">
          <figcaption>Cumulative net profit passes the full $1.5M investment during Year 3.</figcaption></figure>
        <figure class="chart full"><img alt="Use of funds" src="{CH['use_of_funds.png']}">
          <figcaption>Two milestone-gated tranches: $1.0M at close, $0.5M at Month 4 against
          verified sell-through and Sudan advances. Peak funding need: ${abs(M.PEAK_DEFICIT)/1e6:.2f}M.</figcaption></figure>
      </div>
    </div>
  </section>

  <section class="band alt">
    <div class="wrap">
      <div class="eyebrow">The plan</div>
      <h2 class="sec">Execution roadmap</h2>
      <div class="timeline">
        <div class="phase"><div class="p">M1&ndash;M3</div><div class="t">Launch</div><p>T1 drawn; first Vestwoods POs prepaid; New Cairo showroom opens; first Al Reem containers land; Sudan first order.</p></div>
        <div class="phase"><div class="p">M4&ndash;M6</div><div class="t">Prove</div><p>Operating break-even (M4); T2 drawn on milestones; dealers signed; houseware sell-through in both showrooms.</p></div>
        <div class="phase"><div class="p">M7&ndash;M12</div><div class="t">Convert</div><p>Algeria first LC orders ship (M8); cumulative break-even (M8); hypermarket listings; Libya due diligence.</p></div>
        <div class="phase"><div class="p">M13&ndash;M18</div><div class="t">Compound</div><p>Vestwoods credit terms activate; Libya launches; full dividend distributions begin.</p></div>
        <div class="phase"><div class="p">Y3&ndash;Y5</div><div class="t">Scale</div><p>41 Vestwoods + 35 Al Reem containers/yr; Alexandria branch; closing cash ${M.CF_CLOSE[4]/1e6:.1f}M.</p></div>
      </div>
    </div>
  </section>

  <section class="cta">
    <div class="wrap">
      <div class="eyebrow" style="color:var(--gold2)">The ask</div>
      <h2 class="serif">$1.5M for half of a platform<br>that is already built</h2>
      <p>An exclusive energy-storage agency priced under every warrantied competitor, a group-owned
      houseware supply line with locked margins, four markets in motion, and a founder already
      invested and operational.</p>
      <p class="contact">Fadi Jannan &middot; Managing Director &nbsp;&middot;&nbsp; f.jannan@norcotrading.com &nbsp;&middot;&nbsp; +971 58 509 3383</p>
    </div>
  </section>

  <div class="foot">NORCO Egypt &middot; Business Plan &amp; Investment Proposal &middot; Version 5.0 (Group) &middot; Strictly Private &amp; Confidential</div>
</div>
"""

# Artifact fragment (style + body, no doctype/head/body)
frag = STYLE + BODY
with open(os.path.join(HERE, "..", "NORCO_Investor_Brief.fragment.html"), "w") as f:
    f.write(frag)

# Standalone (full doc) for local rendering & sending to user
standalone = ("<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\">"
              "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">"
              "<title>NORCO — Investment Proposal</title>"
              "<style>body{margin:0}</style>" + STYLE +
              "</head><body>" + BODY + "</body></html>")
with open(os.path.join(HERE, "..", "NORCO_Investor_Brief.html"), "w") as f:
    f.write(standalone)

print("Wrote NORCO_Investor_Brief.html and .fragment.html")
