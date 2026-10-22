// Lingua · billing math shared by the teacher panel and the office panel.
// Plans: per class, weekly, monthly or free. Students in the same "family" (siblings)
// share one plan: one amount, one payment and one receipt for all of them.
(function () {
  const L = window.LINGUA;
  const day = d => { const x = new Date(d); return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); };
  const mk = d => day(d).slice(0, 7);
  const at = d => new Date(typeof d === "string" && d.length === 10 ? d + "T12:00" : d);
  const sum = a => a.reduce((t, p) => t + Number(p.amount || 0), 0);
  // (pay_day and family only appear once supabase/v5.sql has added those columns, so saving a plan never sends unknown columns)
  const DEF = id => ({ student_id: id, billing: "per_class", rate: 0, currency: "MXN", phone: null, parent_phone: null });
  const plan = (D, id) => { const r = (D.admin || []).find(a => a.student_id === id); return r ? { ...DEF(id), ...r } : DEF(id); };
  // Everyone who shares this student's plan (just the student when there's no family)
  const members = (D, id) => {
    const a = plan(D, id); if (!a.family) return [id];
    const ids = (D.admin || []).filter(x => x.family === a.family).map(x => x.student_id);
    return ids.includes(id) ? ids : [id].concat(ids);
  };

  // Weeks run Monday–Sunday; a week is named by its pay day (Saturday by default)
  const off = pd => ((pd == null ? 6 : pd) + 6) % 7;
  const weekKey = (d, pd) => { const x = at(d), mon = new Date(x.getFullYear(), x.getMonth(), x.getDate() - ((x.getDay() + 6) % 7), 12); mon.setDate(mon.getDate() + off(pd)); return day(mon); };
  const weekRange = (key, pd) => { const k = at(key), mon = new Date(k); mon.setDate(k.getDate() - off(pd)); const sun = new Date(mon); sun.setDate(mon.getDate() + 6); return [day(mon), day(sun)]; };
  // Newest first: `ahead` weeks after this one, this one, and `back` weeks before
  const weekKeys = (pd, back, ahead) => { const now = at(weekKey(new Date(), pd)), out = []; for (let k = -(ahead || 0); k <= (back || 0); k++) { const d = new Date(now); d.setDate(now.getDate() - 7 * k); out.push(day(d)); } return out; };

  // One week of a weekly plan
  function week(D, id, key) {
    const a = plan(D, id), set = new Set(members(D, id)), rate = Number(a.rate) || 0;
    const cls = (D.classes || []).filter(c => set.has(c.student_id) && weekKey(c.starts_at, a.pay_day) === key);
    const n = st => cls.filter(c => c.status === st).length, by = {};
    cls.filter(c => c.status === "attended" || c.status === "scheduled").forEach(c => { by[c.student_id] = (by[c.student_id] || 0) + 1; });
    const paid = sum((D.payments || []).filter(p => set.has(p.student_id) && p.week === key));
    const attended = n("attended"), scheduled = n("scheduled");
    const due = attended + scheduled > 0 || paid > 0 ? rate : 0;
    return { key, range: weekRange(key, a.pay_day), attended, scheduled, missed: n("missed"), cancelled: n("cancelled"), k: attended + scheduled, by, rate, due, paid, bal: Math.max(0, rate - paid),
      code: paid >= rate && rate > 0 ? "paid" : paid > 0 ? "partial" : attended > 0 ? "pending" : "none" };
  }

  // A month for any plan. Weekly plans count the weeks whose pay day falls in the month
  // and that had at least one class taken (a week off for vacations costs nothing).
  function bill(D, id, m) {
    const a = plan(D, id), ids = members(D, id), set = new Set(ids), rate = Number(a.rate) || 0;
    const all = (D.classes || []).filter(c => set.has(c.student_id)), pays = (D.payments || []).filter(p => set.has(p.student_id));
    let cls, due, weeks = null;
    if (a.billing === "weekly") {
      const keys = new Set(all.map(c => weekKey(c.starts_at, a.pay_day)).concat(pays.map(p => p.week).filter(Boolean)).filter(k => k.slice(0, 7) === m));
      weeks = [...keys].sort().map(k => week(D, id, k));
      weeks.forEach(w => { w.due = w.attended > 0 ? rate : 0; });
      cls = all.filter(c => weekKey(c.starts_at, a.pay_day).slice(0, 7) === m);
      due = weeks.reduce((t, w) => t + w.due, 0);
    } else {
      cls = all.filter(c => mk(c.starts_at) === m);
      const att = cls.filter(c => c.status === "attended").length;
      due = a.billing === "free" ? 0 : a.billing === "monthly" ? rate : att * rate;
    }
    const n = st => cls.filter(c => c.status === st).length, paid = sum(pays.filter(p => p.month === m));
    const code = a.billing === "free" ? "free" : due === 0 && paid === 0 ? "none" : paid >= due ? "paid" : paid > 0 ? "partial" : "pending";
    return { a, ids, family: ids.length > 1, attended: n("attended"), scheduled: n("scheduled"), missed: n("missed"), cancelled: n("cancelled"), due, paid, bal: Math.max(0, due - paid), weeks, code };
  }

  // Billing units for lists: a family shows up once, with all its members
  function units(D, list) {
    const seen = new Set(), out = [];
    list.forEach(s => {
      if (seen.has(s.p.id)) return;
      const grp = members(D, s.p.id).map(i => list.find(x => x.p.id === i)).filter(Boolean);
      (grp.length ? grp : [s]).forEach(x => seen.add(x.p.id));
      out.push(grp.length ? grp : [s]);
    });
    return out;
  }
  // "Erick y Derek Molina" · "Ana Pérez y Luis Gómez"
  function names(full, and) {
    and = " " + (and || "y") + " ";
    const n = full.map(x => String(x || "").trim()).filter(Boolean);
    if (n.length < 2) return n[0] || "";
    const join = a => a.slice(0, -1).join(", ") + and + a[a.length - 1];
    const last = n.map(x => x.split(/\s+/).slice(1).join(" "));
    return last[0] && last.every(l => l === last[0]) ? join(n.map(x => x.split(/\s+/)[0])) + " " + last[0] : join(n);
  }

  L.billing = { plan, members, bill, week, units, names, weekKey, weekRange, weekKeys };
})();
