console.time('Time');
await import('./authentication.js');
await import('./hash.js');
await import('./signature.js');
await import('./symmetric.js');
console.timeEnd('Time');
