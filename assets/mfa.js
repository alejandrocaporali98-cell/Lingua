// Lingua · two-step verification (TOTP) for the teacher and office accounts.
// Turn it on by scanning a QR code with an authenticator app (Google Authenticator, Microsoft Authenticator, 1Password…).
// Once on, signing in asks for the 6-digit code, and the database (supabase/v10.sql) refuses a session without it.
(function () {
  const L = window.LINGUA, esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const T = {
    en: { title: "Two-step verification", onT: "On.", onD: "Signing in asks for a 6-digit code from your authenticator app.", offT: "Off.", offD: "Add a second step so a stolen password isn’t enough to get into your account.",
      on: "Turn on", off: "Turn off", scan: "1. Scan this code with an authenticator app (Google Authenticator, Microsoft Authenticator…).", key: "Can’t scan? Enter this key in the app:",
      code: "2. Type the 6-digit code the app shows", verify: "Verify and turn on", cancel: "Cancel", bad: "That code isn’t right. Check the app and try again.",
      done: "Two-step verification is on.", offOk: "Two-step verification is off.", sure: "Turn off two-step verification? Your account will only need the password.", err: "Two-step verification isn’t available right now.", busy: "One moment…" },
    es: { title: "Verificación en dos pasos", onT: "Activada.", onD: "Al entrar se pide un código de 6 dígitos de tu app de autenticación.", offT: "Desactivada.", offD: "Agrega un segundo paso para que una contraseña robada no sea suficiente para entrar a tu cuenta.",
      on: "Activar", off: "Desactivar", scan: "1. Escanea este código con una app de autenticación (Google Authenticator, Microsoft Authenticator…).", key: "¿No puedes escanear? Escribe esta clave en la app:",
      code: "2. Escribe el código de 6 dígitos que muestra la app", verify: "Verificar y activar", cancel: "Cancelar", bad: "Ese código no es correcto. Revisa la app e intenta de nuevo.",
      done: "La verificación en dos pasos está activada.", offOk: "La verificación en dos pasos está desactivada.", sure: "¿Desactivar la verificación en dos pasos? Tu cuenta solo pedirá la contraseña.", err: "La verificación en dos pasos no está disponible en este momento.", busy: "Un momento…" }
  };
  const api = () => L.sb && L.sb.auth && L.sb.auth.mfa && L.sb.auth.mfa.listFactors ? L.sb.auth.mfa : null;

  L.mfaPanel = async function (el, lang) {
    const t = T[lang] || T.en, m = api();
    if (!el) return;
    if (!m) { el.hidden = true; return; }
    el.hidden = false;
    const head = `<div class="card-head"><h2>${t.title}</h2></div>`;
    async function draw(note) {
      let list;
      try { const r = await m.listFactors(); if (r.error) throw r.error; list = r.data; } catch (e) { el.innerHTML = head + `<p class="muted">${t.err}</p>`; return; }
      const all = list.all || list.totp || [], on = all.find(f => f.factor_type !== "phone" && f.status === "verified");
      for (const f of all.filter(f => f.status !== "verified")) { try { await m.unenroll({ factorId: f.id }); } catch (e) {} }
      el.innerHTML = head + (note ? `<p class="mfa-note">${note}</p>` : "") + (on
        ? `<p><b>${t.onT}</b> ${t.onD}</p><div class="actions"><button type="button" class="btn sm" id="mfaOff">${t.off}</button></div>`
        : `<p><b>${t.offT}</b> ${t.offD}</p><div class="actions"><button type="button" class="btn primary sm" id="mfaOn">${t.on}</button></div>`);
      const off = el.querySelector("#mfaOff"), go = el.querySelector("#mfaOn");
      if (off) off.onclick = async () => {
        if (!confirm(t.sure)) return; off.disabled = true; off.textContent = t.busy;
        const r = await m.unenroll({ factorId: on.id }); if (r.error) { off.disabled = false; off.textContent = t.off; alert(r.error.message); return; }
        try { await L.sb.auth.refreshSession(); } catch (e) {}
        draw(t.offOk);
      };
      if (go) go.onclick = async () => {
        go.disabled = true; go.textContent = t.busy;
        const { data, error } = await m.enroll({ factorType: "totp", friendlyName: "Lingua " + new Date().toISOString().slice(0, 16) });
        if (error) { go.disabled = false; go.textContent = t.on; el.insertAdjacentHTML("beforeend", `<p class="mfa-bad">${esc(error.message)}</p>`); return; }
        el.innerHTML = head + `<div class="mfa-setup"><p>${t.scan}</p><img class="mfa-qr" src="${esc(data.totp.qr_code)}" alt="QR code" width="180" height="180">
          <p class="muted" style="font-size:.85em">${t.key} <code class="mfa-key">${esc(data.totp.secret)}</code></p>
          <label for="mfaCode"><b>${t.code}</b></label><input id="mfaCode" class="in" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]*" placeholder="123456">
          <p class="mfa-bad" id="mfaBad" hidden></p>
          <div class="actions"><button type="button" class="btn primary sm" id="mfaVerify">${t.verify}</button><button type="button" class="btn ghost sm" id="mfaCancel">${t.cancel}</button></div></div>`;
        const inp = el.querySelector("#mfaCode"), bad = el.querySelector("#mfaBad"), vb = el.querySelector("#mfaVerify");
        inp.focus();
        el.querySelector("#mfaCancel").onclick = async () => { try { await m.unenroll({ factorId: data.id }); } catch (e) {} draw(); };
        const verify = async () => {
          vb.disabled = true; bad.hidden = true;
          const r = await m.challengeAndVerify({ factorId: data.id, code: inp.value.replace(/\D/g, "") });
          if (r.error) { vb.disabled = false; bad.textContent = t.bad; bad.hidden = false; inp.select(); return; }
          draw(t.done);
        };
        vb.onclick = verify; inp.onkeydown = e => { if (e.key === "Enter") verify(); };
      };
    }
    el.innerHTML = head + `<p class="muted">${t.busy}</p>`;
    draw();
  };
})();
