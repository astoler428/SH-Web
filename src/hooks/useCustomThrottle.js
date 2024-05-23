import React, { useCallback, useEffect, useRef } from "react";

export default function useCustomThrottle(fn, dependencies = [], delay = 1000) {
  let lastTime = 0;
  return useCallback((...args) => {
    const now = new Date().getTime();
    if (now - lastTime < delay) {
      return;
    }
    lastTime = now;
    fn(...args);
  }, dependencies);
}

// export default function useCustomThrottle(fn, dependencies) {
//   const canCallFn = useRef(true);

//   useEffect(() => {
//     canCallFn.current = true;
//   }, dependencies);
//   return async (...args) => {
//     if (!canCallFn.current) {
//       return;
//     }
//     canCallFn.current = false;
//     await fn(...args);
//   };
// }
