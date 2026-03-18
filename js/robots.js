/**
 * KODZEN TEKNOLOJİ — Robot Animasyonu
 * Canvas'ta pixel-art robotlar: savaşıyor, kodluyor, uzaya çıkıyor!
 * Sonunda biri ekrana bakıp "Hoş geldiniz, sizi bekliyorduk!" diyor
 */
(function () {
  'use strict';

  var SHOWN_KEY = 'kzRobotShown_' + new Date().toDateString();
  // Her gün sadece 1 kez göster
  if (sessionStorage.getItem(SHOWN_KEY)) return;

  var COLORS = {
    teal:    '#00c4a0',
    purple:  '#a855f7',
    gold:    '#f59e0b',
    red:     '#ef4444',
    blue:    '#3b82f6',
    bg:      'rgba(4,6,16,0.93)',
    bgDark:  '#020810',
    star:    'rgba(255,255,255,0.7)',
    text:    '#e2e8f0'
  };

  // ── Overlay ──
  var overlay = document.createElement('div');
  overlay.id = 'kzRobotOverlay';
  overlay.style.cssText = [
    'position:fixed;top:0;left:0;width:100%;height:100%;',
    'z-index:99999;background:' + COLORS.bgDark + ';',
    'display:flex;flex-direction:column;align-items:center;justify-content:center;',
    'opacity:0;transition:opacity .6s ease;'
  ].join('');

  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'max-width:100%;max-height:75vh;';
  overlay.appendChild(canvas);

  var msgBox = document.createElement('div');
  msgBox.style.cssText = [
    'margin-top:1.5rem;text-align:center;opacity:0;transition:opacity .8s;',
    'font-family:"Inter",sans-serif;'
  ].join('');
  msgBox.innerHTML = [
    '<div style="font-size:1.6rem;font-weight:800;color:' + COLORS.teal + ';letter-spacing:.5px;text-shadow:0 0 20px rgba(0,196,160,.5)">',
    '🤖 Hoş Geldiniz — Sizi Bekliyorduk!</div>',
    '<div style="color:#94a3b8;font-size:.92rem;margin-top:.4rem;">KODZEN TEKNOLOJİ &bull; Artvin\'den Dünyaya Yazılım</div>',
    '<button id="kzRobotClose" style="margin-top:1.2rem;background:linear-gradient(135deg,#00c4a0,#00a085);',
    'color:#000;border:none;padding:.6rem 2.2rem;border-radius:30px;font-size:.9rem;font-weight:700;',
    'cursor:pointer;letter-spacing:.5px;transition:transform .2s;" ',
    'onmouseover="this.style.transform=\'scale(1.06)\'" onmouseout="this.style.transform=\'scale(1)\'">',
    '▶ Siteye Gir</button>'
  ].join('');
  overlay.appendChild(msgBox);

  document.body.appendChild(overlay);

  // ── Fade in ──
  requestAnimationFrame(function() {
    overlay.style.opacity = '1';
  });

  document.getElementById('kzRobotClose').addEventListener('click', closeOverlay);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeOverlay();
  });

  function closeOverlay() {
    overlay.style.opacity = '0';
    setTimeout(function() { overlay.remove(); }, 700);
    sessionStorage.setItem(SHOWN_KEY, '1');
  }

  // ── Canvas setup ──
  var W = Math.min(window.innerWidth - 40, 820);
  var H = Math.round(W * 0.52);
  canvas.width = W;
  canvas.height = H;
  var ctx = canvas.getContext('2d');

  // ── Stars ──
  var stars = [];
  for (var i = 0; i < 80; i++) {
    stars.push({ x: Math.random() * W, y: Math.random() * H * 0.7, r: Math.random() * 1.5 + .3, blink: Math.random() * Math.PI * 2 });
  }

  // ── Planet (Earth) ──
  var planet = { x: W * 0.76, y: H * 0.22, r: H * 0.14 };

  // ── Robot class ──
  function Robot(x, y, color, scale) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.scale = scale || 1;
    this.walk = 0;
    this.armAngle = 0;
    this.eyeGlow = 0;
    this.vx = 0;
    this.vy = 0;
    this.state = 'idle'; // idle, walk, code, fight, space, greet
    this.facing = 1;
    this.frame = 0;
    this.hp = 100;
  }

  Robot.prototype.draw = function(t) {
    var ctx2 = ctx;
    var s = this.scale;
    var x = this.x, y = this.y;
    var c = this.color;
    ctx2.save();
    ctx2.translate(x, y);
    if (this.facing < 0) { ctx2.scale(-1,1); }

    // Legs
    var legSwing = Math.sin(t * 0.08 + this.walk) * 8 * s;
    ctx2.fillStyle = c;
    // Left leg
    ctx2.save(); ctx2.translate(-6*s, 0);
    ctx2.rotate((this.state === 'idle' ? 0 : legSwing * 0.04));
    ctx2.fillRect(-4*s, 0, 8*s, 18*s);
    ctx2.fillStyle = '#334155';
    ctx2.fillRect(-4*s, 15*s, 8*s, 6*s); // boot
    ctx2.restore();
    // Right leg
    ctx2.save(); ctx2.translate(6*s, 0);
    ctx2.rotate((this.state === 'idle' ? 0 : -legSwing * 0.04));
    ctx2.fillStyle = c;
    ctx2.fillRect(-4*s, 0, 8*s, 18*s);
    ctx2.fillStyle = '#334155';
    ctx2.fillRect(-4*s, 15*s, 8*s, 6*s);
    ctx2.restore();

    // Body
    ctx2.fillStyle = c;
    ctx2.beginPath();
    ctx2.roundRect(-12*s, -28*s, 24*s, 30*s, 4*s);
    ctx2.fill();

    // Chest detail
    ctx2.fillStyle = 'rgba(0,0,0,0.2)';
    ctx2.fillRect(-7*s, -24*s, 14*s, 8*s);
    ctx2.fillStyle = (this.state === 'fight') ? COLORS.red : COLORS.teal;
    ctx2.fillRect(-5*s, -22*s, 4*s, 4*s);
    ctx2.fillRect(1*s, -22*s, 4*s, 4*s);

    // Arms
    var armL = this.state === 'code' ? Math.sin(t*0.12)*20 - 10 :
               this.state === 'fight' ? Math.sin(t*0.2)*40 - 20 :
               Math.sin(t*0.06)*8;
    var armR = this.state === 'code' ? Math.sin(t*0.12 + 1)*20 - 10 :
               this.state === 'fight' ? -Math.sin(t*0.2)*40 + 20 :
               Math.sin(t*0.06 + 1)*8;

    ctx2.save();
    ctx2.translate(-14*s, -22*s);
    ctx2.rotate(armL * 0.04);
    ctx2.fillStyle = c;
    ctx2.fillRect(-4*s, 0, 7*s, 20*s);
    if (this.state === 'fight') {
      ctx2.fillStyle = COLORS.gold;
      ctx2.beginPath(); ctx2.arc(0, 20*s, 5*s, 0, Math.PI*2); ctx2.fill();
    }
    ctx2.restore();

    ctx2.save();
    ctx2.translate(14*s, -22*s);
    ctx2.rotate(armR * 0.04);
    ctx2.fillStyle = c;
    ctx2.fillRect(-3*s, 0, 7*s, 20*s);
    if (this.state === 'code') {
      // mini laptop
      ctx2.fillStyle = '#1e293b';
      ctx2.fillRect(4*s, 12*s, 14*s, 9*s);
      ctx2.fillStyle = COLORS.blue;
      ctx2.fillRect(5*s, 13*s, 12*s, 7*s);
      // typing dots
      if (Math.floor(t/6) % 2 === 0) {
        ctx2.fillStyle = COLORS.teal;
        ctx2.fillRect(6*s, 15*s, 3*s, 1.5*s);
        ctx2.fillRect(6*s, 17*s, 5*s, 1.5*s);
      }
    }
    ctx2.restore();

    // Head
    var headBob = Math.sin(t * 0.07 + this.walk) * 2;
    ctx2.save(); ctx2.translate(0, headBob);
    ctx2.fillStyle = c;
    ctx2.beginPath();
    ctx2.roundRect(-10*s, -50*s, 20*s, 22*s, 4*s);
    ctx2.fill();

    // Antenna
    ctx2.strokeStyle = c; ctx2.lineWidth = 2*s;
    ctx2.beginPath(); ctx2.moveTo(0, -50*s); ctx2.lineTo(0, -58*s); ctx2.stroke();
    ctx2.fillStyle = (Math.sin(t*0.15) > 0) ? COLORS.teal : COLORS.purple;
    ctx2.beginPath(); ctx2.arc(0, -59*s, 3*s, 0, Math.PI*2); ctx2.fill();

    // Eyes
    var eyeColor = this.state === 'greet' ? COLORS.gold :
                   this.state === 'fight' ? COLORS.red : COLORS.teal;
    var eyeGlow = 0.4 + Math.sin(t * 0.1) * 0.3;
    ctx2.shadowColor = eyeColor; ctx2.shadowBlur = 8*s;
    ctx2.fillStyle = eyeColor;
    ctx2.globalAlpha = eyeGlow;
    ctx2.fillRect(-7*s, -46*s, 5*s, 4*s);
    ctx2.fillRect(2*s, -46*s, 5*s, 4*s);
    ctx2.globalAlpha = 1; ctx2.shadowBlur = 0;

    // Mouth
    if (this.state === 'greet') {
      ctx2.strokeStyle = COLORS.gold; ctx2.lineWidth = 1.5*s;
      ctx2.beginPath();
      ctx2.arc(0, -34*s, 5*s, 0, Math.PI); ctx2.stroke(); // smile
    } else {
      ctx2.fillStyle = 'rgba(0,0,0,.5)';
      ctx2.fillRect(-4*s, -34*s, 8*s, 2*s);
    }
    ctx2.restore();

    ctx2.restore();
  };

  // ── Scene robots ──
  var robots = [
    // Coder robot - sol taraf
    new Robot(W*0.12, H*0.72, COLORS.teal, 0.9),
    // Fighter 1
    new Robot(W*0.38, H*0.72, COLORS.purple, 0.85),
    // Fighter 2  
    new Robot(W*0.52, H*0.72, COLORS.red, 0.85),
    // Space robot - gezegene doğru yürüyor
    new Robot(W*0.72, H*0.58, COLORS.gold, 0.75),
    // Greet robot - ortada, kameraya bakıyor
    new Robot(W*0.28, H*0.72, COLORS.blue, 0.95),
  ];

  robots[0].state = 'code';   // coder
  robots[1].state = 'fight';  // fighter 1
  robots[2].state = 'fight';  // fighter 2
  robots[2].facing = -1;
  robots[3].state = 'space';  // space
  robots[4].state = 'idle';   // greeter - will become greet

  var t = 0;
  var greetShown = false;
  var greetTimer = 0;

  function drawBg() {
    // Space gradient
    var grd = ctx.createLinearGradient(0, 0, 0, H);
    grd.addColorStop(0, '#010409');
    grd.addColorStop(0.6, '#030d1a');
    grd.addColorStop(1, '#060b14');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    // Stars
    stars.forEach(function(s) {
      s.blink += 0.03;
      var a = 0.4 + Math.sin(s.blink) * 0.3;
      ctx.globalAlpha = a;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Earth/Planet
    var p = planet;
    ctx.shadowColor = COLORS.blue; ctx.shadowBlur = 30;
    var eg = ctx.createRadialGradient(p.x - p.r*0.3, p.y - p.r*0.3, p.r*0.1, p.x, p.y, p.r);
    eg.addColorStop(0, '#1d6fa4');
    eg.addColorStop(0.4, '#1a4f7a');
    eg.addColorStop(0.7, '#0d3b5c');
    eg.addColorStop(1, '#030f1f');
    ctx.fillStyle = eg;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();

    // Continent blob
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(40,120,60,.6)';
    ctx.beginPath(); ctx.ellipse(p.x - p.r*0.2, p.y - p.r*0.1, p.r*0.3, p.r*0.2, -0.4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(p.x + p.r*0.25, p.y + p.r*0.1, p.r*0.2, p.r*0.25, 0.6, 0, Math.PI*2); ctx.fill();

    // Atmosphere glow
    ctx.strokeStyle = 'rgba(100,200,255,0.15)'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r + 3, 0, Math.PI*2); ctx.stroke();

    // Ground / platform
    ctx.fillStyle = '#0d1524';
    ctx.fillRect(0, H*0.78, W, H*0.22);
    ctx.fillStyle = 'rgba(0,196,160,.15)';
    ctx.fillRect(0, H*0.78, W, 2);

    // Grid lines on ground
    ctx.strokeStyle = 'rgba(0,196,160,.06)'; ctx.lineWidth = 1;
    for (var gx = 0; gx < W; gx += 40) {
      ctx.beginPath(); ctx.moveTo(gx, H*0.78); ctx.lineTo(gx, H); ctx.stroke();
    }
  }

  function drawCodeScreen() {
    // Monitor behind coder robot
    var mx = W*0.02, my = H*0.38, mw = W*0.18, mh = H*0.32;
    ctx.fillStyle = '#0a1628'; ctx.strokeStyle = 'rgba(0,196,160,.3)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(mx, my, mw, mh, 6); ctx.fill(); ctx.stroke();

    // Screen
    ctx.fillStyle = '#020810';
    ctx.fillRect(mx+4, my+4, mw-8, mh-20);

    // Code lines
    var lines = ['> npm install ai', '✓ model loaded', 'const kz = new AI()', '> training...', '█ 87% done'];
    lines.forEach(function(ln, i) {
      if (i > Math.floor(t/20) % 6) return;
      ctx.fillStyle = i === 0 ? COLORS.teal : i === lines.length-1 ? COLORS.gold : '#64748b';
      ctx.font = 'bold ' + Math.round(mw*0.08) + 'px monospace';
      ctx.fillText(ln, mx+7, my+16 + i*(mh-20)/5.5);
    });
  }

  function drawFightEffects() {
    // Spark between fighters
    if (Math.random() < 0.3) {
      var fx = W*0.45, fy = H*0.55;
      for (var sp = 0; sp < 5; sp++) {
        ctx.strokeStyle = Math.random() > 0.5 ? COLORS.gold : COLORS.red;
        ctx.lineWidth = 1.5; ctx.globalAlpha = Math.random();
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(fx + (Math.random()-0.5)*30, fy + (Math.random()-0.5)*30);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    // VS text
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = COLORS.gold;
    ctx.font = 'bold ' + Math.round(W*0.025) + 'px "Inter",sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ VS ⚡', W*0.45, H*0.44);
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
  }

  function drawSpaceRobot() {
    // Rocket booster flames
    var rx = robots[3].x, ry = robots[3].y;
    ctx.fillStyle = 'rgba(245,158,11,' + (0.3 + Math.random()*0.4) + ')';
    for (var f = 0; f < 4; f++) {
      ctx.beginPath();
      ctx.arc(rx - 8 + f*4, ry + 5, 3 + Math.random()*4, 0, Math.PI*2);
      ctx.fill();
    }
    // Tether line to planet
    ctx.strokeStyle = 'rgba(0,196,160,.2)'; ctx.lineWidth = 1; ctx.setLineDash([4,4]);
    ctx.beginPath(); ctx.moveTo(rx, ry-20); ctx.lineTo(planet.x, planet.y + planet.r); ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawGreetBubble() {
    if (!greetShown) return;
    var bx = robots[4].x - 10, by = robots[4].y - 90;
    ctx.fillStyle = 'rgba(0,196,160,.95)';
    ctx.strokeStyle = COLORS.teal; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(bx - 80, by - 30, 160, 32, 8);
    ctx.fill(); ctx.stroke();
    // Tail
    ctx.beginPath();
    ctx.moveTo(bx - 10, by + 2);
    ctx.lineTo(bx, by + 14);
    ctx.lineTo(bx + 10, by + 2);
    ctx.fillStyle = 'rgba(0,196,160,.95)'; ctx.fill();

    ctx.fillStyle = '#000';
    ctx.font = 'bold ' + Math.round(W*0.018) + 'px "Inter",sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Hoş geldiniz! 👋', bx, by - 10);
    ctx.textAlign = 'left';
  }

  function loop() {
    t++;
    ctx.clearRect(0, 0, W, H);
    drawBg();
    drawCodeScreen();
    drawFightEffects();
    drawSpaceRobot();

    // Space robot floats toward planet
    robots[3].x += Math.sin(t * 0.015) * 0.3;
    robots[3].y -= 0.08;
    if (robots[3].y < H * 0.2) robots[3].y = H * 0.6;

    // Fighter robots advance toward each other then bounce
    if (robots[1].x < W*0.44) robots[1].x += 0.4;
    else robots[1].x = W*0.38;
    if (robots[2].x > W*0.46) robots[2].x -= 0.4;
    else robots[2].x = W*0.52;
    robots[1].walk = t;
    robots[2].walk = t;

    // Greeter robot - after 3s looks at camera
    if (t > 180 && !greetShown) {
      greetShown = true;
      robots[4].state = 'greet';
      // Show speech bubble + message after a moment
      setTimeout(function() {
        msgBox.style.opacity = '1';
      }, 800);
    }

    // Draw all robots
    robots.forEach(function(r) { r.draw(t); });
    drawGreetBubble();

    if (document.getElementById('kzRobotOverlay')) {
      requestAnimationFrame(loop);
    }
  }

  // Start after tiny delay
  setTimeout(function() { requestAnimationFrame(loop); }, 200);

})();