# 集合set

Tags: python基础

## 1. 基本概念

- `set` 是**无序、不重复**的元素集合。
- 底层实现是 **哈希表**（和 `dict` 类似，只存 key，没有 value）。
- 平均插入、查找、删除都是 **O(1)**（C++ `std::set` 是平衡二叉树，O(log n)；`unordered_set` 才是 O(1)）。

---

## 2. 创建集合

```python
s = {1, 2, 3}       # 字面量
s = set([1, 2, 3])  # 从列表创建
s = set()           # 空集合（注意不能用 {}，那是空字典）

```

---

## 3. 添加和删除元素

```python
s.add(4)         # 添加元素（不存在则加入）
s.remove(2)      # 删除元素（不存在会报错）
s.discard(5)     # 删除元素（不存在也不报错）
x = s.pop()      # 随机删除并返回一个元素
s.clear()        # 清空集合

```

C++ 对应：

```cpp
unordered_set<int> s;
s.insert(4);
s.erase(2);

```

---

## 4. 判断元素是否存在

```python
if 3 in s:
    print("存在")

```

C++ 对应：

```cpp
if (s.count(3)) { ... }

```

---

## 5. 集合运算（数学集合操作）

```python
a = {1, 2, 3}
b = {3, 4, 5}

print(a | b)   # 并集 {1, 2, 3, 4, 5}
print(a & b)   # 交集 {3}
print(a - b)   # 差集 {1, 2}
print(a ^ b)   # 对称差集 {1, 2, 4, 5}

# 对应方法
a.union(b)
a.intersection(b)
a.difference(b)
a.symmetric_difference(b)

```

C++ 对应：要手动写循环或用算法库（无直接运算符）。

---

## 6. 子集 / 超集判断

```python
a = {1, 2}
b = {1, 2, 3}
print(a <= b)   # True  a 是 b 的子集
print(b >= a)   # True  b 是 a 的超集
print(a < b)    # 真子集
print(a.issubset(b))
print(b.issuperset(a))

```

---

## 7. 集合推导式

```python
s = {x**2 for x in range(5)}
print(s)  # {0, 1, 4, 9, 16}

```

---

## 8. 冻结集合（不可变）

```python
fs = frozenset([1, 2, 3])
# fs.add(4)  # ❌ 不支持修改

```

C++ 对应：没有完全等价的，类似 `const unordered_set`。