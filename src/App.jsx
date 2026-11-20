import React, { useState, useEffect, useLayoutEffect, useRef, useId } from "react";
import {
  Circle, ChevronDown, ChevronUp, ChevronRight, ChevronsDownUp, AudioLines, CircleStop, Info, RefreshCw, X, Search, ListFilter, Plus,
  Landmark, PanelLeft, Bell, Mic, Sparkles, Settings, HelpCircle, ShieldPlus, Lightbulb,
  Calendar, Wrench, BookOpen,
} from "lucide-react";

/* ============================================================
   BANK ACCOUNTS DEMO: Practice Data > Bank Accounts
   All data is fictional. Shell, nav and tokens come from ATI_Demo.jsx.
   Table follows Design System 3.0, Data Table (Static, Full Width, Compact rows).
   ============================================================ */

/* ---------- data ---------- */
const TODAY_LABEL = "11/20/2026";

const PLAID_ROWS = [
  { id: "p1", institution: "Flagstar Private Internet Banking (formerly Signature Bank)", site: "Athelas WPT (2)", synced: "06/29/2024", linked: "04/04/2024",
    accounts: [{ account: "MOVEMENT CONCEPTS PHYSICAL THERAPY PC", official: "MOVEMENT CONCEPTS PHYSICAL THERAPY PC", number: "5485", type: "DEPOSITORY", linked: "04/04/2024", lastTx: "06/28/2024" }] },
];

const S_WPT = "Athelas WPT (2)";
const S_1606 = "Athelas Testing Child Site (1606)";
const S_B = "Athelas Testing Child Site B (154040)";

/* rows 11 and 12 of each table are invented to fill the second page */
const BAI_ROWS = [
  { id: "b1", missing: "30+ days", number: "1003", site: S_1606, last: "09/18/2026", days: 63 },
  { id: "b2", missing: "30+ days", number: "1006", site: S_B, last: "10/02/2026", days: 49 },
  { id: "b3", missing: "30+ days", number: "1012", site: S_B, last: "10/13/2026", days: 38 },
  { id: "b4", missing: "30+ days", number: "1008", site: S_1606, last: "10/21/2026", days: 30 },
  { id: "b5", missing: "18 days", number: "1004", site: S_B, last: "10/23/2026", days: 28 },
  { id: "b6", missing: "17 days", number: "1010", site: S_WPT, last: "10/23/2026", days: 28 },
  { id: "b7", missing: "15 days", number: "1007", site: S_WPT, last: "10/27/2026", days: 24 },
  { id: "b8", missing: "13 days", number: "1009", site: S_B, last: "10/28/2026", days: 23 },
  { id: "b9", missing: "12 days", number: "1001", site: S_WPT, last: "10/29/2026", days: 22 },
  { id: "b10", missing: "16 days", number: "1002", site: S_WPT, last: "10/29/2026", days: 22 },
  { id: "b11", missing: "11 days", number: "1005", site: S_1606, last: "10/30/2026", days: 21 },
  { id: "b12", missing: "10 days", number: "1011", site: S_B, last: "10/31/2026", days: 20 },
];

const ANATOMY_ROWS = [
  { id: "a1", number: "2004", site: S_B, last: "09/23/2026", days: 58 },
  { id: "a2", number: "2011", site: S_1606, last: "10/03/2026", days: 48 },
  { id: "a3", number: "2007", site: S_WPT, last: "10/11/2026", days: 40 },
  { id: "a4", number: "2005", site: S_1606, last: "10/18/2026", days: 33 },
  { id: "a5", number: "2009", site: S_B, last: "10/22/2026", days: 29 },
  { id: "a6", number: "2002", site: S_WPT, last: "10/24/2026", days: 27 },
  { id: "a7", number: "2012", site: S_B, last: "10/26/2026", days: 25 },
  { id: "a8", number: "2006", site: S_B, last: "10/27/2026", days: 24 },
  { id: "a9", number: "2010", site: S_WPT, last: "10/28/2026", days: 23 },
  { id: "a10", number: "2003", site: S_1606, last: "10/30/2026", days: 21 },
  { id: "a11", number: "2001", site: S_WPT, last: "10/31/2026", days: 20 },
  { id: "a12", number: "2008", site: S_1606, last: "11/01/2026", days: 19 },
];

const masked = (n) => "**** " + n;

/* ---------- navigation ---------- */
const NAV = [
  { id: "ehr", g: "EHR", icon: ShieldPlus, items: ["Calendar", "Patients", "Inbox", "Preferences", "Interventions", "Pharmacy Requests", "Orders"].map((l) => ({ l })) },
  { id: "insights", g: "Insights", icon: Lightbulb, items: [{ l: "Overview" }, { l: "Dashboards", dot: "peach" }, { l: "Performance Analysis" }, { l: "Revenue Analysis" }, { l: "Denials Analysis" }, { l: "A/R Report", dot: "blue" }, { l: "EHR Reports" }, { l: "My Reports" }, { l: "AI Report Builder", dot: "peach" }] },
  { id: "daily", g: "Daily Operations", icon: Calendar, items: [{ l: "Onboarding" }, { l: "Appointments (New)", dot: "peach" }, { l: "Prior Authorizations" }, { l: "Call Center" }, { l: "Agents Center" }, { l: "Claims", dot: "peach" }, { l: "Claim Details" }, { l: "Encounter Details" }, { l: "Remittances", dot: "peach" }, { l: "Patient Responsibility" }] },
  { id: "utilities", g: "Utilities", icon: Wrench, items: ["Posting Tool", "EOB Creation", "Remittances (Old)"].map((l) => ({ l })) },
  { id: "admin", g: "Admin Panel", icon: BookOpen, items: [{ l: "Practice Data", live: true }] },
];
const NAV_OPEN = { ehr: false, insights: true, daily: true, utilities: true, admin: true };

