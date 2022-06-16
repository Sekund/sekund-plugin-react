import mimeDB from "mime-db";

const extList = () => {
  const ret = new Map();

  for (const x of Object.keys(mimeDB)) {
    const val = mimeDB[x];

    if (val.extensions && val.extensions.length > 0) {
      for (const y of val.extensions) {
        ret.set(y, x);
      }
    }
  }

  return ret;
};

export default function mime(str: string): string {
  const ext = str.indexOf(".") !== -1 ? str.substring(str.lastIndexOf(".") + 1) : str;
  const list = extList();
  for (let k of list.keys()) {
    if (k === ext) {
      return list.get(k);
    }
  }
  return "";
}
