var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// node_modules/big-integer/BigInteger.js
var require_BigInteger = __commonJS((exports, module) => {
  var bigInt = function(undefined2) {
    var BASE = 1e7, LOG_BASE = 7, MAX_INT = 9007199254740992, MAX_INT_ARR = smallToArray(MAX_INT), DEFAULT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
    var supportsNativeBigInt = typeof BigInt === "function";
    function Integer(v, radix, alphabet, caseSensitive) {
      if (typeof v === "undefined")
        return Integer[0];
      if (typeof radix !== "undefined")
        return +radix === 10 && !alphabet ? parseValue(v) : parseBase(v, radix, alphabet, caseSensitive);
      return parseValue(v);
    }
    function BigInteger(value, sign) {
      this.value = value;
      this.sign = sign;
      this.isSmall = false;
    }
    BigInteger.prototype = Object.create(Integer.prototype);
    function SmallInteger(value) {
      this.value = value;
      this.sign = value < 0;
      this.isSmall = true;
    }
    SmallInteger.prototype = Object.create(Integer.prototype);
    function NativeBigInt(value) {
      this.value = value;
    }
    NativeBigInt.prototype = Object.create(Integer.prototype);
    function isPrecise(n) {
      return -MAX_INT < n && n < MAX_INT;
    }
    function smallToArray(n) {
      if (n < 1e7)
        return [n];
      if (n < 100000000000000)
        return [n % 1e7, Math.floor(n / 1e7)];
      return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 100000000000000)];
    }
    function arrayToSmall(arr) {
      trim(arr);
      var length = arr.length;
      if (length < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
        switch (length) {
          case 0:
            return 0;
          case 1:
            return arr[0];
          case 2:
            return arr[0] + arr[1] * BASE;
          default:
            return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
        }
      }
      return arr;
    }
    function trim(v) {
      var i2 = v.length;
      while (v[--i2] === 0)
        ;
      v.length = i2 + 1;
    }
    function createArray(length) {
      var x = new Array(length);
      var i2 = -1;
      while (++i2 < length) {
        x[i2] = 0;
      }
      return x;
    }
    function truncate(n) {
      if (n > 0)
        return Math.floor(n);
      return Math.ceil(n);
    }
    function add(a, b) {
      var l_a = a.length, l_b = b.length, r = new Array(l_a), carry = 0, base = BASE, sum, i2;
      for (i2 = 0;i2 < l_b; i2++) {
        sum = a[i2] + b[i2] + carry;
        carry = sum >= base ? 1 : 0;
        r[i2] = sum - carry * base;
      }
      while (i2 < l_a) {
        sum = a[i2] + carry;
        carry = sum === base ? 1 : 0;
        r[i2++] = sum - carry * base;
      }
      if (carry > 0)
        r.push(carry);
      return r;
    }
    function addAny(a, b) {
      if (a.length >= b.length)
        return add(a, b);
      return add(b, a);
    }
    function addSmall(a, carry) {
      var l = a.length, r = new Array(l), base = BASE, sum, i2;
      for (i2 = 0;i2 < l; i2++) {
        sum = a[i2] - base + carry;
        carry = Math.floor(sum / base);
        r[i2] = sum - carry * base;
        carry += 1;
      }
      while (carry > 0) {
        r[i2++] = carry % base;
        carry = Math.floor(carry / base);
      }
      return r;
    }
    BigInteger.prototype.add = function(v) {
      var n = parseValue(v);
      if (this.sign !== n.sign) {
        return this.subtract(n.negate());
      }
      var a = this.value, b = n.value;
      if (n.isSmall) {
        return new BigInteger(addSmall(a, Math.abs(b)), this.sign);
      }
      return new BigInteger(addAny(a, b), this.sign);
    };
    BigInteger.prototype.plus = BigInteger.prototype.add;
    SmallInteger.prototype.add = function(v) {
      var n = parseValue(v);
      var a = this.value;
      if (a < 0 !== n.sign) {
        return this.subtract(n.negate());
      }
      var b = n.value;
      if (n.isSmall) {
        if (isPrecise(a + b))
          return new SmallInteger(a + b);
        b = smallToArray(Math.abs(b));
      }
      return new BigInteger(addSmall(b, Math.abs(a)), a < 0);
    };
    SmallInteger.prototype.plus = SmallInteger.prototype.add;
    NativeBigInt.prototype.add = function(v) {
      return new NativeBigInt(this.value + parseValue(v).value);
    };
    NativeBigInt.prototype.plus = NativeBigInt.prototype.add;
    function subtract(a, b) {
      var a_l = a.length, b_l = b.length, r = new Array(a_l), borrow = 0, base = BASE, i2, difference;
      for (i2 = 0;i2 < b_l; i2++) {
        difference = a[i2] - borrow - b[i2];
        if (difference < 0) {
          difference += base;
          borrow = 1;
        } else
          borrow = 0;
        r[i2] = difference;
      }
      for (i2 = b_l;i2 < a_l; i2++) {
        difference = a[i2] - borrow;
        if (difference < 0)
          difference += base;
        else {
          r[i2++] = difference;
          break;
        }
        r[i2] = difference;
      }
      for (;i2 < a_l; i2++) {
        r[i2] = a[i2];
      }
      trim(r);
      return r;
    }
    function subtractAny(a, b, sign) {
      var value;
      if (compareAbs(a, b) >= 0) {
        value = subtract(a, b);
      } else {
        value = subtract(b, a);
        sign = !sign;
      }
      value = arrayToSmall(value);
      if (typeof value === "number") {
        if (sign)
          value = -value;
        return new SmallInteger(value);
      }
      return new BigInteger(value, sign);
    }
    function subtractSmall(a, b, sign) {
      var l = a.length, r = new Array(l), carry = -b, base = BASE, i2, difference;
      for (i2 = 0;i2 < l; i2++) {
        difference = a[i2] + carry;
        carry = Math.floor(difference / base);
        difference %= base;
        r[i2] = difference < 0 ? difference + base : difference;
      }
      r = arrayToSmall(r);
      if (typeof r === "number") {
        if (sign)
          r = -r;
        return new SmallInteger(r);
      }
      return new BigInteger(r, sign);
    }
    BigInteger.prototype.subtract = function(v) {
      var n = parseValue(v);
      if (this.sign !== n.sign) {
        return this.add(n.negate());
      }
      var a = this.value, b = n.value;
      if (n.isSmall)
        return subtractSmall(a, Math.abs(b), this.sign);
      return subtractAny(a, b, this.sign);
    };
    BigInteger.prototype.minus = BigInteger.prototype.subtract;
    SmallInteger.prototype.subtract = function(v) {
      var n = parseValue(v);
      var a = this.value;
      if (a < 0 !== n.sign) {
        return this.add(n.negate());
      }
      var b = n.value;
      if (n.isSmall) {
        return new SmallInteger(a - b);
      }
      return subtractSmall(b, Math.abs(a), a >= 0);
    };
    SmallInteger.prototype.minus = SmallInteger.prototype.subtract;
    NativeBigInt.prototype.subtract = function(v) {
      return new NativeBigInt(this.value - parseValue(v).value);
    };
    NativeBigInt.prototype.minus = NativeBigInt.prototype.subtract;
    BigInteger.prototype.negate = function() {
      return new BigInteger(this.value, !this.sign);
    };
    SmallInteger.prototype.negate = function() {
      var sign = this.sign;
      var small = new SmallInteger(-this.value);
      small.sign = !sign;
      return small;
    };
    NativeBigInt.prototype.negate = function() {
      return new NativeBigInt(-this.value);
    };
    BigInteger.prototype.abs = function() {
      return new BigInteger(this.value, false);
    };
    SmallInteger.prototype.abs = function() {
      return new SmallInteger(Math.abs(this.value));
    };
    NativeBigInt.prototype.abs = function() {
      return new NativeBigInt(this.value >= 0 ? this.value : -this.value);
    };
    function multiplyLong(a, b) {
      var a_l = a.length, b_l = b.length, l = a_l + b_l, r = createArray(l), base = BASE, product, carry, i2, a_i, b_j;
      for (i2 = 0;i2 < a_l; ++i2) {
        a_i = a[i2];
        for (var j = 0;j < b_l; ++j) {
          b_j = b[j];
          product = a_i * b_j + r[i2 + j];
          carry = Math.floor(product / base);
          r[i2 + j] = product - carry * base;
          r[i2 + j + 1] += carry;
        }
      }
      trim(r);
      return r;
    }
    function multiplySmall(a, b) {
      var l = a.length, r = new Array(l), base = BASE, carry = 0, product, i2;
      for (i2 = 0;i2 < l; i2++) {
        product = a[i2] * b + carry;
        carry = Math.floor(product / base);
        r[i2] = product - carry * base;
      }
      while (carry > 0) {
        r[i2++] = carry % base;
        carry = Math.floor(carry / base);
      }
      return r;
    }
    function shiftLeft(x, n) {
      var r = [];
      while (n-- > 0)
        r.push(0);
      return r.concat(x);
    }
    function multiplyKaratsuba(x, y) {
      var n = Math.max(x.length, y.length);
      if (n <= 30)
        return multiplyLong(x, y);
      n = Math.ceil(n / 2);
      var b = x.slice(n), a = x.slice(0, n), d = y.slice(n), c = y.slice(0, n);
      var ac = multiplyKaratsuba(a, c), bd = multiplyKaratsuba(b, d), abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));
      var product = addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
      trim(product);
      return product;
    }
    function useKaratsuba(l1, l2) {
      return -0.012 * l1 - 0.012 * l2 + 0.000015 * l1 * l2 > 0;
    }
    BigInteger.prototype.multiply = function(v) {
      var n = parseValue(v), a = this.value, b = n.value, sign = this.sign !== n.sign, abs;
      if (n.isSmall) {
        if (b === 0)
          return Integer[0];
        if (b === 1)
          return this;
        if (b === -1)
          return this.negate();
        abs = Math.abs(b);
        if (abs < BASE) {
          return new BigInteger(multiplySmall(a, abs), sign);
        }
        b = smallToArray(abs);
      }
      if (useKaratsuba(a.length, b.length))
        return new BigInteger(multiplyKaratsuba(a, b), sign);
      return new BigInteger(multiplyLong(a, b), sign);
    };
    BigInteger.prototype.times = BigInteger.prototype.multiply;
    function multiplySmallAndArray(a, b, sign) {
      if (a < BASE) {
        return new BigInteger(multiplySmall(b, a), sign);
      }
      return new BigInteger(multiplyLong(b, smallToArray(a)), sign);
    }
    SmallInteger.prototype._multiplyBySmall = function(a) {
      if (isPrecise(a.value * this.value)) {
        return new SmallInteger(a.value * this.value);
      }
      return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
    };
    BigInteger.prototype._multiplyBySmall = function(a) {
      if (a.value === 0)
        return Integer[0];
      if (a.value === 1)
        return this;
      if (a.value === -1)
        return this.negate();
      return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
    };
    SmallInteger.prototype.multiply = function(v) {
      return parseValue(v)._multiplyBySmall(this);
    };
    SmallInteger.prototype.times = SmallInteger.prototype.multiply;
    NativeBigInt.prototype.multiply = function(v) {
      return new NativeBigInt(this.value * parseValue(v).value);
    };
    NativeBigInt.prototype.times = NativeBigInt.prototype.multiply;
    function square(a) {
      var l = a.length, r = createArray(l + l), base = BASE, product, carry, i2, a_i, a_j;
      for (i2 = 0;i2 < l; i2++) {
        a_i = a[i2];
        carry = 0 - a_i * a_i;
        for (var j = i2;j < l; j++) {
          a_j = a[j];
          product = 2 * (a_i * a_j) + r[i2 + j] + carry;
          carry = Math.floor(product / base);
          r[i2 + j] = product - carry * base;
        }
        r[i2 + l] = carry;
      }
      trim(r);
      return r;
    }
    BigInteger.prototype.square = function() {
      return new BigInteger(square(this.value), false);
    };
    SmallInteger.prototype.square = function() {
      var value = this.value * this.value;
      if (isPrecise(value))
        return new SmallInteger(value);
      return new BigInteger(square(smallToArray(Math.abs(this.value))), false);
    };
    NativeBigInt.prototype.square = function(v) {
      return new NativeBigInt(this.value * this.value);
    };
    function divMod1(a, b) {
      var a_l = a.length, b_l = b.length, base = BASE, result = createArray(b.length), divisorMostSignificantDigit = b[b_l - 1], lambda = Math.ceil(base / (2 * divisorMostSignificantDigit)), remainder = multiplySmall(a, lambda), divisor = multiplySmall(b, lambda), quotientDigit, shift, carry, borrow, i2, l, q;
      if (remainder.length <= a_l)
        remainder.push(0);
      divisor.push(0);
      divisorMostSignificantDigit = divisor[b_l - 1];
      for (shift = a_l - b_l;shift >= 0; shift--) {
        quotientDigit = base - 1;
        if (remainder[shift + b_l] !== divisorMostSignificantDigit) {
          quotientDigit = Math.floor((remainder[shift + b_l] * base + remainder[shift + b_l - 1]) / divisorMostSignificantDigit);
        }
        carry = 0;
        borrow = 0;
        l = divisor.length;
        for (i2 = 0;i2 < l; i2++) {
          carry += quotientDigit * divisor[i2];
          q = Math.floor(carry / base);
          borrow += remainder[shift + i2] - (carry - q * base);
          carry = q;
          if (borrow < 0) {
            remainder[shift + i2] = borrow + base;
            borrow = -1;
          } else {
            remainder[shift + i2] = borrow;
            borrow = 0;
          }
        }
        while (borrow !== 0) {
          quotientDigit -= 1;
          carry = 0;
          for (i2 = 0;i2 < l; i2++) {
            carry += remainder[shift + i2] - base + divisor[i2];
            if (carry < 0) {
              remainder[shift + i2] = carry + base;
              carry = 0;
            } else {
              remainder[shift + i2] = carry;
              carry = 1;
            }
          }
          borrow += carry;
        }
        result[shift] = quotientDigit;
      }
      remainder = divModSmall(remainder, lambda)[0];
      return [arrayToSmall(result), arrayToSmall(remainder)];
    }
    function divMod2(a, b) {
      var a_l = a.length, b_l = b.length, result = [], part = [], base = BASE, guess, xlen, highx, highy, check;
      while (a_l) {
        part.unshift(a[--a_l]);
        trim(part);
        if (compareAbs(part, b) < 0) {
          result.push(0);
          continue;
        }
        xlen = part.length;
        highx = part[xlen - 1] * base + part[xlen - 2];
        highy = b[b_l - 1] * base + b[b_l - 2];
        if (xlen > b_l) {
          highx = (highx + 1) * base;
        }
        guess = Math.ceil(highx / highy);
        do {
          check = multiplySmall(b, guess);
          if (compareAbs(check, part) <= 0)
            break;
          guess--;
        } while (guess);
        result.push(guess);
        part = subtract(part, check);
      }
      result.reverse();
      return [arrayToSmall(result), arrayToSmall(part)];
    }
    function divModSmall(value, lambda) {
      var length = value.length, quotient = createArray(length), base = BASE, i2, q, remainder, divisor;
      remainder = 0;
      for (i2 = length - 1;i2 >= 0; --i2) {
        divisor = remainder * base + value[i2];
        q = truncate(divisor / lambda);
        remainder = divisor - q * lambda;
        quotient[i2] = q | 0;
      }
      return [quotient, remainder | 0];
    }
    function divModAny(self, v) {
      var value, n = parseValue(v);
      if (supportsNativeBigInt) {
        return [new NativeBigInt(self.value / n.value), new NativeBigInt(self.value % n.value)];
      }
      var a = self.value, b = n.value;
      var quotient;
      if (b === 0)
        throw new Error("Cannot divide by zero");
      if (self.isSmall) {
        if (n.isSmall) {
          return [new SmallInteger(truncate(a / b)), new SmallInteger(a % b)];
        }
        return [Integer[0], self];
      }
      if (n.isSmall) {
        if (b === 1)
          return [self, Integer[0]];
        if (b == -1)
          return [self.negate(), Integer[0]];
        var abs = Math.abs(b);
        if (abs < BASE) {
          value = divModSmall(a, abs);
          quotient = arrayToSmall(value[0]);
          var remainder = value[1];
          if (self.sign)
            remainder = -remainder;
          if (typeof quotient === "number") {
            if (self.sign !== n.sign)
              quotient = -quotient;
            return [new SmallInteger(quotient), new SmallInteger(remainder)];
          }
          return [new BigInteger(quotient, self.sign !== n.sign), new SmallInteger(remainder)];
        }
        b = smallToArray(abs);
      }
      var comparison = compareAbs(a, b);
      if (comparison === -1)
        return [Integer[0], self];
      if (comparison === 0)
        return [Integer[self.sign === n.sign ? 1 : -1], Integer[0]];
      if (a.length + b.length <= 200)
        value = divMod1(a, b);
      else
        value = divMod2(a, b);
      quotient = value[0];
      var qSign = self.sign !== n.sign, mod = value[1], mSign = self.sign;
      if (typeof quotient === "number") {
        if (qSign)
          quotient = -quotient;
        quotient = new SmallInteger(quotient);
      } else
        quotient = new BigInteger(quotient, qSign);
      if (typeof mod === "number") {
        if (mSign)
          mod = -mod;
        mod = new SmallInteger(mod);
      } else
        mod = new BigInteger(mod, mSign);
      return [quotient, mod];
    }
    BigInteger.prototype.divmod = function(v) {
      var result = divModAny(this, v);
      return {
        quotient: result[0],
        remainder: result[1]
      };
    };
    NativeBigInt.prototype.divmod = SmallInteger.prototype.divmod = BigInteger.prototype.divmod;
    BigInteger.prototype.divide = function(v) {
      return divModAny(this, v)[0];
    };
    NativeBigInt.prototype.over = NativeBigInt.prototype.divide = function(v) {
      return new NativeBigInt(this.value / parseValue(v).value);
    };
    SmallInteger.prototype.over = SmallInteger.prototype.divide = BigInteger.prototype.over = BigInteger.prototype.divide;
    BigInteger.prototype.mod = function(v) {
      return divModAny(this, v)[1];
    };
    NativeBigInt.prototype.mod = NativeBigInt.prototype.remainder = function(v) {
      return new NativeBigInt(this.value % parseValue(v).value);
    };
    SmallInteger.prototype.remainder = SmallInteger.prototype.mod = BigInteger.prototype.remainder = BigInteger.prototype.mod;
    BigInteger.prototype.pow = function(v) {
      var n = parseValue(v), a = this.value, b = n.value, value, x, y;
      if (b === 0)
        return Integer[1];
      if (a === 0)
        return Integer[0];
      if (a === 1)
        return Integer[1];
      if (a === -1)
        return n.isEven() ? Integer[1] : Integer[-1];
      if (n.sign) {
        return Integer[0];
      }
      if (!n.isSmall)
        throw new Error("The exponent " + n.toString() + " is too large.");
      if (this.isSmall) {
        if (isPrecise(value = Math.pow(a, b)))
          return new SmallInteger(truncate(value));
      }
      x = this;
      y = Integer[1];
      while (true) {
        if (b & true) {
          y = y.times(x);
          --b;
        }
        if (b === 0)
          break;
        b /= 2;
        x = x.square();
      }
      return y;
    };
    SmallInteger.prototype.pow = BigInteger.prototype.pow;
    NativeBigInt.prototype.pow = function(v) {
      var n = parseValue(v);
      var a = this.value, b = n.value;
      var _0 = BigInt(0), _1 = BigInt(1), _2 = BigInt(2);
      if (b === _0)
        return Integer[1];
      if (a === _0)
        return Integer[0];
      if (a === _1)
        return Integer[1];
      if (a === BigInt(-1))
        return n.isEven() ? Integer[1] : Integer[-1];
      if (n.isNegative())
        return new NativeBigInt(_0);
      var x = this;
      var y = Integer[1];
      while (true) {
        if ((b & _1) === _1) {
          y = y.times(x);
          --b;
        }
        if (b === _0)
          break;
        b /= _2;
        x = x.square();
      }
      return y;
    };
    BigInteger.prototype.modPow = function(exp, mod) {
      exp = parseValue(exp);
      mod = parseValue(mod);
      if (mod.isZero())
        throw new Error("Cannot take modPow with modulus 0");
      var r = Integer[1], base = this.mod(mod);
      if (exp.isNegative()) {
        exp = exp.multiply(Integer[-1]);
        base = base.modInv(mod);
      }
      while (exp.isPositive()) {
        if (base.isZero())
          return Integer[0];
        if (exp.isOdd())
          r = r.multiply(base).mod(mod);
        exp = exp.divide(2);
        base = base.square().mod(mod);
      }
      return r;
    };
    NativeBigInt.prototype.modPow = SmallInteger.prototype.modPow = BigInteger.prototype.modPow;
    function compareAbs(a, b) {
      if (a.length !== b.length) {
        return a.length > b.length ? 1 : -1;
      }
      for (var i2 = a.length - 1;i2 >= 0; i2--) {
        if (a[i2] !== b[i2])
          return a[i2] > b[i2] ? 1 : -1;
      }
      return 0;
    }
    BigInteger.prototype.compareAbs = function(v) {
      var n = parseValue(v), a = this.value, b = n.value;
      if (n.isSmall)
        return 1;
      return compareAbs(a, b);
    };
    SmallInteger.prototype.compareAbs = function(v) {
      var n = parseValue(v), a = Math.abs(this.value), b = n.value;
      if (n.isSmall) {
        b = Math.abs(b);
        return a === b ? 0 : a > b ? 1 : -1;
      }
      return -1;
    };
    NativeBigInt.prototype.compareAbs = function(v) {
      var a = this.value;
      var b = parseValue(v).value;
      a = a >= 0 ? a : -a;
      b = b >= 0 ? b : -b;
      return a === b ? 0 : a > b ? 1 : -1;
    };
    BigInteger.prototype.compare = function(v) {
      if (v === Infinity) {
        return -1;
      }
      if (v === -Infinity) {
        return 1;
      }
      var n = parseValue(v), a = this.value, b = n.value;
      if (this.sign !== n.sign) {
        return n.sign ? 1 : -1;
      }
      if (n.isSmall) {
        return this.sign ? -1 : 1;
      }
      return compareAbs(a, b) * (this.sign ? -1 : 1);
    };
    BigInteger.prototype.compareTo = BigInteger.prototype.compare;
    SmallInteger.prototype.compare = function(v) {
      if (v === Infinity) {
        return -1;
      }
      if (v === -Infinity) {
        return 1;
      }
      var n = parseValue(v), a = this.value, b = n.value;
      if (n.isSmall) {
        return a == b ? 0 : a > b ? 1 : -1;
      }
      if (a < 0 !== n.sign) {
        return a < 0 ? -1 : 1;
      }
      return a < 0 ? 1 : -1;
    };
    SmallInteger.prototype.compareTo = SmallInteger.prototype.compare;
    NativeBigInt.prototype.compare = function(v) {
      if (v === Infinity) {
        return -1;
      }
      if (v === -Infinity) {
        return 1;
      }
      var a = this.value;
      var b = parseValue(v).value;
      return a === b ? 0 : a > b ? 1 : -1;
    };
    NativeBigInt.prototype.compareTo = NativeBigInt.prototype.compare;
    BigInteger.prototype.equals = function(v) {
      return this.compare(v) === 0;
    };
    NativeBigInt.prototype.eq = NativeBigInt.prototype.equals = SmallInteger.prototype.eq = SmallInteger.prototype.equals = BigInteger.prototype.eq = BigInteger.prototype.equals;
    BigInteger.prototype.notEquals = function(v) {
      return this.compare(v) !== 0;
    };
    NativeBigInt.prototype.neq = NativeBigInt.prototype.notEquals = SmallInteger.prototype.neq = SmallInteger.prototype.notEquals = BigInteger.prototype.neq = BigInteger.prototype.notEquals;
    BigInteger.prototype.greater = function(v) {
      return this.compare(v) > 0;
    };
    NativeBigInt.prototype.gt = NativeBigInt.prototype.greater = SmallInteger.prototype.gt = SmallInteger.prototype.greater = BigInteger.prototype.gt = BigInteger.prototype.greater;
    BigInteger.prototype.lesser = function(v) {
      return this.compare(v) < 0;
    };
    NativeBigInt.prototype.lt = NativeBigInt.prototype.lesser = SmallInteger.prototype.lt = SmallInteger.prototype.lesser = BigInteger.prototype.lt = BigInteger.prototype.lesser;
    BigInteger.prototype.greaterOrEquals = function(v) {
      return this.compare(v) >= 0;
    };
    NativeBigInt.prototype.geq = NativeBigInt.prototype.greaterOrEquals = SmallInteger.prototype.geq = SmallInteger.prototype.greaterOrEquals = BigInteger.prototype.geq = BigInteger.prototype.greaterOrEquals;
    BigInteger.prototype.lesserOrEquals = function(v) {
      return this.compare(v) <= 0;
    };
    NativeBigInt.prototype.leq = NativeBigInt.prototype.lesserOrEquals = SmallInteger.prototype.leq = SmallInteger.prototype.lesserOrEquals = BigInteger.prototype.leq = BigInteger.prototype.lesserOrEquals;
    BigInteger.prototype.isEven = function() {
      return (this.value[0] & 1) === 0;
    };
    SmallInteger.prototype.isEven = function() {
      return (this.value & 1) === 0;
    };
    NativeBigInt.prototype.isEven = function() {
      return (this.value & BigInt(1)) === BigInt(0);
    };
    BigInteger.prototype.isOdd = function() {
      return (this.value[0] & 1) === 1;
    };
    SmallInteger.prototype.isOdd = function() {
      return (this.value & 1) === 1;
    };
    NativeBigInt.prototype.isOdd = function() {
      return (this.value & BigInt(1)) === BigInt(1);
    };
    BigInteger.prototype.isPositive = function() {
      return !this.sign;
    };
    SmallInteger.prototype.isPositive = function() {
      return this.value > 0;
    };
    NativeBigInt.prototype.isPositive = SmallInteger.prototype.isPositive;
    BigInteger.prototype.isNegative = function() {
      return this.sign;
    };
    SmallInteger.prototype.isNegative = function() {
      return this.value < 0;
    };
    NativeBigInt.prototype.isNegative = SmallInteger.prototype.isNegative;
    BigInteger.prototype.isUnit = function() {
      return false;
    };
    SmallInteger.prototype.isUnit = function() {
      return Math.abs(this.value) === 1;
    };
    NativeBigInt.prototype.isUnit = function() {
      return this.abs().value === BigInt(1);
    };
    BigInteger.prototype.isZero = function() {
      return false;
    };
    SmallInteger.prototype.isZero = function() {
      return this.value === 0;
    };
    NativeBigInt.prototype.isZero = function() {
      return this.value === BigInt(0);
    };
    BigInteger.prototype.isDivisibleBy = function(v) {
      var n = parseValue(v);
      if (n.isZero())
        return false;
      if (n.isUnit())
        return true;
      if (n.compareAbs(2) === 0)
        return this.isEven();
      return this.mod(n).isZero();
    };
    NativeBigInt.prototype.isDivisibleBy = SmallInteger.prototype.isDivisibleBy = BigInteger.prototype.isDivisibleBy;
    function isBasicPrime(v) {
      var n = v.abs();
      if (n.isUnit())
        return false;
      if (n.equals(2) || n.equals(3) || n.equals(5))
        return true;
      if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5))
        return false;
      if (n.lesser(49))
        return true;
    }
    function millerRabinTest(n, a) {
      var nPrev = n.prev(), b = nPrev, r = 0, d, t, i2, x;
      while (b.isEven())
        b = b.divide(2), r++;
      next:
        for (i2 = 0;i2 < a.length; i2++) {
          if (n.lesser(a[i2]))
            continue;
          x = bigInt(a[i2]).modPow(b, n);
          if (x.isUnit() || x.equals(nPrev))
            continue;
          for (d = r - 1;d != 0; d--) {
            x = x.square().mod(n);
            if (x.isUnit())
              return false;
            if (x.equals(nPrev))
              continue next;
          }
          return false;
        }
      return true;
    }
    BigInteger.prototype.isPrime = function(strict) {
      var isPrime = isBasicPrime(this);
      if (isPrime !== undefined2)
        return isPrime;
      var n = this.abs();
      var bits = n.bitLength();
      if (bits <= 64)
        return millerRabinTest(n, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
      var logN = Math.log(2) * bits.toJSNumber();
      var t = Math.ceil(strict === true ? 2 * Math.pow(logN, 2) : logN);
      for (var a = [], i2 = 0;i2 < t; i2++) {
        a.push(bigInt(i2 + 2));
      }
      return millerRabinTest(n, a);
    };
    NativeBigInt.prototype.isPrime = SmallInteger.prototype.isPrime = BigInteger.prototype.isPrime;
    BigInteger.prototype.isProbablePrime = function(iterations, rng) {
      var isPrime = isBasicPrime(this);
      if (isPrime !== undefined2)
        return isPrime;
      var n = this.abs();
      var t = iterations === undefined2 ? 5 : iterations;
      for (var a = [], i2 = 0;i2 < t; i2++) {
        a.push(bigInt.randBetween(2, n.minus(2), rng));
      }
      return millerRabinTest(n, a);
    };
    NativeBigInt.prototype.isProbablePrime = SmallInteger.prototype.isProbablePrime = BigInteger.prototype.isProbablePrime;
    BigInteger.prototype.modInv = function(n) {
      var { zero: t, one: newT } = bigInt, r = parseValue(n), newR = this.abs(), q, lastT, lastR;
      while (!newR.isZero()) {
        q = r.divide(newR);
        lastT = t;
        lastR = r;
        t = newT;
        r = newR;
        newT = lastT.subtract(q.multiply(newT));
        newR = lastR.subtract(q.multiply(newR));
      }
      if (!r.isUnit())
        throw new Error(this.toString() + " and " + n.toString() + " are not co-prime");
      if (t.compare(0) === -1) {
        t = t.add(n);
      }
      if (this.isNegative()) {
        return t.negate();
      }
      return t;
    };
    NativeBigInt.prototype.modInv = SmallInteger.prototype.modInv = BigInteger.prototype.modInv;
    BigInteger.prototype.next = function() {
      var value = this.value;
      if (this.sign) {
        return subtractSmall(value, 1, this.sign);
      }
      return new BigInteger(addSmall(value, 1), this.sign);
    };
    SmallInteger.prototype.next = function() {
      var value = this.value;
      if (value + 1 < MAX_INT)
        return new SmallInteger(value + 1);
      return new BigInteger(MAX_INT_ARR, false);
    };
    NativeBigInt.prototype.next = function() {
      return new NativeBigInt(this.value + BigInt(1));
    };
    BigInteger.prototype.prev = function() {
      var value = this.value;
      if (this.sign) {
        return new BigInteger(addSmall(value, 1), true);
      }
      return subtractSmall(value, 1, this.sign);
    };
    SmallInteger.prototype.prev = function() {
      var value = this.value;
      if (value - 1 > -MAX_INT)
        return new SmallInteger(value - 1);
      return new BigInteger(MAX_INT_ARR, true);
    };
    NativeBigInt.prototype.prev = function() {
      return new NativeBigInt(this.value - BigInt(1));
    };
    var powersOfTwo = [1];
    while (2 * powersOfTwo[powersOfTwo.length - 1] <= BASE)
      powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
    var powers2Length = powersOfTwo.length, highestPower2 = powersOfTwo[powers2Length - 1];
    function shift_isSmall(n) {
      return Math.abs(n) <= BASE;
    }
    BigInteger.prototype.shiftLeft = function(v) {
      var n = parseValue(v).toJSNumber();
      if (!shift_isSmall(n)) {
        throw new Error(String(n) + " is too large for shifting.");
      }
      if (n < 0)
        return this.shiftRight(-n);
      var result = this;
      if (result.isZero())
        return result;
      while (n >= powers2Length) {
        result = result.multiply(highestPower2);
        n -= powers2Length - 1;
      }
      return result.multiply(powersOfTwo[n]);
    };
    NativeBigInt.prototype.shiftLeft = SmallInteger.prototype.shiftLeft = BigInteger.prototype.shiftLeft;
    BigInteger.prototype.shiftRight = function(v) {
      var remQuo;
      var n = parseValue(v).toJSNumber();
      if (!shift_isSmall(n)) {
        throw new Error(String(n) + " is too large for shifting.");
      }
      if (n < 0)
        return this.shiftLeft(-n);
      var result = this;
      while (n >= powers2Length) {
        if (result.isZero() || result.isNegative() && result.isUnit())
          return result;
        remQuo = divModAny(result, highestPower2);
        result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
        n -= powers2Length - 1;
      }
      remQuo = divModAny(result, powersOfTwo[n]);
      return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
    };
    NativeBigInt.prototype.shiftRight = SmallInteger.prototype.shiftRight = BigInteger.prototype.shiftRight;
    function bitwise(x, y, fn) {
      y = parseValue(y);
      var xSign = x.isNegative(), ySign = y.isNegative();
      var xRem = xSign ? x.not() : x, yRem = ySign ? y.not() : y;
      var xDigit = 0, yDigit = 0;
      var xDivMod = null, yDivMod = null;
      var result = [];
      while (!xRem.isZero() || !yRem.isZero()) {
        xDivMod = divModAny(xRem, highestPower2);
        xDigit = xDivMod[1].toJSNumber();
        if (xSign) {
          xDigit = highestPower2 - 1 - xDigit;
        }
        yDivMod = divModAny(yRem, highestPower2);
        yDigit = yDivMod[1].toJSNumber();
        if (ySign) {
          yDigit = highestPower2 - 1 - yDigit;
        }
        xRem = xDivMod[0];
        yRem = yDivMod[0];
        result.push(fn(xDigit, yDigit));
      }
      var sum = fn(xSign ? 1 : 0, ySign ? 1 : 0) !== 0 ? bigInt(-1) : bigInt(0);
      for (var i2 = result.length - 1;i2 >= 0; i2 -= 1) {
        sum = sum.multiply(highestPower2).add(bigInt(result[i2]));
      }
      return sum;
    }
    BigInteger.prototype.not = function() {
      return this.negate().prev();
    };
    NativeBigInt.prototype.not = SmallInteger.prototype.not = BigInteger.prototype.not;
    BigInteger.prototype.and = function(n) {
      return bitwise(this, n, function(a, b) {
        return a & b;
      });
    };
    NativeBigInt.prototype.and = SmallInteger.prototype.and = BigInteger.prototype.and;
    BigInteger.prototype.or = function(n) {
      return bitwise(this, n, function(a, b) {
        return a | b;
      });
    };
    NativeBigInt.prototype.or = SmallInteger.prototype.or = BigInteger.prototype.or;
    BigInteger.prototype.xor = function(n) {
      return bitwise(this, n, function(a, b) {
        return a ^ b;
      });
    };
    NativeBigInt.prototype.xor = SmallInteger.prototype.xor = BigInteger.prototype.xor;
    var LOBMASK_I = 1 << 30, LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;
    function roughLOB(n) {
      var v = n.value, x = typeof v === "number" ? v | LOBMASK_I : typeof v === "bigint" ? v | BigInt(LOBMASK_I) : v[0] + v[1] * BASE | LOBMASK_BI;
      return x & -x;
    }
    function integerLogarithm(value, base) {
      if (base.compareTo(value) <= 0) {
        var tmp = integerLogarithm(value, base.square(base));
        var p = tmp.p;
        var e = tmp.e;
        var t = p.multiply(base);
        return t.compareTo(value) <= 0 ? { p: t, e: e * 2 + 1 } : { p, e: e * 2 };
      }
      return { p: bigInt(1), e: 0 };
    }
    BigInteger.prototype.bitLength = function() {
      var n = this;
      if (n.compareTo(bigInt(0)) < 0) {
        n = n.negate().subtract(bigInt(1));
      }
      if (n.compareTo(bigInt(0)) === 0) {
        return bigInt(0);
      }
      return bigInt(integerLogarithm(n, bigInt(2)).e).add(bigInt(1));
    };
    NativeBigInt.prototype.bitLength = SmallInteger.prototype.bitLength = BigInteger.prototype.bitLength;
    function max(a, b) {
      a = parseValue(a);
      b = parseValue(b);
      return a.greater(b) ? a : b;
    }
    function min(a, b) {
      a = parseValue(a);
      b = parseValue(b);
      return a.lesser(b) ? a : b;
    }
    function gcd(a, b) {
      a = parseValue(a).abs();
      b = parseValue(b).abs();
      if (a.equals(b))
        return a;
      if (a.isZero())
        return b;
      if (b.isZero())
        return a;
      var c = Integer[1], d, t;
      while (a.isEven() && b.isEven()) {
        d = min(roughLOB(a), roughLOB(b));
        a = a.divide(d);
        b = b.divide(d);
        c = c.multiply(d);
      }
      while (a.isEven()) {
        a = a.divide(roughLOB(a));
      }
      do {
        while (b.isEven()) {
          b = b.divide(roughLOB(b));
        }
        if (a.greater(b)) {
          t = b;
          b = a;
          a = t;
        }
        b = b.subtract(a);
      } while (!b.isZero());
      return c.isUnit() ? a : a.multiply(c);
    }
    function lcm(a, b) {
      a = parseValue(a).abs();
      b = parseValue(b).abs();
      return a.divide(gcd(a, b)).multiply(b);
    }
    function randBetween(a, b, rng) {
      a = parseValue(a);
      b = parseValue(b);
      var usedRNG = rng || Math.random;
      var low = min(a, b), high = max(a, b);
      var range = high.subtract(low).add(1);
      if (range.isSmall)
        return low.add(Math.floor(usedRNG() * range));
      var digits = toBase(range, BASE).value;
      var result = [], restricted = true;
      for (var i2 = 0;i2 < digits.length; i2++) {
        var top = restricted ? digits[i2] + (i2 + 1 < digits.length ? digits[i2 + 1] / BASE : 0) : BASE;
        var digit = truncate(usedRNG() * top);
        result.push(digit);
        if (digit < digits[i2])
          restricted = false;
      }
      return low.add(Integer.fromArray(result, BASE, false));
    }
    var parseBase = function(text, base, alphabet, caseSensitive) {
      alphabet = alphabet || DEFAULT_ALPHABET;
      text = String(text);
      if (!caseSensitive) {
        text = text.toLowerCase();
        alphabet = alphabet.toLowerCase();
      }
      var length = text.length;
      var i2;
      var absBase = Math.abs(base);
      var alphabetValues = {};
      for (i2 = 0;i2 < alphabet.length; i2++) {
        alphabetValues[alphabet[i2]] = i2;
      }
      for (i2 = 0;i2 < length; i2++) {
        var c = text[i2];
        if (c === "-")
          continue;
        if (c in alphabetValues) {
          if (alphabetValues[c] >= absBase) {
            if (c === "1" && absBase === 1)
              continue;
            throw new Error(c + " is not a valid digit in base " + base + ".");
          }
        }
      }
      base = parseValue(base);
      var digits = [];
      var isNegative = text[0] === "-";
      for (i2 = isNegative ? 1 : 0;i2 < text.length; i2++) {
        var c = text[i2];
        if (c in alphabetValues)
          digits.push(parseValue(alphabetValues[c]));
        else if (c === "<") {
          var start = i2;
          do {
            i2++;
          } while (text[i2] !== ">" && i2 < text.length);
          digits.push(parseValue(text.slice(start + 1, i2)));
        } else
          throw new Error(c + " is not a valid character");
      }
      return parseBaseFromArray(digits, base, isNegative);
    };
    function parseBaseFromArray(digits, base, isNegative) {
      var val = Integer[0], pow = Integer[1], i2;
      for (i2 = digits.length - 1;i2 >= 0; i2--) {
        val = val.add(digits[i2].times(pow));
        pow = pow.times(base);
      }
      return isNegative ? val.negate() : val;
    }
    function stringify(digit, alphabet) {
      alphabet = alphabet || DEFAULT_ALPHABET;
      if (digit < alphabet.length) {
        return alphabet[digit];
      }
      return "<" + digit + ">";
    }
    function toBase(n, base) {
      base = bigInt(base);
      if (base.isZero()) {
        if (n.isZero())
          return { value: [0], isNegative: false };
        throw new Error("Cannot convert nonzero numbers to base 0.");
      }
      if (base.equals(-1)) {
        if (n.isZero())
          return { value: [0], isNegative: false };
        if (n.isNegative())
          return {
            value: [].concat.apply([], Array.apply(null, Array(-n.toJSNumber())).map(Array.prototype.valueOf, [1, 0])),
            isNegative: false
          };
        var arr = Array.apply(null, Array(n.toJSNumber() - 1)).map(Array.prototype.valueOf, [0, 1]);
        arr.unshift([1]);
        return {
          value: [].concat.apply([], arr),
          isNegative: false
        };
      }
      var neg = false;
      if (n.isNegative() && base.isPositive()) {
        neg = true;
        n = n.abs();
      }
      if (base.isUnit()) {
        if (n.isZero())
          return { value: [0], isNegative: false };
        return {
          value: Array.apply(null, Array(n.toJSNumber())).map(Number.prototype.valueOf, 1),
          isNegative: neg
        };
      }
      var out = [];
      var left = n, divmod;
      while (left.isNegative() || left.compareAbs(base) >= 0) {
        divmod = left.divmod(base);
        left = divmod.quotient;
        var digit = divmod.remainder;
        if (digit.isNegative()) {
          digit = base.minus(digit).abs();
          left = left.next();
        }
        out.push(digit.toJSNumber());
      }
      out.push(left.toJSNumber());
      return { value: out.reverse(), isNegative: neg };
    }
    function toBaseString(n, base, alphabet) {
      var arr = toBase(n, base);
      return (arr.isNegative ? "-" : "") + arr.value.map(function(x) {
        return stringify(x, alphabet);
      }).join("");
    }
    BigInteger.prototype.toArray = function(radix) {
      return toBase(this, radix);
    };
    SmallInteger.prototype.toArray = function(radix) {
      return toBase(this, radix);
    };
    NativeBigInt.prototype.toArray = function(radix) {
      return toBase(this, radix);
    };
    BigInteger.prototype.toString = function(radix, alphabet) {
      if (radix === undefined2)
        radix = 10;
      if (radix !== 10 || alphabet)
        return toBaseString(this, radix, alphabet);
      var v = this.value, l = v.length, str = String(v[--l]), zeros = "0000000", digit;
      while (--l >= 0) {
        digit = String(v[l]);
        str += zeros.slice(digit.length) + digit;
      }
      var sign = this.sign ? "-" : "";
      return sign + str;
    };
    SmallInteger.prototype.toString = function(radix, alphabet) {
      if (radix === undefined2)
        radix = 10;
      if (radix != 10 || alphabet)
        return toBaseString(this, radix, alphabet);
      return String(this.value);
    };
    NativeBigInt.prototype.toString = SmallInteger.prototype.toString;
    NativeBigInt.prototype.toJSON = BigInteger.prototype.toJSON = SmallInteger.prototype.toJSON = function() {
      return this.toString();
    };
    BigInteger.prototype.valueOf = function() {
      return parseInt(this.toString(), 10);
    };
    BigInteger.prototype.toJSNumber = BigInteger.prototype.valueOf;
    SmallInteger.prototype.valueOf = function() {
      return this.value;
    };
    SmallInteger.prototype.toJSNumber = SmallInteger.prototype.valueOf;
    NativeBigInt.prototype.valueOf = NativeBigInt.prototype.toJSNumber = function() {
      return parseInt(this.toString(), 10);
    };
    function parseStringValue(v) {
      if (isPrecise(+v)) {
        var x = +v;
        if (x === truncate(x))
          return supportsNativeBigInt ? new NativeBigInt(BigInt(x)) : new SmallInteger(x);
        throw new Error("Invalid integer: " + v);
      }
      var sign = v[0] === "-";
      if (sign)
        v = v.slice(1);
      var split = v.split(/e/i);
      if (split.length > 2)
        throw new Error("Invalid integer: " + split.join("e"));
      if (split.length === 2) {
        var exp = split[1];
        if (exp[0] === "+")
          exp = exp.slice(1);
        exp = +exp;
        if (exp !== truncate(exp) || !isPrecise(exp))
          throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
        var text = split[0];
        var decimalPlace = text.indexOf(".");
        if (decimalPlace >= 0) {
          exp -= text.length - decimalPlace - 1;
          text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
        }
        if (exp < 0)
          throw new Error("Cannot include negative exponent part for integers");
        text += new Array(exp + 1).join("0");
        v = text;
      }
      var isValid = /^([0-9][0-9]*)$/.test(v);
      if (!isValid)
        throw new Error("Invalid integer: " + v);
      if (supportsNativeBigInt) {
        return new NativeBigInt(BigInt(sign ? "-" + v : v));
      }
      var r = [], max2 = v.length, l = LOG_BASE, min2 = max2 - l;
      while (max2 > 0) {
        r.push(+v.slice(min2, max2));
        min2 -= l;
        if (min2 < 0)
          min2 = 0;
        max2 -= l;
      }
      trim(r);
      return new BigInteger(r, sign);
    }
    function parseNumberValue(v) {
      if (supportsNativeBigInt) {
        return new NativeBigInt(BigInt(v));
      }
      if (isPrecise(v)) {
        if (v !== truncate(v))
          throw new Error(v + " is not an integer.");
        return new SmallInteger(v);
      }
      return parseStringValue(v.toString());
    }
    function parseValue(v) {
      if (typeof v === "number") {
        return parseNumberValue(v);
      }
      if (typeof v === "string") {
        return parseStringValue(v);
      }
      if (typeof v === "bigint") {
        return new NativeBigInt(v);
      }
      return v;
    }
    for (var i = 0;i < 1000; i++) {
      Integer[i] = parseValue(i);
      if (i > 0)
        Integer[-i] = parseValue(-i);
    }
    Integer.one = Integer[1];
    Integer.zero = Integer[0];
    Integer.minusOne = Integer[-1];
    Integer.max = max;
    Integer.min = min;
    Integer.gcd = gcd;
    Integer.lcm = lcm;
    Integer.isInstance = function(x) {
      return x instanceof BigInteger || x instanceof SmallInteger || x instanceof NativeBigInt;
    };
    Integer.randBetween = randBetween;
    Integer.fromArray = function(digits, base, isNegative) {
      return parseBaseFromArray(digits.map(parseValue), parseValue(base || 10), isNegative);
    };
    return Integer;
  }();
  if (typeof module !== "undefined" && module.hasOwnProperty("exports")) {
    module.exports = bigInt;
  }
  if (typeof define === "function" && define.amd) {
    define(function() {
      return bigInt;
    });
  }
});