const CM_ITEMS = ["Contracts", "Fee schedules", "Payer Hierarchy", "Documents", "Destination"];
const BANK_ITEMS = [["plaid", "Plaid"], ["bai", "BAI"], ["anatomy", "Anatomy"]];
const OTHER_ITEMS = ["Line Item Options", "Write-Off Reasons", "Skip Collection Reasons", "Adjustment Types", "Provider Credentialing"];
const PAGE_TITLE = { plaid: "Plaid", bai: "BAI", anatomy: "Anatomy" };

function SubGroup({ label, open, onToggle, children }) {
  return (
    <div className="sn-group">
      <button className="sn-gh" aria-expanded={open} onClick={onToggle}>
        <Circle size={16} /><span>{label}</span><ChevronUp size={20} className={open ? "" : "flipc2"} />
      </button>
      {open && <div className="sn-body"><span className="sline" /><div className="sn-list">{children}</div></div>}
    </div>
  );
}

function PracticeNav({ page, onGo, onInert }) {
  const [cmOpen, setCmOpen] = useState(true);
  const [bankOpen, setBankOpen] = useState(true);
  return (
    <aside className="subnav2" aria-label="Practice data">
      <div className="sn-h">Billing</div>
      <SubGroup label="Contract Management" open={cmOpen} onToggle={() => setCmOpen(!cmOpen)}>
        {CM_ITEMS.map((l) => <button key={l} className="sn-item" onClick={onInert}>{l}</button>)}
      </SubGroup>
      <SubGroup label="Bank Accounts" open={bankOpen} onToggle={() => setBankOpen(!bankOpen)}>
        {BANK_ITEMS.map(([k, l]) => (
          <button key={k} className={"sn-item" + (page === k ? " on" : "")} aria-current={page === k ? "page" : undefined} onClick={() => onGo(k)}>{l}</button>
        ))}
      </SubGroup>
      {OTHER_ITEMS.map((l) => <button key={l} className="sn-item top" onClick={onInert}><Circle size={16} />{l}</button>)}
    </aside>
  );
}

/* ---------- Data Table (DS: Data Table, Static, Contained). One component for all three pages. ---------- */
function IconButton({ label, onClick, children, className = "", ...rest }) {
  return <button className={"icon " + className} aria-label={label} onClick={onClick} {...rest}>{children}</button>;
}

