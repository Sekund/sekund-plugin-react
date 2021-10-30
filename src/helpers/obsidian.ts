export function setHandleDisplay(value) {
	const resizeHandles: HTMLCollectionOf<Element> = document.getElementsByClassName("workspace-leaf-resize-handle");
	for (let i = 0; i < resizeHandles.length; i++) {
		const handle = resizeHandles.item(i) as HTMLElement;
		handle.style.display = value;
	}
}
