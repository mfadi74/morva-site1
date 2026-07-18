# -*- coding: utf-8 -*-
"""Generate the NORCO Vestwoods investor brief: standalone HTML + artifact fragment (Vestwoods only)."""
import base64, os
import model as M

HERE = os.path.dirname(__file__)
ASSETS = os.path.join(HERE, "..", "assets")

def data_uri(name):
    with open(os.path.join(ASSETS, name), "rb") as f:
        return "data:image/png;base64," + base64.b64encode(f.read()).decode()

CH = {n: data_uri(n) for n in [
    "revenue_by_market.png", "profit_trend.png", "cumulative_profit.png",
    "use_of_funds.png", "containers.png", "returns.png", "y1_cash.png", "battery_prices.png"]}

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
  .hero{background:linear-gradient(160deg,#0f2942 0%,#173d5f 100%);color:var(--hero-ink);
    padding:0;overflow:hidden;position:relative;}
  .hero .wrap{padding:58px 28px 46px;position:relative;z-index:1;}
  .hero .brand{font-family:Georgia,serif;font-size:34px;font-weight:700;letter-spacing:.02em;color:#fff;}
  .hero .brand small{display:block;font-size:12px;letter-spacing:.30em;color:var(--gold2);
    font-family:-apple-system,sans-serif;font-weight:700;margin-top:4px;}
  .hero h1{font-size:clamp(30px,5vw,50px);line-height:1.05;margin:26px 0 14px;color:#fff;font-weight:700;}
  .hero p.lede{font-size:19px;color:var(--hero-ink);max-width:62ch;margin:0 0 30px;}
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
  .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:0;background:var(--navy);}
  .kpi{padding:26px 22px;text-align:center;border-right:1px solid rgba(255,255,255,.09);}
  .kpi:last-child{border-right:none;}
  .kpi .v{font-family:Georgia,serif;font-size:30px;font-weight:700;color:#fff;line-height:1;}
  .kpi .l{font-size:12px;color:var(--hero-mute);text-transform:uppercase;letter-spacing:.09em;margin-top:8px;font-weight:600;}
  section.band{padding:52px 0;}
  section.band.alt{background:var(--card);border-top:1px solid var(--line);border-bottom:1px solid var(--line);}
  h2.sec{font-size:29px;margin:0 0 6px;color:var(--ink);font-weight:700;}
  .sec-lead{color:var(--muted);font-size:17px;margin:0 0 30px;max-width:66ch;}
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
  .mkts{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
  .mkt{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:20px;box-shadow:var(--shadow);
    position:relative;overflow:hidden;}
  .mkt::before{content:"";position:absolute;left:0;top:0;bottom:0;width:5px;}
  .mkt.e::before{background:var(--blue);} .mkt.s::before{background:var(--aqua);}
  .mkt.a::before{background:var(--gold);} .mkt.l::before{background:var(--orange,#eb6834);}
  .mkt h3{font-size:18px;margin:2px 0 6px;color:var(--ink);}
  .mkt p{color:var(--muted);font-size:13.5px;margin:0 0 12px;}
  .mkt .n{font-family:Georgia,serif;font-size:19px;font-weight:700;color:var(--ink);}
  .mkt .c{font-size:11.5px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;}
  .timeline{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;}
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
    .figrid,.why,.timeline,.mkts{grid-template-columns:1fr;}
    .askbox .divider{display:none;}
  }
  @media print{
    .brief{font-size:12px;} section.band{padding:26px 0;} .hero .wrap{padding:34px 28px 30px;}
    figure.chart,.why .item,.phase,.mkt,.askbox{box-shadow:none;break-inside:avoid;}
  }
</style>
"""

def money(v): return f"${v/1e6:.1f}M"

BODY = f"""
<div class="brief">

  <header class="hero">
    <div class="wrap">
      <div class="brand">NORCO<small>EGYPT &nbsp;&middot;&nbsp; GENERAL TRADING</small></div>
      <div class="tag" style="margin-top:22px">
        <span>Exclusive Vestwoods (Haier Energy) agency</span>
        <span>Lithium battery energy storage</span>
        <span>Egypt &middot; Sudan &middot; Algeria &middot; Libya</span>
      </div>
      <h1>Energy storage Egypt<br>can't do without.</h1>
      <p class="lede">Invest in NORCO Egypt, the exclusive distributor of Vestwoods lithium battery
      storage across four North &amp; East African markets &mdash; targeting
      <b style="color:#fff">${M.REV_5YR/1e6:.1f}M revenue</b> and
      <b style="color:#fff">${M.NP_5YR/1e6:.1f}M net profit</b> over five years, with every dollar of
      profit distributed and Year-1 profit alone nearly repaying the raise.</p>
      <div class="askbox">
        <div>
          <div class="lbl">Investment sought</div>
          <div class="big num">$1.0M</div>
          <div class="sub">for 50% of NORCO Egypt &middot; optional $0.5M accelerator</div>
        </div>
        <div class="divider"></div>
        <div>
          <div class="lbl">Investor return</div>
          <div class="big num">{M.INV_IRR*100:.0f}%<span style="font-size:20px;color:var(--hero-mute)"> IRR &middot; {M.INV_MOIC:.1f}x</span></div>
          <div class="sub">{M.INV_MOIC_DIV:.1f}x from dividends alone + terminal value</div>
        </div>
        <div class="divider"></div>
        <div>
          <div class="lbl">Break-even</div>
          <div class="big num">Month 6</div>
          <div class="sub">operating &amp; cumulative break-even</div>
        </div>
      </div>
    </div>
  </header>

  <div class="kpis">
    <div class="kpi"><div class="v num">${M.REV_5YR/1e6:.1f}M</div><div class="l">5-yr revenue</div></div>
    <div class="kpi"><div class="v num">${M.NP_5YR/1e6:.1f}M</div><div class="l">5-yr net profit</div></div>
    <div class="kpi"><div class="v num">41</div><div class="l">containers / yr by Y5</div></div>
    <div class="kpi"><div class="v num">100%</div><div class="l">profit distributed yearly</div></div>
  </div>

  <section class="band">
    <div class="wrap">
      <div class="eyebrow">The opportunity</div>
      <h2 class="sec">Why Vestwoods, why now</h2>
      <p class="sec-lead">Egypt's grid has run structural summer deficits since 2023. Storage is no
      longer a luxury &mdash; it's a purchase of necessity, and NORCO holds the exclusive agency for
      a Haier-backed brand priced to win.</p>
      <div class="why">
        <div class="item"><div class="h"><b>Purchase of</b> necessity</div>
          <p>Load-shedding, diesel escalation and net-metering under Law 87/2015 drive villas, clinics,
          telecom towers and light industry to lithium storage across all four markets.</p></div>
        <div class="item"><div class="h"><b>Priced to win</b> in batteries</div>
          <p>Vestwoods retails 15&ndash;26% below tier-1 brands per kWh with Haier pedigree, a 5-year
          warranty and a Cairo service bench the grey market cannot match.</p></div>
        <div class="item"><div class="h"><b>Exclusive agency</b> + credit</div>
          <p>Price control across Egypt, plus Sinosure-backed supplier credit (10% down + 90% at
          3-month credit) that keeps the working-capital need to ~$0.9M.</p></div>
      </div>
    </div>
  </section>

  <section class="band alt">
    <div class="wrap">
      <div class="eyebrow">The markets</div>
      <h2 class="sec">Four corridors, one agency</h2>
      <div class="mkts">
        <div class="mkt e"><h3>Egypt</h3><p>Core market. Retail + wholesale through two showrooms and a
          dealer network. 50/50 retail-wholesale mix at $433,281/container.</p>
          <div class="n num">6 &rarr; 15</div><div class="c">containers Y1 &rarr; Y5</div></div>
        <div class="mkt s"><h3>Sudan</h3><p>Committed buyer; orders on arrival of first containers.
          50% advance + 50% on delivery &mdash; working-capital positive.</p>
          <div class="n num">4 &rarr; 10</div><div class="c">containers Y1 &rarr; Y5</div></div>
        <div class="mkt a"><h3>Algeria</h3><p>Agency in advanced negotiation; first orders Month 8 on
          100% LC before shipment, FOB Jebel Ali. Zero in-country exposure.</p>
          <div class="n num">3 &rarr; 8</div><div class="c">containers Y1 &rarr; Y5</div></div>
        <div class="mkt l"><h3>Libya</h3><p>Dual-hub distributors (Tripoli + Benghazi) from Year 2 on
          advance / confirmed LC. Chronic-outage residential &amp; telecom demand.</p>
          <div class="n num">0 &rarr; 8</div><div class="c">containers Y2 &rarr; Y5</div></div>
      </div>
    </div>
  </section>

  <section class="band">
    <div class="wrap">
      <div class="eyebrow">Market study</div>
      <h2 class="sec">Priced under every warrantied rival</h2>
      <p class="sec-lead">NORCO's June-2026 Cairo market survey: Vestwoods undercuts every warrantied
      competitor per kWh, and only the no-warranty grey market is cheaper.</p>
      <div class="figrid">
        <figure class="chart full"><img alt="Battery price per kWh comparison" src="{CH['battery_prices.png']}">
          <figcaption>Vestwoods at $266/kWh vs. $303&ndash;$460 for warrantied competitors (Deye,
          Growatt, Pylontech, Huawei). The exclusive agency lets NORCO hold price while winning the
          warranty-sensitive installer, telecom and C&amp;I buyer.</figcaption></figure>
      </div>
    </div>
  </section>

  <section class="band alt">
    <div class="wrap">
      <div class="eyebrow">The numbers</div>
      <h2 class="sec">Financial trajectory</h2>
      <p class="sec-lead">Every figure ties to the companion workbook. Egypt product cost 79% of
      revenue; export sales at wholesale per the founder's supply pricing. Year 1 is modelled monthly.</p>
      <div class="figrid">
        <figure class="chart full"><img alt="Vestwoods revenue by market" src="{CH['revenue_by_market.png']}">
          <figcaption>Revenue scales from ${M.REV[0]/1e6:.1f}M to ${M.REV[4]/1e6:.1f}M across four markets.</figcaption></figure>
        <figure class="chart"><img alt="Gross and net profit" src="{CH['profit_trend.png']}">
          <figcaption>Profitable from Year 1; net profit reaches ${M.NP[4]/1e6:.2f}M by Year 5.</figcaption></figure>
        <figure class="chart"><img alt="Containers per year" src="{CH['containers.png']}">
          <figcaption>13 &rarr; 41 containers/yr across the four corridors.</figcaption></figure>
        <figure class="chart full"><img alt="Year 1 monthly cash position" src="{CH['y1_cash.png']}">
          <figcaption>Year-1 cash never drops below ${M.MIN_CASH_WITH_RAISE/1e3:,.0f}K with the raise;
          ends at ${M.Y1_END_CASH/1e6:.2f}M.</figcaption></figure>
      </div>
    </div>
  </section>

  <section class="band">
    <div class="wrap">
      <div class="eyebrow">The return</div>
      <h2 class="sec">What the investor earns</h2>
      <p class="sec-lead">$1.0M buys 50% of NORCO Egypt. 100% of net profit is distributed annually in
      arrears &mdash; ${(sum(M.INV_DIV))/1e6:.1f}M to the investor in dividends alone
      ({M.INV_MOIC_DIV:.1f}x, {M.INV_IRR_DIV*100:.0f}% IRR) &mdash; and NORCO UAE (20% shareholder)
      anchors the exclusive Vestwoods agency.</p>
      <div class="figrid">
        <figure class="chart"><img alt="Investor cash flow" src="{CH['returns.png']}">
          <figcaption>Dividends build to ${M.INV_DIV[4]/1e6:.2f}M/yr; terminal value of
          ${M.INV_TERMINAL/1e6:.1f}M at 5&times; Year-5 profit.</figcaption></figure>
        <figure class="chart"><img alt="Cumulative net profit vs capital" src="{CH['cumulative_profit.png']}">
          <figcaption>Cumulative net profit clears the full $1.0M investment inside Year 2.</figcaption></figure>
        <figure class="chart full"><img alt="Use of funds" src="{CH['use_of_funds.png']}">
          <figcaption>Two milestone-gated tranches of $500K (close / Month 4) plus an optional $500K
          accelerator. Peak funding need: ${abs(M.PEAK_DEFICIT)/1e6:.2f}M in Jan-27.</figcaption></figure>
      </div>
    </div>
  </section>

  <section class="band alt">
    <div class="wrap">
      <div class="eyebrow">The plan</div>
      <h2 class="sec">Execution roadmap</h2>
      <div class="timeline">
        <div class="phase"><div class="p">M1&ndash;M3</div><div class="t">Launch</div><p>T1 drawn; first Vestwoods POs under Sinosure credit; New Cairo showroom opens; Sudan first order.</p></div>
        <div class="phase"><div class="p">M4&ndash;M6</div><div class="t">Prove</div><p>T2 on milestones; operating &amp; cumulative break-even (M6); dealers signed; first Cairo exhibition.</p></div>
        <div class="phase"><div class="p">M7&ndash;M12</div><div class="t">Convert</div><p>Algeria first LC orders ship (M8); telecom &amp; C&amp;I pipeline; Libya distributor due diligence.</p></div>
        <div class="phase"><div class="p">M13&ndash;M18</div><div class="t">Compound</div><p>Credit terms on all POs; Libya launches; full dividend distributions begin.</p></div>
        <div class="phase"><div class="p">Y3&ndash;Y5</div><div class="t">Scale</div><p>41 containers/yr across four markets; Alexandria branch; B2G desk; closing cash ${M.CF_CLOSE[4]/1e6:.1f}M.</p></div>
      </div>
    </div>
  </section>

  <section class="cta">
    <div class="wrap">
      <div class="eyebrow" style="color:var(--gold2)">The ask</div>
      <h2 class="serif">$1.0M for half of a business<br>that is already built</h2>
      <p>An exclusive energy-storage agency priced under every warrantied competitor, four markets in
      motion, a committed Sudan buyer, and a founder already invested and operational.</p>
      <p class="contact">Fadi Jannan &middot; Managing Director &nbsp;&middot;&nbsp; f.jannan@norcotrading.com &nbsp;&middot;&nbsp; +971 58 509 3383</p>
    </div>
  </section>

  <div class="foot">NORCO Egypt &middot; Vestwoods Business Plan &amp; Investment Proposal &middot; Version 7.0 &middot; Strictly Private &amp; Confidential</div>
</div>
"""

frag = STYLE + BODY
with open(os.path.join(HERE, "..", "NORCO_Vestwoods_Investor_Brief.fragment.html"), "w") as f:
    f.write(frag)
standalone = ("<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\">"
              "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">"
              "<title>NORCO — Vestwoods Investment Proposal</title>"
              "<style>body{margin:0}</style>" + STYLE + "</head><body>" + BODY + "</body></html>")
with open(os.path.join(HERE, "..", "NORCO_Vestwoods_Investor_Brief.html"), "w") as f:
    f.write(standalone)
print("Wrote NORCO_Vestwoods_Investor_Brief.html and .fragment.html")
