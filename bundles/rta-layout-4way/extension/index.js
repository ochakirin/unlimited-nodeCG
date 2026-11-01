module.exports = function (nodecg) {
  // Replicantの初期化
  const stopwatch = nodecg.Replicant('stopwatch', {
    defaultValue: { state: 'stopped', startTime: 0, offset: 0, formatted: '00:00:00' }
  });
  nodecg.Replicant('runners', { defaultValue: ['Player 1', 'Player 2', 'Player 3', 'Player 4'] });
  nodecg.Replicant('points', { defaultValue: [0, 0, 0, 0] });

  let timerInterval;

  function updateTime() {
    if (stopwatch.value.state !== 'running') return;
    const now = Date.now();
    const elapsed = now - stopwatch.value.startTime + stopwatch.value.offset;
    
    // HH:MM:SSにフォーマット
    const h = Math.floor(elapsed / 3600000).toString().padStart(2, '0');
    const m = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
    stopwatch.value.formatted = `${h}:${m}:${s}`;
  }

  nodecg.listenFor('startTimer', () => {
    if (stopwatch.value.state === 'running') return;
    stopwatch.value.startTime = Date.now();
    stopwatch.value.state = 'running';
    timerInterval = setInterval(updateTime, 100); // 描画更新用に100ms周期で回す
  });

  nodecg.listenFor('stopTimer', () => {
    if (stopwatch.value.state !== 'running') return;
    clearInterval(timerInterval);
    stopwatch.value.offset += Date.now() - stopwatch.value.startTime;
    stopwatch.value.state = 'stopped';
  });

  nodecg.listenFor('resetTimer', () => {
    clearInterval(timerInterval);
    stopwatch.value = { state: 'stopped', startTime: 0, offset: 0, formatted: '00:00:00' };
  });
};
