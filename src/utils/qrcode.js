/* ============================================================
 * 二维码生成器 - 纯 JavaScript 手写实现
 * 支持版本 1-40，纠错等级 L/M/Q/H，字节编码模式
 * ============================================================ */

import { normalizeHex } from './common'

const PAD0 = 0xEC
const PAD1 = 0x11

const MODE_BYTE = 0b0100

const ECC_LEVELS = {
  L: 0,
  M: 1,
  Q: 2,
  H: 3,
}

const ALIGNMENT_PATTERN = [
  [],
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
  [6, 30, 54],
  [6, 32, 58],
  [6, 34, 62],
  [6, 26, 46, 66],
  [6, 26, 48, 70],
  [6, 26, 50, 74],
  [6, 30, 54, 78],
  [6, 30, 56, 82],
  [6, 30, 58, 86],
  [6, 34, 62, 90],
  [6, 28, 50, 72, 94],
  [6, 26, 50, 74, 98],
  [6, 30, 54, 78, 102],
  [6, 28, 54, 80, 106],
  [6, 32, 58, 84, 110],
  [6, 30, 58, 86, 114],
  [6, 34, 62, 90, 118],
  [6, 26, 50, 74, 98, 122],
  [6, 30, 54, 78, 102, 126],
  [6, 26, 52, 78, 104, 130],
  [6, 30, 56, 82, 108, 134],
  [6, 34, 60, 86, 112, 138],
  [6, 30, 58, 86, 114, 142],
  [6, 34, 62, 90, 118, 146],
  [6, 30, 54, 78, 102, 126, 150],
  [6, 24, 50, 76, 102, 128, 154],
  [6, 28, 54, 80, 106, 132, 158],
  [6, 32, 58, 84, 110, 136, 162],
  [6, 26, 54, 82, 110, 138, 166],
  [6, 30, 58, 86, 114, 142, 170],
]

const RS_EXP_TABLE = new Array(256)
const RS_LOG_TABLE = new Array(256)
;(function initRSTables() {
  let x = 1
  for (let i = 0; i < 255; i++) {
    RS_EXP_TABLE[i] = x
    RS_LOG_TABLE[x] = i
    x <<= 1
    if (x & 0x100) x ^= 0x11d
  }
  RS_EXP_TABLE[255] = RS_EXP_TABLE[0]
})()

function rsMult(a, b) {
  if (a === 0 || b === 0) return 0
  return RS_EXP_TABLE[(RS_LOG_TABLE[a] + RS_LOG_TABLE[b]) % 255]
}

function rsPolyMult(p1, p2) {
  const result = new Array(p1.length + p2.length - 1).fill(0)
  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      result[i + j] ^= rsMult(p1[i], p2[j])
    }
  }
  return result
}

function rsGeneratorPoly(count) {
  let poly = [1]
  for (let i = 0; i < count; i++) {
    poly = rsPolyMult(poly, [1, RS_EXP_TABLE[i]])
  }
  return poly
}

function rsEncode(data, ecLen) {
  const gen = rsGeneratorPoly(ecLen)
  const result = new Array(data.length + ecLen).fill(0)
  for (let i = 0; i < data.length; i++) {
    result[i] = data[i]
  }
  for (let i = 0; i < data.length; i++) {
    const coef = result[i]
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        result[i + j] ^= rsMult(gen[j], coef)
      }
    }
  }
  return result.slice(data.length)
}

