/**
 * Honest data-period labels for UI copy.
 * Sourced from Layer-2 canonical snapshot (JNPA LDB monthly + NLDSL snapshots).
 * Update this file when the seed snapshot’s latest periods change.
 */
export const DATA_PROVENANCE = {
  /** One-line chip for hero / banners */
  chip: "Data as of June 2026",
  /** Slightly longer chip when space allows */
  chipDetail: "JNPT dwell · June 2026 · Not live AIS",
  /** Primary dwell month judges will ask about (JNPA LDB month-end for JNPT) */
  jnptDwellMonth: "June 2026",
  jnptPeriodKey: "2026-06",
  /** NLDSL / published snapshot for other Indian origins */
  otherPortsSnapshot: "May 2025",
  /** Carrier D&D tariff notice window in the verified pack */
  tariffWindow: "2023–2026 published notices",
  /** IPA Daily Vessels Position coverage */
  ipaVessels: "IPA published days · 3 Jul–25 Aug 2026 (not every calendar day)",
  waitFeeCalendar:
    "Verified JNPT container events 2023; 2024 uses the same month-day analog. No official day-wise wait-fee CSV found for 2025–2026 (JNPA LDB is monthly PDFs).",
  monthlyCargo:
    "Owner CSV · monthly cargo tonnes Oct 2025–Jul 2026 · not wait-fee and not exploded into daily dwell",
  /** Home / About paragraph */
  summary:
    "Figures use published baselines — not live AIS. JNPT export dwell is the JNPA LDB month-end for June 2026; other Indian origins use May 2025 published port snapshots. Demurrage slabs come from verified carrier tariff notices (2023–2026).",
  /** Short footer / dashboard line */
  short:
    "Baselines: JNPT dwell June 2026 (JNPA LDB); other ports May 2025; tariffs 2023–2026. Not live AIS.",
} as const;
