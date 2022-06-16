import { useAppContext } from "@/state/AppContext";
import { debounce } from "ts-debounce";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { isTouchDevice } from "@/utils";

const HeightAdjustableContext = createContext({} as any);

export const HeightAdjustable = ({ children, parentComponent, ...props }) => {
  const [adjustedHeight, setAdjustedHeight] = useState<number>(300);
  const yDividerPos = useRef<number | null>(null);
  const { appState } = useAppContext();

  const onMouseHoldDown = (e: MouseEvent) => {
    yDividerPos.current = e.clientY;
  };

  useEffect(() => {
    (async () => {
      const touchDevice = isTouchDevice();
      if (!touchDevice && appState.plugin) {
        if (!appState.plugin.settings) {
          await appState.plugin?.loadSettings();
        }
        if (appState.plugin.settings.notePanelHeight) {
          setAdjustedHeight(appState.plugin.settings.notePanelHeight);
        }
      }
    })();
  }, []);

  const onMouseHoldUp = () => {
    yDividerPos.current = null;
  };

  const onMouseHoldMove = async (e: MouseEvent) => {
    if (yDividerPos.current) {
      const rect = parentComponent.current.getBoundingClientRect();
      var y = e.clientY - rect.top;
      setAdjustedHeight(parentComponent.current.offsetHeight - y);
      if (appState.plugin) {
        appState.plugin.settings.notePanelHeight = adjustedHeight;
        const saveSettings = () => {
          if (appState.plugin) {
            appState.plugin.saveData(appState.plugin.settings);
          }
        };
        const save = debounce(saveSettings, 100, { isImmediate: false });
        save();
      }

      yDividerPos.current = e.clientY;
    }
  };

  useEffect(() => {
    document.addEventListener("mouseup", onMouseHoldUp);
    document.addEventListener("mousemove", onMouseHoldMove);

    return () => {
      document.removeEventListener("mouseup", onMouseHoldUp);
      document.removeEventListener("mousemove", onMouseHoldMove);
    };
  });

  return (
    <div className="bg-obs-primary" style={{ height: adjustedHeight + "px" }} {...props}>
      <HeightAdjustableContext.Provider
        value={{
          onMouseHoldDown,
        }}
      >
        {children}
      </HeightAdjustableContext.Provider>
    </div>
  );
};

export const HeightAdjustableHandle = (props) => {
  const { onMouseHoldDown } = useContext(HeightAdjustableContext);

  return (
    <div {...props} className="relative w-full bg-obs-modifier-border h-4px">
      <div
        className="absolute left-0 right-0 bg-transparent opacity-50 -top-3 -bottom-3"
        style={{ cursor: "row-resize" }}
        onMouseDown={onMouseHoldDown}
      ></div>
    </div>
  );
};
