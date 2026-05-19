(function () {
  "use strict";

  var currentScript = document.currentScript;
  var tenantCode = currentScript ? currentScript.getAttribute("data-tenant-code") : "";
  var widgetId = currentScript ? currentScript.getAttribute("data-widget-id") : "";

  if (document.getElementById("kodzen-support-widget")) {
    return;
  }

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var style = document.createElement("style");
    style.textContent =
      "#kodzen-support-widget{position:fixed;right:24px;bottom:24px;z-index:2147483000;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#eaf4ff}" +
      "#kodzen-support-widget *{box-sizing:border-box}" +
      ".kz-widget-panel{position:absolute;right:0;bottom:84px;width:min(340px,calc(100vw - 32px));background:#071426;border:1px solid rgba(54,130,255,.35);border-radius:16px;box-shadow:0 22px 70px rgba(0,0,0,.45);overflow:hidden;transform:translateY(12px) scale(.98);opacity:0;pointer-events:none;transition:opacity .18s ease,transform .18s ease}" +
      ".kz-widget-open .kz-widget-panel{opacity:1;pointer-events:auto;transform:translateY(0) scale(1)}" +
      ".kz-widget-head{padding:18px 18px 14px;background:linear-gradient(135deg,#0f2d57,#063d3d);border-bottom:1px solid rgba(255,255,255,.08)}" +
      ".kz-widget-title{font-weight:800;font-size:16px;line-height:1.2;margin:0 0 6px;color:#fff}" +
      ".kz-widget-subtitle{font-size:13px;line-height:1.45;color:#b9d7ff;margin:0}" +
      ".kz-widget-body{padding:14px;background:#08111f}" +
      ".kz-widget-action{display:flex;align-items:center;gap:10px;width:100%;min-height:48px;padding:12px 14px;margin:0 0 10px;border:1px solid rgba(255,255,255,.1);border-radius:12px;background:#0d1d33;color:#fff;text-decoration:none;font-size:14px;font-weight:700;transition:background .15s ease,border-color .15s ease,transform .15s ease}" +
      ".kz-widget-action:hover{background:#123156;border-color:rgba(54,130,255,.55);transform:translateY(-1px);color:#fff}" +
      ".kz-widget-action:last-child{margin-bottom:0}" +
      ".kz-widget-icon{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:999px;background:#10c9a7;color:#001b16;font-weight:900;flex:0 0 auto}" +
      ".kz-widget-meta{display:block;margin-top:6px;color:#7893b5;font-size:11px;line-height:1.35}" +
      ".kz-widget-toggle{position:relative;display:flex;align-items:center;justify-content:center;width:64px;height:64px;margin-left:auto;border:0;border-radius:999px;background:linear-gradient(135deg,#10c9a7,#1f7cff);color:#fff;font-size:30px;font-weight:900;cursor:pointer;box-shadow:0 14px 34px rgba(16,201,167,.32);transition:transform .15s ease,box-shadow .15s ease}" +
      ".kz-widget-toggle:hover{transform:translateY(-2px);box-shadow:0 18px 42px rgba(31,124,255,.38)}" +
      ".kz-widget-toggle:focus-visible{outline:3px solid rgba(93,173,255,.8);outline-offset:4px}" +
      ".kz-widget-pulse{position:absolute;inset:-10px;border-radius:999px;border:2px solid rgba(16,201,167,.34);animation:kzPulse 2.2s ease-out infinite}" +
      "@keyframes kzPulse{0%{transform:scale(.78);opacity:.9}100%{transform:scale(1.3);opacity:0}}" +
      "@media (max-width:640px){#kodzen-support-widget{right:16px;bottom:16px}.kz-widget-panel{bottom:76px}.kz-widget-toggle{width:58px;height:58px;font-size:28px}}";
    document.head.appendChild(style);

    var root = document.createElement("div");
    root.id = "kodzen-support-widget";
    root.setAttribute("data-widget-id", widgetId || "");
    root.setAttribute("data-tenant-code", tenantCode || "");

    root.innerHTML =
      '<div class="kz-widget-panel" role="dialog" aria-label="Kodzen canli destek">' +
      '  <div class="kz-widget-head">' +
      '    <p class="kz-widget-title">Kodzen Canli Destek</p>' +
      '    <p class="kz-widget-subtitle">Web, yazilim ve otomasyon talepleriniz icin bize hizlica ulasin.</p>' +
      "  </div>" +
      '  <div class="kz-widget-body">' +
      '    <a class="kz-widget-action" href="https://wa.me/905458966096" target="_blank" rel="noopener">' +
      '      <span class="kz-widget-icon">W</span><span>WhatsApp ile yaz</span>' +
      "    </a>" +
      '    <a class="kz-widget-action" href="tel:+905458966096">' +
      '      <span class="kz-widget-icon">T</span><span>Telefonla ara</span>' +
      "    </a>" +
      '    <span class="kz-widget-meta">Kiraci: ' + escapeHtml(tenantCode || "kodzen") + "</span>" +
      "  </div>" +
      "</div>" +
      '<button class="kz-widget-toggle" type="button" aria-label="Canli destegi ac" aria-expanded="false">' +
      '  <span class="kz-widget-pulse" aria-hidden="true"></span><span aria-hidden="true">?</span>' +
      "</button>";

    document.body.appendChild(root);

    var toggle = root.querySelector(".kz-widget-toggle");
    toggle.addEventListener("click", function () {
      var isOpen = root.classList.toggle("kz-widget-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.setAttribute("aria-label", isOpen ? "Canli destegi kapat" : "Canli destegi ac");
    });
  });

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }
})();
