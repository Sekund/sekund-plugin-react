import { AppState, initialAppState } from "@/state/AppReducer";

export default class GlobalState {
  private static _instance: GlobalState;

  private _appState: AppState = initialAppState;

  constructor() {
    GlobalState._instance = this;
  }

  static get instance() {
    return GlobalState._instance;
  }

  get appState() {
    return this._appState;
  }

  set appState(aState: AppState) {
    this._appState = aState;
  }
}