const ECC_INFO = [
  [[1, 26], [1, 26], [1, 26], [1, 26]],
  [[1, 44], [1, 44], [1, 44], [1, 44]],
  [[1, 70], [1, 70], [1, 70], [1, 70]],
  [[1, 100], [1, 100], [2, 50], [2, 50]],
  [[1, 134], [1, 134], [2, 67], [2, 67]],
  [[2, 86], [2, 86], [2, 86], [2, 86]],
  [[2, 98], [2, 98], [2, 98], [2, 98]],
  [[2, 121], [2, 121], [2, 121], [2, 121]],
  [[2, 146], [2, 146], [2, 73, 4, 74], [2, 73, 4, 74]],
  [[2, 86, 2, 87], [2, 86, 2, 87], [4, 64, 1, 65], [4, 64, 1, 65]],
  [[4, 101], [4, 101], [4, 101], [4, 101]],
  [[2, 116, 2, 117], [2, 116, 2, 117], [4, 58, 2, 59], [4, 58, 2, 59]],
  [[4, 133], [4, 133], [4, 133], [4, 133]],
  [[3, 145, 1, 146], [3, 145, 1, 146], [4, 72, 2, 73], [4, 72, 2, 73]],
  [[5, 109, 1, 110], [5, 109, 1, 110], [4, 72, 4, 73], [4, 72, 4, 73]],
  [[5, 122, 1, 123], [5, 122, 1, 123], [4, 72, 2, 73, 2, 74], [4, 72, 2, 73, 2, 74]],
  [[1, 135, 5, 136], [1, 135, 5, 136], [4, 75, 4, 76], [4, 75, 4, 76]],
  [[5, 150, 1, 151], [5, 150, 1, 151], [6, 74, 4, 75], [6, 74, 4, 75]],
  [[3, 141, 4, 142], [3, 141, 4, 142], [5, 74, 5, 75], [5, 74, 5, 75]],
  [[4, 135, 4, 136], [4, 135, 4, 136], [4, 74, 6, 75], [4, 74, 6, 75]],
  [[2, 147, 7, 148], [2, 147, 7, 148], [6, 74, 4, 75, 2, 76], [6, 74, 4, 75, 2, 76]],
  [[2, 146, 7, 147], [2, 146, 7, 147], [5, 74, 5, 75, 4, 76], [5, 74, 5, 75, 4, 76]],
  [[3, 145, 7, 146], [3, 145, 7, 146], [4, 74, 6, 75, 4, 76], [4, 74, 6, 75, 4, 76]],
  [[4, 144, 7, 145], [4, 144, 7, 145], [6, 74, 4, 75, 6, 76], [6, 74, 4, 75, 6, 76]],
  [[5, 143, 7, 144], [5, 143, 7, 144], [5, 74, 5, 75, 6, 76], [5, 74, 5, 75, 6, 76]],
  [[6, 142, 7, 143], [6, 142, 7, 143], [6, 74, 6, 75, 4, 76, 2, 77], [6, 74, 6, 75, 4, 76, 2, 77]],
  [[8, 139, 4, 140], [8, 139, 4, 140], [5, 74, 6, 75, 6, 76, 2, 77], [5, 74, 6, 75, 6, 76, 2, 77]],
  [[8, 140, 4, 141], [8, 140, 4, 141], [6, 74, 6, 75, 4, 76, 4, 77], [6, 74, 6, 75, 4, 76, 4, 77]],
  [[3, 141, 10, 142], [3, 141, 10, 142], [6, 74, 6, 75, 6, 76, 2, 77], [6, 74, 6, 75, 6, 76, 2, 77]],
  [[7, 135, 7, 136], [7, 135, 7, 136], [7, 74, 6, 75, 4, 76, 6, 77], [7, 74, 6, 75, 4, 76, 6, 77]],
  [[5, 142, 10, 143], [5, 142, 10, 143], [6, 74, 6, 75, 6, 76, 6, 77], [6, 74, 6, 75, 6, 76, 6, 77]],
  [[5, 142, 11, 143], [5, 142, 11, 143], [6, 74, 6, 75, 6, 76, 6, 77, 2, 78], [6, 74, 6, 75, 6, 76, 6, 77, 2, 78]],
  [[7, 139, 9, 140], [7, 139, 9, 140], [6, 74, 6, 75, 6, 76, 6, 77, 4, 78], [6, 74, 6, 75, 6, 76, 6, 77, 4, 78]],
  [[3, 140, 15, 141], [3, 140, 15, 141], [6, 74, 6, 75, 6, 76, 6, 77, 5, 78], [6, 74, 6, 75, 6, 76, 6, 77, 5, 78]],
  [[3, 141, 16, 142], [3, 141, 16, 142], [6, 74, 6, 75, 6, 76, 6, 77, 6, 78], [6, 74, 6, 75, 6, 76, 6, 77, 6, 78]],
  [[4, 140, 16, 141], [4, 140, 16, 141], [6, 74, 6, 75, 6, 76, 6, 77, 6, 78, 2, 79], [6, 74, 6, 75, 6, 76, 6, 77, 6, 78, 2, 79]],
  [[2, 139, 19, 140], [2, 139, 19, 140], [6, 74, 6, 75, 6, 76, 6, 77, 6, 78, 4, 79], [6, 74, 6, 75, 6, 76, 6, 77, 6, 78, 4, 79]],
  [[7, 137, 14, 138], [7, 137, 14, 138], [6, 74, 6, 75, 6, 76, 6, 77, 6, 78, 5, 79], [6, 74, 6, 75, 6, 76, 6, 77, 6, 78, 5, 79]],
  [[5, 142, 18, 143], [5, 142, 18, 143], [6, 74, 6, 75, 6, 76, 6, 77, 6, 78, 6, 79], [6, 74, 6, 75, 6, 76, 6, 77, 6, 78, 6, 79]],
  [[5, 141, 20, 142], [5, 141, 20, 142], [6, 74, 6, 75, 6, 76, 6, 77, 6, 78, 6, 79, 2, 80], [6, 74, 6, 75, 6, 76, 6, 77, 6, 78, 6, 79, 2, 80]],
]

