import React, { useCallback, useEffect, useRef } from "react";
import client, { post } from "../api/api";

export default function useCustomThrottle(fn, dependencies = [], delay = 1000) {
  // let lastTime = 0;
  const lastTimeRef = useRef(0);
  return useCallback(
    (...args) => {
      const now = new Date().getTime();
      if (now - lastTimeRef.current < delay) {
        return;
      }
      lastTimeRef.current = now;
      fn(...args);
    },
    [delay, fn, client, post, ...dependencies]
  );
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