function Pop({ title, align = "right", render, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  return (
    <div className="pop" ref={ref}>
      {render({ open, toggle: () => setOpen(!open) })}
      {open && <div className={"pop-menu " + align} role="dialog" aria-label={title}><div className="pop-t">{title}</div>{children}</div>}
    </div>
  );
}

function CheckRow({ checked, onChange, children }) {
  return <label className="chk"><input type="checkbox" checked={checked} onChange={onChange} /><span>{children}</span></label>;
}

function DataTable({ title, onInfo, headerActions, columns, rows, renderActions, expand, searchText, searchPlaceholder = "Search", label }) {
  const [q, setQ] = useState("");
  const [hidden, setHidden] = useState(() => new Set());
  const [sites, setSites] = useState(() => new Set());
  const [open, setOpen] = useState(() => new Set(expand ? rows.map((r) => r.id) : []));
  const [filterRow, setFilterRow] = useState(false);
  const flip = (set, setter, k) => { const n = new Set(set); n.has(k) ? n.delete(k) : n.add(k); setter(n); };
  const siteOptions = [...new Set(rows.map((r) => r.site))];
  const needle = q.trim().toLowerCase();
  const shown = rows.filter((r) => (!sites.size || sites.has(r.site)) && (!needle || searchText(r).toLowerCase().includes(needle)));
  const cols = columns.filter((c) => !hidden.has(c.key));
  const span = (expand ? 1 : 0) + cols.length + (renderActions ? 1 : 0);
  return (
    <section className="dt" aria-label={label || title}>
      <div className="dt-head">
        <div className="dt-title">
          <h1>{title}</h1>
          {onInfo && <button className="info" aria-label={title + " information"} onClick={onInfo}><Info size={16} /></button>}
        </div>
        <div className="dt-bar">
          <div className="tabs" role="tablist" aria-label="Views">
            <button className="tab on" role="tab" aria-selected="true">All</button>
          </div>
          <span className="grow" />
          <button className={"tgl" + (filterRow || sites.size ? " on" : "")} aria-label="Filter" aria-pressed={filterRow} onClick={() => setFilterRow(!filterRow)}><ListFilter size={16} /></button>
          <Pop title="Columns" render={({ open: o, toggle }) => (
            <button className={"tgl" + (o ? " on" : "")} aria-label="Table settings" aria-haspopup="dialog" aria-expanded={o} onClick={toggle}><Settings size={16} /></button>
          )}>
            {columns.map((c) => <CheckRow key={c.key} checked={!hidden.has(c.key)} onChange={() => flip(hidden, setHidden, c.key)}>{c.label}</CheckRow>)}
          </Pop>
          {headerActions}
          <label className="sf">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={searchPlaceholder} aria-label="Search" />
            <Search size={16} />
          </label>
        </div>
        {filterRow && (
          <div className="frow" role="group" aria-label="Filters">
            <Pop title="Site" align="left" render={({ toggle }) => (sites.size
              ? <button className="icon" aria-label="Add filter" onClick={toggle}><Plus size={18} /></button>
              : <button className="fbtn" onClick={toggle}><Plus size={18} />Filter</button>)}>
              {siteOptions.map((o) => <CheckRow key={o} checked={sites.has(o)} onChange={() => flip(sites, setSites, o)}>{o}</CheckRow>)}
            </Pop>
            <div className="fslot">
              {[...sites].slice(0, 3).map((v) => (
                <span key={v} className="fpill">{v}<button className="fx" aria-label={"Remove filter " + v} onClick={() => flip(sites, setSites, v)}><X size={16} /></button></span>
              ))}
              {sites.size > 3 && <span className="fchip">+{sites.size - 3}</span>}
            </div>
            <button className="fhide" onClick={() => setFilterRow(false)}><ChevronsDownUp size={18} />Hide</button>
          </div>
        )}
      </div>
      <div className="dt-box">
        <table className="dtbl">
          <thead>
            <tr>
              {expand && <th className="xcol" aria-label="Expand" />}
              {cols.map((c) => <th key={c.key} style={c.w ? { width: c.w, minWidth: c.w } : undefined}>{c.label}</th>)}
              {renderActions && <th className="act" aria-label="Actions"><span className="actslot" /></th>}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => {
              const isOpen = open.has(r.id);
              return (
                <React.Fragment key={r.id}>
                  <tr className={"mr" + (expand ? " clickable" : "")} onClick={expand ? (e) => { if (!e.target.closest("button")) flip(open, setOpen, r.id); } : undefined}>
                    {expand && (
                      <td className="xcol">
                        <IconButton label={isOpen ? "Collapse row" : "Expand row"} aria-expanded={isOpen} className={isOpen ? "open" : ""} onClick={() => flip(open, setOpen, r.id)}>
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </IconButton>
                      </td>
                    )}
                    {cols.map((c) => <td key={c.key}>{c.render ? c.render(r) : r[c.key]}</td>)}
                    {renderActions && <td className="act"><div className="actslot">{renderActions(r)}</div></td>}
                  </tr>
                  {expand && isOpen && (
                    <tr className="xr"><td colSpan={span}><div className="xc"><div className="xslot">{expand(r)}</div></div></td></tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* Expanded Plaid row: accounts under the institution */
const ACCOUNT_COLS = [["account", "Account", null], ["official", "Account Official Name", null], ["number", "Number", 130], ["type", "Type", 150], ["linked", "Date Linked", 140], ["lastTx", "Last Transaction Date", 190]];
function PlaidAccounts({ row }) {
  return (
    <div className="xbox"><table className="xtbl">
      <thead><tr>{ACCOUNT_COLS.map(([k, l, w]) => <th key={k} style={w ? { width: w } : undefined}>{l}</th>)}</tr></thead>
      <tbody>
        {row.accounts.map((a, i) => (
          <tr key={i}>{ACCOUNT_COLS.map(([k]) => (
            <td key={k} className={k === "account" || k === "official" ? "trunc" : undefined} title={k === "account" || k === "official" ? a[k] : undefined}>
              {k === "number" ? masked(a.number) : k === "type" ? <span className="tag">{a.type}</span> : a[k]}
            </td>
          ))}</tr>
        ))}
      </tbody>
    </table></div>
  );
}

/* ---------- pages ---------- */
/* DS: Icon Button, Size XS (20px, 16px icon). Neutral hover tint, Accent Subtle hover tint. */
function IconButtonXS({ label, onClick, tone = "neutral", children }) {
  return <button className={"ibxs " + tone} aria-label={label} onClick={onClick}>{children}</button>;
}

/* DS: Tooltip (popover surface, strong border, 8px radius, medium 13px label, arrow on top) */
function Tip({ label, children }) {
  const [pos, setPos] = useState(null);
  const ref = useRef(null);
  const popRef = useRef(null);
  const id = useId();
  const show = () => {
    const r = ref.current.getBoundingClientRect();
    setPos({ center: r.left + r.width / 2, top: r.bottom + 8, shift: 0, placed: false });
  };
  const hide = () => setPos(null);
  useLayoutEffect(() => {
    if (pos && !pos.placed && popRef.current) {
      const w = popRef.current.getBoundingClientRect().width;
      const left = pos.center - w / 2;
      const shift = Math.min(0, window.innerWidth - 8 - (left + w)) + Math.max(0, 8 - left);
      setPos({ ...pos, shift, placed: true, w });
    }
  }, [pos]);
  return (
    <span ref={ref} className="tipw" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide} aria-describedby={pos ? id : undefined}>
      {children}
      {pos && (
        <span id={id} role="tooltip" ref={popRef} className="tip"
          style={{ left: pos.center - (pos.w || 0) / 2 + pos.shift, top: pos.top, "--arrow-x": (pos.w || 0) / 2 - pos.shift + "px", visibility: pos.placed ? "visible" : "hidden" }}>
          {label}
        </span>
      )}
    </span>
  );
}

/* DS: Modal (480px, popover surface, 16px radius, header, slot with bottom border, action footer) on an overlay */
function Modal({ title, onClose, children, actions }) {
  const titleId = useId();
  const first = useRef(null);
  useEffect(() => {
    first.current && first.current.focus();
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);
  return (
    <div className="overlay">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="modal-h"><h2 id={titleId}>{title}</h2></div>
        <div className="modal-b">{children}</div>
        <div className="modal-f">{actions(first)}</div>
      </div>
    </div>
  );
}

function PlaidPage({ toast }) {
  const [rows, setRows] = useState(PLAID_ROWS);
  const [spin, setSpin] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const refresh = (id) => { setSpin(id); setTimeout(() => { setSpin(null); toast("Not part of this demo"); }, 1000); };
  const columns = [
    { key: "institution", label: "Institution" },
    { key: "site", label: "Site", w: 220 },
    { key: "synced", label: "Last Synced", w: 160 },
    { key: "linked", label: "Date Linked", w: 160 },
  ];
  return (
    <>
      <DataTable
        title="Plaid"
        columns={columns}
        rows={rows}
        searchPlaceholder="Account Name or Number"
        searchText={(r) => [r.institution, r.site, ...r.accounts.flatMap((a) => [a.account, a.official, a.number])].join(" ")}
        expand={(r) => <PlaidAccounts row={r} />}
        headerActions={<button className="btn primary" disabled><Landmark size={16} />Connect New Bank Account</button>}
        renderActions={(r) => (
          <>
            <Tip label="Bank account needs to be refreshed">
              <IconButtonXS label="Refresh" tone="neutral warn" onClick={() => refresh(r.id)}><RefreshCw size={16} className={spin === r.id ? "spin" : ""} /></IconButtonXS>
            </Tip>
            <IconButtonXS label="Remove" tone="accent" onClick={() => setConfirm(r.id)}><X size={16} /></IconButtonXS>
          </>
        )}
      />
      {confirm && (
        <Modal
          title="Deleting Bank Account"
          onClose={() => setConfirm(null)}
          actions={(first) => (
            <>
              <button ref={first} className="mbtn" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="mbtn danger" onClick={() => { setRows(rows.filter((r) => r.id !== confirm)); setConfirm(null); }}>Yes, I'm Sure</button>
            </>
          )}
        >
          You are about to delete a bank account. Are you sure you want to proceed?
        </Modal>
      )}
    </>
  );
}

/* Missing bank dates chip with a DS Infocon: the Info icon reveals the detail in a Popover on hover or focus */
const BAI_NOTE = "We are missing BAI data for these dates. Athelas has no access to the bank deposits for these dates and cannot reconcile them to their remittances. Please ask your bank to send Athelas the BAI file for these dates. Contact Athelas support if you have questions.";
function MissingChip({ label }) {
  const [pos, setPos] = useState(null);
  const ref = useRef(null);
  const popRef = useRef(null);
  const id = useId();
  const span = label.replace(/^(\d+)\+/, ">$1");
  const show = () => {
    const r = ref.current.getBoundingClientRect();
    const w = 366;
    setPos({ left: Math.min(Math.max(8, r.left + r.width / 2 - w / 2), window.innerWidth - w - 8), top: r.bottom + 8, anchorTop: r.top, flipped: false });
  };
  const hide = () => setPos(null);
  useLayoutEffect(() => {
    if (pos && !pos.flipped && popRef.current) {
      const h = popRef.current.getBoundingClientRect().height;
      if (h && pos.top + h > window.innerHeight - 8) setPos({ ...pos, top: pos.anchorTop - 8 - h, flipped: true });
    }
  }, [pos]);
  return (
    <span ref={ref} className="pill" tabIndex={0} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide} aria-describedby={pos ? id : undefined}>
      {label}<Info size={16} aria-hidden="true" />
      {pos && (
        <span id={id} role="tooltip" ref={popRef} className="infopop" style={{ left: pos.left, top: pos.top }}>
          <span>no transactions for {span}</span>
          <span>{BAI_NOTE}</span>
        </span>
      )}
    </span>
  );
}

function BaiPage({ toast }) {
  const columns = [
    { key: "missing", label: "Missing bank dates", w: 200, render: (r) => <MissingChip label={r.missing} /> },
    { key: "number", label: "Number", w: 160, render: (r) => masked(r.number) },
    { key: "site", label: "Site" },
    { key: "last", label: "Last Transaction Date", w: 220 },
    { key: "days", label: "Days since last transaction", w: 240 },
  ];
  return <DataTable title="BAI" onInfo={() => toast("Not part of this demo")} columns={columns} rows={BAI_ROWS} searchText={(r) => masked(r.number) + " " + r.site} />;
}

function AnatomyPage({ toast }) {
  const columns = [
    { key: "number", label: "Number", w: 200, render: (r) => masked(r.number) },
    { key: "site", label: "Site" },
    { key: "last", label: "Last Transaction Date", w: 220 },
    { key: "days", label: "Days since last transaction", w: 240 },
  ];
  return <DataTable title="Anatomy" onInfo={() => toast("Not part of this demo")} columns={columns} rows={ANATOMY_ROWS} searchText={(r) => masked(r.number) + " " + r.site} />;
}

/* ---------- app ---------- */
/* DS: Dictation Badge (28px, 8px sides, 8px radius). Enabled and Hover when idle; solid accent with audio waves while recording, Stop on hover. */
const WAVES = [8, 4, 12, 16, 8, 12, 8];
function DictationBadge({ active, onToggle }) {
  return (
    <button className={"dict" + (active ? " rec" : "")} aria-label={active ? "Stop dictation" : "Start dictation"} aria-pressed={active} onClick={onToggle}>
      {active && <span className="waves" aria-hidden="true">{WAVES.map((h, i) => <i key={i} style={{ height: h }} />)}</span>}
      <AudioLines size={18} className="dict-i" />
      {active && <CircleStop size={18} className="dict-stop" />}
    </button>
  );
}

export default function App() {
  const [page, setPage] = useState("plaid");
  const [navOpen, setNavOpen] = useState(NAV_OPEN);
  const [navOff, setNavOff] = useState(false);
  const [msg, setMsg] = useState("");
  const [dictating, setDictating] = useState(false);
  const timer = useRef(null);
  const toast = (m) => { setMsg(m); clearTimeout(timer.current); timer.current = setTimeout(() => setMsg(""), 2500); };
  useEffect(() => () => clearTimeout(timer.current), []);
  const inert = () => toast("Not part of this demo");

  return (
    <div className="app">
      <style>{CSS}</style>
      <div className={"shell" + (navOff ? " navoff" : "")}>
        <nav className="sidecol" aria-label="Main">
          <div className="logo">Air</div>
          <div className="sidescroll">
            {NAV.map((g) => {
              const Ic = g.icon, isOpen = navOpen[g.id];
              return (
                <div key={g.id} className="sgroup">
                  <button className="shead" aria-expanded={isOpen} onClick={() => setNavOpen({ ...navOpen, [g.id]: !isOpen })}>
                    <Ic size={16} /><span>{g.g}</span><ChevronDown size={16} className={isOpen ? "flip" : ""} />
                  </button>
                  {isOpen && (
                    <div className="sbody"><span className="sline" />
                      <div className="slist">
                        {g.items.map((it) => (
                          <button key={it.l} className={"ni" + (it.live ? " on" : " off")} onClick={it.live ? undefined : inert}>
                            <span>{it.l}</span>{it.dot && <i className={"ndot " + it.dot} aria-hidden="true" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="sfoot"><span className="avatar">LR</span><Settings size={16} /><span className="grow" /><HelpCircle size={16} /></div>
        </nav>
        <div className="rightcol">
          <header className="hdr">
            <div className="hdr-l">
              <button className="icon hbtn" aria-label={navOff ? "Show navigation" : "Hide navigation"} aria-pressed={navOff} onClick={() => setNavOff(!navOff)}><PanelLeft size={16} /></button>
              <div className="bc"><span className="bc-link">Practice Data</span><ChevronRight size={14} className="bc-sep" /><span className="bc-cur">{PAGE_TITLE[page]}</span></div>
            </div>
            <div className="hdr-c">
              <button className="icon" aria-label="Notifications" onClick={inert}><Bell size={16} /></button>
              <button className="gsearch" onClick={inert}><Search size={16} />Global Search<span className="kbd">⌘K</span></button>
            </div>
            <div className="hdr-r" role="group" aria-label="AI controls">
              <DictationBadge active={dictating} onToggle={() => setDictating(!dictating)} />
              <button className="aitab" onClick={inert}><Mic size={18} />Scribe</button>
              <button className="aitab" onClick={inert}><Sparkles size={18} />Athelas AI</button>
            </div>
          </header>
          <main className="canvas pdc">
            <div className="pd">
              <PracticeNav page={page} onGo={setPage} onInert={inert} />
              <section className="pd-main">
                {page === "plaid" && <PlaidPage toast={toast} />}
                {page === "bai" && <BaiPage toast={toast} />}
                {page === "anatomy" && <AnatomyPage toast={toast} />}
              </section>
            </div>
          </main>
        </div>
      </div>
      {msg && <div className="toast" role="status">{msg}</div>}
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap');
.app{
/* Design System 3.0 tokens (same set as ATI_Demo.jsx). Every color below this block reads from these. */
--fg1:#1f1f1f;--fg2:#454545;--fg3:#737373;--fg-dis:rgba(0,0,0,.4);--fg-accent:#1132ee;--on-accent:#fff;
--bs:rgba(0,0,0,.1);--bst:rgba(0,0,0,.2);
--base:#fff;--solid2:#f5f5f5;--tonal:#f1f3fe;--d5:rgba(0,0,0,.05);--d10:rgba(0,0,0,.1);
--accent:#1132ee;--accent-h:#0d27c0;--accent-sub:rgba(17,50,238,.1);--accent-sub-h:rgba(17,50,238,.05);--accent-text:#0d28bf;
--danger:#b52b2b;--warning:#c27023;
--t-red:rgba(181,43,43,.1);
--solid-inverse:#141414;--fg-on-inverse:#e5e5e5;
--bg-state-accent-subtle-active:var(--accent-sub);--bg-state-accent-subtle-hover:var(--accent-sub-h);--bg-tp-dark-5:var(--d5);--fg-secondary:var(--fg2);--fg-accent-text:var(--fg-accent);
--shadow-soft:rgba(0,0,0,.04);--bg-color-strong-neutral:var(--fg3);--bg-state-base-hover:rgba(89,89,89,.05);--bg-state-danger-strong:var(--danger);--shadow-tip:rgba(0,0,0,.08);--shadow-modal:rgba(0,0,0,.08);--scrim:rgba(0,0,0,.4);--shadow-pop:rgba(0,0,0,.25);
--peach:#ebddd3;--peach-on:#dacbc9;--periwinkle:#b9c1f3;
--r-soft:8px;--r-card:16px;--shadow-info:rgba(0,0,0,.06);--r-semi:4px;--r-field:6px;--r-extra:12px;--r-full:100px;
font-family:'Geist',system-ui,-apple-system,'Segoe UI',sans-serif;color:var(--fg1);font-size:13px;line-height:1.6;height:100vh;display:flex;flex-direction:column;background:var(--tonal);font-variant-numeric:tabular-nums;position:relative}
.app *{box-sizing:border-box}
.app button{font-family:inherit;font-size:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;cursor:pointer}
.app :focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.muted{color:var(--fg3)}.grow{flex:1}
h1{font-size:18px;font-weight:600;line-height:1.2;margin:0}
.row{display:flex;align-items:center}

/* shell */
.shell{flex:1;display:grid;grid-template-columns:232px 1fr;min-height:0;background:var(--tonal)}
.shell.navoff{grid-template-columns:1fr}.shell.navoff .sidecol{display:none}
.sidecol{display:flex;flex-direction:column;gap:16px;padding:8px;min-height:0}
.logo{font-weight:600;font-size:20px;letter-spacing:-.02em;padding:0 8px;height:32px;display:flex;align-items:center}
.sidescroll{flex:1;overflow:auto;border-bottom:1px solid var(--bs)}
.sgroup{display:flex;flex-direction:column;margin-bottom:4px}
.shead{display:flex;align-items:center;gap:6px;height:30px;width:100%;padding:0;border:0;background:transparent;text-align:left;font-weight:500;font-size:14px;color:var(--fg2)}
.shead:hover{color:var(--fg1)}.shead .flip{transform:rotate(180deg);margin-left:2px}
.sbody{display:flex}.sline{width:1px;background:var(--d10);margin:0 12px 12px 8px}
.slist{flex:1;display:flex;flex-direction:column;gap:2px;padding-bottom:12px;min-width:0}
.ni{display:flex;align-items:center;gap:6px;width:100%;text-align:left;background:transparent;border:0;color:var(--fg2);padding:0 8px;height:28px;border-radius:var(--r-soft);overflow:hidden;white-space:nowrap}
.ni span{overflow:hidden;text-overflow:ellipsis;flex:1;min-width:0}
.ni.off{cursor:default}
.ndot{width:10px;height:10px;border-radius:50%;flex:none}.ndot.peach{background:var(--peach)}.ndot.blue{background:var(--periwinkle)}
.ni:hover{background:var(--d5)}.ni.on{background:var(--accent-sub);color:var(--fg-accent);font-weight:500;cursor:default}
.sfoot{display:flex;align-items:center;height:36px;padding-top:8px}
.avatar{width:28px;height:28px;border-radius:50%;border:1px solid var(--bst);display:grid;place-items:center;font-size:11px;font-weight:500;background:var(--base)}
.rightcol{display:flex;flex-direction:column;min-width:0;min-height:0;padding:0 8px 8px 0}
.hdr{display:flex;align-items:center;justify-content:space-between;padding:4px 0;position:relative;height:36px;flex:none}
.hdr-l{display:flex;align-items:center;gap:6px}
.hdr-r{display:flex;align-items:center;gap:4px}
.hdr-l svg{color:var(--fg2);margin:0 6px}
.bc{display:flex;align-items:center}.bc-link{color:var(--fg3)}.hdr-l .bc-sep{color:var(--fg3);margin:0 8px}.bc-cur{font-weight:500}
.hdr-c{position:absolute;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:4px;top:4px;color:var(--fg2)}
.gsearch{display:flex;align-items:center;gap:4px;justify-content:center;width:320px;background:var(--d5);border:0;border-radius:var(--r-soft);padding:3px 6px;color:var(--fg3);position:relative}
.kbd{position:absolute;right:10px;font-size:12px;color:var(--fg-dis)}
/* DS: AI Global Tab Item (28px, 8px sides, 6px gap, 8px radius, 18px icon, label/S in accent). Hover and Active use the accent tints. */
.app .aitab{display:flex;align-items:center;gap:6px;height:28px;padding:0 8px;border:0;border-radius:var(--r-soft);background:transparent;color:var(--fg-accent-text);font-weight:500}
.app .aitab:hover{background:var(--bg-state-accent-subtle-hover)}
.app .aitab.on,.app .aitab:active{background:var(--bg-state-accent-subtle-active)}
/* DS: Dictation Badge */
.app .dict{display:flex;align-items:center;gap:6px;height:28px;padding:0 8px;border:0;border-radius:var(--r-soft);background:transparent;color:var(--fg-accent-text)}
.app .dict:hover{background:var(--bg-state-accent-subtle-hover)}
.app .dict.rec{background:var(--accent);color:var(--on-accent)}
.app .dict.rec:hover{background:var(--accent)}
.dict .dict-stop{display:none}.dict.rec:hover .dict-i{display:none}.dict.rec:hover .dict-stop{display:block}
.waves{display:flex;align-items:center;gap:2px;height:16px}
.waves i{display:block;width:2px;border-radius:2px;background:var(--on-accent);opacity:.5}
.canvas{flex:1;min-height:0;overflow:auto;background:var(--base);border:1px solid var(--bs);border-radius:var(--r-soft);position:relative}
.canvas.pdc{display:flex;flex-direction:column}
.pd{display:grid;grid-template-columns:208px 1fr;min-height:100%;flex:1}
.pd-main{min-width:0;overflow:auto;display:flex;flex-direction:column;min-height:0}

/* practice data secondary menu */
.subnav2{padding:12px;border-right:1px solid var(--bs);display:flex;flex-direction:column;gap:4px;align-self:stretch;width:208px;overflow:auto}
.sn-h{height:28px;display:flex;align-items:center;font-size:15px;font-weight:500;color:var(--fg2)}
.sn-group{display:flex;flex-direction:column}
.sn-gh{display:flex;align-items:center;gap:6px;height:28px;border:0;background:transparent;padding:0;font-weight:500;color:var(--fg2);width:100%;text-align:left}
.sn-gh span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}.sn-gh svg{flex:none}.sn-gh svg:last-child{margin-left:2px}.flipc2{transform:rotate(180deg)}
.sn-body{display:flex}
.sn-list{flex:1;display:flex;flex-direction:column;gap:2px;padding-bottom:12px;min-width:0}
.sn-item{display:flex;align-items:center;gap:6px;width:100%;height:28px;padding:0 8px;border:0;background:transparent;border-radius:var(--r-soft);color:var(--fg2);text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sn-item:hover{background:var(--d5)}.sn-item.on{background:var(--accent-sub);color:var(--accent-text)}
.sn-item.top{padding:0}.sn-item svg{flex:none}

/* buttons and icon buttons (DS: Button, Icon Button) */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:4px;height:28px;border:1px solid var(--bs);background:var(--base);border-radius:var(--r-full);padding:0 14px;font-weight:500;white-space:nowrap}
.btn.primary{background:var(--accent);border-color:var(--accent);color:var(--on-accent)}.btn.primary:hover:not(:disabled){background:var(--accent-h)}
.btn.primary:disabled{background:var(--d5);border-color:transparent;color:var(--fg-dis);cursor:not-allowed}
.icon{border:0;background:transparent;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;color:var(--fg2);padding:0}.icon:hover{background:var(--d5)}
.icon.dis{color:var(--fg-dis);cursor:default;pointer-events:none}
.icon.warn{color:var(--warning)}.icon.acc{color:var(--accent)}
.spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}

/* Data Table, Contained (DS: Table Content Header, Table Heading Cell, Table Row compact) */
.pd-main{padding:16px 16px 16px 16px}
.dt{display:flex;flex-direction:column;gap:8px;width:100%;min-width:0;flex:1;min-height:0}
.dt-head{display:flex;flex-direction:column;gap:4px}
.dt-title{display:flex;align-items:center;gap:6px;padding-bottom:4px}
.dt-title h1{line-height:normal}
.info{border:0;background:transparent;padding:0;width:20px;height:20px;display:grid;place-items:center;color:var(--fg2);border-radius:50%}.info:hover{background:var(--d5)}
.dt-bar{display:flex;align-items:center;gap:6px}
/* DS: Tab Menu Item, Filled, Size S (28px high, 6px sides, 8px radius, 13px regular) */
.tabs{display:flex;align-items:center;gap:8px}
.app .tab{display:flex;align-items:center;gap:4px;height:28px;padding:0 6px;border:0;border-radius:var(--r-soft);background:transparent;color:var(--fg-secondary);font-weight:400}
.tab:hover:not(.on){background:var(--bg-state-accent-subtle-hover)}
.tab.on{background:var(--bg-state-accent-subtle-active);color:var(--fg-accent-text)}
/* DS: Toggle Button (28px square, 8px radius, 4px padding, 16px icon) */
.tgl{display:grid;place-items:center;width:28px;height:28px;padding:4px;border:0;border-radius:var(--r-soft);background:transparent;color:var(--fg1)}
.tgl:hover{background:var(--d5)}
.tgl.on{background:var(--bg-state-accent-subtle-active)}
.pop{position:relative}
.pop-menu{position:absolute;top:32px;min-width:240px;max-height:320px;overflow:auto;padding:8px;background:var(--base);border:1px solid var(--bs);border-radius:var(--r-soft);box-shadow:0 6px 8px var(--shadow-pop);z-index:10;display:flex;flex-direction:column;gap:2px}
.pop-menu.right{right:0}.pop-menu.left{left:0}
.pop-t{font-weight:500;color:var(--fg2);padding:0 4px 4px}
/* DS: Filter Row, Basic Filter, Chip */
.frow{display:flex;align-items:flex-start;gap:8px;padding:4px 0;margin-top:4px}
.fbtn{display:flex;align-items:center;justify-content:center;gap:4px;height:28px;padding:0 14px;border:1px solid var(--bs);border-radius:var(--r-full);background:var(--base);color:var(--fg1);font-weight:500}
.fbtn:hover{background:var(--d5)}
.fslot{flex:1;display:flex;align-items:center;gap:6px;min-width:0;min-height:28px}
.fpill{display:flex;align-items:center;gap:2px;height:28px;padding:0 4px 0 8px;border-radius:var(--r-soft);background:var(--bg-tp-dark-5);color:var(--fg1);white-space:nowrap}
.fx{width:20px;height:20px;padding:0;border:0;border-radius:var(--r-full);background:transparent;display:grid;place-items:center;color:var(--fg2)}.fx:hover{background:var(--d10)}
.fchip{display:flex;align-items:center;justify-content:center;height:28px;padding:0 8px;border-radius:var(--r-soft);background:var(--bg-tp-dark-5);color:var(--fg1);font-weight:500}
.app .fhide{display:flex;align-items:center;justify-content:center;gap:4px;height:28px;padding:0 12px;border:0;border-radius:var(--r-full);background:transparent;color:var(--fg-accent-text);font-weight:500;margin-left:auto}
.fhide:hover{background:var(--bg-state-accent-subtle-hover)}
.chk{display:flex;align-items:center;gap:8px;min-height:28px;padding:0 4px;border-radius:var(--r-semi);white-space:nowrap;color:var(--fg1)}.chk:hover{background:var(--d5)}
.sf{display:flex;align-items:center;justify-content:space-between;gap:8px;width:240px;height:28px;padding:8px;border-radius:var(--r-field);background:var(--d5);color:var(--fg3)}
.sf input{border:0;outline:0;flex:1;min-width:0;font:inherit;background:transparent;color:var(--fg1)}
.sf input::placeholder{color:var(--fg3)}
.sf:focus-within{outline:2px solid var(--accent)}
.dt-box{flex:1;min-height:0;overflow:auto;border:1px solid var(--bs);border-radius:var(--r-soft);background:var(--base)}
.dtbl{border-collapse:separate;border-spacing:0;width:100%;font-size:13px}
.dtbl th{position:sticky;top:0;z-index:1;background:var(--solid2);text-align:left;font-weight:400;color:var(--fg1);padding:0 8px;height:28px;border-bottom:1px solid var(--bs);white-space:nowrap}
.dtbl td{padding:0 8px;height:36px;border-bottom:1px solid var(--bs);color:var(--fg2);white-space:nowrap;background:var(--base)}
.dtbl tr.mr:hover td{background:var(--d5)}
.dtbl tr.mr.clickable{cursor:pointer}
/* the sticky actions cell must stay opaque on hover, otherwise cells scrolling underneath show through */
.dtbl tr.mr:hover td.act{background-color:var(--base);background-image:linear-gradient(var(--d5),var(--d5))}
.dtbl .xcol{width:36px;min-width:36px;padding:0 4px}
.dtbl td.xcol .icon{margin:0 auto}
/* DS: .Table Row Actions, Type=Action Buttons (8px padding, 20px slots, soft shadow on the left edge) */
.dtbl .act{position:sticky;right:0;width:1%;padding:0 8px;box-shadow:-2px 0 4px var(--shadow-soft)}
.actslot{display:flex;align-items:center;gap:8px;min-width:48px;min-height:20px}
.dtbl th.act{z-index:2;box-shadow:none}
.icon.open{background:var(--d5)}
.dtbl tr.xr > td{padding:0;height:auto;border-bottom:0}
/* DS: Expansion Container (6px left border, bottom border) and Expanded Slot (16px sides, 12px top and bottom) */
.xc{display:flex;flex-direction:column;border-left:6px solid var(--bs);border-bottom:1px solid var(--bs)}
.xslot{display:flex;padding:12px 16px 12px 25px;min-width:0}
.xbox{flex:1;min-width:0;border:1px solid var(--bs);border-radius:var(--r-soft);overflow:hidden;background:var(--base)}
.xtbl{flex:1;min-width:0;width:100%;table-layout:fixed;border-collapse:separate;border-spacing:0;font-size:13px}
.xtbl th{position:static;z-index:auto;border-bottom:1px solid var(--bs);background:var(--solid2);text-align:left;font-weight:400;color:var(--fg1);padding:0 12px;height:32px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.xtbl td{padding:10px 12px;height:auto;min-height:48px;color:var(--fg2);white-space:normal;overflow-wrap:anywhere;vertical-align:middle;background:var(--base);border-bottom:1px solid var(--bs)}
.xtbl tbody tr:last-child td{border-bottom:0}
.xtbl tbody tr:hover td{background:var(--d5)}
.xtbl td.trunc{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
/* DS: Tag, Size XS (24px high, 2px sides, 4px gap, label/S, no fill). The -2px margin keeps the label on the cell text edge. */
.tag{vertical-align:middle;display:inline-flex;align-items:center;gap:4px;height:24px;padding:0 2px;margin-left:-2px;color:var(--bg-color-strong-neutral);font-weight:500;white-space:nowrap}
.app input[type=checkbox]{accent-color:var(--accent);width:16px;height:16px;margin:0}

/* Missing bank dates pill: a real problem, so it uses the danger tint */
.pill{vertical-align:middle;display:inline-flex;align-items:center;gap:4px;height:24px;padding:0 2px;margin-left:-2px;color:var(--danger);font-weight:500;cursor:default}
.pill svg{flex:none}
/* DS: Infocon Popover (12px padding, 16px radius, subtle border, soft shadow) */
.infopop{position:fixed;z-index:30;display:flex;flex-direction:column;gap:8px;width:max-content;max-width:366px;padding:12px;background:var(--base);border:1px solid var(--bs);border-radius:var(--r-card);box-shadow:0 2px 8px var(--shadow-info);color:var(--fg1);font-weight:400;white-space:normal;text-align:left}

/* DS: Icon Button XS */
.ibxs{display:grid;place-items:center;width:20px;height:20px;padding:0;border:0;border-radius:var(--r-full);background:transparent;color:var(--fg2)}
.ibxs:hover{background:var(--bg-state-base-hover)}
.ibxs.accent{color:var(--fg-accent-text)}.ibxs.accent:hover{background:var(--bg-state-accent-subtle-hover)}
.ibxs.warn{color:var(--warning)}
/* DS: Tooltip */
.tipw{display:inline-flex}
.tip{position:fixed;z-index:30;padding:8px;border:1px solid var(--bst);border-radius:var(--r-soft);background:var(--base);box-shadow:0 6px 8px var(--shadow-tip);color:var(--fg2);font-weight:500;white-space:nowrap}
.tip:before,.tip:after{content:"";position:absolute;left:var(--arrow-x);transform:translateX(-50%);border-left:9px solid transparent;border-right:9px solid transparent}
.tip:before{top:-8px;border-bottom:7px solid var(--bst)}
.tip:after{top:-7px;border-bottom:7px solid var(--base)}
/* DS: Modal on Overlay */
.overlay{position:fixed;inset:0;z-index:40;display:grid;place-items:center;background:var(--scrim)}
.modal{width:480px;max-width:calc(100vw - 32px);display:flex;flex-direction:column;background:var(--base);border-radius:var(--r-card);box-shadow:0 6px 16px var(--shadow-modal);overflow:hidden}
.modal-h{min-height:48px;padding:12px 16px 12px 20px;display:flex;align-items:center}
.modal-h h2{margin:0;font-size:18px;font-weight:600;line-height:normal;color:var(--fg1)}
.modal-b{padding:16px;border-bottom:1px solid var(--bs);color:var(--fg1)}
.modal-f{display:flex;align-items:center;justify-content:flex-end;gap:6px;padding:16px}
.app .mbtn{height:36px;padding:0 14px;border:0;border-radius:var(--r-full);background:transparent;color:var(--fg-accent-text);font-weight:500;display:inline-flex;align-items:center;justify-content:center}
.mbtn:hover{background:var(--bg-state-accent-subtle-hover)}
.mbtn.danger{padding:0 16px;background:var(--bg-state-danger-strong);color:var(--on-accent)}
.mbtn.danger:hover{background:var(--bg-state-danger-strong);filter:brightness(.92)}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--solid-inverse);color:var(--fg-on-inverse);padding:8px 16px;border-radius:var(--r-soft);z-index:50;box-shadow:0 6px 8px var(--shadow-pop);max-width:80vw}
@media (prefers-reduced-motion:reduce){.spin{animation:none}}
@media (max-width:1000px){.shell{grid-template-columns:1fr}.sidecol{display:none}.hdr-c{display:none}}
`;