const ECC_CODEWORDS_PER_BLOCK = [
  [7, 10, 13, 17],
  [10, 16, 22, 28],
  [15, 26, 36, 44],
  [20, 36, 52, 64],
  [26, 48, 72, 88],
  [36, 64, 96, 112],
  [40, 72, 108, 130],
  [48, 88, 132, 156],
  [60, 110, 160, 192],
  [72, 130, 192, 224],
  [80, 150, 224, 264],
  [96, 176, 260, 308],
  [104, 198, 288, 352],
  [120, 216, 320, 384],
  [132, 240, 360, 432],
  [144, 280, 408, 480],
  [168, 308, 448, 532],
  [180, 338, 504, 588],
  [196, 364, 546, 650],
  [224, 416, 600, 700],
  [224, 442, 644, 750],
  [252, 476, 690, 816],
  [270, 504, 750, 900],
  [300, 560, 810, 960],
  [312, 588, 870, 1050],
  [336, 644, 952, 1110],
  [360, 700, 1020, 1200],
  [390, 728, 1050, 1260],
  [420, 784, 1140, 1350],
  [450, 812, 1200, 1440],
  [480, 868, 1290, 1530],
  [510, 924, 1350, 1620],
  [540, 980, 1440, 1710],
  [570, 1036, 1530, 1800],
  [570, 1064, 1590, 1890],
  [600, 1120, 1680, 1980],
  [630, 1204, 1770, 2100],
  [660, 1260, 1860, 2220],
  [720, 1316, 1950, 2310],
  [750, 1372, 2040, 2430],
]

function getECCSpec(version, ecLevel) {
  const ecIdx = ECC_LEVELS[ecLevel]
  const spec = ECC_INFO[version - 1][ecIdx]
  const ecPerBlock = ECC_CODEWORDS_PER_BLOCK[version - 1][ecIdx]
  const blocks = []
  let totalData = 0
  let i = 0
  while (i < spec.length) {
    const count = spec[i++]
    const dataLen = spec[i++]
    for (let j = 0; j < count; j++) {
      blocks.push({ dataLen, ecLen: ecPerBlock })
      totalData += dataLen
    }
  }
  return { blocks, totalData, ecPerBlock }
}

function utf8Encode(str) {
  const out = []
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i)
    if (c < 0x80) {
      out.push(c)
    } else if (c < 0x800) {
      out.push(0xc0 | (c >> 6))
      out.push(0x80 | (c & 0x3f))
    } else if (c < 0xd800 || c >= 0xe000) {
      out.push(0xe0 | (c >> 12))
      out.push(0x80 | ((c >> 6) & 0x3f))
      out.push(0x80 | (c & 0x3f))
    } else {
      i++
      const c2 = ((c & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff)
      const cp = c2 + 0x10000
      out.push(0xf0 | (cp >> 18))
      out.push(0x80 | ((cp >> 12) & 0x3f))
      out.push(0x80 | ((cp >> 6) & 0x3f))
      out.push(0x80 | (cp & 0x3f))
    }
  }
  return out
}

function chooseVersion(dataBits, ecLevel) {
  for (let v = 1; v <= 40; v++) {
    const { totalData } = getECCSpec(v, ecLevel)
    const capacity = totalData * 8
    const charCountBits = v <= 9 ? 8 : 16
    const needed = 4 + charCountBits + dataBits
    if (needed <= capacity) return v
  }
  return 40
}