// node_modules/base64-js/index.js
var require_base64_js = __commonJS((exports) => {
  function getLens(b64) {
    var len2 = b64.length;
    if (len2 % 4 > 0) {
      throw new Error("Invalid string. Length must be a multiple of 4");
    }
    var validLen = b64.indexOf("=");
    if (validLen === -1)
      validLen = len2;
    var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
    return [validLen, placeHoldersLen];
  }
  function byteLength(b64) {
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
  }
  function _byteLength(b64, validLen, placeHoldersLen) {
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
  }
  function toByteArray(b64) {
    var tmp;
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
    var curByte = 0;
    var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
    var i2;
    for (i2 = 0;i2 < len2; i2 += 4) {
      tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
      arr[curByte++] = tmp >> 16 & 255;
      arr[curByte++] = tmp >> 8 & 255;
      arr[curByte++] = tmp & 255;
    }
    if (placeHoldersLen === 2) {
      tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
      arr[curByte++] = tmp & 255;
    }
    if (placeHoldersLen === 1) {
      tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
      arr[curByte++] = tmp >> 8 & 255;
      arr[curByte++] = tmp & 255;
    }
    return arr;
  }
  function tripletToBase64(num) {
    return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
  }
  function encodeChunk(uint8, start, end) {
    var tmp;
    var output = [];
    for (var i2 = start;i2 < end; i2 += 3) {
      tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
      output.push(tripletToBase64(tmp));
    }
    return output.join("");
  }
  function fromByteArray(uint8) {
    var tmp;
    var len2 = uint8.length;
    var extraBytes = len2 % 3;
    var parts = [];
    var maxChunkLength = 16383;
    for (var i2 = 0, len22 = len2 - extraBytes;i2 < len22; i2 += maxChunkLength) {
      parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
    }
    if (extraBytes === 1) {
      tmp = uint8[len2 - 1];
      parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "==");
    } else if (extraBytes === 2) {
      tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
      parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "=");
    }
    return parts.join("");
  }
  exports.byteLength = byteLength;
  exports.toByteArray = toByteArray;
  exports.fromByteArray = fromByteArray;
  var lookup = [];
  var revLookup = [];
  var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
  var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (i = 0, len = code.length;i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }
  var i;
  var len;
  revLookup["-".charCodeAt(0)] = 62;
  revLookup["_".charCodeAt(0)] = 63;
});

