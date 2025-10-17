export const KEY = {
  // 특수 키
  ENTER: "Enter",
  ESCAPE: "Escape",
  TAB: "Tab",
  SPACE: " ", // 혹은 'Spacebar'도 있지만 ' '가 실제 값입니다.
  BACKSPACE: "Backspace",

  // 화살표 키
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",

  // 기타 등등...
  // MDN 페이지에 있는 모든 키 값을 채워 넣습니다.
} as const; // ✨ 'as const'를 붙여서 각 프로퍼티가 string이 아닌 실제 값으로 추론되게 하는 것이 포인트!

// 보너스: 모든 키 값의 유니언 타입도 export 해주면 금상첨화입니다.
export type KeyValue = (typeof KEY)[keyof typeof KEY];