function generateCodewords(text, version, ecLevel) {
  const bytes = utf8Encode(text)
  const bitBuffer = []

  bitBuffer.push((MODE_BYTE >> 3) & 1)
  bitBuffer.push((MODE_BYTE >> 2) & 1)
  bitBuffer.push((MODE_BYTE >> 1) & 1)
  bitBuffer.push(MODE_BYTE & 1)

  const charCountBits = version <= 9 ? 8 : 16
  let len = bytes.length
  for (let i = charCountBits - 1; i >= 0; i--) {
    bitBuffer.push((len >> i) & 1)
  }

  for (const b of bytes) {
    for (let i = 7; i >= 0; i--) {
      bitBuffer.push((b >> i) & 1)
    }
  }

  const { totalData } = getECCSpec(version, ecLevel)
  const totalBits = totalData * 8

  if (bitBuffer.length + 4 <= totalBits) {
    bitBuffer.push(0)
    bitBuffer.push(0)
    bitBuffer.push(0)
    bitBuffer.push(0)
  }

  while (bitBuffer.length % 8 !== 0) {
    bitBuffer.push(0)
  }

  const byteData = []
  for (let i = 0; i < bitBuffer.length; i += 8) {
    let b = 0
    for (let j = 0; j < 8; j++) {
      b = (b << 1) | bitBuffer[i + j]
    }
    byteData.push(b)
  }

  let padIdx = 0
  while (byteData.length < totalData) {
    byteData.push(padIdx % 2 === 0 ? PAD0 : PAD1)
    padIdx++
  }

  return byteData
}

function splitIntoBlocks(data, version, ecLevel) {
  const { blocks, ecPerBlock } = getECCSpec(version, ecLevel)
  let offset = 0
  const result = []
  for (const block of blocks) {
    const dataPart = data.slice(offset, offset + block.dataLen)
    offset += block.dataLen
    const ecPart = rsEncode(dataPart, ecPerBlock)
    result.push({ data: dataPart, ec: ecPart })
  }
  return result
}

function interleaveBlocks(blocks) {
  const dataBytes = []
  const ecBytes = []

  const maxDataLen = Math.max(...blocks.map((b) => b.data.length))
  const maxEcLen = Math.max(...blocks.map((b) => b.ec.length))

  for (let i = 0; i < maxDataLen; i++) {
    for (const block of blocks) {
      if (i < block.data.length) dataBytes.push(block.data[i])
    }
  }

  for (let i = 0; i < maxEcLen; i++) {
    for (const block of blocks) {
      if (i < block.ec.length) ecBytes.push(block.ec[i])
    }
  }

  return [...dataBytes, ...ecBytes]
}

function createMatrix(size) {
  return Array.from({ length: size }, () => new Array(size).fill(null))
}

function setFinderPattern(matrix, row, col) {
  for (let r = -1; r <= 7; r++) {
    for (let c = -1; c <= 7; c++) {
      const rr = row + r
      const cc = col + c
      if (rr < 0 || rr >= matrix.length || cc < 0 || cc >= matrix.length) continue
      const isBorder = r === 0 || r === 6 || c === 0 || c === 6
      const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4
      const isOuter = r >= 0 && r <= 6 && c >= 0 && c <= 6
      if (isOuter) matrix[rr][cc] = isBorder || isInner
    }
  }
}

function setAlignmentPattern(matrix, row, col) {
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const rr = row + r
      const cc = col + c
      const absR = Math.abs(r)
      const absC = Math.abs(c)
      const isBorder = absR === 2 || absC === 2
      const isCenter = absR === 0 && absC === 0
      matrix[rr][cc] = isBorder || isCenter
    }
  }
}

function setTimingPattern(matrix, size) {
  for (let i = 8; i < size - 8; i++) {
    if (matrix[6][i] === null) matrix[6][i] = i % 2 === 0
    if (matrix[i][6] === null) matrix[i][6] = i % 2 === 0
  }
}

function setDarkModule(matrix) {
  matrix[matrix.length - 8][8] = true
}

function reserveFormatInfo(matrix, size) {
  for (let i = 0; i <= 8; i++) {
    if (i !== 6) {
      matrix[8][i] = false
      matrix[i][8] = false
    }
  }
  for (let i = 0; i < 8; i++) {
    matrix[size - 1 - i][8] = false
    matrix[8][size - 1 - i] = false
  }
  matrix[size - 8][8] = false
}

