export function isVisible(elem: HTMLElement) {
  const style = getComputedStyle(elem);

  if (style.display === "none") return false;
  if (style.visibility !== "visible") return false;
  if ((style.opacity as any) === 0) return false;

  if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height + elem.getBoundingClientRect().width === 0) return false;

  const elementPoints: { [key: string]: { x: number; y: number } } = {
    center: {
      x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
      y: elem.getBoundingClientRect().top + elem.offsetHeight / 2,
    },
    topLeft: {
      x: elem.getBoundingClientRect().left,
      y: elem.getBoundingClientRect().top,
    },
    topRight: {
      x: elem.getBoundingClientRect().right,
      y: elem.getBoundingClientRect().top,
    },
    bottomLeft: {
      x: elem.getBoundingClientRect().left,
      y: elem.getBoundingClientRect().bottom,
    },
    bottomRight: {
      x: elem.getBoundingClientRect().right,
      y: elem.getBoundingClientRect().bottom,
    },
  };

  const docWidth = document.documentElement.clientWidth || window.innerWidth;
  const docHeight = document.documentElement.clientHeight || window.innerHeight;

  if (elementPoints.topLeft.x > docWidth) return false;
  if (elementPoints.topLeft.y > docHeight) return false;
  if (elementPoints.bottomRight.x < 0) return false;
  if (elementPoints.bottomRight.y < 0) return false;

  for (let index in elementPoints) {
    const point: { x: number; y: number } = elementPoints[index];
    let pointContainer = document.elementFromPoint(point.x, point.y);
    if (pointContainer !== null) {
      do {
        if (pointContainer === elem) return true;
      } while ((pointContainer = pointContainer.parentNode as HTMLElement));
    }
  }
  return false;
}
