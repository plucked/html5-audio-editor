/* BinaryToolkit written by Rainer Heynke */
window.requestFileSystem =
  window.requestFileSystem || window.webkitRequestFileSystem;
window.BlobBuilder = window.WebKitBlobBuilder || window.MozBlobBuilder;
window.URL = window.URL || window.webkitURL;

export class BinaryReader {
  constructor(data) {
    this.data = new Uint8Array(data);
    this.pos = 0;

    this.signMasks = [0x0, 0x80, 0x8000, 0x800000, 0x80000000];
    this.masks = [0x0, 0xff + 1, 0xffff + 1, 0xffffff + 1, 0xffffffff + 1];
  }

  gotoString(value) {
    for (var i = this.pos; i < this.data.length; ++i) {
      if (value[0] == String.fromCharCode(this.data[i])) {
        var complete = true;
        for (var j = i; j < value.length + i; ++j) {
          if (value[j - i] != String.fromCharCode(this.data[j])) {
            complete = false;
            break;
          }
        }

        if (complete == true) {
          this.pos = i;
          break;
        }
      }
    }
  }

  readUInt8(bigEndian) {
    return this.readInteger(1, false, bigEndian);
  }

  readInt8(bigEndian) {
    return this.readInteger(1, true, bigEndian);
  }

  readUInt16(bigEndian) {
    return this.readInteger(2, false, bigEndian);
  }

  readInt16(bigEndian) {
    return this.readInteger(2, true, bigEndian);
  }

  readUInt32(bigEndian) {
    return this.readInteger(4, false, bigEndian);
  }

  readInt32(bigEndian) {
    return this.readInteger(4, true, bigEndian);
  }

  readString(size) {
    var r = "";
    var i = 0;

    for (i = 0; i < size; ++i) {
      r += String.fromCharCode(this.data[this.pos++]);
    }
    return r;
  }

  /* size = size in bytes (e.g. 1 = 8 bits, ...)
   * signed = boolean flag to define if the value is signed
   * bigEndian = boolean flag to define the decoding in big endian style
   */
  readInteger(size, signed, bigEndian) {
    if (this.pos + (size - 1) >= this.data.length)
      throw "Buffer overflow during reading.";

    var i = 0;
    var r = 0;

    // read the bytes
    for (i = 0; i < size; ++i) {
      if (bigEndian === true) {
        r = this.data[this.pos++] + (r << (i * 8));
      } else {
        r += this.data[this.pos++] << (i * 8);
      }
    }

    // convert from unsigned to signed
    if (signed && r & this.signMasks[size]) {
      r = r - this.masks[size];
    }

    return r;
  }

  eof() {
    return this.data.length >= this.pos;
  }
}

export class BinaryWriter {
  constructor(estimatedSize) {
    this.estimatedSize = estimatedSize;
    this.pos = 0;
    this.data = new Uint8Array(estimatedSize);

    this.masks = [0x0, 0xff + 1, 0xffff + 1, 0xffffff + 1, 0xffffffff + 1];
  }

  writeUInt8(value, bigEndian) {
    return this.writeInteger(value, 1, bigEndian);
  }

  writeInt8(value, bigEndian) {
    return this.writeInteger(value, 1, bigEndian);
  }

  writeUInt16(value, bigEndian) {
    return this.writeInteger(value, 2, bigEndian);
  }

  writeInt16(value, bigEndian) {
    return this.writeInteger(value, 2, bigEndian);
  }

  writeUInt32(value, bigEndian) {
    return this.writeInteger(value, 4, bigEndian);
  }

  writeInt32(value, bigEndian) {
    return this.writeInteger(value, 4, bigEndian);
  }

  writeString(value) {
    var i = 0;
    for (i = 0; i < value.length; ++i) {
      this.data[this.pos++] = value.charCodeAt(i);
    }
  }

  /* value = the actual value which want to get stored
   * size = size in bytes of the value
   * bigEndian = flag to store the number in big endian style
   */
  writeInteger(value, size, bigEndian) {
    var r = value;
    var i = 0;

    // convert to unsigned if value is negative
    if (value < 0) {
      r += this.masks[size];
    }

    // write the bytes
    for (i = 0; i < size; ++i) {
      if (bigEndian === true) {
        this.data[this.pos++] = (r >> ((size - i - 1) * 8)) & 0xff;
      } else {
        this.data[this.pos++] = (r >> (i * 8)) & 0xff;
      }
    }
  }
}