function placeData(matrix, codewords) {
  const size = matrix.length
  let bitIdx = 0
  let upward = true

  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--

    for (let i = 0; i < size; i++) {
      const row = upward ? size - 1 - i : i

      for (let c = 0; c < 2; c++) {
        const cc = col - c
        if (matrix[row][cc] === null) {
          let bit = false
          if (bitIdx < codewords.length * 8) {
            const byteIdx = Math.floor(bitIdx / 8)
            const bitPos = 7 - (bitIdx % 8)
            bit = ((codewords[byteIdx] >> bitPos) & 1) === 1
            bitIdx++
          }
          matrix[row][cc] = bit
        }
      }
    }
    upward = !upward
  }
}

function applyMask(matrix, maskPattern) {
  const size = matrix.length
  const result = createMatrix(size)
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (
        (r < 8 && c < 8) ||
        (r < 8 && c >= size - 8) ||
        (r >= size - 8 && c < 8)
      ) {
        result[r][c] = matrix[r][c]
        continue
      }
      if (r === 6 || c === 6) {
        result[r][c] = matrix[r][c]
        continue
      }
      if (r >= size - 8 && c === 8) {
        result[r][c] = matrix[r][c]
        continue
      }
      if (c >= size - 8 && r === 8) {
        result[r][c] = matrix[r][c]
        continue
      }

      let mask = false
      switch (maskPattern) {
        case 0:
          mask = (r + c) % 2 === 0
          break
        case 1:
          mask = r % 2 === 0
          break
        case 2:
          mask = c % 3 === 0
          break
        case 3:
          mask = (r + c) % 3 === 0
          break
        case 4:
          mask = (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0
          break
        case 5:
          mask = ((r * c) % 2) + ((r * c) % 3) === 0
          break
        case 6:
          mask = (((r * c) % 2) + ((r * c) % 3)) % 2 === 0
          break
        case 7:
          mask = (((r + c) % 2) + ((r * c) % 3)) % 2 === 0
          break
      }
      result[r][c] = matrix[r][c] !== mask
    }
  }
  return result
}

const FORMAT_INFO_GF = 0x537

function computeFormatInfo(ecLevel, maskPattern) {
  const ecBits = ECC_LEVELS[ecLevel] === 0 ? 0b01 : ECC_LEVELS[ecLevel] === 1 ? 0b00 : ECC_LEVELS[ecLevel] === 2 ? 0b11 : 0b10
  let data = (ecBits << 3) | maskPattern

  let rem = data << 10
  for (let i = 4; i >= 0; i--) {
    if ((rem >> (i + 10)) & 1) {
      rem ^= FORMAT_INFO_GF << i
    }
  }
  const formatBits = ((data << 10) | rem) ^ 0x5412
  return formatBits
}

function placeFormatInfo(matrix, formatBits) {
  const size = matrix.length

  for (let i = 0; i < 15; i++) {
    const bit = ((formatBits >> i) & 1) === 1

    if (i < 6) matrix[8][i] = bit
    else if (i < 8) matrix[8][i + 1] = bit
    else matrix[14 - i][8] = bit

    if (i < 8) matrix[size - 1 - i][8] = bit
    else matrix[8][size - 15 + i] = bit
  }
  matrix[size - 8][8] = true
}

function computePenalty(matrix) {
  const size = matrix.length
  let penalty = 0

  for (let r = 0; r < size; r++) {
    let run = 1
    for (let c = 1; c < size; c++) {
      if (matrix[r][c] === matrix[r][c - 1]) {
        run++
      } else {
        if (run >= 5) penalty += run - 2
        run = 1
      }
    }
    if (run >= 5) penalty += run - 2
  }

  for (let c = 0; c < size; c++) {
    let run = 1
    for (let r = 1; r < size; r++) {
      if (matrix[r][c] === matrix[r - 1][c]) {
        run++
      } else {
        if (run >= 5) penalty += run - 2
        run = 1
      }
    }
    if (run >= 5) penalty += run - 2
  }

  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const v = matrix[r][c]
      if (matrix[r][c + 1] === v && matrix[r + 1][c] === v && matrix[r + 1][c + 1] === v) {
        penalty += 3
      }
    }
  }

  let darkCount = 0
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c]) darkCount++
    }
  }
  const percent = (darkCount * 100) / (size * size)
  const prev = Math.floor(percent / 5)
  const next = Math.ceil(percent / 5)
  penalty += Math.min(Math.abs(prev * 5 - 50), Math.abs(next * 5 - 50)) * 2

  return penalty
}

