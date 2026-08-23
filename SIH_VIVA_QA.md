# Port Sense — SIH viva Q&A (practice sheet)

Short answers you can say out loud. Keep the first sentence; expand only if they dig.

---

## Product basics

**Q: What is Port Sense?**  
A: A demurrage intelligence tool for Indian MSME exporters. It turns port congestion into rupees at risk *before* they book — so they can pick a cheaper origin gate.

**Q: Who is the user?**  
A: Small and medium exporters who can’t buy enterprise logistics platforms. They feel demurrage on thin margins.

**Q: What problem do you solve?**  
A: Avoidable waiting charges at congested Indian ports. The invoice arrives after the margin is gone. We price the wait early.

---

## Demurrage vs detention (they will mix these up)

**Q: What is demurrage?**  
A: Fee when the *container sits at the port/terminal* longer than the carrier’s free days.

**Q: What is detention?**  
A: Fee when you keep the container *outside the port* (warehouse/factory) too long after gate-out.

**Q: Where do you show detention on the website?**  
A: **We don’t.** V1 only prices **demurrage at the Indian origin**. Detention is out of scope so we don’t invent numbers. If a faculty member points at “D&D” on a tariff PDF: that document covers both; our calculator uses the demurrage slabs only.

---

## Data — where stored, how it works

**Q: Where is the data stored?**  
A: In a **canonical snapshot** — a versioned JSON file (`data/canonical-snapshot.json`) built by Layer 2. The Next.js APIs load that snapshot on the server. Not a live AIS feed, not a random Excel on the laptop during demo.

**Q: Where do the raw sources come from?**  
A: Verified packs under our data room: JNPA LDB monthly dwell for JNPT, published port snapshots for other gates, carrier tariff notices for free time + demurrage slabs. Each fact keeps a citation path.

**Q: What month is this data?**  
A: **JNPT dwell = June 2026** (JNPA LDB month-end). **Other Indian ports = May 2025** snapshots. **Tariffs = 2023–2026 published notices.** Stated on Home, About, and Dashboard.

**Q: How does the data flow work?**  
A: Five layers:  
1) **Ingestion** — validate source files  
2) **Canonical** — trusted facts in one snapshot  
3) **Cost / Risk** — dwell + free time + slabs → ₹ + risk  
4) **Lanes** — rank origins for a destination  
5) **Explanation** — template “why” with citations  
UI (`port-sense`) only calls APIs; it doesn’t invent math.

**Q: Is this live / real-time?**  
A: No. Published baselines + a congestion buffer estimate. We refuse fake live AIS. Honesty is a feature for SIH evaluation.

**Q: What if data is missing?**  
A: **Fail closed** — show insufficient / Unknown (e.g. ocean transit to USA), never invent sailing days.

---

## Numbers on screen

**Q: Why can demurrage be ₹0?**  
A: Estimated dwell is still inside carrier **free time**. That is correct, not a bug.

**Q: What does the Carrier dropdown do?**  
A: Each line has different free days and demurrage slabs. Same boxes, different ₹. “Not decided” defaults to Maersk as a planning proxy.

**Q: Why JNPT → Dubai, not AEJEA?**  
A: UI shows plain names (JNPT, Dubai, USA). Codes like AEJEA/INNSA are internal UN/LOCODEs in the backend only.

**Q: What does the orange bar next to a lane mean?**  
A: Selected row highlight — which lane you clicked.

**Q: What does the dashed line on the map mean?**  
A: Illustrative **sea route** around the coast for from→to. Not land, not live ship tracking.

---

## Tech stack (30 seconds)

**Q: Tech stack?**  
A: **Next.js + React + TypeScript + Tailwind** for UI. **Leaflet** for maps. **Recharts** for charts. Business logic in five **TypeScript layer packages** with a service-layer / clean architecture. Deployed on **Vercel**; code on **GitHub**.

**Q: Why layers / clean architecture?**  
A: UI must not own pricing math. Swap a live feed later without rewriting the dashboard. Test and cite each stage.

**Q: Frontend vs backend?**  
A: Same Next.js app: React pages + `/api/lanes`, `/api/risk`, `/api/health` server routes that call Layers 2–5.

---

## Scope & honesty (marks magnets)

**Q: What is out of scope?**  
A: Live AIS, invented ocean transit, full detention calculator, full freight rates, black-box AI invoice prediction.

**Q: Why include USA if transit is Unknown?**  
A: To show we still compare **Indian-origin demurrage** for that booking choice, without faking sailing days we don’t have.

**Q: How does this help policy / Sagarmala?**  
A: Lower avoidable logistics cost for MSMEs → export competitiveness. We speak in rupees, not jargon.

---

## One-liner close

> “Port Sense: cited published port + tariff data → demurrage ₹ at Indian gates → ranked lanes before booking. Not live AIS. Not detention. June 2026 JNPT dwell.”
