import React, { useCallback, useEffect, useRef } from "react";
import client, { post } from "../api/api";

export default function useCustomThrottle(fn, delay = 1500) {
  const lastTimeRef = useRef(0);
  return (...args) => {
    const now = new Date().getTime();
    if (now - lastTimeRef.current < delay) {
      return;
    }
    lastTimeRef.current = now;
    fn(...args);
  };
}

export function useCustomSharedThrottle(fn, lastTimeRef, delay = 1500) {
  return (...args) => {
    const now = new Date().getTime();
    if (now - lastTimeRef.current < delay) {
      return;
    }
    lastTimeRef.current = now;
    fn(...args);
  };
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
