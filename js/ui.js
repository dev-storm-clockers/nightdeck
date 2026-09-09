/** NightDeck shared UI helpers. */
(function (global) {
  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $all(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function toast(msg, ms) {
    const existing = $(".toast");
    if (existing) existing.remove();
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), ms || 2200);
  }

  function brandHtml(subtitle) {
    return (
      '<div class="brand">' +
      '<div class="brand-mark">ND</div>' +
      "<div><h1>NightDeck</h1><p>" +
      (subtitle || "Staff Night games") +
      "</p></div></div>"
    );
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      toast("Copied");
      return true;
    } catch {
      toast("Copy failed — select the text manually");
      return false;
    }
  }

  function qs(name) {
    return new URLSearchParams(location.search).get(name);
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  global.NightDeckUI = { $, $all, toast, brandHtml, copyText, qs, escapeHtml };
})(window);
