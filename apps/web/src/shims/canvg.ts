// Lightweight safe shim for canvg to satisfy jsPDF optional dynamic import
// without pulling in core-js or legacy polyfill install scripts.
export class Canvg {
  static async fromString() {
    throw new Error('canvg is not installed');
  }
}

export default Canvg;

