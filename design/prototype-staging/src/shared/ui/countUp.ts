/* Counts dashboard numbers up from zero when a screen opens (e.g. "₦86,500", "4.7", "91%").
   Keeps the prefix/suffix and formatting; skipped when the user prefers reduced motion. */
export function countUp(root: ParentNode, selector = '.stat .v', ms = 1200) {
  if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const frames: number[] = [];
  root.querySelectorAll<HTMLElement>(selector).forEach(el => {
    const text = el.textContent ?? '';
    const m = text.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
    if (!m) return;
    const [, pre, num, post] = m;
    const target = Number(num.replace(/,/g, ''));
    if (!isFinite(target) || target === 0) return;
    const decimals = (num.split('.')[1] ?? '').length, commas = num.includes(',');
    const fmt = (v: number) => { const f = v.toFixed(decimals); return commas ? Number(f).toLocaleString('en-NG', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : f; };
    const t0 = performance.now();
    el.style.fontVariantNumeric = 'tabular-nums';
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / ms), eased = 1 - Math.pow(1 - k, 3);
      el.textContent = pre + fmt(target * eased) + post;
      if (k < 1) frames.push(requestAnimationFrame(tick)); else el.textContent = text;
    };
    frames.push(requestAnimationFrame(tick));
  });
  return () => frames.forEach(cancelAnimationFrame);
}
