const fmDesignerEvents = require.context('./events', true, /(\.js)$/)

export default fmDesignerEvents.keys().reduce((t, c) => {
  const {key, label, default: fn} = fmDesignerEvents(c);
  return (t[key] = {key, label, fn}), t;
}, {});