// node_modules/ieee754/index.js
var require_ieee754 = __commonJS((exports) => {
  /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
  exports.read = function(buffer, offset, isLE, mLen, nBytes) {
    var e, m;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i = isLE ? nBytes - 1 : 0;
    var d = isLE ? -1 : 1;
    var s = buffer[offset + i];
    i += d;
    e = s & (1 << -nBits) - 1;
    s >>= -nBits;
    nBits += eLen;
    for (;nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
    }
    m = e & (1 << -nBits) - 1;
    e >>= -nBits;
    nBits += mLen;
    for (;nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
    }
    if (e === 0) {
      e = 1 - eBias;
    } else if (e === eMax) {
      return m ? NaN : (s ? -1 : 1) * Infinity;
    } else {
      m = m + Math.pow(2, mLen);
      e = e - eBias;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
  };
  exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
    var i = isLE ? 0 : nBytes - 1;
    var d = isLE ? 1 : -1;
    var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
    value = Math.abs(value);
    if (isNaN(value) || value === Infinity) {
      m = isNaN(value) ? 1 : 0;
      e = eMax;
    } else {
      e = Math.floor(Math.log(value) / Math.LN2);
      if (value * (c = Math.pow(2, -e)) < 1) {
        e--;
        c *= 2;
      }
      if (e + eBias >= 1) {
        value += rt / c;
      } else {
        value += rt * Math.pow(2, 1 - eBias);
      }
      if (value * c >= 2) {
        e++;
        c /= 2;
      }
      if (e + eBias >= eMax) {
        m = 0;
        e = eMax;
      } else if (e + eBias >= 1) {
        m = (value * c - 1) * Math.pow(2, mLen);
        e = e + eBias;
      } else {
        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
        e = 0;
      }
    }
    for (;mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
    }
    e = e << mLen | m;
    eLen += mLen;
    for (;eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
    }
    buffer[offset + i - d] |= s * 128;
  };
});

