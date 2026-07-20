# unordered_map

Tags: 基础库使用

[C++中的unordered_map用法详解_unorderedmap用法-CSDN博客](https://blog.csdn.net/zou_albert/article/details/106983268)

`std::unordered_map` 是 C++11 新增的哈希表容器，提供平均 O(1) 的查找、插入、删除性能。下面分块介绍它的基本用法。

---

## 1. 引入头文件

```cpp
#include <unordered_map>

```

---

## 2. 定义

```cpp
// 模板参数：Key 类型、Value 类型、Hash 函数、Key 相等比较
std::unordered_map<Key, T, Hash=std::hash<Key>, Pred=std::equal_to<Key>> mp;

```

最常见的用法：

```cpp
std::unordered_map<std::string, int> mp;

```

---

## 3. 插入元素

1. **使用 `operator[]`**
    
    ```cpp
    mp["apple"] = 3;
    mp["banana"] = 5;
    
    ```
    
    如果键不存在，会插入一个默认值（`T()`），然后再赋值。
    
2. **使用 `insert`**
    
    ```cpp
    mp.insert({"orange", 7});
    // 或者
    mp.insert(std::make_pair("pear", 4));
    
    ```
    
3. **使用 `emplace`（更高效）**
    
    ```cpp
    mp.emplace("grape", 9);
    
    ```
    

---

## 4. 访问元素

1. **`operator[]`**
    
    ```cpp
    int cnt = mp["apple"];  // 存在则返回对应值，不存在则插入新元素并返回默认值 0
    
    ```
    
2. **`at`（越界检测）**
    
    ```cpp
    try {
        int cnt = mp.at("banana");
    } catch (std::out_of_range& e) {
        // 键不存在时会抛出异常
    }
    
    ```
    
3. **`find`**
    
    ```cpp
    auto it = mp.find("orange");
    if (it != mp.end()) {
        std::cout << it->first << " -> " << it->second << "\n";
    } else {
        std::cout << "not found\n";
    }
    
    ```
    

---

## 5. 删除元素

- **按键删除**
    
    ```cpp
    mp.erase("pear");
    
    ```
    
- **按迭代器删除**
    
    ```cpp
    auto it = mp.find("grape");
    if (it != mp.end()) mp.erase(it);
    
    ```
    

---

## 6. 遍历

```cpp
for (auto& kv : mp) {
    // kv.first 是 key，kv.second 是 value
    std::cout << kv.first << " -> " << kv.second << "\n";
}

```

或者：

```cpp
for (auto it = mp.begin(); it != mp.end(); ++it) {
    std::cout << it->first << " -> " << it->second << "\n";
}

```

---

## 7. 其他常用接口

- **`size()`**、`empty()`：容器大小及是否为空
- **`clear()`**：清空所有元素
- **`count(key)`**：键是否存在（返回 0 或 1）
- **`reserve(n)`**：预留至少能放下 `n` 个元素的桶数，加速插入
- **`bucket_count()`、`load_factor()`**：查看哈希表的桶数、负载因子

---

## 8. 自定义 Key 和 Hash

如果你要用自定义类型做键，需要提供 `hash` 和 `equal_to`：

```cpp
struct Point {
    int x, y;
    bool operator==(Point const& o) const {
        return x==o.x && y==o.y;
    }
};

struct PointHash {
    std::size_t operator()(Point const& p) const noexcept {
        return std::hash<long long>()(((long long)p.x << 32) ^ (unsigned long long)p.y);
    }
};

std::unordered_map<Point, std::string, PointHash> mp2;

```

---

## 9. 小结

- `std::unordered_map` 适合需要快速查找/插入/删除的场景。
- 默认实现使用链式哈希，平均复杂度 O(1)，最坏情况 O(n)。
- 常用操作：`operator[]`、`find`、`insert`/`emplace`、`erase`。
- 可通过 `reserve`、自定义哈希函数等手段进一步优化性能和适用性。

# 自定义

在 C++ 的 `std::unordered_map` 中，如果你想用自定义类型（比如 `Point`）做为 key，就必须告诉容器：

1. **如何对你的 key 做哈希**（也就是把一个 `Point` 转换成一个 `size_t` 的“桶索引”）
2. **如何判断两个 key 是否相等**（当哈希值相同的时候，用来进一步区分是真相等还是哈希冲突）

下面针对示例代码逐步详细解释：

---

## 1. 自定义 Key 类型：`Point`

```cpp
struct Point {
    int x, y;
    bool operator==(Point const& o) const {
        return x == o.x && y == o.y;
    }
};

```

- `x, y`：表示平面上的一个点坐标。
- `operator==`：重载了 `==` 运算符，用来判断两个 `Point` 对象是否“真正相等”——只有当 `x` 和 `y` 两个分量都相同时，才认为它们相等。
- 这个 `operator==` 会被 `std::equal_to<Point>`（默认的相等比较器）调用。

---

## 2. 自定义哈希函数对象：`PointHash`

```cpp
struct PointHash {
    std::size_t operator()(Point const& p) const noexcept {
        // 把两个 32 位整数拼成一个 64 位整数，再用 std::hash<long long>
        return std::hash<long long>()(
            (static_cast<long long>(p.x) << 32) ^ (static_cast<unsigned long long>(p.y))
        );
    }
};

```

- **为什么要自定义？**
    
    标准库只为内置类型（比如 `int`、`std::string`）和一些常见类型提供了 `std::hash<T>` 特化。你自己的 `Point` 类型没有默认哈希，因此必须自己写。
    
- **`operator()`**
    
    这是一个函数调用运算符 overload，使得 `PointHash` 成为一个可调用对象（functor）。容器内部会在需要哈希时调用 `PointHash{}(somePoint)`。
    
- **`noexcept`**
    
    表示这个哈希计算不会抛异常，让容器在处理异常安全性时更高效。
    
- **哈希实现思路**
    - 将 `p.x` 左移 32 位，拼到高 32 位；把 `p.y` 置于低 32 位；然后对得到的 64 位整数调用 `std::hash<long long>()`。
    - 这样做的好处是尽量避免把两个分量的值挤在一起引发大量哈希冲突，同时复用已有的整型哈希实现。

---

## 3. 在 `unordered_map` 中使用

```cpp
std::unordered_map<Point, std::string, PointHash> mp2;

```

- **模板参数**
    - `Point`：键类型
    - `std::string`：值类型
    - `PointHash`：哈希函数对象类型
    - 默认的相等比较器 `std::equal_to<Point>` 会用到你定义的 `Point::operator==`
- **工作流程**
    1. 当你执行 `mp2.emplace({1,2}, "A")` 或者 `mp2[{1,2}] = "A"`：
        - 容器先调用 `PointHash{}(Point{1,2})`，得到一个 `size_t hash`。
        - 根据 `hash % bucket_count()` 确定落在哪个桶（bucket）里。
        - 如果桶里空，就直接放进去；如果不空，就遍历该桶的链表（或其它实现结构），对每个元素调用 `std::equal_to<Point>` ——也就是 `point1 == point2`——来判断是否已经存在相同的 key。
    2. 查找、删除同理：先哈希定位桶，再用 `operator==` 确认。

---

## 4. 小结与注意事项

1. **别忘了同时提供 “哈希” 和 “相等比较”**
    - 哈希负责分桶
    - 相等比较负责桶内进一步判断
2. **哈希函数要高效且分布均匀**
    
    过于简单（比如只返回 `p.x`）会导致同一桶过度拥挤，影响性能。
    
3. **不要返回局部对象的指针或引用**
    
    哈希函数只应该读 `Point` 的成员，不要产生临时的、不可用的内存引用。
    
4. **`noexcept` 推荐加上**
    
    能帮助容器在抛异常时保持更好的安全性。
    
5. **如果需要自定义比较器**，可以把第四个模板参数也显式指定：
    
    ```cpp
    struct PointEqual {
      bool operator()(Point const& a, Point const& b) const {
        return a.x==b.x && a.y==b.y;
      }
    };
    std::unordered_map<Point, std::string, PointHash, PointEqual> mp3;
    
    ```
    

通过上述方式，你就能在 `std::unordered_map` 里放心地用自定义类型做键，既享受哈希表的高性能，又保证键比较和哈希的一致性。