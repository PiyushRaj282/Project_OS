const processListEl = document.getElementById('processList');
const algorithmEl = document.getElementById('algorithm');
const quantumRow = document.getElementById('quantumRow');
const quantumEl = document.getElementById('quantum');
const addProcBtn = document.getElementById('addProcBtn');
const clearBtn = document.getElementById('clearBtn');
const runBtn = document.getElementById('runBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stepBtn = document.getElementById('stepBtn');
const resetBtn = document.getElementById('resetBtn');
const exportBtn = document.getElementById('exportBtn');
const themeToggleSwitch = document.getElementById('themeToggleSwitch');

const avgWaitEl = document.getElementById('avgWait');
const avgTurnEl = document.getElementById('avgTurn');
const utilEl = document.getElementById('util');
const totalTimeEl = document.getElementById('totalTime');
const legendEl = document.getElementById('legend');

const pnameEl = document.getElementById('pname');
const arrivalEl = document.getElementById('arrival');
const burstEl = document.getElementById('burst');
const canvas = document.getElementById('ganttCanvas');
const ctx = canvas.getContext('2d');

let processes = [];
let timeline = [];
let playState = { playing: false, currentSegmentIndex: 0, animating: false };
let animRequest = null;

themeToggleSwitch.addEventListener('change', function() {
  if (this.checked) {
    document.documentElement.classList.add('light-mode');
  } else {
    document.documentElement.classList.remove('light-mode');
  }
});

function pickColor(i) {
  const palette = [
    '#7c5cff', '#00c2a8', '#ff7a59', '#ffc857', '#4cc9f0',
    '#f72585', '#7209b7', '#4cc9f0', '#3a86ff', '#ffd60a'
  ];
  return palette[i % palette.length];
}

function renderProcesses() {
  processListEl.innerHTML = '';
  processes.forEach((p, idx) => {
    const div = document.createElement('div');
    div.className = 'proc-item';
    div.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;">
        <div class="idx">${p.name}</div>
        <input class="small" value="${p.name}" data-field="name" data-idx="${idx}" />
      </div>
      <input value="${p.arrival}" data-field="arrival" data-idx="${idx}" />
      <input value="${p.burst}" data-field="burst" data-idx="${idx}" />
      <button title="Remove" data-idx="${idx}" style="background:transparent;border:0;color:var(--muted);cursor:pointer;">✕</button>
    `;
    div.querySelectorAll('input').forEach(inp => {
      inp.addEventListener('change', (e) => {
        const i = +inp.dataset.idx;
        const f = inp.dataset.field;
        if (f === 'arrival') { processes[i].arrival = Math.max(0, parseInt(inp.value || 0)); }
        else if (f === 'burst') { processes[i].burst = Math.max(1, parseInt(inp.value || 1)); processes[i].origBurst = processes[i].burst; }
        else if (f === 'name') { processes[i].name = (inp.value || `P${i + 1}`).toString(); }
        renderLegend();
      });
    });
    div.querySelector('button').addEventListener('click', () => {
      processes.splice(idx,1);
      renderProcesses();
      renderLegend();
    });
    processListEl.appendChild(div);
  });
}

algorithmEl.addEventListener('change', () => {
  quantumRow.style.display = algorithmEl.value === 'RR' ? 'block' : 'none';
});

addProcBtn.addEventListener('click', () => {
  const name  = (pnameEl.value || `P${processes.length+1}`).toUpperCase().trim();
  const arrival = Math.max(0, parseInt(arrivalEl.value || 0));
  const burst   = Math.max(1, parseInt(burstEl.value || 1));
  processes.push({
    id:       processes.length + 1,
    name,
    arrival,
    burst,
    origBurst: burst,
    color:    pickColor(processes.length)
  });
  renderProcesses();
  renderLegend();
  pnameEl.value   = `P${processes.length+1}`;
  arrivalEl.value = 0;
  burstEl.value   = 1;
});

clearBtn.addEventListener('click', () => {
  processes = [];
  timeline  = [];
  stopAnimation();
  resetStats();
  renderProcesses();
  renderLegend();
  drawEmptyCanvas();
});

function scheduleFCFS(procs) {
  const P = procs.map(p => ({ ...p })).sort((a,b) => (a.arrival !== b.arrival ? a.arrival - b.arrival : a.id - b.id));
  let time = 0; const tl = [];
  for (const p of P) {
    if (time < p.arrival) time = p.arrival;
    const start = time;
    const end   = start + p.burst;
    tl.push({ pid: p.id, name: p.name, start, end });
    time = end;
  }
  return tl;
}

function scheduleSJF(procs) {
  const P     = procs.map(p => ({ ...p }));
  const n     = P.length;
  let time     = 0; const tl = []; const done = new Array(n).fill(false);
  P.sort((a,b) => a.arrival - b.arrival || a.id - b.id);
  let completed = 0;
  while (completed < n) {
    const candidates = P.filter((p,i) => !done[i] && p.arrival <= time);
    if (!candidates.length) {
      const nextA = Math.min(...P.filter((p,i)=>!done[i]).map(p=>p.arrival));
      time = Math.max(time, nextA);
      continue;
    }
    let choose = candidates.reduce((a,b) => a.burst <= b.burst ? a : b);
    const idx   = P.findIndex(p => p.id === choose.id);
    const start = time;
    const end   = start + choose.burst;
    tl.push({ pid: choose.id, name: choose.name, start, end });
    time = end;
    done[idx] = true;
    completed++;
  }
  return tl;
}

function scheduleRR(procs, quantum) {
  const P = procs.map(p => ({ ...p, remaining: p.burst }));
  P.sort((a,b) => a.arrival - b.arrival || a.id - b.id);
  let time = 0; const tl = []; const queue = [];
  let idxNextArrival = 0;
  while (idxNextArrival < P.length && P[idxNextArrival].arrival <= time) {
    queue.push(P[idxNextArrival]); idxNextArrival++;
  }
  if (!queue.length && idxNextArrival < P.length) {
    time = P[idxNextArrival].arrival;
    while (idxNextArrival < P.length && P[idxNextArrival].arrival <= time) {
      queue.push(P[idxNextArrival]);
      idxNextArrival++;
    }
  }
  while (queue.length > 0) {
    const proc = queue.shift();
    const exec = Math.min(quantum, proc.remaining);
    const start = Math.max(time, proc.arrival);
    const end   = start + exec;
    tl.push({ pid: proc.id, name: proc.name, start, end });
    proc.remaining -= exec;
    time = end;
    while (idxNextArrival < P.length && P[idxNextArrival].arrival <= time) {
      queue.push(P[idxNextArrival]);
      idxNextArrival++;
    }
    if (proc.remaining > 0) {
      if (!queue.length && idxNextArrival < P.length && P[idxNextArrival].arrival > time) {
        time = Math.max(time, P[idxNextArrival].arrival);
        while (idxNextArrival < P.length && P[idxNextArrival].arrival <= time) {
          queue.push(P[idxNextArrival]); idxNextArrival++;
        }
      }
      queue.push(proc);
    } else {
      if (!queue.length && idxNextArrival < P.length) {
        time = Math.max(time, P[idxNextArrival].arrival);
        while (idxNextArrival < P.length && P[idxNextArrival].arrival <= time) {
          queue.push(P[idxNextArrival]); idxNextArrival++;
        }
      }
    }
  }
  const merged = [];
  for (const seg of tl) {
    if (merged.length && merged[merged.length-1].pid === seg.pid && merged[merged.length-1].end === seg.start) {
      merged[merged.length-1].end = seg.end;
    } else merged.push({ ...seg });
  }
  return merged;
}

function computeStats(tl, procs) {
  if (!tl.length) return { avgWait:0, avgTurn:0, util:0, totalTime:0, details:[] };
  const details = procs.map(p => ({ id:p.id, name:p.name, arrival:p.arrival, burst:p.origBurst }));
  const completion = {};
  tl.forEach(seg => {
    completion[seg.pid] = Math.max(completion[seg.pid] || 0, seg.end);
  });
  let totalBurst = 0;
  details.forEach(d => {
    const comp = completion[d.id] ?? d.arrival;
    d.completion = comp;
    d.turnaround = comp - d.arrival;
    d.waiting    = d.turnaround - d.burst;
    totalBurst   += d.burst;
  });
  const firstArrival = Math.min(...details.map(d=>d.arrival));
  const lastEnd      = Math.max(...tl.map(s=>s.end));
  const totalTime    = lastEnd - firstArrival;
  const util         = totalTime > 0 ? ((totalBurst / totalTime) * 100) : 100;
  const avgWait      = details.reduce((s,d)=>s+d.waiting,0)/details.length;
  const avgTurn      = details.reduce((s,d)=>s+d.turnaround,0)/details.length;
  return { avgWait, avgTurn, util, totalTime, details };
}

function resetStats() {
  avgWaitEl.innerText   = '—';
  avgTurnEl.innerText   = '—';
  utilEl.innerText      = '—';
  totalTimeEl.innerText = '—';
}

function renderLegend() {
  legendEl.innerHTML = '';
  processes.forEach((p,i) => {
    const item = document.createElement('div');
    item.className = 'litem';
    item.innerHTML = `<div class="swatch" style="background:${p.color}"></div><div style="font-weight:600">${p.name}</div>`;
    legendEl.appendChild(item);
  });
}

function drawEmptyCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(255,255,255,0.02)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.font = '16px Inter';
  ctx.fillText('No schedule yet — add processes and click Run Simulation', 24, 40);
}

function timelineToPixels(tl) {
  if (!tl.length) return { scale:1, minT:0, maxT:0, width:canvas.width-40 };
  const minT = Math.min(...tl.map(s=>s.start));
  const maxT = Math.max(...tl.map(s=>s.end));
  const width = canvas.width-120;
  const span  = Math.max(1, maxT-minT);
  return { minT, maxT, scale: width/span, width, span };
}

function drawFullTimeline(tl) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.01)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!tl.length) {
    drawEmptyCanvas();
    ctx.restore();
    return;
  }

  const { minT, maxT, scale, width, span } = timelineToPixels(tl);
  const startX = 60, startY = 70, barHeight = 52;

  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(startX-8, startY+barHeight+16);
  ctx.lineTo(startX+width+8, startY+barHeight+16);
  ctx.stroke();

  tl.forEach(seg => {
    const p = processes.find(x=>x.id===seg.pid) || { color:'#777', name:seg.name };
    const x = startX + Math.round((seg.start-minT)*scale);
    const w = Math.max(2, Math.round((seg.end-seg.start)*scale));
    const y = startY;
    roundRect(ctx, x, y, w, barHeight, 10, true, false, p.color, 1);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font      = '13px Inter';
    ctx.fillText(`${p.name}`, x+10, y+30);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(`${seg.start}`, x-6, startY+barHeight+32);
  });

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillText(`${maxT}`, startX+width-6, startY+barHeight+32);

  ctx.restore();
}

function animateTimeline(tl, fromIndex = 0) {
  if (!tl.length) return;
  playState.currentSegmentIndex = fromIndex;
  playState.playing = true;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  const { minT, maxT, scale, width, span } = timelineToPixels(tl);
  const startX = 60, startY = 70, barHeight = 52;

  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.01)';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(startX-8, startY+barHeight+16);
  ctx.lineTo(startX+width+8, startY+barHeight+16);
  ctx.stroke();
  ctx.restore();

  function drawCompleted(cur) {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.01)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX-8, startY+barHeight+16);
    ctx.lineTo(startX+width+8, startY+barHeight+16);
    ctx.stroke();
    ctx.restore();

    for (let i = 0; i < cur; i++) {
      const seg = tl[i];
      const p   = processes.find(x=>x.id===seg.pid) || { color:'#777', name:seg.name };
      const x   = startX + Math.round((seg.start-minT)*scale);
      const w   = Math.max(2, Math.round((seg.end-seg.start)*scale));
      const y   = startY;
      roundRect(ctx, x, y, w, barHeight, 10, true, false, p.color, 1);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font      = '13px Inter';
      ctx.fillText(`${p.name}`, x+10, y+30);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText(`${seg.start}`, x-6, startY+barHeight+32);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(`${maxT}`, startX+width-6, startY+barHeight+32);
  }

  function animateSegment(index) {
    if (index >= tl.length) {
      playState.playing = false;
      cancelAnimationFrame(animRequest);
      animRequest = null;
      updateStatsDisplay();
      return;
    }
    const seg     = tl[index];
    const p       = processes.find(x=>x.id===seg.pid) || { color:'#777' };
    const segStartPx = startX + Math.round((seg.start-minT)*scale);
    const segEndPx   = startX + Math.round((seg.end-minT)*scale);
    const totalPx    = Math.max(2, segEndPx-segStartPx);
    let drawnPx      = 0;
    const durationMs = Math.max(1000, (seg.end-seg.start)*600); 
    const startTime  = performance.now();

    function step(now) {
      const t = Math.min(1, (now-startTime)/durationMs);
      drawnPx = Math.round(totalPx * t);
      drawCompleted(index);
      roundRect(ctx, segStartPx, startY, drawnPx, barHeight, 10, true, false, p.color, 1);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font      = '13px Inter';
      ctx.fillText(`${p.name}`, segStartPx+10, startY+30);
      const curTimeLabel = seg.start + (seg.end-seg.start)*t;
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText(`${seg.start.toFixed(1)}`, segStartPx-6, startY+barHeight+32);
      ctx.fillText(`${curTimeLabel.toFixed(1)}`, segStartPx+drawnPx-12, startY+barHeight+32);

      if (!playState.playing) {
        return;
      }
      if (t < 1) {
        animRequest = requestAnimationFrame(step);
      } else {
        playState.currentSegmentIndex = index+1;
        animRequest = requestAnimationFrame(() => animateSegment(index+1));
      }
    }
    animRequest = requestAnimationFrame(step);
  }
  animateSegment(fromIndex);
}

function roundRect(ctx, x, y, w, h, r = 8, fill = true, stroke = false, fillColor = '#777', strokeWidth = 1) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y,     x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x,     y + h, r);
  ctx.arcTo(x,     y + h, x,     y,     r);
  ctx.arcTo(x,     y,     x + w, y,     r);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  if (stroke) {
    ctx.lineWidth   = strokeWidth;
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.stroke();
  }
}

function prepareAndRun() {
  if (!processes.length) {
    alert('Add at least one process.');
    return;
  }
  processes.forEach(p => p.origBurst = p.origBurst ?? p.burst);
  const algo = algorithmEl.value;
  let tl = [];
  if (algo === 'FCFS')     tl = scheduleFCFS(processes);
  else if (algo === 'SJF') tl = scheduleSJF(processes);
  else if (algo === 'RR') {
    const q = Math.max(1, parseInt(quantumEl.value || 1));
    tl = scheduleRR(processes, q);
  }
  timeline = tl;
  const stats    = computeStats(tl, processes);
  playState.currentSegmentIndex = 0;
  playState.playing              = true;
  playState.animating            = true;
  renderLegend();
  resetStats();
  animateTimeline(timeline, 0);
}

pauseBtn.addEventListener('click', () => {
  playState.playing = !playState.playing;
  if (playState.playing) {
    if (playState.currentSegmentIndex >= timeline.length) {
      playState.playing = false;
      return;
    }
    animateTimeline(timeline, playState.currentSegmentIndex);
  } else {
    if (animRequest) cancelAnimationFrame(animRequest);
    animRequest = null;
  }
});

runBtn.addEventListener('click', () => {
  stopAnimation();
  processes.forEach(p => p.origBurst = p.origBurst ?? p.burst);
  prepareAndRun();
});

stepBtn.addEventListener('click', () => {
  if (!timeline.length) {
    const algo = algorithmEl.value;
    if (!processes.length) { alert('Add processes first.'); return; }
    if (algo === 'RR') timeline = scheduleRR(processes, Math.max(1, parseInt(quantumEl.value||1)));
    else if (algo === 'SJF') timeline = scheduleSJF(processes);
    else timeline = scheduleFCFS(processes);
  }
  if (animRequest) { cancelAnimationFrame(animRequest); animRequest = null; playState.playing = false; }
  playState.currentSegmentIndex = playState.currentSegmentIndex ?? 0;
  const idx = playState.currentSegmentIndex + 1;
  drawFullTimeline(timeline.slice(0, idx));
  playState.currentSegmentIndex = idx;
  if (idx >= timeline.length) updateStatsDisplay();
});

resetBtn.addEventListener('click', () => {
  stopAnimation();
  timeline   = [];
  playState  = { playing:false, currentSegmentIndex:0, animating:false };
  drawEmptyCanvas();
  resetStats();
});

exportBtn.addEventListener('click', () => {
  const url = canvas.toDataURL('image/png');
  const a   = document.createElement('a');
  a.href     = url;
  a.download = 'gantt.png';
  document.body.appendChild(a);
  a.click();
  a.remove();
});

function stopAnimation() {
  if (animRequest) cancelAnimationFrame(animRequest);
  animRequest = null;
  playState.playing = false;
  playState.animating = false;
}

function updateStatsDisplay() {
  const stats = computeStats(timeline, processes);
  avgWaitEl.innerText   = stats.avgWait.toFixed(2);
  avgTurnEl.innerText   = stats.avgTurn.toFixed(2);
  utilEl.innerText      = stats.util.toFixed(1) + ' %';
  totalTimeEl.innerText = stats.totalTime.toFixed(2);
}

window.addEventListener('resize', () => {
  const rect = canvas.getBoundingClientRect();
  canvas.width  = Math.max(1000, rect.width * (window.devicePixelRatio || 1));
  canvas.height = Math.max(380, rect.height * (window.devicePixelRatio || 1));
  if (timeline && timeline.length) drawFullTimeline(timeline);
  else drawEmptyCanvas();
});

(function init() {
  pnameEl.value   = 'P1';
  arrivalEl.value = 0;
  burstEl.value   = 4;
  quantumEl.value = 3;
  processes = [
    { id:1, name:'P1', arrival:0, burst:4, origBurst:4, color: pickColor(0) },
    { id:2, name:'P2', arrival:1, burst:6, origBurst:6, color: pickColor(1) },
    { id:3, name:'P3', arrival:2, burst:4, origBurst:4, color: pickColor(2) }
  ];
  renderProcesses();
  renderLegend();
  const rect = canvas.getBoundingClientRect();
  canvas.width  = Math.max(1000, rect.width * (window.devicePixelRatio || 1));
  canvas.height = Math.max(380, rect.height * (window.devicePixelRatio || 1));
  drawEmptyCanvas();
})();