// node_modules/buffer/index.js
var require_buffer = __commonJS((exports) => {
  function typedArraySupport() {
    try {
      const arr = new Uint8Array(1);
      const proto = { foo: function() {
        return 42;
      } };
      Object.setPrototypeOf(proto, Uint8Array.prototype);
      Object.setPrototypeOf(arr, proto);
      return arr.foo() === 42;
    } catch (e) {
      return false;
    }
  }
  function createBuffer(length) {
    if (length > K_MAX_LENGTH) {
      throw new RangeError('The value "' + length + '" is invalid for option "size"');
    }
    const buf = new Uint8Array(length);
    Object.setPrototypeOf(buf, Buffer.prototype);
    return buf;
  }
  function Buffer(arg, encodingOrOffset, length) {
    if (typeof arg === "number") {
      if (typeof encodingOrOffset === "string") {
        throw new TypeError('The "string" argument must be of type string. Received type number');
      }
      return allocUnsafe(arg);
    }
    return from(arg, encodingOrOffset, length);
  }
  function from(value, encodingOrOffset, length) {
    if (typeof value === "string") {
      return fromString(value, encodingOrOffset);
    }
    if (ArrayBuffer.isView(value)) {
      return fromArrayView(value);
    }
    if (value == null) {
      throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, " + "or Array-like Object. Received type " + typeof value);
    }
    if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
      return fromArrayBuffer(value, encodingOrOffset, length);
    }
    if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
      return fromArrayBuffer(value, encodingOrOffset, length);
    }
    if (typeof value === "number") {
      throw new TypeError('The "value" argument must not be of type number. Received type number');
    }
    const valueOf = value.valueOf && value.valueOf();
    if (valueOf != null && valueOf !== value) {
      return Buffer.from(valueOf, encodingOrOffset, length);
    }
    const b = fromObject(value);
    if (b)
      return b;
    if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
      return Buffer.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
    }
    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, " + "or Array-like Object. Received type " + typeof value);
  }
  function assertSize(size) {
    if (typeof size !== "number") {
      throw new TypeError('"size" argument must be of type number');
    } else if (size < 0) {
      throw new RangeError('The value "' + size + '" is invalid for option "size"');
    }
  }
  function alloc(size, fill, encoding) {
    assertSize(size);
    if (size <= 0) {
      return createBuffer(size);
    }
    if (fill !== undefined) {
      return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
    }
    return createBuffer(size);
  }
  function allocUnsafe(size) {
    assertSize(size);
    return createBuffer(size < 0 ? 0 : checked(size) | 0);
  }
  function fromString(string, encoding) {
    if (typeof encoding !== "string" || encoding === "") {
      encoding = "utf8";
    }
    if (!Buffer.isEncoding(encoding)) {
      throw new TypeError("Unknown encoding: " + encoding);
    }
    const length = byteLength(string, encoding) | 0;
    let buf = createBuffer(length);
    const actual = buf.write(string, encoding);
    if (actual !== length) {
      buf = buf.slice(0, actual);
    }
    return buf;
  }
  function fromArrayLike(array) {
    const length = array.length < 0 ? 0 : checked(array.length) | 0;
    const buf = createBuffer(length);
    for (let i = 0;i < length; i += 1) {
      buf[i] = array[i] & 255;
    }
    return buf;
  }
  function fromArrayView(arrayView) {
    if (isInstance(arrayView, Uint8Array)) {
      const copy = new Uint8Array(arrayView);
      return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
    }
    return fromArrayLike(arrayView);
  }
  function fromArrayBuffer(array, byteOffset, length) {
    if (byteOffset < 0 || array.byteLength < byteOffset) {
      throw new RangeError('"offset" is outside of buffer bounds');
    }
    if (array.byteLength < byteOffset + (length || 0)) {
      throw new RangeError('"length" is outside of buffer bounds');
    }
    let buf;
    if (byteOffset === undefined && length === undefined) {
      buf = new Uint8Array(array);
    } else if (length === undefined) {
      buf = new Uint8Array(array, byteOffset);
    } else {
      buf = new Uint8Array(array, byteOffset, length);
    }
    Object.setPrototypeOf(buf, Buffer.prototype);
    return buf;
  }
  function fromObject(obj) {
    if (Buffer.isBuffer(obj)) {
      const len = checked(obj.length) | 0;
      const buf = createBuffer(len);
      if (buf.length === 0) {
        return buf;
      }
      obj.copy(buf, 0, 0, len);
      return buf;
    }
    if (obj.length !== undefined) {
      if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
        return createBuffer(0);
      }
      return fromArrayLike(obj);
    }
    if (obj.type === "Buffer" && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data);
    }
  }
  function checked(length) {
    if (length >= K_MAX_LENGTH) {
      throw new RangeError("Attempt to allocate Buffer larger than maximum " + "size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
    }
    return length | 0;
  }
  function SlowBuffer(length) {
    if (+length != length) {
      length = 0;
    }
    return Buffer.alloc(+length);
  }
  function byteLength(string, encoding) {
    if (Buffer.isBuffer(string)) {
      return string.length;
    }
    if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
      return string.byteLength;
    }
    if (typeof string !== "string") {
      throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' + "Received type " + typeof string);
    }
    const len = string.length;
    const mustMatch = arguments.length > 2 && arguments[2] === true;
    if (!mustMatch && len === 0)
      return 0;
    let loweredCase = false;
    for (;; ) {
      switch (encoding) {
        case "ascii":
        case "latin1":
        case "binary":
          return len;
        case "utf8":
        case "utf-8":
          return utf8ToBytes(string).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return len * 2;
        case "hex":
          return len >>> 1;
        case "base64":
          return base64ToBytes(string).length;
        default:
          if (loweredCase) {
            return mustMatch ? -1 : utf8ToBytes(string).length;
          }
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  }
  function slowToString(encoding, start, end) {
    let loweredCase = false;
    if (start === undefined || start < 0) {
      start = 0;
    }
    if (start > this.length) {
      return "";
    }
    if (end === undefined || end > this.length) {
      end = this.length;
    }
    if (end <= 0) {
      return "";
    }
    end >>>= 0;
    start >>>= 0;
    if (end <= start) {
      return "";
    }
    if (!encoding)
      encoding = "utf8";
    while (true) {
      switch (encoding) {
        case "hex":
          return hexSlice(this, start, end);
        case "utf8":
        case "utf-8":
          return utf8Slice(this, start, end);
        case "ascii":
          return asciiSlice(this, start, end);
        case "latin1":
        case "binary":
          return latin1Slice(this, start, end);
        case "base64":
          return base64Slice(this, start, end);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return utf16leSlice(this, start, end);
        default:
          if (loweredCase)
            throw new TypeError("Unknown encoding: " + encoding);
          encoding = (encoding + "").toLowerCase();
          loweredCase = true;
      }
    }
  }
  function swap(b, n, m) {
    const i = b[n];
    b[n] = b[m];
    b[m] = i;
  }
  function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
    if (buffer.length === 0)
      return -1;
    if (typeof byteOffset === "string") {
      encoding = byteOffset;
      byteOffset = 0;
    } else if (byteOffset > 2147483647) {
      byteOffset = 2147483647;
    } else if (byteOffset < -2147483648) {
      byteOffset = -2147483648;
    }
    byteOffset = +byteOffset;
    if (numberIsNaN(byteOffset)) {
      byteOffset = dir ? 0 : buffer.length - 1;
    }
    if (byteOffset < 0)
      byteOffset = buffer.length + byteOffset;
    if (byteOffset >= buffer.length) {
      if (dir)
        return -1;
      else
        byteOffset = buffer.length - 1;
    } else if (byteOffset < 0) {
      if (dir)
        byteOffset = 0;
      else
        return -1;
    }
    if (typeof val === "string") {
      val = Buffer.from(val, encoding);
    }
    if (Buffer.isBuffer(val)) {
      if (val.length === 0) {
        return -1;
      }
      return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
    } else if (typeof val === "number") {
      val = val & 255;
      if (typeof Uint8Array.prototype.indexOf === "function") {
        if (dir) {
          return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
        } else {
          return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
        }
      }
      return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
    }
    throw new TypeError("val must be string, number or Buffer");
  }
  function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
    let indexSize = 1;
    let arrLength = arr.length;
    let valLength = val.length;
    if (encoding !== undefined) {
      encoding = String(encoding).toLowerCase();
      if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
        if (arr.length < 2 || val.length < 2) {
          return -1;
        }
        indexSize = 2;
        arrLength /= 2;
        valLength /= 2;
        byteOffset /= 2;
      }
    }
    function read(buf, i2) {
      if (indexSize === 1) {
        return buf[i2];
      } else {
        return buf.readUInt16BE(i2 * indexSize);
      }
    }
    let i;
    if (dir) {
      let foundIndex = -1;
      for (i = byteOffset;i < arrLength; i++) {
        if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
          if (foundIndex === -1)
            foundIndex = i;
          if (i - foundIndex + 1 === valLength)
            return foundIndex * indexSize;
        } else {
          if (foundIndex !== -1)
            i -= i - foundIndex;
          foundIndex = -1;
        }
      }
    } else {
      if (byteOffset + valLength > arrLength)
        byteOffset = arrLength - valLength;
      for (i = byteOffset;i >= 0; i--) {
        let found = true;
        for (let j = 0;j < valLength; j++) {
          if (read(arr, i + j) !== read(val, j)) {
            found = false;
            break;
          }
        }
        if (found)
          return i;
      }
    }
    return -1;
  }
  function hexWrite(buf, string, offset, length) {
    offset = Number(offset) || 0;
    const remaining = buf.length - offset;
    if (!length) {
      length = remaining;
    } else {
      length = Number(length);
      if (length > remaining) {
        length = remaining;
      }
    }
    const strLen = string.length;
    if (length > strLen / 2) {
      length = strLen / 2;
    }
    let i;
    for (i = 0;i < length; ++i) {
      const parsed = parseInt(string.substr(i * 2, 2), 16);
      if (numberIsNaN(parsed))
        return i;
      buf[offset + i] = parsed;
    }
    return i;
  }
  function utf8Write(buf, string, offset, length) {
    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
  }
  function asciiWrite(buf, string, offset, length) {
    return blitBuffer(asciiToBytes(string), buf, offset, length);
  }
  function base64Write(buf, string, offset, length) {
    return blitBuffer(base64ToBytes(string), buf, offset, length);
  }
  function ucs2Write(buf, string, offset, length) {
    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
  }
  function base64Slice(buf, start, end) {
    if (start === 0 && end === buf.length) {
      return base64.fromByteArray(buf);
    } else {
      return base64.fromByteArray(buf.slice(start, end));
    }
  }
  function utf8Slice(buf, start, end) {
    end = Math.min(buf.length, end);
    const res = [];
    let i = start;
    while (i < end) {
      const firstByte = buf[i];
      let codePoint = null;
      let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
      if (i + bytesPerSequence <= end) {
        let secondByte, thirdByte, fourthByte, tempCodePoint;
        switch (bytesPerSequence) {
          case 1:
            if (firstByte < 128) {
              codePoint = firstByte;
            }
            break;
          case 2:
            secondByte = buf[i + 1];
            if ((secondByte & 192) === 128) {
              tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
              if (tempCodePoint > 127) {
                codePoint = tempCodePoint;
              }
            }
            break;
          case 3:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];
            if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
              tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
              if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                codePoint = tempCodePoint;
              }
            }
            break;
          case 4:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];
            fourthByte = buf[i + 3];
            if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
              tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
              if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                codePoint = tempCodePoint;
              }
            }
        }
      }
      if (codePoint === null) {
        codePoint = 65533;
        bytesPerSequence = 1;
      } else if (codePoint > 65535) {
        codePoint -= 65536;
        res.push(codePoint >>> 10 & 1023 | 55296);
        codePoint = 56320 | codePoint & 1023;
      }
      res.push(codePoint);
      i += bytesPerSequence;
    }
    return decodeCodePointsArray(res);
  }
  function decodeCodePointsArray(codePoints) {
    const len = codePoints.length;
    if (len <= MAX_ARGUMENTS_LENGTH) {
      return String.fromCharCode.apply(String, codePoints);
    }
    let res = "";
    let i = 0;
    while (i < len) {
      res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
    }
    return res;
  }
  function asciiSlice(buf, start, end) {
    let ret = "";
    end = Math.min(buf.length, end);
    for (let i = start;i < end; ++i) {
      ret += String.fromCharCode(buf[i] & 127);
    }
    return ret;
  }
  function latin1Slice(buf, start, end) {
    let ret = "";
    end = Math.min(buf.length, end);
    for (let i = start;i < end; ++i) {
      ret += String.fromCharCode(buf[i]);
    }
    return ret;
  }
  function hexSlice(buf, start, end) {
    const len = buf.length;
    if (!start || start < 0)
      start = 0;
    if (!end || end < 0 || end > len)
      end = len;
    let out = "";
    for (let i = start;i < end; ++i) {
      out += hexSliceLookupTable[buf[i]];
    }
    return out;
  }
  function utf16leSlice(buf, start, end) {
    const bytes = buf.slice(start, end);
    let res = "";
    for (let i = 0;i < bytes.length - 1; i += 2) {
      res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
    }
    return res;
  }
  function checkOffset(offset, ext, length) {
    if (offset % 1 !== 0 || offset < 0)
      throw new RangeError("offset is not uint");
    if (offset + ext > length)
      throw new RangeError("Trying to access beyond buffer length");
  }
  function checkInt(buf, value, offset, ext, max, min) {
    if (!Buffer.isBuffer(buf))
      throw new TypeError('"buffer" argument must be a Buffer instance');
    if (value > max || value < min)
      throw new RangeError('"value" argument is out of bounds');
    if (offset + ext > buf.length)
      throw new RangeError("Index out of range");
  }
  function wrtBigUInt64LE(buf, value, offset, min, max) {
    checkIntBI(value, min, max, buf, offset, 7);
    let lo = Number(value & BigInt(4294967295));
    buf[offset++] = lo;
    lo = lo >> 8;
    buf[offset++] = lo;
    lo = lo >> 8;
    buf[offset++] = lo;
    lo = lo >> 8;
    buf[offset++] = lo;
    let hi = Number(value >> BigInt(32) & BigInt(4294967295));
    buf[offset++] = hi;
    hi = hi >> 8;
    buf[offset++] = hi;
    hi = hi >> 8;
    buf[offset++] = hi;
    hi = hi >> 8;
    buf[offset++] = hi;
    return offset;
  }
  function wrtBigUInt64BE(buf, value, offset, min, max) {
    checkIntBI(value, min, max, buf, offset, 7);
    let lo = Number(value & BigInt(4294967295));
    buf[offset + 7] = lo;
    lo = lo >> 8;
    buf[offset + 6] = lo;
    lo = lo >> 8;
    buf[offset + 5] = lo;
    lo = lo >> 8;
    buf[offset + 4] = lo;
    let hi = Number(value >> BigInt(32) & BigInt(4294967295));
    buf[offset + 3] = hi;
    hi = hi >> 8;
    buf[offset + 2] = hi;
    hi = hi >> 8;
    buf[offset + 1] = hi;
    hi = hi >> 8;
    buf[offset] = hi;
    return offset + 8;
  }
  function checkIEEE754(buf, value, offset, ext, max, min) {
    if (offset + ext > buf.length)
      throw new RangeError("Index out of range");
    if (offset < 0)
      throw new RangeError("Index out of range");
  }
  function writeFloat(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 4, 340282346638528860000000000000000000000, -340282346638528860000000000000000000000);
    }
    ieee754.write(buf, value, offset, littleEndian, 23, 4);
    return offset + 4;
  }
  function writeDouble(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 8, 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000, -179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000);
    }
    ieee754.write(buf, value, offset, littleEndian, 52, 8);
    return offset + 8;
  }
  function E(sym, getMessage, Base) {
    errors[sym] = class NodeError extends Base {
      constructor() {
        super();
        Object.defineProperty(this, "message", {
          value: getMessage.apply(this, arguments),
          writable: true,
          configurable: true
        });
        this.name = `${this.name} [${sym}]`;
        this.stack;
        delete this.name;
      }
      get code() {
        return sym;
      }
      set code(value) {
        Object.defineProperty(this, "code", {
          configurable: true,
          enumerable: true,
          value,
          writable: true
        });
      }
      toString() {
        return `${this.name} [${sym}]: ${this.message}`;
      }
    };
  }
  function addNumericalSeparator(val) {
    let res = "";
    let i = val.length;
    const start = val[0] === "-" ? 1 : 0;
    for (;i >= start + 4; i -= 3) {
      res = `_${val.slice(i - 3, i)}${res}`;
    }
    return `${val.slice(0, i)}${res}`;
  }
  function checkBounds(buf, offset, byteLength2) {
    validateNumber(offset, "offset");
    if (buf[offset] === undefined || buf[offset + byteLength2] === undefined) {
      boundsError(offset, buf.length - (byteLength2 + 1));
    }
  }
  function checkIntBI(value, min, max, buf, offset, byteLength2) {
    if (value > max || value < min) {
      const n = typeof min === "bigint" ? "n" : "";
      let range;
      if (byteLength2 > 3) {
        if (min === 0 || min === BigInt(0)) {
          range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
        } else {
          range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ` + `${(byteLength2 + 1) * 8 - 1}${n}`;
        }
      } else {
        range = `>= ${min}${n} and <= ${max}${n}`;
      }
      throw new errors.ERR_OUT_OF_RANGE("value", range, value);
    }
    checkBounds(buf, offset, byteLength2);
  }
  function validateNumber(value, name) {
    if (typeof value !== "number") {
      throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
    }
  }
  function boundsError(value, length, type) {
    if (Math.floor(value) !== value) {
      validateNumber(value, type);
      throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
    }
    if (length < 0) {
      throw new errors.ERR_BUFFER_OUT_OF_BOUNDS;
    }
    throw new errors.ERR_OUT_OF_RANGE(type || "offset", `>= ${type ? 1 : 0} and <= ${length}`, value);
  }
  function base64clean(str) {
    str = str.split("=")[0];
    str = str.trim().replace(INVALID_BASE64_RE, "");
    if (str.length < 2)
      return "";
    while (str.length % 4 !== 0) {
      str = str + "=";
    }
    return str;
  }
  function utf8ToBytes(string, units) {
    units = units || Infinity;
    let codePoint;
    const length = string.length;
    let leadSurrogate = null;
    const bytes = [];
    for (let i = 0;i < length; ++i) {
      codePoint = string.charCodeAt(i);
      if (codePoint > 55295 && codePoint < 57344) {
        if (!leadSurrogate) {
          if (codePoint > 56319) {
            if ((units -= 3) > -1)
              bytes.push(239, 191, 189);
            continue;
          } else if (i + 1 === length) {
            if ((units -= 3) > -1)
              bytes.push(239, 191, 189);
            continue;
          }
          leadSurrogate = codePoint;
          continue;
        }
        if (codePoint < 56320) {
          if ((units -= 3) > -1)
            bytes.push(239, 191, 189);
          leadSurrogate = codePoint;
          continue;
        }
        codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
      } else if (leadSurrogate) {
        if ((units -= 3) > -1)
          bytes.push(239, 191, 189);
      }
      leadSurrogate = null;
      if (codePoint < 128) {
        if ((units -= 1) < 0)
          break;
        bytes.push(codePoint);
      } else if (codePoint < 2048) {
        if ((units -= 2) < 0)
          break;
        bytes.push(codePoint >> 6 | 192, codePoint & 63 | 128);
      } else if (codePoint < 65536) {
        if ((units -= 3) < 0)
          break;
        bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
      } else if (codePoint < 1114112) {
        if ((units -= 4) < 0)
          break;
        bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
      } else {
        throw new Error("Invalid code point");
      }
    }
    return bytes;
  }
  function asciiToBytes(str) {
    const byteArray = [];
    for (let i = 0;i < str.length; ++i) {
      byteArray.push(str.charCodeAt(i) & 255);
    }
    return byteArray;
  }
  function utf16leToBytes(str, units) {
    let c, hi, lo;
    const byteArray = [];
    for (let i = 0;i < str.length; ++i) {
      if ((units -= 2) < 0)
        break;
      c = str.charCodeAt(i);
      hi = c >> 8;
      lo = c % 256;
      byteArray.push(lo);
      byteArray.push(hi);
    }
    return byteArray;
  }
  function base64ToBytes(str) {
    return base64.toByteArray(base64clean(str));
  }
  function blitBuffer(src, dst, offset, length) {
    let i;
    for (i = 0;i < length; ++i) {
      if (i + offset >= dst.length || i >= src.length)
        break;
      dst[i + offset] = src[i];
    }
    return i;
  }
  function isInstance(obj, type) {
    return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
  }
  function numberIsNaN(obj) {
    return obj !== obj;
  }
  function defineBigIntMethod(fn) {
    return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
  }
  function BufferBigIntNotDefined() {
    throw new Error("BigInt not supported");
  }
  /*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   */
  var base64 = require_base64_js();
  var ieee754 = require_ieee754();
  var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
  exports.Buffer = Buffer;
  exports.SlowBuffer = SlowBuffer;
  exports.INSPECT_MAX_BYTES = 50;
  var K_MAX_LENGTH = 2147483647;
  exports.kMaxLength = K_MAX_LENGTH;
  Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();
  if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
    console.error("This browser lacks typed array (Uint8Array) support which is required by " + "`buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
  }
  Object.defineProperty(Buffer.prototype, "parent", {
    enumerable: true,
    get: function() {
      if (!Buffer.isBuffer(this))
        return;
      return this.buffer;
    }
  });
  Object.defineProperty(Buffer.prototype, "offset", {
    enumerable: true,
    get: function() {
      if (!Buffer.isBuffer(this))
        return;
      return this.byteOffset;
    }
  });
  Buffer.poolSize = 8192;
  Buffer.from = function(value, encodingOrOffset, length) {
    return from(value, encodingOrOffset, length);
  };
  Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
  Object.setPrototypeOf(Buffer, Uint8Array);
  Buffer.alloc = function(size, fill, encoding) {
    return alloc(size, fill, encoding);
  };
  Buffer.allocUnsafe = function(size) {
    return allocUnsafe(size);
  };
  Buffer.allocUnsafeSlow = function(size) {
    return allocUnsafe(size);
  };
  Buffer.isBuffer = function isBuffer(b) {
    return b != null && b._isBuffer === true && b !== Buffer.prototype;
  };
  Buffer.compare = function compare(a, b) {
    if (isInstance(a, Uint8Array))
      a = Buffer.from(a, a.offset, a.byteLength);
    if (isInstance(b, Uint8Array))
      b = Buffer.from(b, b.offset, b.byteLength);
    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
      throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
    }
    if (a === b)
      return 0;
    let x = a.length;
    let y = b.length;
    for (let i = 0, len = Math.min(x, y);i < len; ++i) {
      if (a[i] !== b[i]) {
        x = a[i];
        y = b[i];
        break;
      }
    }
    if (x < y)
      return -1;
    if (y < x)
      return 1;
    return 0;
  };
  Buffer.isEncoding = function isEncoding(encoding) {
    switch (String(encoding).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return true;
      default:
        return false;
    }
  };
  Buffer.concat = function concat(list, length) {
    if (!Array.isArray(list)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }
    if (list.length === 0) {
      return Buffer.alloc(0);
    }
    let i;
    if (length === undefined) {
      length = 0;
      for (i = 0;i < list.length; ++i) {
        length += list[i].length;
      }
    }
    const buffer = Buffer.allocUnsafe(length);
    let pos = 0;
    for (i = 0;i < list.length; ++i) {
      let buf = list[i];
      if (isInstance(buf, Uint8Array)) {
        if (pos + buf.length > buffer.length) {
          if (!Buffer.isBuffer(buf))
            buf = Buffer.from(buf);
          buf.copy(buffer, pos);
        } else {
          Uint8Array.prototype.set.call(buffer, buf, pos);
        }
      } else if (!Buffer.isBuffer(buf)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      } else {
        buf.copy(buffer, pos);
      }
      pos += buf.length;
    }
    return buffer;
  };
  Buffer.byteLength = byteLength;
  Buffer.prototype._isBuffer = true;
  Buffer.prototype.swap16 = function swap16() {
    const len = this.length;
    if (len % 2 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    }
    for (let i = 0;i < len; i += 2) {
      swap(this, i, i + 1);
    }
    return this;
  };
  Buffer.prototype.swap32 = function swap32() {
    const len = this.length;
    if (len % 4 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    }
    for (let i = 0;i < len; i += 4) {
      swap(this, i, i + 3);
      swap(this, i + 1, i + 2);
    }
    return this;
  };
  Buffer.prototype.swap64 = function swap64() {
    const len = this.length;
    if (len % 8 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    }
    for (let i = 0;i < len; i += 8) {
      swap(this, i, i + 7);
      swap(this, i + 1, i + 6);
      swap(this, i + 2, i + 5);
      swap(this, i + 3, i + 4);
    }
    return this;
  };
  Buffer.prototype.toString = function toString() {
    const length = this.length;
    if (length === 0)
      return "";
    if (arguments.length === 0)
      return utf8Slice(this, 0, length);
    return slowToString.apply(this, arguments);
  };
  Buffer.prototype.toLocaleString = Buffer.prototype.toString;
  Buffer.prototype.equals = function equals(b) {
    if (!Buffer.isBuffer(b))
      throw new TypeError("Argument must be a Buffer");
    if (this === b)
      return true;
    return Buffer.compare(this, b) === 0;
  };
  Buffer.prototype.inspect = function inspect() {
    let str = "";
    const max = exports.INSPECT_MAX_BYTES;
    str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
    if (this.length > max)
      str += " ... ";
    return "<Buffer " + str + ">";
  };
  if (customInspectSymbol) {
    Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect;
  }
  Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
    if (isInstance(target, Uint8Array)) {
      target = Buffer.from(target, target.offset, target.byteLength);
    }
    if (!Buffer.isBuffer(target)) {
      throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. ' + "Received type " + typeof target);
    }
    if (start === undefined) {
      start = 0;
    }
    if (end === undefined) {
      end = target ? target.length : 0;
    }
    if (thisStart === undefined) {
      thisStart = 0;
    }
    if (thisEnd === undefined) {
      thisEnd = this.length;
    }
    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
      throw new RangeError("out of range index");
    }
    if (thisStart >= thisEnd && start >= end) {
      return 0;
    }
    if (thisStart >= thisEnd) {
      return -1;
    }
    if (start >= end) {
      return 1;
    }
    start >>>= 0;
    end >>>= 0;
    thisStart >>>= 0;
    thisEnd >>>= 0;
    if (this === target)
      return 0;
    let x = thisEnd - thisStart;
    let y = end - start;
    const len = Math.min(x, y);
    const thisCopy = this.slice(thisStart, thisEnd);
    const targetCopy = target.slice(start, end);
    for (let i = 0;i < len; ++i) {
      if (thisCopy[i] !== targetCopy[i]) {
        x = thisCopy[i];
        y = targetCopy[i];
        break;
      }
    }
    if (x < y)
      return -1;
    if (y < x)
      return 1;
    return 0;
  };
  Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1;
  };
  Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
  };
  Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
  };
  Buffer.prototype.write = function write(string, offset, length, encoding) {
    if (offset === undefined) {
      encoding = "utf8";
      length = this.length;
      offset = 0;
    } else if (length === undefined && typeof offset === "string") {
      encoding = offset;
      length = this.length;
      offset = 0;
    } else if (isFinite(offset)) {
      offset = offset >>> 0;
      if (isFinite(length)) {
        length = length >>> 0;
        if (encoding === undefined)
          encoding = "utf8";
      } else {
        encoding = length;
        length = undefined;
      }
    } else {
      throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
    }
    const remaining = this.length - offset;
    if (length === undefined || length > remaining)
      length = remaining;
    if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
      throw new RangeError("Attempt to write outside buffer bounds");
    }
    if (!encoding)
      encoding = "utf8";
    let loweredCase = false;
    for (;; ) {
      switch (encoding) {
        case "hex":
          return hexWrite(this, string, offset, length);
        case "utf8":
        case "utf-8":
          return utf8Write(this, string, offset, length);
        case "ascii":
        case "latin1":
        case "binary":
          return asciiWrite(this, string, offset, length);
        case "base64":
          return base64Write(this, string, offset, length);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return ucs2Write(this, string, offset, length);
        default:
          if (loweredCase)
            throw new TypeError("Unknown encoding: " + encoding);
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  };
  Buffer.prototype.toJSON = function toJSON() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  var MAX_ARGUMENTS_LENGTH = 4096;
  Buffer.prototype.slice = function slice(start, end) {
    const len = this.length;
    start = ~~start;
    end = end === undefined ? len : ~~end;
    if (start < 0) {
      start += len;
      if (start < 0)
        start = 0;
    } else if (start > len) {
      start = len;
    }
    if (end < 0) {
      end += len;
      if (end < 0)
        end = 0;
    } else if (end > len) {
      end = len;
    }
    if (end < start)
      end = start;
    const newBuf = this.subarray(start, end);
    Object.setPrototypeOf(newBuf, Buffer.prototype);
    return newBuf;
  };
  Buffer.prototype.readUintLE = Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
    offset = offset >>> 0;
    byteLength2 = byteLength2 >>> 0;
    if (!noAssert)
      checkOffset(offset, byteLength2, this.length);
    let val = this[offset];
    let mul = 1;
    let i = 0;
    while (++i < byteLength2 && (mul *= 256)) {
      val += this[offset + i] * mul;
    }
    return val;
  };
  Buffer.prototype.readUintBE = Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
    offset = offset >>> 0;
    byteLength2 = byteLength2 >>> 0;
    if (!noAssert) {
      checkOffset(offset, byteLength2, this.length);
    }
    let val = this[offset + --byteLength2];
    let mul = 1;
    while (byteLength2 > 0 && (mul *= 256)) {
      val += this[offset + --byteLength2] * mul;
    }
    return val;
  };
  Buffer.prototype.readUint8 = Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 1, this.length);
    return this[offset];
  };
  Buffer.prototype.readUint16LE = Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    return this[offset] | this[offset + 1] << 8;
  };
  Buffer.prototype.readUint16BE = Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    return this[offset] << 8 | this[offset + 1];
  };
  Buffer.prototype.readUint32LE = Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
  };
  Buffer.prototype.readUint32BE = Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
  };
  Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === undefined || last === undefined) {
      boundsError(offset, this.length - 8);
    }
    const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
    const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
    return BigInt(lo) + (BigInt(hi) << BigInt(32));
  });
  Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === undefined || last === undefined) {
      boundsError(offset, this.length - 8);
    }
    const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
    const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
    return (BigInt(hi) << BigInt(32)) + BigInt(lo);
  });
  Buffer.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
    offset = offset >>> 0;
    byteLength2 = byteLength2 >>> 0;
    if (!noAssert)
      checkOffset(offset, byteLength2, this.length);
    let val = this[offset];
    let mul = 1;
    let i = 0;
    while (++i < byteLength2 && (mul *= 256)) {
      val += this[offset + i] * mul;
    }
    mul *= 128;
    if (val >= mul)
      val -= Math.pow(2, 8 * byteLength2);
    return val;
  };
  Buffer.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
    offset = offset >>> 0;
    byteLength2 = byteLength2 >>> 0;
    if (!noAssert)
      checkOffset(offset, byteLength2, this.length);
    let i = byteLength2;
    let mul = 1;
    let val = this[offset + --i];
    while (i > 0 && (mul *= 256)) {
      val += this[offset + --i] * mul;
    }
    mul *= 128;
    if (val >= mul)
      val -= Math.pow(2, 8 * byteLength2);
    return val;
  };
  Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 1, this.length);
    if (!(this[offset] & 128))
      return this[offset];
    return (255 - this[offset] + 1) * -1;
  };
  Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    const val = this[offset] | this[offset + 1] << 8;
    return val & 32768 ? val | 4294901760 : val;
  };
  Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    const val = this[offset + 1] | this[offset] << 8;
    return val & 32768 ? val | 4294901760 : val;
  };
  Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
  };
  Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
  };
  Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === undefined || last === undefined) {
      boundsError(offset, this.length - 8);
    }
    const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
    return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
  });
  Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === undefined || last === undefined) {
      boundsError(offset, this.length - 8);
    }
    const val = (first << 24) + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
    return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
  });
  Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return ieee754.read(this, offset, true, 23, 4);
  };
  Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return ieee754.read(this, offset, false, 23, 4);
  };
  Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 8, this.length);
    return ieee754.read(this, offset, true, 52, 8);
  };
  Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 8, this.length);
    return ieee754.read(this, offset, false, 52, 8);
  };
  Buffer.prototype.writeUintLE = Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength2 = byteLength2 >>> 0;
    if (!noAssert) {
      const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
      checkInt(this, value, offset, byteLength2, maxBytes, 0);
    }
    let mul = 1;
    let i = 0;
    this[offset] = value & 255;
    while (++i < byteLength2 && (mul *= 256)) {
      this[offset + i] = value / mul & 255;
    }
    return offset + byteLength2;
  };
  Buffer.prototype.writeUintBE = Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength2 = byteLength2 >>> 0;
    if (!noAssert) {
      const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
      checkInt(this, value, offset, byteLength2, maxBytes, 0);
    }
    let i = byteLength2 - 1;
    let mul = 1;
    this[offset + i] = value & 255;
    while (--i >= 0 && (mul *= 256)) {
      this[offset + i] = value / mul & 255;
    }
    return offset + byteLength2;
  };
  Buffer.prototype.writeUint8 = Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 1, 255, 0);
    this[offset] = value & 255;
    return offset + 1;
  };
  Buffer.prototype.writeUint16LE = Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 2, 65535, 0);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    return offset + 2;
  };
  Buffer.prototype.writeUint16BE = Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 2, 65535, 0);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
    return offset + 2;
  };
  Buffer.prototype.writeUint32LE = Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 4, 4294967295, 0);
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 255;
    return offset + 4;
  };
  Buffer.prototype.writeUint32BE = Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 4, 4294967295, 0);
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 255;
    return offset + 4;
  };
  Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
    return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
  });
  Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
    return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
  });
  Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      const limit = Math.pow(2, 8 * byteLength2 - 1);
      checkInt(this, value, offset, byteLength2, limit - 1, -limit);
    }
    let i = 0;
    let mul = 1;
    let sub = 0;
    this[offset] = value & 255;
    while (++i < byteLength2 && (mul *= 256)) {
      if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
        sub = 1;
      }
      this[offset + i] = (value / mul >> 0) - sub & 255;
    }
    return offset + byteLength2;
  };
  Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      const limit = Math.pow(2, 8 * byteLength2 - 1);
      checkInt(this, value, offset, byteLength2, limit - 1, -limit);
    }
    let i = byteLength2 - 1;
    let mul = 1;
    let sub = 0;
    this[offset + i] = value & 255;
    while (--i >= 0 && (mul *= 256)) {
      if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
        sub = 1;
      }
      this[offset + i] = (value / mul >> 0) - sub & 255;
    }
    return offset + byteLength2;
  };
  Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 1, 127, -128);
    if (value < 0)
      value = 255 + value + 1;
    this[offset] = value & 255;
    return offset + 1;
  };
  Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 2, 32767, -32768);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    return offset + 2;
  };
  Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 2, 32767, -32768);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
    return offset + 2;
  };
  Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 4, 2147483647, -2147483648);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
    return offset + 4;
  };
  Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 4, 2147483647, -2147483648);
    if (value < 0)
      value = 4294967295 + value + 1;
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 255;
    return offset + 4;
  };
  Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
    return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
    return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
    return writeFloat(this, value, offset, true, noAssert);
  };
  Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
    return writeFloat(this, value, offset, false, noAssert);
  };
  Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
    return writeDouble(this, value, offset, true, noAssert);
  };
  Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
    return writeDouble(this, value, offset, false, noAssert);
  };
  Buffer.prototype.copy = function copy(target, targetStart, start, end) {
    if (!Buffer.isBuffer(target))
      throw new TypeError("argument should be a Buffer");
    if (!start)
      start = 0;
    if (!end && end !== 0)
      end = this.length;
    if (targetStart >= target.length)
      targetStart = target.length;
    if (!targetStart)
      targetStart = 0;
    if (end > 0 && end < start)
      end = start;
    if (end === start)
      return 0;
    if (target.length === 0 || this.length === 0)
      return 0;
    if (targetStart < 0) {
      throw new RangeError("targetStart out of bounds");
    }
    if (start < 0 || start >= this.length)
      throw new RangeError("Index out of range");
    if (end < 0)
      throw new RangeError("sourceEnd out of bounds");
    if (end > this.length)
      end = this.length;
    if (target.length - targetStart < end - start) {
      end = target.length - targetStart + start;
    }
    const len = end - start;
    if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
      this.copyWithin(targetStart, start, end);
    } else {
      Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
    }
    return len;
  };
  Buffer.prototype.fill = function fill(val, start, end, encoding) {
    if (typeof val === "string") {
      if (typeof start === "string") {
        encoding = start;
        start = 0;
        end = this.length;
      } else if (typeof end === "string") {
        encoding = end;
        end = this.length;
      }
      if (encoding !== undefined && typeof encoding !== "string") {
        throw new TypeError("encoding must be a string");
      }
      if (typeof encoding === "string" && !Buffer.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      if (val.length === 1) {
        const code = val.charCodeAt(0);
        if (encoding === "utf8" && code < 128 || encoding === "latin1") {
          val = code;
        }
      }
    } else if (typeof val === "number") {
      val = val & 255;
    } else if (typeof val === "boolean") {
      val = Number(val);
    }
    if (start < 0 || this.length < start || this.length < end) {
      throw new RangeError("Out of range index");
    }
    if (end <= start) {
      return this;
    }
    start = start >>> 0;
    end = end === undefined ? this.length : end >>> 0;
    if (!val)
      val = 0;
    let i;
    if (typeof val === "number") {
      for (i = start;i < end; ++i) {
        this[i] = val;
      }
    } else {
      const bytes = Buffer.isBuffer(val) ? val : Buffer.from(val, encoding);
      const len = bytes.length;
      if (len === 0) {
        throw new TypeError('The value "' + val + '" is invalid for argument "value"');
      }
      for (i = 0;i < end - start; ++i) {
        this[i + start] = bytes[i % len];
      }
    }
    return this;
  };
  var errors = {};
  E("ERR_BUFFER_OUT_OF_BOUNDS", function(name) {
    if (name) {
      return `${name} is outside of buffer bounds`;
    }
    return "Attempt to access memory outside buffer bounds";
  }, RangeError);
  E("ERR_INVALID_ARG_TYPE", function(name, actual) {
    return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
  }, TypeError);
  E("ERR_OUT_OF_RANGE", function(str, range, input) {
    let msg = `The value of "${str}" is out of range.`;
    let received = input;
    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
      received = addNumericalSeparator(String(input));
    } else if (typeof input === "bigint") {
      received = String(input);
      if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
        received = addNumericalSeparator(received);
      }
      received += "n";
    }
    msg += ` It must be ${range}. Received ${received}`;
    return msg;
  }, RangeError);
  var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
  var hexSliceLookupTable = function() {
    const alphabet = "0123456789abcdef";
    const table = new Array(256);
    for (let i = 0;i < 16; ++i) {
      const i16 = i * 16;
      for (let j = 0;j < 16; ++j) {
        table[i16 + j] = alphabet[i] + alphabet[j];
      }
    }
    return table;
  }();
});