function generateMatrix(text, ecLevel = 'M') {
  const bytes = utf8Encode(text)
  const version = chooseVersion(bytes.length * 8, ecLevel)
  const size = 17 + 4 * version

  const codewords = generateCodewords(text, version, ecLevel)
  const blocks = splitIntoBlocks(codewords, version, ecLevel)
  const finalCodewords = interleaveBlocks(blocks)

  const matrix = createMatrix(size)

  setFinderPattern(matrix, 0, 0)
  setFinderPattern(matrix, 0, size - 7)
  setFinderPattern(matrix, size - 7, 0)

  if (version >= 2) {
    const positions = ALIGNMENT_PATTERN[version]
    for (const r of positions) {
      for (const c of positions) {
        if (matrix[r][c] === null) {
          setAlignmentPattern(matrix, r, c)
        }
      }
    }
  }

  setTimingPattern(matrix, size)
  reserveFormatInfo(matrix, size)
  setDarkModule(matrix)
  placeData(matrix, finalCodewords)

  let bestMatrix = null
  let bestPenalty = Infinity
  for (let mask = 0; mask < 8; mask++) {
    const masked = applyMask(matrix, mask)
    const formatBits = computeFormatInfo(ecLevel, mask)
    placeFormatInfo(masked, formatBits)
    const penalty = computePenalty(masked)
    if (penalty < bestPenalty) {
      bestPenalty = penalty
      bestMatrix = masked
    }
  }

  return bestMatrix
}

export function generateQrMatrix(text, options = {}) {
  const { ecLevel = 'M' } = options
  return generateMatrix(text, ecLevel)
}

export function drawQrToCanvas(canvas, text, options = {}) {
  const {
    size = 300,
    foreground = '#000000',
    background = '#ffffff',
    margin = 4,
    ecLevel = 'M',
  } = options

  const fg = normalizeHex(foreground)
  const bg = normalizeHex(background)

  const matrix = generateMatrix(text, ecLevel)
  const moduleCount = matrix.length
  const totalModules = moduleCount + margin * 2
  const moduleSize = Math.floor(size / totalModules)
  const actualSize = moduleSize * totalModules

  canvas.width = actualSize
  canvas.height = actualSize

  const ctx = canvas.getContext('2d')

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, actualSize, actualSize)

  ctx.fillStyle = fg
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (matrix[r][c]) {
        const x = (c + margin) * moduleSize
        const y = (r + margin) * moduleSize
        ctx.fillRect(x, y, moduleSize, moduleSize)
      }
    }
  }

  return { matrix, moduleSize, actualSize, margin }
}

export function drawQrWithLogo(canvas, text, options = {}) {
  const {
    logoImage = null,
    logoSizeRatio = 0.2,
    logoBgColor = '#ffffff',
    ...rest
  } = options

  const result = drawQrToCanvas(canvas, text, rest)

  if (logoImage) {
    const { actualSize } = result
    const logoSize = Math.floor(actualSize * logoSizeRatio)
    const logoX = Math.floor((actualSize - logoSize) / 2)
    const logoY = Math.floor((actualSize - logoSize) / 2)
    const padding = Math.floor(logoSize * 0.1)

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = logoBgColor
    ctx.fillRect(logoX - padding, logoY - padding, logoSize + padding * 2, logoSize + padding * 2)
    ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize)
  }

  return result
}

export function generateSvgString(text, options = {}) {
  const {
    size = 300,
    foreground = '#000000',
    background = '#ffffff',
    margin = 4,
    ecLevel = 'M',
  } = options

  const fg = normalizeHex(foreground)
  const bg = normalizeHex(background)

  const matrix = generateMatrix(text, ecLevel)
  const moduleCount = matrix.length
  const totalModules = moduleCount + margin * 2
  const moduleSize = size / totalModules

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">`
  svg += `<rect width="${size}" height="${size}" fill="${bg}"/>`

  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (matrix[r][c]) {
        const x = (c + margin) * moduleSize
        const y = (r + margin) * moduleSize
        svg += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="${fg}"/>`
      }
    }
  }

  svg += '</svg>'
  return svg
}