// node_modules/bplist-parser/bplistParser.js
var require_bplistParser = __commonJS((exports) => {
  function readUInt(buffer, start) {
    start = start || 0;
    let l = 0;
    for (let i = start;i < buffer.length; i++) {
      l <<= 8;
      l |= buffer[i] & 255;
    }
    return l;
  }
  function readUInt64BE(buffer, start) {
    const data = buffer.slice(start, start + 8);
    return data.readUInt32BE(4, 8);
  }
  function swapBytes(buffer) {
    const len = buffer.length;
    for (let i = 0;i < len; i += 2) {
      const a = buffer[i];
      buffer[i] = buffer[i + 1];
      buffer[i + 1] = a;
    }
    return buffer;
  }
  var fs = (()=>({}));
  var bigInt = require_BigInteger();
  var debug = false;
  var Buffer = require_buffer().Buffer;
  exports.maxObjectSize = 100 * 1000 * 1000;
  exports.maxObjectCount = 32768;
  var EPOCH = 978307200000;
  var UID = exports.UID = function(id) {
    this.UID = id;
  };
  exports.parseFile = function(fileNameOrBuffer, callback) {
    return new Promise(function(resolve, reject) {
      function tryParseBuffer(buffer) {
        let err = null;
        let result;
        try {
          result = parseBuffer(buffer);
          resolve(result);
        } catch (ex) {
          err = ex;
          reject(err);
        } finally {
          if (callback)
            callback(err, result);
        }
      }
      if (Buffer.isBuffer(fileNameOrBuffer)) {
        return tryParseBuffer(fileNameOrBuffer);
      }
      fs.readFile(fileNameOrBuffer, function(err, data) {
        if (err) {
          reject(err);
          return callback(err);
        }
        tryParseBuffer(data);
      });
    });
  };
  exports.parseFileSync = function(fileNameOrBuffer) {
    if (!Buffer.isBuffer(fileNameOrBuffer)) {
      fileNameOrBuffer = fs.readFileSync(fileNameOrBuffer);
    }
    return parseBuffer(fileNameOrBuffer);
  };
  var parseBuffer = exports.parseBuffer = function(buffer) {
    const header = buffer.slice(0, "bplist".length).toString("utf8");
    if (header !== "bplist") {
      throw new Error("Invalid binary plist. Expected 'bplist' at offset 0.");
    }
    const trailer = buffer.slice(buffer.length - 32, buffer.length);
    const offsetSize = trailer.readUInt8(6);
    if (debug) {
      console.log("offsetSize: " + offsetSize);
    }
    const objectRefSize = trailer.readUInt8(7);
    if (debug) {
      console.log("objectRefSize: " + objectRefSize);
    }
    const numObjects = readUInt64BE(trailer, 8);
    if (debug) {
      console.log("numObjects: " + numObjects);
    }
    const topObject = readUInt64BE(trailer, 16);
    if (debug) {
      console.log("topObject: " + topObject);
    }
    const offsetTableOffset = readUInt64BE(trailer, 24);
    if (debug) {
      console.log("offsetTableOffset: " + offsetTableOffset);
    }
    if (numObjects > exports.maxObjectCount) {
      throw new Error("maxObjectCount exceeded");
    }
    const offsetTable = [];
    for (let i = 0;i < numObjects; i++) {
      const offsetBytes = buffer.slice(offsetTableOffset + i * offsetSize, offsetTableOffset + (i + 1) * offsetSize);
      offsetTable[i] = readUInt(offsetBytes, 0);
      if (debug) {
        console.log("Offset for Object #" + i + " is " + offsetTable[i] + " [" + offsetTable[i].toString(16) + "]");
      }
    }
    function parseObject(tableOffset) {
      const offset = offsetTable[tableOffset];
      const type = buffer[offset];
      const objType = (type & 240) >> 4;
      const objInfo = type & 15;
      switch (objType) {
        case 0:
          return parseSimple();
        case 1:
          return parseInteger();
        case 8:
          return parseUID();
        case 2:
          return parseReal();
        case 3:
          return parseDate();
        case 4:
          return parseData();
        case 5:
          return parsePlistString();
        case 6:
          return parsePlistString(true);
        case 10:
          return parseArray();
        case 13:
          return parseDictionary();
        default:
          throw new Error("Unhandled type 0x" + objType.toString(16));
      }
      function parseSimple() {
        switch (objInfo) {
          case 0:
            return null;
          case 8:
            return false;
          case 9:
            return true;
          case 15:
            return null;
          default:
            throw new Error("Unhandled simple type 0x" + objType.toString(16));
        }
      }
      function bufferToHexString(buffer2) {
        let str = "";
        let i;
        for (i = 0;i < buffer2.length; i++) {
          if (buffer2[i] != 0) {
            break;
          }
        }
        for (;i < buffer2.length; i++) {
          const part = "00" + buffer2[i].toString(16);
          str += part.substr(part.length - 2);
        }
        return str;
      }
      function parseInteger() {
        const length = Math.pow(2, objInfo);
        if (length < exports.maxObjectSize) {
          const data = buffer.slice(offset + 1, offset + 1 + length);
          if (length === 16) {
            const str = bufferToHexString(data);
            return bigInt(str, 16);
          }
          return data.reduce((acc, curr) => {
            acc <<= 8;
            acc |= curr & 255;
            return acc;
          });
        }
        throw new Error("Too little heap space available! Wanted to read " + length + " bytes, but only " + exports.maxObjectSize + " are available.");
      }
      function parseUID() {
        const length = objInfo + 1;
        if (length < exports.maxObjectSize) {
          return new UID(readUInt(buffer.slice(offset + 1, offset + 1 + length)));
        }
        throw new Error("Too little heap space available! Wanted to read " + length + " bytes, but only " + exports.maxObjectSize + " are available.");
      }
      function parseReal() {
        const length = Math.pow(2, objInfo);
        if (length < exports.maxObjectSize) {
          const realBuffer = buffer.slice(offset + 1, offset + 1 + length);
          if (length === 4) {
            return realBuffer.readFloatBE(0);
          }
          if (length === 8) {
            return realBuffer.readDoubleBE(0);
          }
        } else {
          throw new Error("Too little heap space available! Wanted to read " + length + " bytes, but only " + exports.maxObjectSize + " are available.");
        }
      }
      function parseDate() {
        if (objInfo != 3) {
          console.error("Unknown date type :" + objInfo + ". Parsing anyway...");
        }
        const dateBuffer = buffer.slice(offset + 1, offset + 9);
        return new Date(EPOCH + 1000 * dateBuffer.readDoubleBE(0));
      }
      function parseData() {
        let dataoffset = 1;
        let length = objInfo;
        if (objInfo == 15) {
          const int_type = buffer[offset + 1];
          const intType = (int_type & 240) / 16;
          if (intType != 1) {
            console.error("0x4: UNEXPECTED LENGTH-INT TYPE! " + intType);
          }
          const intInfo = int_type & 15;
          const intLength = Math.pow(2, intInfo);
          dataoffset = 2 + intLength;
          if (intLength < 3) {
            length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
          } else {
            length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
          }
        }
        if (length < exports.maxObjectSize) {
          return buffer.slice(offset + dataoffset, offset + dataoffset + length);
        }
        throw new Error("Too little heap space available! Wanted to read " + length + " bytes, but only " + exports.maxObjectSize + " are available.");
      }
      function parsePlistString(isUtf16) {
        isUtf16 = isUtf16 || 0;
        let enc = "utf8";
        let length = objInfo;
        let stroffset = 1;
        if (objInfo == 15) {
          const int_type = buffer[offset + 1];
          const intType = (int_type & 240) / 16;
          if (intType != 1) {
            console.error("UNEXPECTED LENGTH-INT TYPE! " + intType);
          }
          const intInfo = int_type & 15;
          const intLength = Math.pow(2, intInfo);
          stroffset = 2 + intLength;
          if (intLength < 3) {
            length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
          } else {
            length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
          }
        }
        length *= isUtf16 + 1;
        if (length < exports.maxObjectSize) {
          let plistString = Buffer.from(buffer.slice(offset + stroffset, offset + stroffset + length));
          if (isUtf16) {
            plistString = swapBytes(plistString);
            enc = "ucs2";
          }
          return plistString.toString(enc);
        }
        throw new Error("Too little heap space available! Wanted to read " + length + " bytes, but only " + exports.maxObjectSize + " are available.");
      }
      function parseArray() {
        let length = objInfo;
        let arrayoffset = 1;
        if (objInfo == 15) {
          const int_type = buffer[offset + 1];
          const intType = (int_type & 240) / 16;
          if (intType != 1) {
            console.error("0xa: UNEXPECTED LENGTH-INT TYPE! " + intType);
          }
          const intInfo = int_type & 15;
          const intLength = Math.pow(2, intInfo);
          arrayoffset = 2 + intLength;
          if (intLength < 3) {
            length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
          } else {
            length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
          }
        }
        if (length * objectRefSize > exports.maxObjectSize) {
          throw new Error("Too little heap space available!");
        }
        const array = [];
        for (let i = 0;i < length; i++) {
          const objRef = readUInt(buffer.slice(offset + arrayoffset + i * objectRefSize, offset + arrayoffset + (i + 1) * objectRefSize));
          array[i] = parseObject(objRef);
        }
        return array;
      }
      function parseDictionary() {
        let length = objInfo;
        let dictoffset = 1;
        if (objInfo == 15) {
          const int_type = buffer[offset + 1];
          const intType = (int_type & 240) / 16;
          if (intType != 1) {
            console.error("0xD: UNEXPECTED LENGTH-INT TYPE! " + intType);
          }
          const intInfo = int_type & 15;
          const intLength = Math.pow(2, intInfo);
          dictoffset = 2 + intLength;
          if (intLength < 3) {
            length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
          } else {
            length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
          }
        }
        if (length * 2 * objectRefSize > exports.maxObjectSize) {
          throw new Error("Too little heap space available!");
        }
        if (debug) {
          console.log("Parsing dictionary #" + tableOffset);
        }
        const dict = {};
        for (let i = 0;i < length; i++) {
          const keyRef = readUInt(buffer.slice(offset + dictoffset + i * objectRefSize, offset + dictoffset + (i + 1) * objectRefSize));
          const valRef = readUInt(buffer.slice(offset + dictoffset + length * objectRefSize + i * objectRefSize, offset + dictoffset + length * objectRefSize + (i + 1) * objectRefSize));
          const key = parseObject(keyRef);
          const val = parseObject(valRef);
          if (debug) {
            console.log("  DICT #" + tableOffset + ": Mapped " + key + " to " + val);
          }
          dict[key] = val;
        }
        return dict;
      }
    }
    return [parseObject(topObject)];
  };
});

// index.js
var import_bplist_parser = __toESM(require_bplistParser(), 1);
function parseB64(base64_string) {
  let test = Buffer.from(base64_string, "base64");
  const out = import_bplist_parser.default.parseBuffer(test);
  return out;
}
function file2ArrayBuffer(file, callback) {
  let reader = new FileReader;
  reader.onload = function(e) {
    let arrayBuffer = new Uint8Array(reader.result);
    console.log(arrayBuffer);
    let test = Buffer.from(arrayBuffer);
    const out = import_bplist_parser.default.parseBuffer(test);
    callback(out);
  };
  reader.readAsArrayBuffer(file);
}
function file2parsed(file) {
  return new Promise((resolve) => {
    file2ArrayBuffer(file, resolve);
  });
}
function dropEvent(event) {
}
var Buffer = require_buffer().Buffer;
export {
  parseB64,
  file2parsed,
  dropEvent
};
